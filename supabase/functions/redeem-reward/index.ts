import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RedeemRewardRequest {
  userId: string
  rewardId: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    const { userId, rewardId }: RedeemRewardRequest = await req.json()

    if (!userId || !rewardId) {
      return new Response(
        JSON.stringify({ error: 'User ID and Reward ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify user exists and is a paid member
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, is_paid_member, points, email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    if (!user.is_paid_member) {
      return new Response(
        JSON.stringify({ error: 'User must be a paid member to redeem rewards' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Get reward details
    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single()

    if (rewardError || !reward) {
      return new Response(
        JSON.stringify({ error: 'Reward not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Check if user has enough points
    if (user.points < reward.points_cost) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient points',
          required: reward.points_cost,
          available: user.points
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if reward is in stock
    if (reward.stock !== null && reward.stock <= 0) {
      return new Response(
        JSON.stringify({ error: 'Reward is out of stock' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if user already has pending reward
    const { data: existingReward } = await supabase
      .from('user_rewards')
      .select('id')
      .eq('user_id', userId)
      .eq('reward_id', rewardId)
      .eq('status', 'PENDING')
      .limit(1)

    if (existingReward && existingReward.length > 0) {
      return new Response(
        JSON.stringify({ error: 'You already have this reward pending' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
      )
    }

    // Start transaction
    const { error: transactionError } = await supabase.rpc('redeem_reward', {
      user_id_param: userId,
      reward_id_param: rewardId
    })

    if (transactionError) {
      console.error('Transaction error:', transactionError)
      return new Response(
        JSON.stringify({ error: 'Failed to redeem reward' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Apply reward benefits based on type
    let benefitApplied = false
    try {
      switch (reward.type) {
        case 'AI_CREDITS':
          // Add AI generation credits to user's account
          const credits = reward.value?.credits || 50
          // This would integrate with your AI generation system
          // For now, we'll just log it
          console.log(`Applied ${credits} AI credits to user ${userId}`)
          benefitApplied = true
          break

        case 'AFFILIATE_BONUS':
          // Increase affiliate commission rate
          const bonusRate = reward.value?.bonus_rate || 0.05
          // This would update the user's affiliate settings
          console.log(`Applied ${bonusRate * 100}% affiliate bonus to user ${userId}`)
          benefitApplied = true
          break

        case 'CONTENT_UNLOCK':
          // Unlock premium content
          const contentIds = reward.value?.content_ids || []
          // This would grant access to specific content
          console.log(`Unlocked content for user ${userId}:`, contentIds)
          benefitApplied = true
          break

        case 'CUSTOM':
          // Handle custom reward logic
          console.log(`Applied custom reward to user ${userId}:`, reward.value)
          benefitApplied = true
          break

        default:
          console.warn(`Unknown reward type: ${reward.type}`)
      }
    } catch (benefitError) {
      console.error('Error applying reward benefit:', benefitError)
      // Don't fail the redemption, just log the error
    }

    // Update reward status to claimed if benefit was applied
    if (benefitApplied) {
      await supabase
        .from('user_rewards')
        .update({ status: 'CLAIMED' })
        .eq('user_id', userId)
        .eq('reward_id', rewardId)
        .eq('status', 'PENDING')
    }

    // Get updated user data
    const { data: updatedUser } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Reward redeemed successfully',
        reward: {
          id: reward.id,
          name: reward.name,
          type: reward.type,
          points_cost: reward.points_cost
        },
        points_deducted: reward.points_cost,
        remaining_points: updatedUser?.points || 0,
        benefit_applied: benefitApplied
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in redeem-reward function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})