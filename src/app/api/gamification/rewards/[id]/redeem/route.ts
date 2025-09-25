import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { db } from '@/lib/db'
import { GamificationProgressService } from '@/lib/gamification-progress'

// Only import Supabase if it's configured
let supabase: any;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { supabase: supabaseClient } = await import('@/lib/supabase');
    supabase = supabaseClient;
  }
} catch (error) {
  console.warn('Supabase not configured, gamification will work without authentication');
}

=======
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { GamificationProgressService } from '@/lib/gamification-progress'

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
<<<<<<< HEAD
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      )
    }

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    // Get the current user from Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database using id
    const dbUser = await db.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const rewardId = params.id

    const success = await GamificationProgressService.redeemReward(dbUser.id, rewardId)
    
    if (success) {
      return NextResponse.json({ message: 'Reward redeemed successfully' })
    } else {
      return NextResponse.json(
        { error: 'Failed to redeem reward' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error redeeming reward:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to redeem reward' },
      { status: 500 }
    )
  }
}