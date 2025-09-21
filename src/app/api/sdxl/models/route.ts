/**
 * SDXL Models API Endpoint
 * Provides information about available SDXL models and LoRA configurations
 */

import { NextRequest, NextResponse } from 'next/server'
import { StableDiffusionXLService } from '@/services/ai/stable-diffusion-xl.service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'models', 'lora', 'styles', 'configs', or 'all'

    const sdxlService = StableDiffusionXLService.getInstance()

    let response: any = { success: true }

    switch (type) {
      case 'models':
        response.data = {
          models: sdxlService.getAvailableModels()
        }
        break
      case 'lora':
        response.data = {
          loraModels: sdxlService.getAvailableLoRAModels()
        }
        break
      case 'styles':
        response.data = {
          stylePresets: sdxlService.getStylePresets()
        }
        break
      case 'configs':
        response.data = {
          recommendedConfigs: sdxlService.getRecommendedConfigs()
        }
        break
      case 'all':
      default:
        response.data = {
          models: sdxlService.getAvailableModels(),
          loraModels: sdxlService.getAvailableLoRAModels(),
          stylePresets: sdxlService.getStylePresets(),
          recommendedConfigs: sdxlService.getRecommendedConfigs()
        }
        break
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('SDXL models API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}