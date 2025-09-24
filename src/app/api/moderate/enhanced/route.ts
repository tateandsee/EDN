import { NextRequest, NextResponse } from 'next/server'
import { enhancedContentModeration } from '@/lib/enhanced-content-moderation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, priority = 'medium' } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Validate content structure
    if (!content.text && !content.imageUrl && !content.videoUrl && !content.audioUrl) {
      return NextResponse.json(
        { error: 'Content must contain text, imageUrl, videoUrl, or audioUrl' },
        { status: 400 }
      )
    }

    // Add to moderation queue if real-time processing is enabled
    const queueId = await enhancedContentModeration.addToModerationQueue({
      contentId: content.id || 'unknown',
      contentType: content.text ? 'text' : content.imageUrl ? 'image' : content.videoUrl ? 'video' : 'audio',
      status: 'pending',
      priority: priority as any,
      submittedBy: content.submittedBy || 'anonymous'
    })

    // If real-time processing is enabled, get the result immediately
    const config = enhancedContentModeration.getConfig()
    if (config.enableRealTimeProcessing) {
      const result = await enhancedContentModeration.moderateContent(content)
      
      return NextResponse.json({
        success: true,
        result,
        queueId,
        processingTime: result.metadata.processingTime,
        timestamp: new Date().toISOString()
      })
    } else {
      // Return queue ID for async processing
      return NextResponse.json({
        success: true,
        queueId,
        message: 'Content added to moderation queue',
        estimatedProcessingTime: '30-60 seconds',
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('Enhanced moderation error:', error)
    return NextResponse.json(
      { error: 'Failed to moderate content' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const queueStatus = enhancedContentModeration.getQueueStatus()
    const config = enhancedContentModeration.getConfig()

    return NextResponse.json({
      service: 'Enhanced Content Moderation',
      status: 'active',
      queueStatus,
      config: {
        sensitivity: config.sensitivity,
        enableAIEnhancement: config.enableAIEnhancement,
        enableContextualAnalysis: config.enableContextualAnalysis,
        enableRealTimeProcessing: config.enableRealTimeProcessing,
        autoModeration: config.autoModeration
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Get moderation status error:', error)
    return NextResponse.json(
      { error: 'Failed to get moderation status' },
      { status: 500 }
    )
  }
}