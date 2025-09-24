import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Only import Supabase if it's configured
let createClient: any;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabaseModule = await import('@supabase/supabase-js');
    createClient = supabaseModule.createClient;
  }
} catch (error) {
  console.warn('Supabase not configured, platforms will work without authentication');
}

export async function GET(request: Request) {
  try {
    // Check if Supabase is configured
    if (!createClient) {
      // Return mock platforms if authentication is not configured
      const mockPlatforms = [
        { id: '1', name: 'OnlyFans', description: 'Premium content platform', icon: 'onlyfans', category: 'ADULT_PLATFORM', isActive: true },
        { id: '2', name: 'Instagram', description: 'Social media platform', icon: 'instagram', category: 'SOCIAL_MEDIA', isActive: true },
        { id: '3', name: 'TikTok', description: 'Short video platform', icon: 'tiktok', category: 'VIDEO_PLATFORM', isActive: true }
      ]
      
      return NextResponse.json({
        platforms: mockPlatforms,
        connections: []
      })
    }

    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      // Return mock platforms if database is not configured
      const mockPlatforms = [
        { id: '1', name: 'OnlyFans', description: 'Premium content platform', icon: 'onlyfans', category: 'ADULT_PLATFORM', isActive: true },
        { id: '2', name: 'Instagram', description: 'Social media platform', icon: 'instagram', category: 'SOCIAL_MEDIA', isActive: true },
        { id: '3', name: 'TikTok', description: 'Short video platform', icon: 'tiktok', category: 'VIDEO_PLATFORM', isActive: true }
      ]
      
      return NextResponse.json({
        platforms: mockPlatforms,
        connections: []
      })
    }

    const platforms = await db.platform.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })

    const connections = await db.platformConnection.findMany({
      where: { userId: user.id },
      include: { platform: true }
    })

    return NextResponse.json({
      platforms,
      connections
    })
  } catch (error) {
    console.error('Error fetching platforms:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!createClient) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      )
    }

    const supabase = await createClient()
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

    const { platformId, username, authData } = await request.json()

    if (!platformId) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      )
    }

    // Check if platform exists
    const platform = await db.platform.findUnique({
      where: { id: platformId }
    })

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      )
    }

    // Create or update connection
    const connection = await db.platformConnection.upsert({
      where: {
        platformId_userId: {
          platformId,
          userId: user.id
        }
      },
      update: {
        username,
        authData,
        isConnected: true
      },
      create: {
        platformId,
        userId: user.id,
        username,
        authData,
        isConnected: true
      },
      include: { platform: true }
    })

    return NextResponse.json({ success: true, connection })
  } catch (error) {
    console.error('Error creating platform connection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}