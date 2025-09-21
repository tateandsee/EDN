/**
 * EDN Parent Prompt System
 * 
 * This system ensures all marketplace content uses the highest quality base prompt
 * for generating AI women models. The structure and quality must be maintained while
 * allowing customization of hair color, hair type, clothing, pose, and background.
 */

export interface ParentPromptConfig {
  hairColor?: string
  hairType?: string
  clothing?: string
  pose?: string
  background?: string
  lighting?: string
  eyeColor?: string
  age?: number
  bodyType?: string
  style?: string
}

export class ParentPromptSystem {
  private static readonly BASE_POSITIVE_PROMPT = `A highly detailed, photorealistic image of a 25-year-old Victoria's Secret style supermodel with long, flowing dark hair, stunning facial features including high cheekbones, full lips, and flawless skin, bright emerald green eyes, large enhanced breasts, exceptionally long legs, and a toned, athletic hourglass body. She is wearing a skimpy red string bikini that accentuates her curves, walking gracefully with a confident stride down a serene tropical beach, gentle waves lapping at her ankles in crystal-clear shallow water, palm trees swaying on one side, pristine white sand stretching into the distance, and a vibrant ocean horizon. The scene is captured during golden hour sunset with warm, soft lighting casting a golden glow and subtle shadows, high resolution 8K, professional photography style inspired by Mario Testino, wide-angle lens, sharp focus on the model with slight bokeh background.`

  private static readonly BASE_NEGATIVE_PROMPT = `deformed, mutated, ugly, disfigured, blurry, low resolution, pixelated, artifacts, jpeg compression, noise, grainy, overexposed, underexposed, washed out colors, unnatural skin tones, plastic skin, shiny skin, extra limbs, missing limbs, fused fingers, poorly drawn hands, bad anatomy, asymmetrical face, crooked smile, cross-eyed, aged skin, wrinkles, blemishes, acne, scars, obese, skinny, malnourished, disproportionate body, small breasts, short legs, flat chest, awkward pose, stiff movement, crowded scene, people in background, animals, trash on beach, polluted water, murky water, stormy weather, rainy, cloudy, dark lighting, harsh shadows, flat lighting, text, watermark, logo, signature, borders, frames, cartoon, illustration, painting, sketch, abstract, anime, CGI, 3D render, low quality, amateur photo, distorted proportions, clothing tears, bikini malfunctions, excessive makeup, tired expression, AI generated, artificial intelligence, machine learning, neural network, deepfake, computer generated, digital art, rendered, synthetic, artificial, fake, unreal, virtual, generated, created by AI, made by AI, AI artwork, artificial image, computer generated image, digital creation, AI model, AI generated image, machine made, algorithm generated, computer vision, neural art, AI creation, digital generation, automated generation, AI system, computer generated artwork, machine created image, algorithmic art, AI generated content, computer generated content, digital synthetic image, artificial neural network generated, machine learning artwork, AI synthesized image, computer vision generated image, neural network artwork, AI digital art, machine generated visual, algorithmic visual, computer synthesized image, AI visual generation, machine learning visual, neural network visual, computer generated visual, AI synthesized visual, machine generated artwork, algorithmic generated image, computer vision artwork, neural network generated image, AI generated visual, machine learning generated image, computer synthesized visual, neural network synthesized image, AI digital artwork, machine generated digital art, algorithmic digital art, computer generated digital art, AI visual artwork, machine learning visual art, neural network visual art, computer vision visual art, AI synthesized artwork, machine synthesized artwork, algorithmic synthesized artwork, computer synthesized artwork, neural network synthesized artwork, AI generated digital visual, machine generated digital visual, algorithmic digital visual, computer generated digital visual, AI visual digital art, machine learning digital visual art, neural network digital visual art, computer vision digital visual art, AI synthesized digital visual, machine synthesized digital visual, algorithmic synthesized digital visual, computer synthesized digital visual, neural network synthesized digital visual, AI digital visual artwork, machine generated digital visual artwork, algorithmic digital visual artwork, computer generated digital visual artwork, AI visual digital artwork, machine learning visual digital artwork, neural network visual digital artwork, computer vision visual digital artwork, AI synthesized digital artwork, machine synthesized digital artwork, algorithmic synthesized digital artwork, computer synthesized digital artwork, neural network synthesized digital artwork.`

  /**
   * Generate a customized prompt based on the parent prompt structure
   */
  static generatePrompt(config: ParentPromptConfig = {}): { positive: string; negative: string } {
    let positivePrompt = this.BASE_POSITIVE_PROMPT
    const negativePrompt = this.BASE_NEGATIVE_PROMPT

    // Apply customizations while maintaining the high-quality structure
    if (config.hairColor || config.hairType) {
      const hairDesc = [
        config.hairType || 'long, flowing',
        config.hairColor || 'dark'
      ].filter(Boolean).join(' ')
      positivePrompt = positivePrompt.replace(
        'long, flowing dark hair',
        `${hairDesc} hair`
      )
    }

    if (config.eyeColor) {
      positivePrompt = positivePrompt.replace(
        'bright emerald green eyes',
        `bright ${config.eyeColor} eyes`
      )
    }

    if (config.age) {
      positivePrompt = positivePrompt.replace(
        '25-year-old',
        `${config.age}-year-old`
      )
    }

    if (config.clothing) {
      positivePrompt = positivePrompt.replace(
        'wearing a skimpy red string bikini that accentuates her curves',
        `wearing ${config.clothing} that accentuates her curves`
      )
    }

    if (config.pose) {
      positivePrompt = positivePrompt.replace(
        'walking gracefully with a confident stride',
        config.pose
      )
    }

    if (config.background) {
      positivePrompt = positivePrompt.replace(
        'down a serene tropical beach, gentle waves lapping at her ankles in crystal-clear shallow water, palm trees swaying on one side, pristine white sand stretching into the distance, and a vibrant ocean horizon',
        config.background
      )
    }

    if (config.lighting) {
      positivePrompt = positivePrompt.replace(
        'The scene is captured during golden hour sunset with warm, soft lighting casting a golden glow and subtle shadows',
        config.lighting
      )
    }

    if (config.style) {
      positivePrompt = positivePrompt.replace(
        'professional photography style inspired by Mario Testino',
        config.style
      )
    }

    return {
      positive: positivePrompt.trim(),
      negative: negativePrompt.trim()
    }
  }

  /**
   * Pre-defined variations for different marketplace categories
   */
  static getMarketplaceVariations() {
    return {
      // Hair variations
      hairColors: ['dark', 'blonde', 'brown', 'black', 'red', 'auburn', 'platinum blonde', 'chestnut'],
      hairTypes: ['long, flowing', 'short, chic', 'wavy', 'straight', 'curly', 'braided', 'ponytail', 'bun'],
      
      // Clothing variations
      clothing: [
        'a skimpy red string bikini',
        'a elegant black evening dress',
        'a casual white summer dress',
        'a stylish business suit',
        'a sporty athletic outfit',
        'a luxurious lingerie set',
        'a trendy crop top and shorts',
        'a sophisticated cocktail dress'
      ],
      
      // Pose variations
      poses: [
        'walking gracefully with a confident stride',
        'standing elegantly with one hand on hip',
        'sitting seductively on a luxury chair',
        'leaning casually against a wall',
        'dancing with fluid movements',
        'posing with arms raised gracefully',
        'kneeling elegantly on the sand',
        'standing with a slight smile'
      ],
      
      // Background variations
      backgrounds: [
        'down a serene tropical beach, gentle waves lapping at her ankles in crystal-clear shallow water, palm trees swaying on one side, pristine white sand stretching into the distance, and a vibrant ocean horizon',
        'in a luxurious penthouse suite with floor-to-ceiling windows overlooking a city skyline at night',
        'in a high-end photography studio with professional lighting and clean backdrop',
        'in a beautiful garden with blooming flowers and marble fountains',
        'on a rooftop terrace with panoramic city views during sunset',
        'in a modern minimalist apartment with contemporary furniture',
        'by a sparkling swimming pool in a tropical resort',
        'in an elegant ballroom with crystal chandeliers and marble floors'
      ],
      
      // Lighting variations
      lighting: [
        'The scene is captured during golden hour sunset with warm, soft lighting casting a golden glow and subtle shadows',
        'The scene is captured in bright daylight with natural sunlight creating crisp highlights and soft shadows',
        'The scene is captured during blue hour with cool, ambient lighting creating a moody atmosphere',
        'The scene is captured with dramatic studio lighting creating strong contrasts and highlights',
        'The scene is captured with soft, diffused lighting creating a dreamy, ethereal quality',
        'The scene is captured at night with artificial lighting creating a glamorous, sophisticated look'
      ],
      
      // Style variations
      styles: [
        'professional photography style inspired by Mario Testino',
        'high-fashion editorial style inspired by Vogue magazine',
        'glamour photography style inspired by Helmut Newton',
        'beauty photography style inspired by Patrick Demarchelier',
        'contemporary fashion photography style',
        'luxury lifestyle photography style',
        'cinematic photography style with film-like qualities'
      ],
      
      // Eye color variations
      eyeColors: ['emerald green', 'sapphire blue', 'hazel', 'amber', 'gray', 'violet', 'deep brown'],
      
      // Age variations
      ages: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    }
  }

  /**
   * Generate a random marketplace variation while maintaining quality
   */
  static generateRandomVariation(): { positive: string; negative: string; config: ParentPromptConfig } {
    const variations = this.getMarketplaceVariations()
    
    const config: ParentPromptConfig = {
      hairColor: variations.hairColors[Math.floor(Math.random() * variations.hairColors.length)],
      hairType: variations.hairTypes[Math.floor(Math.random() * variations.hairTypes.length)],
      clothing: variations.clothing[Math.floor(Math.random() * variations.clothing.length)],
      pose: variations.poses[Math.floor(Math.random() * variations.poses.length)],
      background: variations.backgrounds[Math.floor(Math.random() * variations.backgrounds.length)],
      lighting: variations.lighting[Math.floor(Math.random() * variations.lighting.length)],
      style: variations.styles[Math.floor(Math.random() * variations.styles.length)],
      eyeColor: variations.eyeColors[Math.floor(Math.random() * variations.eyeColors.length)],
      age: variations.ages[Math.floor(Math.random() * variations.ages.length)]
    }

    const prompts = this.generatePrompt(config)
    
    return {
      ...prompts,
      config
    }
  }

  /**
   * Validate that a prompt maintains the required quality standards
   */
  static validatePrompt(prompt: string): boolean {
    const requiredElements = [
      'photorealistic',
      'supermodel',
      'high cheekbones',
      'full lips',
      'flawless skin',
      'large enhanced breasts',
      'toned, athletic hourglass body',
      'high resolution',
      'professional photography'
    ]

    const forbiddenElements = [
      'deformed',
      'mutated',
      'ugly',
      'disfigured',
      'blurry',
      'low resolution',
      'pixelated',
      'cartoon',
      'illustration',
      'anime',
      'CGI',
      '3D render'
    ]

    const hasAllRequired = requiredElements.every(element => 
      prompt.toLowerCase().includes(element.toLowerCase())
    )

    const hasForbidden = forbiddenElements.some(element =>
      prompt.toLowerCase().includes(element.toLowerCase())
    )

    return hasAllRequired && !hasForbidden
  }

  /**
   * Get the base prompts for reference
   */
  static getBasePrompts() {
    return {
      positive: this.BASE_POSITIVE_PROMPT,
      negative: this.BASE_NEGATIVE_PROMPT
    }
  }
}
