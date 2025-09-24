import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Only import Supabase if it's configured
let supabase: any;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { createClient } = await import('@supabase/supabase-js')
    supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }
} catch (error) {
  console.warn('Supabase not configured, auth will work without authentication');
}

export async function POST(request: Request) {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { id, email, name, avatar } = await request.json()
    
    if (!id || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      )
    }

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}