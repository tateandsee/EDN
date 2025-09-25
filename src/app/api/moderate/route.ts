import { NextRequest, NextResponse } from 'next/server'
import { contentModeration } from '@/lib/content-moderation'

export async function POST(request: NextRequest) {
  try {
<<<<<<< HEAD
    const { type, content, config } = await request.json()

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type and content are required' },
=======
    const body = await request.json()
    const { type, content, config } = body

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
        { status: 400 }
      )
    }

<<<<<<< HEAD
    // Update moderation config if provided
=======
    // Update config if provided
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    if (config) {
      contentModeration.updateConfig(config)
    }

<<<<<<< HEAD
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
=======
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
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
}