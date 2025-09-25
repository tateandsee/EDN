import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { db } from '@/lib/db'
import { contentModeration } from '@/lib/content-moderation'

// Only import Supabase if it's configured
let supabase: any;
let createClient: any;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { supabase: supabaseClient, createClient: createSupabaseClient } = await import('@/lib/supabase');
    supabase = supabaseClient;
    createClient = createSupabaseClient;
  }
} catch (error) {
  console.warn('Supabase not configured, NSFW content will work without authentication');
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      )
    }

=======
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { contentModeration } from '@/lib/content-moderation'

export async function POST(request: NextRequest) {
  try {
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { 
      prompt, 
      type, 
      loraModel, 
      resolution, 
      tags, 
      isNSFW = false,
      moderationConfig,
      autoModerate = true
    } = await request.json()

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and type are required' },
        { status: 400 }
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Check user subscription and age verification for NSFW content
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { expiresAt: 'desc' },
          take: 1
        }
      }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // For NSFW content, require premium subscription and age verification
    if (isNSFW) {
      const subscription = dbUser.subscriptions[0]
      if (!subscription) {
        return NextResponse.json(
          { error: 'Premium subscription required for NSFW content creation' },
          { status: 403 }
        )
      }

      // Check if user has age verification (this would be stored in user metadata)
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user_metadata?.age_verified) {
        return NextResponse.json(
          { error: 'Age verification required for NSFW content creation' },
          { status: 403 }
        )
      }
    }

    // Auto-moderate content if enabled
    let moderationResult: any = null
    if (autoModerate) {
      try {
        // Update moderation config if provided
        if (moderationConfig) {
          contentModeration.updateConfig(moderationConfig)
        }

        // Moderate the prompt
        moderationResult = await contentModeration.moderateText(prompt)

        // If content is flagged as NSFW but user didn't mark it as such, warn them
        if (moderationResult.isNSFW && !isNSFW) {
          return NextResponse.json({
            error: 'Content moderation flagged this as NSFW content',
            moderationResult,
            requiresNSFWMode: true
          }, { status: 400 })
        }

        // If user marked as NSFW but moderation doesn't detect it, still allow but log
        if (isNSFW && !moderationResult.isNSFW) {
          console.log('User marked content as NSFW but moderation did not detect it:', {
            userId: user.id,
            prompt,
            moderationResult
          })
        }

      } catch (moderationError) {
        console.error('Content moderation error:', moderationError)
        // Continue with content creation but log the error
      }
    }

    // Create content record with NSFW flag
    const content = await db.content.create({
      data: {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${new Date().toLocaleDateString()}`,
        type: type.toUpperCase(),
        status: 'PROCESSING',
        prompt,
        loraModel,
        resolution,
        tags: tags || [],
        userId: user.id,
        // Note: You would need to add isNsfw field to the Content model in schema.prisma
        // isNsfw: isNSFW
      }
    })

    // For now, we'll store NSFW information in tags since the schema doesn't have isNsfw field
    if (isNSFW) {
      const currentTags = Array.isArray(tags) ? tags : (tags ? [tags] : [])
      const updatedTags = [...new Set([...currentTags, 'NSFW', 'ADULT_CONTENT'])]
      await db.content.update({
        where: { id: content.id },
        data: {
          tags: updatedTags
        }
      })
    }

    // Log content creation for audit purposes
    console.log('NSFW content creation:', {
      contentId: content.id,
      userId: user.id,
      isNSFW,
      moderationResult: moderationResult ? {
        isNSFW: moderationResult.isNSFW,
        confidence: moderationResult.confidence,
        edgeCases: moderationResult.edgeCases
      } : null,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      content,
      moderationResult,
      message: isNSFW ? 'NSFW content creation initiated' : 'Content creation initiated'
    })

  } catch (error) {
    console.error('NSFW content creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const isNSFW = searchParams.get('nsfw') === 'true'

    const where: any = { userId: user.id }
    if (type) where.type = type.toUpperCase()
    if (status) where.status = status.toUpperCase()

    // Filter by NSFW content (using tags since schema doesn't have isNsfw field)
    if (isNSFW) {
      where.tags = {
        has: ['NSFW', 'ADULT_CONTENT']
      }
    } else if (searchParams.has('nsfw')) {
      // Explicitly exclude NSFW content
      where.tags = {
        none: ['NSFW', 'ADULT_CONTENT']
      }
    }

    const [contents, total] = await Promise.all([
      db.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.content.count({ where })
    ])

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        isNSFW,
        type,
        status
      }
    })
  } catch (error) {
    console.error('Error fetching NSFW content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { contentId, isNSFW, tags, status } = await request.json()

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    // Check if content exists and belongs to user
    const existingContent = await db.content.findFirst({
      where: { 
        id: contentId,
        userId: user.id 
      }
    })

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found or access denied' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}
    if (status) updateData.status = status
    if (tags) updateData.tags = tags

    // Handle NSFW tagging
    if (isNSFW !== undefined) {
      const currentTags = Array.isArray(existingContent.tags) ? existingContent.tags : []
      const nsfwTags = ['NSFW', 'ADULT_CONTENT']
      
      if (isNSFW) {
        // Add NSFW tags
        updateData.tags = [...new Set([...currentTags, ...nsfwTags])]
      } else {
        // Remove NSFW tags
        updateData.tags = currentTags.filter((tag: string) => !nsfwTags.includes(tag))
      }
    }

    // Update content
    const updatedContent = await db.content.update({
      where: { id: contentId },
      data: updateData
    })

    // Log content update for audit purposes
    console.log('NSFW content update:', {
      contentId,
      userId: user.id,
      isNSFW,
      changes: updateData,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      content: updatedContent,
      message: 'Content updated successfully'
    })

  } catch (error) {
    console.error('NSFW content update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
<<<<<<< HEAD
    // Check if Supabase is configured
    if (!createClient) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      )
    }

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      )
    }

    // Check if content exists and belongs to user
    const existingContent = await db.content.findFirst({
      where: { 
        id: contentId,
        userId: user.id 
      }
    })

    if (!existingContent) {
      return NextResponse.json(
        { error: 'Content not found or access denied' },
        { status: 404 }
      )
    }

    // Delete content
    await db.content.delete({
      where: { id: contentId }
    })

    // Log content deletion for audit purposes
    console.log('NSFW content deletion:', {
      contentId,
      userId: user.id,
      wasNSFW: existingContent.tags?.includes('NSFW') || existingContent.tags?.includes('ADULT_CONTENT'),
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Content deleted successfully'
    })

  } catch (error) {
    console.error('NSFW content deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}