import { NextRequest, NextResponse } from 'next/server'
import { videoQueue } from '@/lib/queue-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...data } = body

    switch (action) {
      case 'addJob':
        return await handleAddJob(data)
      
      case 'getJobStatus':
        return await handleGetJobStatus(data)
      
      case 'cancelJob':
        return await handleCancelJob(data)
      
      case 'getStats':
        return await handleGetStats()
      
      case 'updateConfig':
        return await handleUpdateConfig(data)
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Queue API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const stats = videoQueue.getStats()
    const config = videoQueue.getConfig()
    
    return NextResponse.json({
      message: 'Video generation queue service is running',
      stats,
      config,
      endpoints: {
        addJob: 'POST /api/queue with { action: "addJob", type: "video" | "image", priority: "low" | "medium" | "high" | "urgent", data: {...} }',
        getJobStatus: 'POST /api/queue with { action: "getJobStatus", jobId: "job-id" }',
        cancelJob: 'POST /api/queue with { action: "cancelJob", jobId: "job-id" }',
        getStats: 'POST /api/queue with { action: "getStats" }',
        updateConfig: 'POST /api/queue with { action: "updateConfig", config: {...} }'
      }
    })
  } catch (error) {
    console.error('Queue GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleAddJob(data: any) {
  const { type, priority = 'medium', userId, data: jobData } = data

  if (!type || !jobData) {
    return NextResponse.json(
      { error: 'Type and job data are required' },
      { status: 400 }
    )
  }

  try {
    const jobId = await videoQueue.addJob({
      type,
      priority,
      userId,
      data: jobData,
      status: 'pending' as any,
      createdAt: new Date(),
      progress: 0,
      retryCount: 0,
      maxRetries: 3
    })

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Job added to queue successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add job to queue' },
      { status: 400 }
    )
  }
}

async function handleGetJobStatus(data: any) {
  const { jobId } = data

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    )
  }

  const job = videoQueue.getJobStatus(jobId)
  
  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    job
  })
}

async function handleCancelJob(data: any) {
  const { jobId } = data

  if (!jobId) {
    return NextResponse.json(
      { error: 'Job ID is required' },
      { status: 400 }
    )
  }

  const cancelled = videoQueue.cancelJob(jobId)
  
  if (!cancelled) {
    return NextResponse.json(
      { error: 'Job not found or already processed' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Job cancelled successfully'
  })
}

async function handleGetStats() {
  const stats = videoQueue.getStats()
  const processingJobs = videoQueue.getProcessingJobs()
  
  return NextResponse.json({
    success: true,
    stats,
    processingJobs: processingJobs.map(job => ({
      id: job.id,
      type: job.type,
      progress: job.progress,
      status: job.status,
      priority: job.priority
    }))
  })
}

async function handleUpdateConfig(data: any) {
  const { config } = data

  if (!config) {
    return NextResponse.json(
      { error: 'Configuration is required' },
      { status: 400 }
    )
  }

  try {
    videoQueue.updateConfig(config)
    const newConfig = videoQueue.getConfig()
    
    return NextResponse.json({
      success: true,
      message: 'Queue configuration updated successfully',
      config: newConfig
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update queue configuration' },
      { status: 500 }
    )
  }
}