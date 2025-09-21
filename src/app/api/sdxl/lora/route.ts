/**
 * SDXL LoRA Management API Endpoint
 * Handles LoRA model management, fine-tuning, and configuration
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
    const action = searchParams.get('action') // 'models', 'categories', 'stats', 'recommendations', 'search'
    const category = searchParams.get('category')
    const query = searchParams.get('query')
    const useCase = searchParams.get('useCase')

    const loraService = LoRAManagementService.getInstance()

    switch (action) {
      case 'models':
        const models = loraService.getAvailableLoRAModels(category || undefined)
        return NextResponse.json({
          success: true,
          data: { models }
        })

      case 'categories':
        const categories = loraService.getCategories()
        return NextResponse.json({
          success: true,
          data: { categories }
        })

      case 'stats':
        const stats = loraService.getUsageStats()
        return NextResponse.json({
          success: true,
          data: { stats }
        })

      case 'recommendations':
        if (!useCase) {
          return NextResponse.json(
            { error: 'Use case parameter is required' },
            { status: 400 }
          )
        }
        const recommendations = loraService.getRecommendedConfigurations(useCase)
        return NextResponse.json({
          success: true,
          data: { recommendations }
        })

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Search query parameter is required' },
            { status: 400 }
          )
        }
        const searchResults = loraService.searchLoRAModels(query)
        return NextResponse.json({
          success: true,
          data: { results: searchResults }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('LoRA management API error:', error)
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
    const { action, ...data } = body

    const loraService = LoRAManagementService.getInstance()

    switch (action) {
      case 'add-model':
        const { model: modelData } = data
        const modelId = loraService.addCustomLoRAModel(modelData)
        return NextResponse.json({
          success: true,
          data: { modelId }
        })

      case 'remove-model':
        const { modelId: removeId } = data
        const removed = loraService.removeLoRAModel(removeId)
        return NextResponse.json({
          success: true,
          data: { removed }
        })

      case 'create-finetuning':
        const {
          name,
          description,
          baseModel,
          trainingImages,
          config
        } = data

        if (!name || !baseModel || !trainingImages || !config) {
          return NextResponse.json(
            { error: 'Missing required fields for fine-tuning' },
            { status: 400 }
          )
        }

        const jobId = loraService.createFineTuningJob(
          name,
          description,
          baseModel,
          trainingImages,
          config
        )

        return NextResponse.json({
          success: true,
          data: { jobId }
        })

      case 'validate-config':
        const { config: validateConfig } = data
        const validation = loraService.validateLoRAConfig(validateConfig)
        return NextResponse.json({
          success: true,
          data: { validation }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('LoRA management API error:', error)
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
    const action = searchParams.get('action')

    const loraService = LoRAManagementService.getInstance()

    switch (action) {
      case 'cancel-finetuning':
        const jobId = searchParams.get('jobId')
        if (!jobId) {
          return NextResponse.json(
            { error: 'Job ID parameter is required' },
            { status: 400 }
          )
        }

        const cancelled = loraService.cancelFineTuningJob(jobId)
        return NextResponse.json({
          success: true,
          data: { cancelled }
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('LoRA management API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}