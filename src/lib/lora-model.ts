/**
 * EDN LoRA Model Implementation
 * Specialized for photorealistic content creation with NSFW/SFW optimization
 */

import { aiModelIntegration, ImageGenerationRequest } from './ai-models'

export interface LoRAConfig {
  name: string
  path: string
  strength: number
  style: 'photorealistic' | 'artistic' | 'anime' | 'realistic'
  triggerWords: string[]
  negativePrompt?: string
  recommendedSteps: number
  recommendedGuidance: number
  optimizedFor: 'NSFW' | 'SFW' | 'BOTH'
  description: string
}

export interface LoRAModelRequest {
  basePrompt: string
  loraConfigs: LoRAConfig[]
  width: number
  height: number
  steps?: number
  guidance?: number
  seed?: number
  isNSFW?: boolean
  quality: 'standard' | 'high' | 'ultra'
}

export interface LoRAOptimization {
  contrast: number
  brightness: number
  saturation: number
  sharpness: number
  noiseReduction: number
  skinTexture: number
  lighting: 'natural' | 'studio' | 'cinematic' | 'dramatic'
  colorGrading: 'vibrant' | 'natural' | 'moody' | 'dramatic'
}

class LoRAModelManager {
  private loraModels: Map<string, LoRAConfig> = new Map()
  private activeOptimizations: Map<string, LoRAOptimization> = new Map()
  private performanceMetrics: Map<string, any> = new Map()

  constructor() {
    this.initializeLoRAModels()
    this.setupOptimizations()
  }

  /**
   * Initialize all LoRA models
   */
  private initializeLoRAModels(): void {
    const models: LoRAConfig[] = [
      // Photorealistic NSFW Models
      {
        name: 'EDN_Photorealistic_NSFW_v2',
        path: '/models/lora/photorealistic-nsfw-v2.safetensors',
        strength: 1.0,
        style: 'photorealistic',
        triggerWords: ['photorealistic', 'ultra detailed', 'high quality'],
        negativePrompt: 'cartoon, anime, drawing, painting, illustration',
        recommendedSteps: 30,
        recommendedGuidance: 7.5,
        optimizedFor: 'NSFW',
        description: 'Advanced photorealistic model optimized for NSFW content creation'
      },
      {
        name: 'EDN_Beauty_Portrait_v1',
        path: '/models/lora/beauty-portrait-v1.safetensors',
        strength: 0.9,
        style: 'photorealistic',
        triggerWords: ['beauty portrait', 'detailed face', 'realistic skin'],
        negativePrompt: 'ugly, deformed, blurry, low quality',
        recommendedSteps: 25,
        recommendedGuidance: 7.0,
        optimizedFor: 'NSFW',
        description: 'Specialized for beauty portraits with skin texture details'
      },
      {
        name: 'EDN_Body_Anatomy_v1',
        path: '/models/lora/body-anatomy-v1.safetensors',
        strength: 0.8,
        style: 'photorealistic',
        triggerWords: ['anatomically correct', 'realistic body', 'natural proportions'],
        negativePrompt: 'unnatural, distorted, unrealistic',
        recommendedSteps: 35,
        recommendedGuidance: 8.0,
        optimizedFor: 'NSFW',
        description: 'Anatomically accurate body rendering with natural proportions'
      },

      // SFW Photorealistic Models
      {
        name: 'EDN_Photorealistic_SFW_v2',
        path: '/models/lora/photorealistic-sfw-v2.safetensors',
        strength: 1.0,
        style: 'photorealistic',
        triggerWords: ['photorealistic', 'professional photo', 'high resolution'],
        negativePrompt: 'cartoon, anime, drawing, illustration',
        recommendedSteps: 30,
        recommendedGuidance: 7.5,
        optimizedFor: 'SFW',
        description: 'Professional photorealistic model for SFW content creation'
      },
      {
        name: 'EDN_Fashion_Model_v1',
        path: '/models/lora/fashion-model-v1.safetensors',
        strength: 0.9,
        style: 'photorealistic',
        triggerWords: ['fashion model', 'professional photography', 'high fashion'],
        negativePrompt: 'casual, amateur, low quality',
        recommendedSteps: 28,
        recommendedGuidance: 7.2,
        optimizedFor: 'SFW',
        description: 'Specialized for fashion and professional photography'
      },
      {
        name: 'EDN_Portrait_Pro_v1',
        path: '/models/lora/portrait-pro-v1.safetensors',
        strength: 0.95,
        style: 'photorealistic',
        triggerWords: ['professional portrait', 'studio lighting', 'detailed features'],
        negativePrompt: 'blurry, out of focus, poor lighting',
        recommendedSteps: 32,
        recommendedGuidance: 7.8,
        optimizedFor: 'SFW',
        description: 'Professional portrait photography with studio lighting'
      },

      // Dual Purpose Models
      {
        name: 'EDN_Universal_Photoreal_v3',
        path: '/models/lora/universal-photoreal-v3.safetensors',
        strength: 0.85,
        style: 'photorealistic',
        triggerWords: ['ultra realistic', '4k quality', 'professional grade'],
        negativePrompt: 'low quality, amateur, unprofessional',
        recommendedSteps: 30,
        recommendedGuidance: 7.5,
        optimizedFor: 'BOTH',
        description: 'Universal photorealistic model suitable for both NSFW and SFW content'
      },
      {
        name: 'EDN_Skin_Texture_Pro_v2',
        path: '/models/lora/skin-texture-pro-v2.safetensors',
        strength: 0.7,
        style: 'photorealistic',
        triggerWords: ['detailed skin', 'realistic texture', 'natural skin'],
        negativePrompt: 'plastic, artificial, smooth skin',
        recommendedSteps: 25,
        recommendedGuidance: 6.8,
        optimizedFor: 'BOTH',
        description: 'Advanced skin texture rendering for realistic skin details'
      }
    ]

    models.forEach(model => {
      this.loraModels.set(model.name, model)
    })

    console.log(`✅ Initialized ${models.length} LoRA models`)
  }

  /**
   * Setup optimizations for different content types
   */
  private setupOptimizations(): void {
    const optimizations: Record<string, LoRAOptimization> = {
      'NSFW_Portrait': {
        contrast: 1.2,
        brightness: 1.1,
        saturation: 1.15,
        sharpness: 1.3,
        noiseReduction: 0.8,
        skinTexture: 1.4,
        lighting: 'cinematic',
        colorGrading: 'moody'
      },
      'NSFW_Full_Body': {
        contrast: 1.15,
        brightness: 1.05,
        saturation: 1.1,
        sharpness: 1.2,
        noiseReduction: 0.7,
        skinTexture: 1.3,
        lighting: 'studio',
        colorGrading: 'dramatic'
      },
      'SFW_Portrait': {
        contrast: 1.1,
        brightness: 1.0,
        saturation: 1.0,
        sharpness: 1.15,
        noiseReduction: 0.6,
        skinTexture: 1.2,
        lighting: 'natural',
        colorGrading: 'natural'
      },
      'SFW_Fashion': {
        contrast: 1.05,
        brightness: 1.1,
        saturation: 1.2,
        sharpness: 1.1,
        noiseReduction: 0.5,
        skinTexture: 1.1,
        lighting: 'studio',
        colorGrading: 'vibrant'
      },
      'Universal': {
        contrast: 1.1,
        brightness: 1.05,
        saturation: 1.05,
        sharpness: 1.15,
        noiseReduction: 0.6,
        skinTexture: 1.2,
        lighting: 'natural',
        colorGrading: 'natural'
      }
    }

    Object.entries(optimizations).forEach(([key, optimization]) => {
      this.activeOptimizations.set(key, optimization)
    })
  }

  /**
   * Generate image using LoRA models
   */
  async generateWithLoRA(request: LoRAModelRequest): Promise<{
    success: boolean
    imageUrl?: string
    metadata?: any
    error?: string
    processingTime: number
  }> {
    const startTime = Date.now()

    try {
      // Select the best LoRA models for the request
      const selectedModels = this.selectBestLoRAModels(request)

      // Build enhanced prompt with LoRA configurations
      const enhancedPrompt = this.buildEnhancedPrompt(request.basePrompt, selectedModels)

      // Get optimization settings
      const optimization = this.getOptimization(request.isNSFW, selectedModels)

      // Prepare image generation request
      const imageRequest: ImageGenerationRequest = {
        prompt: enhancedPrompt,
        width: request.width,
        height: request.height,
        steps: request.steps || this.getRecommendedSteps(selectedModels),
        guidance: request.guidance || this.getRecommendedGuidance(selectedModels),
        seed: request.seed,
        isNSFW: request.isNSFW,
        loraModel: selectedModels[0]?.name
      }

      // Add negative prompts from LoRA models
      const negativePrompts = selectedModels
        .map(model => model.negativePrompt)
        .filter(Boolean)
        .join(', ')
      
      if (negativePrompts) {
        imageRequest.negativePrompt = negativePrompts
      }

      // Generate image using AI model integration
      const result = await aiModelIntegration.queueRequest('image_generation', imageRequest)

      if (!result.success) {
        throw new Error(result.error || 'Image generation failed')
      }

      // Apply post-processing optimizations
      const optimizedImageUrl = await this.applyOptimizations(result.data.url, optimization)

      // Record performance metrics
      this.recordMetrics(selectedModels, Date.now() - startTime, request.quality)

      return {
        success: true,
        imageUrl: optimizedImageUrl,
        metadata: {
          modelsUsed: selectedModels.map(m => m.name),
          optimization: optimization,
          quality: request.quality,
          enhancedPrompt,
          processingTime: Date.now() - startTime
        },
        processingTime: Date.now() - startTime
      }

    } catch (error) {
      console.error('LoRA generation failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        processingTime: Date.now() - startTime
      }
    }
  }

  /**
   * Select the best LoRA models for the request
   */
  private selectBestLoRAModels(request: LoRAModelRequest): LoRAConfig[] {
    const availableModels = Array.from(this.loraModels.values())
    
    // Filter by optimization target
    const targetModels = availableModels.filter(model => {
      if (request.isNSFW) {
        return model.optimizedFor === 'NSFW' || model.optimizedFor === 'BOTH'
      } else {
        return model.optimizedFor === 'SFW' || model.optimizedFor === 'BOTH'
      }
    })

    // Sort by strength and relevance
    const sortedModels = targetModels.sort((a, b) => {
      // Prioritize models with higher strength
      if (a.strength !== b.strength) {
        return b.strength - a.strength
      }
      
      // Then by recommended steps (higher steps usually mean better quality)
      return b.recommendedSteps - a.recommendedSteps
    })

    // Select top 1-3 models
    const selectedCount = request.quality === 'ultra' ? 3 : request.quality === 'high' ? 2 : 1
    return sortedModels.slice(0, selectedCount)
  }

  /**
   * Build enhanced prompt with LoRA configurations
   */
  private buildEnhancedPrompt(basePrompt: string, models: LoRAConfig[]): string {
    let enhancedPrompt = basePrompt

    // Add LoRA model syntax
    models.forEach(model => {
      enhancedPrompt = `<lora:${model.name}:${model.strength}> ${enhancedPrompt}`
    })

    // Add trigger words from all models
    const allTriggerWords = models.flatMap(model => model.triggerWords)
    const uniqueTriggerWords = [...new Set(allTriggerWords)]
    
    if (uniqueTriggerWords.length > 0) {
      enhancedPrompt += `, ${uniqueTriggerWords.join(', ')}`
    }

    // Add quality modifiers based on number of models
    if (models.length > 1) {
      enhancedPrompt += ', masterpiece, best quality, ultra detailed'
    }

    return enhancedPrompt
  }

  /**
   * Get optimization settings for the request
   */
  private getOptimization(isNSFW?: boolean, models?: LoRAConfig[]): LoRAOptimization {
    if (!models || models.length === 0) {
      return this.activeOptimizations.get('Universal')!
    }

    const primaryModel = models[0]
    
    if (isNSFW) {
      if (primaryModel.name.includes('Portrait')) {
        return this.activeOptimizations.get('NSFW_Portrait')!
      } else {
        return this.activeOptimizations.get('NSFW_Full_Body')!
      }
    } else {
      if (primaryModel.name.includes('Fashion')) {
        return this.activeOptimizations.get('SFW_Fashion')!
      } else {
        return this.activeOptimizations.get('SFW_Portrait')!
      }
    }
  }

  /**
   * Get recommended steps based on selected models
   */
  private getRecommendedSteps(models: LoRAConfig[]): number {
    if (models.length === 0) return 30
    
    // Use the highest recommended steps from selected models
    return Math.max(...models.map(model => model.recommendedSteps))
  }

  /**
   * Get recommended guidance based on selected models
   */
  private getRecommendedGuidance(models: LoRAConfig[]): number {
    if (models.length === 0) return 7.5
    
    // Average the recommended guidance from selected models
    const avgGuidance = models.reduce((sum, model) => sum + model.recommendedGuidance, 0) / models.length
    return Math.round(avgGuidance * 10) / 10
  }

  /**
   * Apply post-processing optimizations
   */
  private async applyOptimizations(imageUrl: string, optimization: LoRAOptimization): Promise<string> {
    // Simulate post-processing optimizations
    // In a real implementation, this would apply actual image processing
    
    const processingSteps = [
      `contrast_${optimization.contrast}`,
      `brightness_${optimization.brightness}`,
      `saturation_${optimization.saturation}`,
      `sharpness_${optimization.sharpness}`,
      `noise_reduction_${optimization.noiseReduction}`,
      `skin_texture_${optimization.skinTexture}`,
      `lighting_${optimization.lighting}`,
      `color_grading_${optimization.colorGrading}`
    ]

    const optimizedUrl = `${imageUrl.split('.')[0]}_optimized.${imageUrl.split('.')[1]}`
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return optimizedUrl
  }

  /**
   * Record performance metrics
   */
  private recordMetrics(models: LoRAConfig[], processingTime: number, quality: string): void {
    const modelKey = models.map(m => m.name).join('+')
    
    const existingMetrics = this.performanceMetrics.get(modelKey) || {
      totalGenerations: 0,
      totalProcessingTime: 0,
      averageProcessingTime: 0,
      qualityDistribution: { standard: 0, high: 0, ultra: 0 }
    }

    existingMetrics.totalGenerations++
    existingMetrics.totalProcessingTime += processingTime
    existingMetrics.averageProcessingTime = existingMetrics.totalProcessingTime / existingMetrics.totalGenerations
    existingMetrics.qualityDistribution[quality]++

    this.performanceMetrics.set(modelKey, existingMetrics)
  }

  /**
   * Get available LoRA models
   */
  getAvailableModels(optimizedFor?: 'NSFW' | 'SFW' | 'BOTH'): LoRAConfig[] {
    const models = Array.from(this.loraModels.values())
    
    if (optimizedFor) {
      return models.filter(model => 
        model.optimizedFor === optimizedFor || model.optimizedFor === 'BOTH'
      )
    }
    
    return models
  }

  /**
   * Get model by name
   */
  getModel(name: string): LoRAConfig | undefined {
    return this.loraModels.get(name)
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): Record<string, any> {
    return Object.fromEntries(this.performanceMetrics)
  }

  /**
   * Get optimization settings
   */
  getOptimizationSettings(): Record<string, LoRAOptimization> {
    return Object.fromEntries(this.activeOptimizations)
  }

  /**
   * Update LoRA model configuration
   */
  updateModel(name: string, config: Partial<LoRAConfig>): boolean {
    const model = this.loraModels.get(name)
    if (!model) return false

    this.loraModels.set(name, { ...model, ...config })
    return true
  }

  /**
   * Get recommended models for specific use cases
   */
  getRecommendedModels(useCase: string): LoRAConfig[] {
    const recommendations: Record<string, string[]> = {
      'nsfw_portrait': ['EDN_Photorealistic_NSFW_v2', 'EDN_Beauty_Portrait_v1'],
      'nsfw_full_body': ['EDN_Photorealistic_NSFW_v2', 'EDN_Body_Anatomy_v1'],
      'sfw_portrait': ['EDN_Photorealistic_SFW_v2', 'EDN_Portrait_Pro_v1'],
      'sfw_fashion': ['EDN_Photorealistic_SFW_v2', 'EDN_Fashion_Model_v1'],
      'universal': ['EDN_Universal_Photoreal_v3', 'EDN_Skin_Texture_Pro_v2']
    }

    const modelNames = recommendations[useCase] || recommendations['universal']
    return modelNames.map(name => this.loraModels.get(name)).filter(Boolean) as LoRAConfig[]
  }
}

// Export singleton instance
export const loraModelManager = new LoRAModelManager()

// Export types and utilities
export { LoRAModelManager }
export type { LoRAConfig, LoRAModelRequest, LoRAOptimization }