import { NextRequest, NextResponse } from 'next/server'
import { contentModeration } from '@/lib/content-moderation'

export async function POST(request: NextRequest) {
  try {
    const { type, content, config } = await request.json()

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type and content are required' },
        { status: 400 }
      )
    }

    // Update moderation config if provided
    if (config) {
      contentModeration.updateConfig(config)
    }

    // Moderate the content based on type
    let moderationResult
    if (type === 'text') {
      moderationResult = await contentModeration.moderateText(content)
    } else if (type === 'image') {
      moderationResult = await contentModeration.moderateImage(content)
    } else {
      return NextResponse.json(
        { error: 'Invalid moderation type. Supported types: text, image' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      result: moderationResult
    })

  } catch (error) {
    console.error('Content moderation error:', error)
    return NextResponse.json(
      { error: 'Failed to moderate content' },
      { status: 500 }
    )
  }
}