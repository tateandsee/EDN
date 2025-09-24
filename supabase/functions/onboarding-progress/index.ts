import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    if (req.method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
      )
    }

    // Get user ID from authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const userId = user.id

    // Verify user exists and is a paid member
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, is_paid_member, points, onboarding_completed, current_level_id')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    if (!userData.is_paid_member) {
      return new Response(
        JSON.stringify({ error: 'User must be a paid member to access onboarding' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Get user's onboarding progress using the database function
    const { data: progressData, error: progressError } = await supabase
      .rpc('get_user_onboarding_progress', { user_id_param: userId })

    if (progressError) {
      console.error('Error fetching progress:', progressError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch onboarding progress' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get available rewards
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('*')
      .order('points_cost')

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch rewards' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Filter rewards based on user's points and NSFW mode
    const availableRewards = rewards.filter(reward => 
      reward.points_cost <= userData.points && 
      (reward.is_nsfw === false || req.headers.get('x-nsfw-mode') === 'true')
    )

    // Get user's redeemed rewards
    const { data: userRewards, error: userRewardsError } = await supabase
      .from('user_rewards')
      .select(`
        id,
        reward_id,
        redeemed_at,
        status,
        rewards (
          id,
          name,
          type,
          description,
          points_cost
        )
      `)
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false })

    if (userRewardsError) {
      console.error('Error fetching user rewards:', userRewardsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user rewards' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get recent activities
    const { data: activities, error: activitiesError } = await supabase
      .from('onboarding_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch activities' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get next level information
    let nextLevel = null
    if (userData.current_level_id) {
      const { data: currentLevel } = await supabase
        .from('levels')
        .select('min_points, max_points')
        .eq('id', userData.current_level_id)
        .single()

      if (currentLevel) {
        const { data: nextLevelData } = await supabase
          .from('levels')
          .select('*')
          .gt('min_points', currentLevel.min_points)
          .order('min_points', { ascending: true })
          .limit(1)

        if (nextLevelData && nextLevelData.length > 0) {
          nextLevel = nextLevelData[0]
        }
      }
    }

    const response = {
      success: true,
      data: {
        user: {
          id: userData.id,
          points: userData.points,
          onboarding_completed: userData.onboarding_completed,
          current_level_id: userData.current_level_id
        },
        progress: progressData,
        available_rewards: availableRewards,
        redeemed_rewards: userRewards,
        recent_activities: activities,
        next_level: nextLevel
      }
    }

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in onboarding-progress function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})