import { NextRequest, NextResponse } from 'next/server'
import { contentModeration } from '@/lib/content-moderation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, config } = body

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      )
    }

    // Update config if provided
    if (config) {
      contentModeration.updateConfig(config)
    }

    let result

    switch (type) {
      case 'text':
        result = await contentModeration.moderateText(content)
        break
      case 'image':
        result = await contentModeration.moderateImage(content)
        break
      case 'video':
        result = await contentModeration.moderateVideo(content)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid content type. Must be text, image, or video' },
          { status: 400 }
        )
    }

    // Log moderation results for audit purposes
    console.log('Content moderation result:', {
      type,
      isNSFW: result.isNSFW,
      confidence: result.confidence,
      edgeCases: result.edgeCases,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Content moderation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during content moderation' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Content moderation service is running',
    config: contentModeration.getConfig(),
    endpoints: {
      text: 'POST /api/moderate with { type: "text", content: "your text" }',
      image: 'POST /api/moderate with { type: "image", content: "image-url" }',
      video: 'POST /api/moderate with { type: "video", content: "video-url" }'
    }
  })
}