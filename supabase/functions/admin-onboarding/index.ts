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

    // Verify user is an admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Access denied. Admin privileges required.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    const method = req.method

    // Handle different endpoints
    switch (path) {
      case 'steps':
        return handleSteps(req, supabase, corsHeaders)
      case 'badges':
        return handleBadges(req, supabase, corsHeaders)
      case 'levels':
        return handleLevels(req, supabase, corsHeaders)
      case 'rewards':
        return handleRewards(req, supabase, corsHeaders)
      case 'analytics':
        return handleAnalytics(req, supabase, corsHeaders)
      case 'user-progress':
        return handleUserProgress(req, supabase, corsHeaders)
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
    }
  } catch (error) {
    console.error('Error in admin-onboarding function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function handleSteps(req: Request, supabase: any, corsHeaders: any) {
  const method = req.method

  switch (method) {
    case 'GET':
      const { data: steps } = await supabase
        .from('onboarding_steps')
        .select('*')
        .order('order')
      return new Response(JSON.stringify({ success: true, data: steps }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'POST':
      const stepData = await req.json()
      const { data: newStep, error: insertError } = await supabase
        .from('onboarding_steps')
        .insert([stepData])
        .select()
      
      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      return new Response(JSON.stringify({ success: true, data: newStep }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      })

    case 'PUT':
      const { searchParams } = new URL(req.url)
      const stepId = searchParams.get('id')
      const updateData = await req.json()
      
      if (!stepId) {
        return new Response(JSON.stringify({ error: 'Step ID required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      const { data: updatedStep, error: updateError } = await supabase
        .from('onboarding_steps')
        .update(updateData)
        .eq('id', stepId)
        .select()
      
      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      return new Response(JSON.stringify({ success: true, data: updatedStep }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'DELETE':
      const { searchParams: deleteParams } = new URL(req.url)
      const deleteStepId = deleteParams.get('id')
      
      if (!deleteStepId) {
        return new Response(JSON.stringify({ error: 'Step ID required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      const { error: deleteError } = await supabase
        .from('onboarding_steps')
        .delete()
        .eq('id', deleteStepId)
      
      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      })
  }
}

async function handleBadges(req: Request, supabase: any, corsHeaders: any) {
  const method = req.method

  switch (method) {
    case 'GET':
      const { data: badges } = await supabase
        .from('badges')
        .select('*')
      return new Response(JSON.stringify({ success: true, data: badges }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'POST':
      const badgeData = await req.json()
      const { data: newBadge, error: insertError } = await supabase
        .from('badges')
        .insert([badgeData])
        .select()
      
      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      return new Response(JSON.stringify({ success: true, data: newBadge }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      })

    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      })
  }
}

async function handleLevels(req: Request, supabase: any, corsHeaders: any) {
  const method = req.method

  switch (method) {
    case 'GET':
      const { data: levels } = await supabase
        .from('levels')
        .select('*')
        .order('min_points')
      return new Response(JSON.stringify({ success: true, data: levels }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'POST':
      const levelData = await req.json()
      const { data: newLevel, error: insertError } = await supabase
        .from('levels')
        .insert([levelData])
        .select()
      
      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      return new Response(JSON.stringify({ success: true, data: newLevel }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      })

    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      })
  }
}

async function handleRewards(req: Request, supabase: any, corsHeaders: any) {
  const method = req.method

  switch (method) {
    case 'GET':
      const { data: rewards } = await supabase
        .from('rewards')
        .select('*')
        .order('points_cost')
      return new Response(JSON.stringify({ success: true, data: rewards }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    case 'POST':
      const rewardData = await req.json()
      const { data: newReward, error: insertError } = await supabase
        .from('rewards')
        .insert([rewardData])
        .select()
      
      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400
        })
      }
      
      return new Response(JSON.stringify({ success: true, data: newReward }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      })

    default:
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      })
  }
}

async function handleAnalytics(req: Request, supabase: any, corsHeaders: any) {
  const method = req.method

  if (method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    })
  }

  // Get overall analytics
  const { data: analytics } = await supabase
    .from('onboarding_analytics')
    .select('*')
    .single()

  // Get step completion rates
  const { data: stepStats } = await supabase
    .from('user_onboarding_progress')
    .select(`
      step_id,
      status,
      onboarding_steps (name, order, is_required)
    `)

  // Calculate completion rates per step
  const stepCompletionRates = {}
  stepStats?.forEach((stat: any) => {
    const stepId = stat.step_id
    const stepName = stat.onboarding_steps?.name
    const isRequired = stat.onboarding_steps?.is_required
    
    if (!stepCompletionRates[stepId]) {
      stepCompletionRates[stepId] = {
        step_id: stepId,
        name: stepName,
        is_required: isRequired,
        total: 0,
        completed: 0,
        in_progress: 0,
        pending: 0
      }
    }
    
    stepCompletionRates[stepId].total++
    if (stat.status === 'COMPLETED') {
      stepCompletionRates[stepId].completed++
    } else if (stat.status === 'IN_PROGRESS') {
      stepCompletionRates[stepId].in_progress++
    } else {
      stepCompletionRates[stepId].pending++
    }
  })

  // Calculate completion rates
  Object.keys(stepCompletionRates).forEach(stepId => {
    const step = stepCompletionRates[stepId]
    step.completion_rate = step.total > 0 ? (step.completed / step.total) * 100 : 0
  })

  // Get badge distribution
  const { data: badgeStats } = await supabase
    .from('user_badges')
    .select(`
      badge_id,
      badges (name, description)
    `)

  const badgeDistribution = {}
  badgeStats?.forEach((stat: any) => {
    const badgeId = stat.badge_id
    const badgeName = stat.badges?.name
    
    if (!badgeDistribution[badgeId]) {
      badgeDistribution[badgeId] = {
        badge_id: badgeId,
        name: badgeName,
        count: 0
      }
    }
    
    badgeDistribution[badgeId].count++
  })

  // Get reward redemption stats
  const { data: rewardStats } = await supabase
    .from('user_rewards')
    .select(`
      reward_id,
      status,
      rewards (name, type, points_cost)
    `)

  const rewardRedemptionStats = {}
  rewardStats?.forEach((stat: any) => {
    const rewardId = stat.reward_id
    const rewardName = stat.rewards?.name
    const rewardType = stat.rewards?.type
    const pointsCost = stat.rewards?.points_cost
    
    if (!rewardRedemptionStats[rewardId]) {
      rewardRedemptionStats[rewardId] = {
        reward_id: rewardId,
        name: rewardName,
        type: rewardType,
        points_cost: pointsCost,
        total: 0,
        pending: 0,
        claimed: 0,
        expired: 0
      }
    }
    
    rewardRedemptionStats[rewardId].total++
    if (stat.status === 'PENDING') {
      rewardRedemptionStats[rewardId].pending++
    } else if (stat.status === 'CLAIMED') {
      rewardRedemptionStats[rewardId].claimed++
    } else if (stat.status === 'EXPIRED') {
      rewardRedemptionStats[rewardId].expired++
    }
  })

  const response = {
    success: true,
    data: {
      overall_analytics: analytics,
      step_completion_rates: Object.values(stepCompletionRates),
      badge_distribution: Object.values(badgeDistribution),
      reward_redemption_stats: Object.values(rewardRedemptionStats)
    }
  }

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleUserProgress(req: Request, supabase: any, corsHeaders: any) {
  const method = req.method

  if (method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405
    })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('user_id')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID required' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }

  // Get user's onboarding summary
  const { data: userSummary } = await supabase
    .from('user_onboarding_summary')
    .select('*')
    .eq('id', userId)
    .single()

  // Get detailed progress
  const { data: detailedProgress } = await supabase
    .from('user_onboarding_progress')
    .select(`
      *,
      onboarding_steps (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  // Get user's activities
  const { data: activities } = await supabase
    .from('onboarding_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Get user's badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select(`
      *,
      badges (*)
    `)
    .eq('user_id', userId)
    .order('awarded_at', { ascending: false })

  // Get user's rewards
  const { data: userRewards } = await supabase
    .from('user_rewards')
    .select(`
      *,
      rewards (*)
    `)
    .eq('user_id', userId)
    .order('redeemed_at', { ascending: false })

  const response = {
    success: true,
    data: {
      user_summary: userSummary,
      detailed_progress: detailedProgress,
      activities: activities,
      badges: userBadges,
      rewards: userRewards
    }
  }

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}