import { ParentPromptSystem, ParentPromptConfig } from './parent-prompt'
import ZAI from 'z-ai-web-dev-sdk'

export interface GeneratedImage {
  id: string
  imageUrl: string
  prompt: string
  negativePrompt: string
  config: ParentPromptConfig
  createdAt: string
  isNsfw: boolean
}

export class AIImageGenerationService {
  private static zai: ZAI | null = null

  /**
   * Initialize the ZAI SDK
   */
  private static async initialize(): Promise<void> {
    if (!this.zai) {
      this.zai = await ZAI.create()
    }
  }

  /**
   * Generate a high-quality AI woman image using the parent prompt system
   */
  static async generateImage(
    config: ParentPromptConfig = {},
    isNsfw: boolean = false
  ): Promise<GeneratedImage> {
    await this.initialize()

    // Generate the prompt using the parent prompt system
    const { positive, negative } = ParentPromptSystem.generatePrompt(config)

    try {
      // Generate the image using ZAI
      const response = await this.zai!.images.generations.create({
        prompt: positive,
        size: '4096x4096'
      })

      const imageBase64 = response.data[0].base64
      
      // Convert base64 to a data URL
      const imageUrl = `data:image/jpeg;base64,${imageBase64}`

      return {
        id: `generated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        imageUrl,
        prompt: positive,
        negativePrompt: negative,
        config,
        createdAt: new Date().toISOString(),
        isNsfw
      }
    } catch (error) {
      console.error('Error generating image:', error)
      throw new Error('Failed to generate image')
    }
  }

  /**
   * Generate multiple variations for marketplace content
   */
  static async generateMarketplaceVariations(
    count: number = 10,
    isNsfw: boolean = false
  ): Promise<GeneratedImage[]> {
    const images: GeneratedImage[] = []

    for (let i = 0; i < count; i++) {
      try {
        const variation = ParentPromptSystem.generateRandomVariation()
        const image = await this.generateImage(variation.config, isNsfw)
        images.push(image)
      } catch (error) {
        console.error(`Error generating variation ${i + 1}:`, error)
        // Continue with other variations even if one fails
      }
    }

    return images
  }

  /**
   * Generate a specific type of model (e.g., blonde, beach scene, etc.)
   */
  static async generateSpecificModel(
    specificConfig: ParentPromptConfig,
    isNsfw: boolean = false
  ): Promise<GeneratedImage> {
    return await this.generateImage(specificConfig, isNsfw)
  }

  /**
   * Batch generate images for marketplace categories
   */
  static async generateMarketplaceBatch(
    categories: Array<{
      name: string
      config: ParentPromptConfig
      count: number
    }>,
    isNsfw: boolean = false
  ): Promise<{ category: string; images: GeneratedImage[] }[]> {
    const results: { category: string; images: GeneratedImage[] }[] = []

    for (const category of categories) {
      try {
        const images: GeneratedImage[] = []
        for (let i = 0; i < category.count; i++) {
          // Add some variation to each image in the category
          const variedConfig = {
            ...category.config,
            // Vary age slightly within the category
            age: (category.config.age || 25) + Math.floor(Math.random() * 5) - 2,
            // Vary pose slightly
            pose: category.config.pose || ParentPromptSystem.getMarketplaceVariations().poses[
              Math.floor(Math.random() * ParentPromptSystem.getMarketplaceVariations().poses.length)
            ]
          }
          
          const image = await this.generateImage(variedConfig, isNsfw)
          images.push(image)
        }
        results.push({ category: category.name, images })
      } catch (error) {
        console.error(`Error generating batch for category ${category.name}:`, error)
      }
    }

    return results
  }

  /**
   * Validate generated image quality
   */
  static validateGeneratedImage(image: GeneratedImage): boolean {
    return ParentPromptSystem.validatePrompt(image.prompt)
  }

  /**
   * Get marketplace generation presets
   */
  static getMarketplacePresets() {
    return {
      // Hair color presets
      blondeModels: {
        name: 'Blonde Models',
        config: { hairColor: 'blonde' },
        description: 'Stunning blonde AI models'
      },
      brunetteModels: {
        name: 'Brunette Models',
        config: { hairColor: 'brown' },
        description: 'Beautiful brunette AI models'
      },
      redheadModels: {
        name: 'Redhead Models',
        config: { hairColor: 'red' },
        description: 'Fiery redhead AI models'
      },

      // Scene presets
      beachModels: {
        name: 'Beach Models',
        config: { 
          background: 'down a serene tropical beach, gentle waves lapping at her ankles in crystal-clear shallow water, palm trees swaying on one side, pristine white sand stretching into the distance, and a vibrant ocean horizon'
        },
        description: 'Models in beautiful beach settings'
      },
      luxuryModels: {
        name: 'Luxury Models',
        config: { 
          background: 'in a luxurious penthouse suite with floor-to-ceiling windows overlooking a city skyline at night'
        },
        description: 'Models in luxury environments'
      },
      studioModels: {
        name: 'Studio Models',
        config: { 
          background: 'in a high-end photography studio with professional lighting and clean backdrop'
        },
        description: 'Professional studio model shots'
      },

      // Style presets
      fashionModels: {
        name: 'Fashion Models',
        config: { 
          style: 'high-fashion editorial style inspired by Vogue magazine',
          clothing: 'a elegant black evening dress'
        },
        description: 'High-fashion editorial style models'
      },
      glamourModels: {
        name: 'Glamour Models',
        config: { 
          style: 'glamour photography style inspired by Helmut Newton',
          clothing: 'a luxurious lingerie set'
        },
        description: 'Glamour photography style models'
      },
      lifestyleModels: {
        name: 'Lifestyle Models',
        config: { 
          style: 'luxury lifestyle photography style',
          clothing: 'a casual white summer dress'
        },
        description: 'Lifestyle photography style models'
      }
    }
  }
}
