import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { GamificationProgressService } from '@/lib/gamification-progress'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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