/**
 * SDXL Fine-Tuning API Endpoint
 * Handles fine-tuning job management and monitoring
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { LoRAManagementService } from '@/services/ai/lora-management.service'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const status = searchParams.get('status')

    const loraService = LoRAManagementService.getInstance()

    if (jobId) {
      // Get specific job
      const job = loraService.getFineTuningJob(jobId)
      if (!job) {
        return NextResponse.json(
          { error: 'Job not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: { job }
      })
    } else {
      // Get all jobs, optionally filtered by status
      const jobs = loraService.getFineTuningJobs(status || undefined)
      return NextResponse.json({
        success: true,
        data: { jobs }
      })
    }

  } catch (error) {
    console.error('Fine-tuning API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      )
    }

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      baseModel,
      trainingImages,
      config
    } = body

    // Validate required fields
    if (!name || !description || !baseModel || !trainingImages || !config) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate training images
    if (!Array.isArray(trainingImages) || trainingImages.length === 0) {
      return NextResponse.json(
        { error: 'Training images must be a non-empty array' },
        { status: 400 }
      )
    }

    // Validate config
    const requiredConfigFields = ['epochs', 'learningRate', 'batchSize', 'resolution', 'steps']
    for (const field of requiredConfigFields) {
      if (config[field] === undefined || config[field] === null) {
        return NextResponse.json(
          { error: `Missing required config field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Create fine-tuning job
    const loraService = LoRAManagementService.getInstance()
    const jobId = loraService.createFineTuningJob(
      name,
      description,
      baseModel,
      trainingImages,
      config
    )

    return NextResponse.json({
      success: true,
      data: {
        jobId,
        message: 'Fine-tuning job created successfully'
      }
    })

  } catch (error) {
    console.error('Fine-tuning API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      )
    }

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID parameter is required' },
        { status: 400 }
      )
    }

    const loraService = LoRAManagementService.getInstance()
    const cancelled = loraService.cancelFineTuningJob(jobId)

    if (!cancelled) {
      return NextResponse.json(
        { error: 'Job not found or cannot be cancelled' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        cancelled: true,
        message: 'Fine-tuning job cancelled successfully'
      }
    })

  } catch (error) {
    console.error('Fine-tuning API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}