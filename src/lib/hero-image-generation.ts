import { ParentPromptSystem, ParentPromptConfig } from './parent-prompt'
import ZAI from 'z-ai-web-dev-sdk'

export interface HeroImageConfig extends ParentPromptConfig {
  heroType: 'homepage' | 'create' | 'dashboard' | 'distribute' | 'marketplace' | 'pricing'
  isNsfw?: boolean
}

export class HeroImageGenerationService {
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
   * Generate hero-specific prompts for different page types
   */
  private static generateHeroPrompt(config: HeroImageConfig): { positive: string; negative: string } {
    const baseConfig: ParentPromptConfig = {
      ...config,
      style: config.style || 'cinematic photography style with film-like qualities'
    }

    let positivePrompt = ''
    let negativePrompt = ParentPromptSystem.generatePrompt(baseConfig).negative

    switch (config.heroType) {
      case 'homepage':
        positivePrompt = `A breathtaking cinematic hero image of a stunning 25-year-old supermodel with long flowing blonde hair and piercing blue eyes, wearing an elegant white flowing dress, standing confidently on a cliff edge overlooking a vast ocean at sunset. The scene captures the essence of freedom and creativity with golden hour lighting creating dramatic shadows and highlights. Professional photography with ultra-high resolution 8K, wide-angle composition, depth of field, and atmospheric perspective. The model exudes confidence and beauty, representing the pinnacle of AI-generated content creation.`
        break

      case 'create':
        positivePrompt = `An inspiring hero image showcasing the creative process, featuring a gorgeous 26-year-old supermodel with wavy auburn hair and emerald green eyes, dressed in a stylish artist's smock over elegant attire, standing in a modern creative studio surrounded by digital art screens and 3D modeling equipment. The scene is bathed in soft, diffused studio lighting that highlights her features while creating a professional atmosphere. The composition emphasizes innovation and artistic expression with ultra-high resolution 8K, professional photography style, and clean modern aesthetics.`
        break

      case 'dashboard':
        positivePrompt = `A sophisticated hero image of a professional 28-year-old supermodel with sleek black hair and hazel eyes, wearing a tailored business suit, standing confidently in a modern high-tech office environment with multiple holographic displays showing analytics and data visualizations. The scene features cool, professional lighting with blue accents, creating an atmosphere of power and intelligence. Ultra-high resolution 8K, corporate photography style with sharp focus and clean lines, representing the cutting-edge technology of the platform.`
        break

      case 'distribute':
        positivePrompt = `A dynamic hero image of a charismatic 24-year-old supermodel with platinum blonde hair and violet eyes, wearing fashionable urban streetwear, standing in a bustling city intersection with digital billboards and social media projections surrounding her. The scene captures the energy of content distribution with vibrant neon lighting and urban energy. Ultra-high resolution 8K, street photography style with motion blur effects and dynamic composition, representing the power of content distribution across platforms.`
        break

      case 'marketplace':
        positivePrompt = `A luxurious hero image of an elegant 27-year-old supermodel with long chestnut hair and sapphire blue eyes, wearing a stunning evening gown, standing in a high-end boutique showroom surrounded by premium AI-generated content displays. The scene features warm, luxurious lighting with gold accents, creating an atmosphere of exclusivity and premium quality. Ultra-high resolution 8K, luxury fashion photography style with shallow depth of field and elegant composition, representing the premium marketplace experience.`
        break

      case 'pricing':
        positivePrompt = `A premium hero image of a sophisticated 29-year-old supermodel with sophisticated silver-streaked dark hair and amber eyes, wearing an exclusive designer outfit, standing in a luxury penthouse with floor-to-ceiling windows showing a city skyline at night. The scene features dramatic lighting with rich shadows and golden highlights, creating an atmosphere of premium value and exclusivity. Ultra-high resolution 8K, luxury lifestyle photography style with cinematic composition and atmospheric perspective, representing the premium pricing tiers.`
        break
    }

    // Add NSFW elements if requested
    if (config.isNsfw) {
      positivePrompt = positivePrompt.replace(
        /wearing (.*?)\./,
        `wearing revealing lingerie that accentuates her perfect figure.`
      )
    }

    return {
      positive: positivePrompt,
      negative: negativePrompt
    }
  }

  /**
   * Generate a hero image for a specific page
   */
  static async generateHeroImage(config: HeroImageConfig): Promise<{ imageUrl: string; prompt: string }> {
    await this.initialize()

    const { positive, negative } = this.generateHeroPrompt(config)

    try {
      // Generate the image using ZAI
      const response = await this.zai!.images.generations.create({
        prompt: positive,
        size: '1024x1024'
      })

      const imageBase64 = response.data[0].base64
      
      // Convert base64 to a data URL
      const imageUrl = `data:image/jpeg;base64,${imageBase64}`

      return {
        imageUrl,
        prompt: positive
      }
    } catch (error) {
      console.error('Error generating hero image:', error)
      throw new Error('Failed to generate hero image')
    }
  }

  /**
   * Generate all hero images for the website
   */
  static async generateAllHeroImages(): Promise<{ [key: string]: string }> {
    const heroTypes: Array<HeroImageConfig['heroType']> = ['homepage', 'create', 'dashboard', 'distribute', 'marketplace', 'pricing']
    const results: { [key: string]: string } = {}

    for (const heroType of heroTypes) {
      try {
        console.log(`Generating ${heroType} hero image...`)
        
        // Generate SFW version
        const sfwResult = await this.generateHeroImage({ heroType, isNsfw: false })
        results[`${heroType}-sfw`] = sfwResult.imageUrl
        
        // Generate NSFW version
        const nsfwResult = await this.generateHeroImage({ heroType, isNsfw: true })
        results[`${heroType}-nsfw`] = nsfwResult.imageUrl
        
        console.log(`Completed ${heroType} hero images`)
      } catch (error) {
        console.error(`Error generating ${heroType} hero images:`, error)
      }
    }

    return results
  }

  /**
   * Get hero image presets for quick generation
   */
  static getHeroPresets() {
    return {
      homepage: {
        name: 'Homepage Hero',
        description: 'Breathtaking cliffside ocean view with elegant model',
        config: { heroType: 'homepage' as const }
      },
      create: {
        name: 'Create Page Hero',
        description: 'Creative studio scene with artistic model',
        config: { heroType: 'create' as const }
      },
      dashboard: {
        name: 'Dashboard Hero',
        description: 'High-tech office with professional model',
        config: { heroType: 'dashboard' as const }
      },
      distribute: {
        name: 'Distribute Hero',
        description: 'Urban city scene with dynamic model',
        config: { heroType: 'distribute' as const }
      },
      marketplace: {
        name: 'Marketplace Hero',
        description: 'Luxury boutique with elegant model',
        config: { heroType: 'marketplace' as const }
      },
      pricing: {
        name: 'Pricing Hero',
        description: 'Luxury penthouse with sophisticated model',
        config: { heroType: 'pricing' as const }
      }
    }
  }
}