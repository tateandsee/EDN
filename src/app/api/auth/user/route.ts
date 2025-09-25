import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { db } from '@/lib/db'
import { createClient as createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
=======
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const { id, email, name, avatar } = await request.json()
    
    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      // Return a basic user object without database
      return NextResponse.json({ 
        success: true, 
        user: {
          id,
          email,
          name: name || email.split('@')[0],
          avatar,
          role: 'CREATOR',
          verified: false,
          subscriptions: [],
          affiliate: null
        }
      })
    }

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    // Check if user exists
    let user = await db.user.findUnique({
      where: { id }
    })

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          id,
          email,
          name: name || email.split('@')[0],
          avatar,
          role: 'CREATOR',
          verified: false
        }
      })
    } else {
      // Update existing user
      user = await db.user.update({
        where: { id },
        data: {
          name: name || user.name,
          avatar: avatar || user.avatar
        }
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error creating/updating user:', error)
<<<<<<< HEAD
    // Return a basic user object even if database fails
    const { id, email, name, avatar } = await request.json()
    return NextResponse.json({ 
      success: true, 
      user: {
        id,
        email,
        name: name || email.split('@')[0],
        avatar,
        role: 'CREATOR',
        verified: false,
        subscriptions: [],
        affiliate: null
      }
    })
=======
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  }
}

export async function GET(request: Request) {
  try {
<<<<<<< HEAD
    const supabase = await createSupabaseServerClient()

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

<<<<<<< HEAD
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      // Return a basic user object without database
      return NextResponse.json({ 
        user: {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0],
          avatar: user.user_metadata?.avatar_url,
          role: 'CREATOR',
          verified: false,
          subscriptions: [],
          affiliate: null
        }
      })
=======
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    }

    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { expiresAt: 'desc' },
          take: 1
        },
        affiliate: true,
        earnings: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error('Error fetching user:', error)
<<<<<<< HEAD
    
    // Try to get user from Supabase session even if database fails
    try {
      const supabase = await createSupabaseServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        return NextResponse.json({ 
          user: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || user.email?.split('@')[0],
            avatar: user.user_metadata?.avatar_url,
            role: 'CREATOR',
            verified: false,
            subscriptions: [],
            affiliate: null
          }
        })
      }
    } catch (sessionError) {
      console.error('Error getting session:', sessionError)
    }

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}