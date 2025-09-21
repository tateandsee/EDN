/**
 * SDXL Health Check API Endpoint
 * Provides health status for the Stable Diffusion XL service
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StableDiffusionXLService } from '@/services/ai/stable-diffusion-xl.service'

export async function GET(request: NextRequest) {
  try {
    // Check authentication (optional for health check, but good for monitoring)
    const session = await getServerSession(authOptions)
    const isAuthenticated = !!session

    const sdxlService = StableDiffusionXLService.getInstance()
    const healthResult = await sdxlService.healthCheck()

    // Get additional service information
    const serviceInfo = {
      initialized: sdxlService['initialized'],
      version: '1.0.0',
      supportedFeatures: [
        'image-generation',
        'lora-support',
        'style-presets',
        'quality-presets',
        'batch-generation',
        'face-cloning'
      ],
      availableModels: sdxlService.getAvailableModels().length,
      availableLoRAModels: sdxlService.getAvailableLoRAModels().length,
      stylePresets: sdxlService.getStylePresets().length,
      recommendedConfigs: sdxlService.getRecommendedConfigs().length
    }

    return NextResponse.json({
      success: true,
      health: {
        healthy: healthResult.healthy,
        details: healthResult.details,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      },
      service: serviceInfo,
      authentication: {
        required: false,
        authenticated: isAuthenticated
      }
    })

  } catch (error) {
    console.error('SDXL health check error:', error)
    return NextResponse.json(
      {
        success: false,
        health: {
          healthy: false,
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}