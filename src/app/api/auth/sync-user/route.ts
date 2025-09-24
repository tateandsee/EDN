import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json()

    if (!user || !user.id || !user.email) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { id: user.id }
    })

    if (existingUser) {
      // Update existing user
      await db.user.update({
        where: { id: user.id },
        data: {
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          emailVerified: user.email_confirmed_at !== null,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new user
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          emailVerified: user.email_confirmed_at !== null,
          onboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    )
  }
}