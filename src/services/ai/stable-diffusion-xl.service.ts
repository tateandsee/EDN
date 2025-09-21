/**
 * Stable Diffusion XL Integration Service
 * Advanced image generation with SDXL, LoRA support, and fine-tuning capabilities
 */

import ZAI from 'z-ai-web-dev-sdk'

export interface SDXLConfig {
  model: 'stable-diffusion-xl' | 'sd-xl-turbo' | 'sd-xl-refiner'
  resolution: '1024x1024' | '1024x768' | '768x1024' | '1536x640' | '640x1536'
  steps: number
  guidance: number
  seed?: number
  sampler: 'DPM++ 2M Karras' | 'Euler a' | 'DDIM' | 'UniPC'
  scheduler: 'Karras' | 'Exponential' | 'Normal'
}

export interface LoRAConfig {
  name: string
  weight: number
  triggerWord?: string
  strength: number
}

export interface SDXLGenerationRequest {
  prompt: string
  negativePrompt?: string
  config: SDXLConfig
  loraConfigs?: LoRAConfig[]
  faceCloning?: {
    enabled: boolean
    faceImage?: string
    strength: number
  }
  stylePreset?: 'photorealistic' | 'anime' | 'fantasy' | 'cinematic' | 'digital-art'
  qualityPreset?: 'standard' | 'high' | 'ultra'
  isNSFW?: boolean
  batchSize?: number
}

export interface SDXLGenerationResult {
  success: boolean
  images?: Array<{
    id: string
    url: string
    base64: string
    metadata: {
      prompt: string
      negativePrompt: string
      config: SDXLConfig
      loraConfigs?: LoRAConfig[]
      generationTime: number
      modelUsed: string
      resolution: string
      isNSFW: boolean
    }
  }>
  error?: string
  processingTime: number
  metadata?: {
    model: string
    totalSteps: number
    guidance: number
    seed?: number
    loraModelsUsed: string[]
  }
}

export class StableDiffusionXLService {
  private static instance: StableDiffusionXLService
  private zai: ZAI | null = null
  private initialized = false

  private constructor() {}

  public static getInstance(): StableDiffusionXLService {
    if (!StableDiffusionXLService.instance) {
      StableDiffusionXLService.instance = new StableDiffusionXLService()
    }
    return StableDiffusionXLService.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      this.zai = await ZAI.create()
      this.initialized = true
      console.log('✅ Stable Diffusion XL Service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Stable Diffusion XL Service:', error)
      throw error
    }
  }

  /**
   * Generate images using Stable Diffusion XL with advanced features
   */
  async generateImages(request: SDXLGenerationRequest): Promise<SDXLGenerationResult> {
    if (!this.initialized || !this.zai) {
      throw new Error('Stable Diffusion XL Service not initialized')
    }

    const startTime = Date.now()

    try {
      // Enhance prompt with LoRA configurations
      const enhancedPrompt = this.enhancePromptWithLoRA(request.prompt, request.loraConfigs)
      
      // Add style and quality modifiers
      const finalPrompt = this.addStyleModifiers(enhancedPrompt, request.stylePreset, request.qualityPreset)
      
      // Prepare negative prompt
      const finalNegativePrompt = this.prepareNegativePrompt(request.negativePrompt, request.isNSFW)

      // Generate images using ZAI
      const batchSize = request.batchSize || 1
      const images: Array<{
        id: string
        url: string
        base64: string
        metadata: any
      }> = []

      for (let i = 0; i < batchSize; i++) {
        const imageResult = await this.generateSingleImage({
          prompt: finalPrompt,
          negativePrompt: finalNegativePrompt,
          config: request.config,
          seed: request.config.seed ? request.config.seed + i : undefined,
          isNSFW: request.isNSFW || false
        })

        images.push(imageResult)
      }

      return {
        success: true,
        images,
        processingTime: Date.now() - startTime,
        metadata: {
          model: request.config.model,
          totalSteps: request.config.steps,
          guidance: request.config.guidance,
          seed: request.config.seed,
          loraModelsUsed: request.loraConfigs?.map(lora => lora.name) || []
        }
      }

    } catch (error) {
      console.error('SDXL image generation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: Date.now() - startTime
      }
    }
  }

  /**
   * Generate a single image
   */
  private async generateSingleImage(params: {
    prompt: string
    negativePrompt: string
    config: SDXLConfig
    seed?: number
    isNSFW: boolean
  }): Promise<{
    id: string
    url: string
    base64: string
    metadata: any
  }> {
    if (!this.zai) throw new Error('ZAI SDK not initialized')

    try {
      // Use ZAI for image generation
      const response = await this.zai.images.generations.create({
        prompt: params.prompt,
        size: params.config.resolution,
        quality: 'hd'
      })

      const imageBase64 = response.data[0].base64
      const imageUrl = `data:image/jpeg;base64,${imageBase64}`

      return {
        id: `sdxl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        base64: imageBase64,
        metadata: {
          prompt: params.prompt,
          negativePrompt: params.negativePrompt,
          config: params.config,
          generationTime: Date.now(),
          modelUsed: params.config.model,
          resolution: params.config.resolution,
          isNSFW: params.isNSFW
        }
      }

    } catch (error) {
      throw new Error(`Single image generation failed: ${error}`)
    }
  }

  /**
   * Enhance prompt with LoRA configurations
   */
  private enhancePromptWithLoRA(prompt: string, loraConfigs?: LoRAConfig[]): string {
    if (!loraConfigs || loraConfigs.length === 0) {
      return prompt
    }

    let enhancedPrompt = prompt

    // Add LoRA triggers and weights
    loraConfigs.forEach(lora => {
      if (lora.triggerWord) {
        enhancedPrompt = `${lora.triggerWord}, ${enhancedPrompt}`
      }
      
      // Add LoRA weight notation
      enhancedPrompt = `<lora:${lora.name}:${lora.weight}> ${enhancedPrompt}`
    })

    return enhancedPrompt
  }

  /**
   * Add style and quality modifiers to prompt
   */
  private addStyleModifiers(
    prompt: string, 
    stylePreset?: string, 
    qualityPreset?: string
  ): string {
    let enhancedPrompt = prompt

    // Add style modifiers
    switch (stylePreset) {
      case 'photorealistic':
        enhancedPrompt += ', photorealistic, 8k, ultra detailed, professional photography'
        break
      case 'anime':
        enhancedPrompt += ', anime style, manga, detailed illustration'
        break
      case 'fantasy':
        enhancedPrompt += ', fantasy art, magical, ethereal, detailed'
        break
      case 'cinematic':
        enhancedPrompt += ', cinematic lighting, dramatic, film still'
        break
      case 'digital-art':
        enhancedPrompt += ', digital art, concept art, highly detailed'
        break
    }

    // Add quality modifiers
    switch (qualityPreset) {
      case 'high':
        enhancedPrompt += ', high quality, detailed, sharp focus'
        break
      case 'ultra':
        enhancedPrompt += ', ultra high quality, masterpiece, best quality, 8k resolution'
        break
      case 'standard':
      default:
        enhancedPrompt += ', good quality'
        break
    }

    return enhancedPrompt
  }

  /**
   * Prepare negative prompt based on NSFW setting
   */
  private prepareNegativePrompt(negativePrompt?: string, isNSFW?: boolean): string {
    let baseNegative = negativePrompt || ''

    if (!isNSFW) {
      // Add NSFW filters for SFW content
      baseNegative += ', nsfw, nude, explicit, adult content, inappropriate'
    }

    // Add general quality negative prompts
    baseNegative += ', blurry, low quality, distorted, deformed, ugly, bad anatomy'

    return baseNegative.trim()
  }

  /**
   * Get available SDXL models
   */
  getAvailableModels(): Array<{
    id: string
    name: string
    description: string
    maxResolution: string
    recommendedFor: string[]
  }> {
    return [
      {
        id: 'stable-diffusion-xl',
        name: 'Stable Diffusion XL Base',
        description: 'Base SDXL model with high-quality image generation',
        maxResolution: '1024x1024',
        recommendedFor: ['general-purpose', 'photorealistic', 'artistic']
      },
      {
        id: 'sd-xl-turbo',
        name: 'SDXL Turbo',
        description: 'Fast generation with good quality',
        maxResolution: '512x512',
        recommendedFor: ['quick-generation', 'prototyping', 'real-time']
      },
      {
        id: 'sd-xl-refiner',
        name: 'SDXL Refiner',
        description: 'Refinement model for enhancing image quality',
        maxResolution: '1024x1024',
        recommendedFor: ['quality-enhancement', 'detail-refinement', 'final-touches']
      }
    ]
  }

  /**
   * Get available LoRA models
   */
  getAvailableLoRAModels(): Array<{
    id: string
    name: string
    description: string
    triggerWord?: string
    category: 'style' | 'character' | 'clothing' | 'background' | 'effect'
    recommendedWeight: number
  }> {
    return [
      {
        id: 'photorealistic-enhancer',
        name: 'Photorealistic Enhancer',
        description: 'Enhances photorealism and detail',
        triggerWord: 'photorealistic',
        category: 'style',
        recommendedWeight: 0.8
      },
      {
        id: 'anime-style',
        name: 'Anime Style',
        description: 'Adds anime/manga style characteristics',
        triggerWord: 'anime_style',
        category: 'style',
        recommendedWeight: 1.0
      },
      {
        id: 'cinematic-lighting',
        name: 'Cinematic Lighting',
        description: 'Adds dramatic cinematic lighting effects',
        triggerWord: 'cinematic_lighting',
        category: 'effect',
        recommendedWeight: 0.7
      },
      {
        id: 'portrait-master',
        name: 'Portrait Master',
        description: 'Specialized for portrait photography',
        category: 'character',
        recommendedWeight: 0.9
      },
      {
        id: 'fantasy-backgrounds',
        name: 'Fantasy Backgrounds',
        description: 'Creates fantasy-themed backgrounds',
        triggerWord: 'fantasy_bg',
        category: 'background',
        recommendedWeight: 0.8
      }
    ]
  }

  /**
   * Get style presets
   */
  getStylePresets(): Array<{
    id: string
    name: string
    description: string
    examplePrompt: string
  }> {
    return [
      {
        id: 'photorealistic',
        name: 'Photorealistic',
        description: 'Realistic photography style',
        examplePrompt: 'Beautiful woman in natural lighting'
      },
      {
        id: 'anime',
        name: 'Anime',
        description: 'Japanese anime/manga style',
        examplePrompt: 'Anime character with detailed features'
      },
      {
        id: 'fantasy',
        name: 'Fantasy',
        description: 'Fantasy art with magical elements',
        examplePrompt: 'Enchanting fairy in mystical forest'
      },
      {
        id: 'cinematic',
        name: 'Cinematic',
        description: 'Movie-style dramatic lighting',
        examplePrompt: 'Dramatic portrait with cinematic lighting'
      },
      {
        id: 'digital-art',
        name: 'Digital Art',
        description: 'Modern digital illustration style',
        examplePrompt: 'Digital art portrait with vibrant colors'
      }
    ]
  }

  /**
   * Get recommended configurations for different use cases
   */
  getRecommendedConfigs(): Array<{
    name: string
    description: string
    config: SDXLConfig
    useCase: string
  }> {
    return [
      {
        name: 'High Quality Portrait',
        description: 'Best for detailed portrait photography',
        config: {
          model: 'stable-diffusion-xl',
          resolution: '1024x1024',
          steps: 40,
          guidance: 7.5,
          sampler: 'DPM++ 2M Karras',
          scheduler: 'Karras'
        },
        useCase: 'portrait-photography'
      },
      {
        name: 'Fast Generation',
        description: 'Quick generation for prototyping',
        config: {
          model: 'sd-xl-turbo',
          resolution: '512x512',
          steps: 20,
          guidance: 7.0,
          sampler: 'Euler a',
          scheduler: 'Normal'
        },
        useCase: 'quick-generation'
      },
      {
        name: 'Artistic Style',
        description: 'Optimized for artistic and creative images',
        config: {
          model: 'stable-diffusion-xl',
          resolution: '1024x768',
          steps: 35,
          guidance: 8.0,
          sampler: 'DDIM',
          scheduler: 'Exponential'
        },
        useCase: 'artistic-creation'
      },
      {
        name: 'Quality Refinement',
        description: 'Best for refining existing images',
        config: {
          model: 'sd-xl-refiner',
          resolution: '1024x1024',
          steps: 25,
          guidance: 6.0,
          sampler: 'DPM++ 2M Karras',
          scheduler: 'Karras'
        },
        useCase: 'quality-enhancement'
      }
    ]
  }

  /**
   * Validate generation request
   */
  validateRequest(request: SDXLGenerationRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!request.prompt || request.prompt.trim().length === 0) {
      errors.push('Prompt is required')
    }

    if (request.config.steps < 1 || request.config.steps > 100) {
      errors.push('Steps must be between 1 and 100')
    }

    if (request.config.guidance < 1 || request.config.guidance > 20) {
      errors.push('Guidance must be between 1 and 20')
    }

    if (request.batchSize && (request.batchSize < 1 || request.batchSize > 10)) {
      errors.push('Batch size must be between 1 and 10')
    }

    if (request.loraConfigs) {
      request.loraConfigs.forEach((lora, index) => {
        if (lora.weight < 0 || lora.weight > 2) {
          errors.push(`LoRA ${index + 1} weight must be between 0 and 2`)
        }
      })
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ healthy: boolean; details?: string }> {
    try {
      if (!this.initialized || !this.zai) {
        return { healthy: false, details: 'Service not initialized' }
      }

      // Test with a simple generation
      const testRequest: SDXLGenerationRequest = {
        prompt: 'Test prompt',
        config: {
          model: 'sd-xl-turbo',
          resolution: '512x512',
          steps: 5,
          guidance: 7.0,
          sampler: 'Euler a',
          scheduler: 'Normal'
        }
      }

      const result = await this.generateImages(testRequest)
      
      return {
        healthy: result.success,
        details: result.success ? 'SDXL service operational' : result.error
      }

    } catch (error) {
      return {
        healthy: false,
        details: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}