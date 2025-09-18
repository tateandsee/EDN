import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { GamificationProgressService } from '@/lib/gamification-progress'

export async function GET(request: NextRequest) {
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

    const progress = await GamificationProgressService.getUserProgress(dbUser.id)
    
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching gamification progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gamification progress' },
      { status: 500 }
    )
  }
}