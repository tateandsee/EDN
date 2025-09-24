import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InitOnboardingRequest {
  userId: string
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

    const { userId }: InitOnboardingRequest = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify user exists and is a paid member
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, is_paid_member, email')
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
        JSON.stringify({ error: 'User must be a paid member to access onboarding' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Check if onboarding already initialized
    const { data: existingProgress } = await supabase
      .from('user_onboarding_progress')
      .select('id')
      .eq('user_id', userId)
      .limit(1)

    if (existingProgress && existingProgress.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Onboarding already initialized for this user' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 409 }
      )
    }

    // Get all onboarding steps
    const { data: steps, error: stepsError } = await supabase
      .from('onboarding_steps')
      .select('*')
      .order('order')

    if (stepsError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch onboarding steps' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Initialize progress for each step
    const progressRecords = steps.map(step => ({
      user_id: userId,
      step_id: step.id,
      status: 'PENDING',
      progress_percentage: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { error: insertError } = await supabase
      .from('user_onboarding_progress')
      .insert(progressRecords)

    if (insertError) {
      return new Response(
        JSON.stringify({ error: 'Failed to initialize onboarding progress' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Log initialization activity
    await supabase
      .from('onboarding_activities')
      .insert({
        user_id: userId,
        action: 'STEP_STARTED',
        details: { event: 'onboarding_initialized', steps_count: steps.length },
        created_at: new Date().toISOString()
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Onboarding journey initialized successfully',
        steps_count: steps.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error in onboarding-init function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})