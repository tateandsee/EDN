/**
 * SDXL Image Generation API Endpoint
 * Handles advanced image generation using Stable Diffusion XL
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StableDiffusionXLService } from '@/services/ai/stable-diffusion-xl.service'
import { rateLimit } from '@/lib/rate-limit'

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

    // Parse request body
    const body = await request.json()
    const {
      prompt,
      negativePrompt,
      config,
      loraConfigs,
      stylePreset,
      qualityPreset,
      isNSFW,
      batchSize,
      unrestrictedNSFW,
      femaleOnly,
      ageRange,
      contentRestrictions
    } = body

    // Validate required fields
    if (!prompt || !config) {
      return NextResponse.json(
        { error: 'Prompt and config are required' },
        { status: 400 }
      )
    }

    // Validate config
    const { model, resolution, steps, guidance, sampler, scheduler } = config
    if (!model || !resolution || !steps || !guidance) {
      return NextResponse.json(
        { error: 'Invalid config: model, resolution, steps, and guidance are required' },
        { status: 400 }
      )
    }

    // Validate unrestricted NSFW parameters
    if (unrestrictedNSFW) {
      // Ensure NSFW mode is enabled
      if (!isNSFW) {
        return NextResponse.json(
          { error: 'NSFW mode must be enabled for unrestricted NSFW generation' },
          { status: 400 }
        )
      }

      // Validate female-only requirement
      if (femaleOnly !== true) {
        return NextResponse.json(
          { error: 'Female-only parameter must be true for unrestricted NSFW generation' },
          { status: 400 }
        )
      }

      // Validate age range
      if (ageRange !== '18-40') {
        return NextResponse.json(
          { error: 'Only age range 18-40 is supported for unrestricted NSFW generation' },
          { status: 400 }
        )
      }

      // Validate content restrictions
      const requiredRestrictions = {
        noChildren: true,
        noMen: true,
        noAnimals: true,
        noPain: true
      }

      if (!contentRestrictions || 
          Object.keys(requiredRestrictions).some(key => 
            contentRestrictions[key] !== requiredRestrictions[key]
          )) {
        return NextResponse.json(
          { error: 'Content restrictions must include: no children, no men, no animals, no pain' },
          { status: 400 }
        )
      }
    }

    // Initialize SDXL service
    const sdxlService = StableDiffusionXLService.getInstance()
    await sdxlService.initialize()

    // Validate request
    const validation = sdxlService.validateRequest({
      prompt,
      negativePrompt,
      config,
      loraConfigs,
      stylePreset,
      qualityPreset,
      isNSFW,
      batchSize
    })

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Prepare generation parameters
    const generationParams = {
      prompt,
      negativePrompt,
      config,
      loraConfigs,
      stylePreset,
      qualityPreset,
      isNSFW: isNSFW || false,
      batchSize: batchSize || 1
    }

    // Add unrestricted NSFW parameters if enabled
    if (unrestrictedNSFW) {
      Object.assign(generationParams, {
        unrestrictedNSFW: true,
        femaleOnly: true,
        ageRange: '18-40',
        contentRestrictions: {
          noChildren: true,
          noMen: true,
          noAnimals: true,
          noPain: true
        }
      })
    }

    // Generate images
    const result = await sdxlService.generateImages(generationParams)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      images: result.images,
      processingTime: result.processingTime,
      metadata: result.metadata
    })

  } catch (error) {
    console.error('SDXL generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Return SDXL configuration and options
    const sdxlService = StableDiffusionXLService.getInstance()
    
    return NextResponse.json({
      success: true,
      data: {
        models: sdxlService.getAvailableModels(),
        loraModels: sdxlService.getAvailableLoRAModels(),
        stylePresets: sdxlService.getStylePresets(),
        recommendedConfigs: sdxlService.getRecommendedConfigs()
      }
    })
  } catch (error) {
    console.error('SDXL config error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}