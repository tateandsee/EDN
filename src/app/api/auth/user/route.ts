import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createClient as createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { id, email, name, avatar } = await request.json()
    
    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}