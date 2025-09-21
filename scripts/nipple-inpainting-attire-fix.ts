#!/usr/bin/env tsx

/**
 * Nipple Inpainting and Attire Enhancement System
 * 
 * Specialized script to fix specific issues:
 * 1. Add nipple inpainting on clothing (visible nipples through fabric)
 * 2. Eliminate white bras and create unique, diverse attire
 * 3. Ensure proper nude rendering for NSFW content
 * 4. Fix prompt adherence issues
 */

import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Specialized nipple inpainting prompts for clothing
const NIPPLE_INPAINTING_VARIATIONS = [
  // Subtle visibility through fabric
  "((subtle nipple visibility through fabric:1.6)), (natural breast contour under clothing:1.5), (soft nipple suggestion:1.4)",
  
  // More defined visibility
  "((nipples clearly visible through clothing:1.7)), (areola impression through fabric:1.6), (natural breast shape defined:1.5)",
  
  // Sheer fabric effect
  "((sheer fabric reveals nipple shape:1.8)), (transparent material shows breast details:1.7), (nipple outline visible:1.6)",
  
  // Tight clothing effect
  "((clothing hugs breasts revealing nipple shape:1.7)), (fabric stretched over natural breasts:1.6), (nipple prominence through clothing:1.5)",
  
  // Artistic rendering
  "((artistic nipple visibility through attire:1.6)), (stylish breast definition under clothing:1.5), (elegant nipple suggestion:1.4)"
]

// Diverse attire options (NO WHITE BRAS)
const UNIQUE_ATTIRE_OPTIONS = [
  // Elegant and sophisticated
  {
    name: "elegant evening gown",
    description: "floor-length designer gown with elegant neckline",
    prompt: "elegant floor-length evening gown, sophisticated design, high fashion",
    nippleEffect: "subtle elegance"
  },
  
  // Modern streetwear
  {
    name: "urban streetwear",
    description: "trendy casual outfit with modern layers",
    prompt: "modern streetwear, urban fashion, layered contemporary style",
    nippleEffect: "casual visibility"
  },
  
  // Athletic wear
  {
    name: "athletic sportswear",
    description: "professional athletic outfit with performance fabric",
    prompt: "athletic sportswear, performance fabric, fitness outfit",
    nippleEffect: "sport contour"
  },
  
  // Business professional
  {
    name: "business attire",
    description: "professional business outfit with modern cut",
    prompt: "business professional attire, corporate wear, modern business suit",
    nippleEffect: "professional subtlety"
  },
  
  // Bohemian style
  {
    name: "bohemian dress",
    description: "flowy bohemian dress with artistic patterns",
    prompt: "bohemian flowing dress, artistic patterns, free-spirited style",
    nippleEffect: "artistic drape"
  },
  
  // Vintage retro
  {
    name: "vintage ensemble",
    description: "retro-inspired outfit with classic styling",
    prompt: "vintage retro outfit, classic styling, period-appropriate attire",
    nippleEffect: "classic modesty"
  },
  
  // Luxury lingerie
  {
    name: "luxury lingerie",
    description: "high-end lingerie with delicate fabrics",
    prompt: "luxury lingerie, delicate lace, high-end intimate apparel",
    nippleEffect: "intimate visibility"
  },
  
  // Designer swimwear
  {
    name: "designer swimwear",
    description: "fashionable swimwear with modern design",
    prompt: "designer swimwear, fashionable beachwear, modern pool attire",
    nippleEffect: "beach natural"
  },
  
  // Cultural traditional
  {
    name: "cultural dress",
    description: "traditional cultural attire with authentic styling",
    prompt: "traditional cultural dress, ethnic attire, authentic cultural wear",
    nippleEffect: "cultural modesty"
  },
  
  // Fantasy costume
  {
    name: "fantasy costume",
    description: "imaginative fantasy outfit with creative elements",
    prompt: "fantasy costume, creative outfit, imaginative attire design",
    nippleEffect: "fantastical suggestion"
  },
  
  // Sheer elegance
  {
    name: "sheer elegance",
    description: "sheer fabric outfit with elegant transparency",
    prompt: "sheer elegant outfit, transparent fabric, sophisticated transparency",
    nippleEffect: "elegant transparency"
  },
  
  // Form-fitting cocktail
  {
    name: "cocktail dress",
    description: "form-fitting cocktail dress with stylish design",
    prompt: "form-fitting cocktail dress, stylish evening wear, bodycon design",
    nippleEffect: "cocktail contour"
  }
]

// Strong nude prompts for NSFW content (no bras, no underwear)
const STRONG_NUDE_PROMPTS = [
  {
    emphasis: "completely naked",
    prompt: "((completely naked, totally nude, absolutely no clothing:1.8)), (bare breasts fully exposed:1.7), (visible nipples and areolas:1.6), (no bra, no underwear, no fabric:1.8)"
  },
  {
    emphasis: "fully unclothed", 
    prompt: "((fully unclothed, totally bare, completely naked:1.8)), (topless with exposed breasts:1.7), (natural nipple visibility:1.6), (zero clothing coverage:1.7)"
  },
  {
    emphasis: "total nudity",
    prompt: "((total nudity, complete nakedness:1.8)), (breasts completely uncovered:1.7), (nipples fully visible and natural:1.6), (absolutely no clothing or coverings:1.8)"
  }
]

interface NippleInpaintingConfig {
  type: 'NUDE' | 'SEMI_NUDE' | 'CLOTHED'
  ethnicity: string
  age: number
  hairColor: string
  eyeColor: string
  setting: string
  currentIssues: string[]
}

class NippleInpaintingSpecialist {
  private zai: ZAI

  constructor() {
    this.zai = null as any
  }

  async initialize() {
    try {
      this.zai = await ZAI.create()
      console.log('✅ Nipple Inpainting Specialist initialized')
    } catch (error) {
      console.error('❌ Failed to initialize specialist:', error)
      throw error
    }
  }

  generateSpecializedPrompt(config: NippleInpaintingConfig): { positive: string; negative: string } {
    const { type, ethnicity, age, hairColor, eyeColor, setting, currentIssues } = config

    let positivePrompt = ''
    let negativePrompt = this.getStrongNegativePrompt()

    // Base quality prompt
    const basePrompt = "(masterpiece, photorealistic, best quality, ultra detailed, 8k:1.4), RAW photo, professional photography"

    switch (type) {
      case 'NUDE':
        // Strong emphasis on complete nudity
        const nudePrompt = STRONG_NUDE_PROMPTS[
          Math.floor(Math.random() * STRONG_NUDE_PROMPTS.length)
        ]
        
        positivePrompt = `${basePrompt},
a stunningly beautiful ${age} year old ${ethnicity} woman,
${nudePrompt.prompt},
Physical Attributes:
(perfect female anatomy:1.6), (natural breast shape:1.5), (perky nipples:1.4), (flawless skin texture:1.5),
toned and shapely physique,
${hairColor} hair,
${eyeColor} eyes, (sparkling, detailed iris:1.4), (doe-eyed expression:1.2),
Setting: ${setting}
Technical Specifications:
(shot on Canon EOS R5, 85mm f/1.2:1.3), (professional studio lighting:1.3), (cinematic lighting:1.2),
(sharp focus on eyes and face:1.4), (ultra-detailed skin texture:1.4), (perfect hands:1.5), (flawless feet:1.4)`

        // Very strong negative prompts against any clothing
        negativePrompt += ', bra, underwear, panties, thong, lingerie, clothing, fabric, textile, shirt, dress, covered, hidden, obscured, concealed'
        break

      case 'SEMI_NUDE':
        // Sheer or partially transparent clothing with nipple visibility
        const nippleInpainting = NIPPLE_INPAINTING_VARIATIONS[
          Math.floor(Math.random() * NIPPLE_INPAINTING_VARIATIONS.length)
        ]
        
        positivePrompt = `${basePrompt},
a stunningly beautiful ${age} year old ${ethnicity} woman,
${nippleInpainting},
Physical Attributes:
(perfect feminine anatomy:1.6), (flawless skin texture:1.5),
(very large surgically enhanced breasts:1.6), perfectly proportioned augmented breasts,
toned physique,
${hairColor} hair,
${eyeColor} eyes, (sparkling, detailed iris:1.4),
Outfit: sheer lingerie or see-through fabric,
Setting: ${setting}
Technical Specifications:
(shot on Canon EOS R5, 85mm f/1.2:1.3), (soft backlighting:1.3), (professional studio lighting:1.2),
(sharp focus:1.4), (ultra-detailed skin texture:1.4), (perfect hands:1.5), (flawless feet:1.4)`

        negativePrompt += ', fully covered, opaque fabric, hidden breasts, no nipple visibility, concealed nipples'
        break

      case 'CLOTHED':
        // Diverse attire with nipple inpainting - NO WHITE BRAS
        const attire = UNIQUE_ATTIRE_OPTIONS[
          Math.floor(Math.random() * UNIQUE_ATTIRE_OPTIONS.length)
        ]
        
        const clothingNippleEffect = NIPPLE_INPAINTING_VARIATIONS[
          Math.floor(Math.random() * NIPPLE_INPAINTING_VARIATIONS.length)
        ]
        
        positivePrompt = `${basePrompt},
a stunningly beautiful ${age} year old ${ethnicity} woman,
(perfect feminine anatomy:1.6), (flawless skin, realistic pores, natural texture:1.5),
(very large surgically enhanced breasts:1.6), perfectly proportioned augmented breasts,
${clothingNippleEffect},
Physical Attributes:
toned and shapely physique,
${hairColor} hair,
${eyeColor} eyes, (sparkling, detailed iris:1.4), (doe-eyed expression:1.2),
Outfit: ${attire.prompt},
Style: ${attire.name}, ${attire.description},
Setting: ${setting}
Technical Specifications:
(shot on ARRI Alexa 65:1.4), (85mm f/1.2 lens:1.3), cinematic lighting, professional color grading,
(sharp focus:1.4), (natural skin texture:1.4), (perfect hands:1.5), (flawless feet:1.4)`

        // Very strong negative prompts against white bras and basic underwear
        negativePrompt += ', white bra, plain bra, basic underwear, white underwear, simple lingerie, bra showing, visible bra lines, basic bra, ordinary underwear, generic lingerie'
        break
    }

    return {
      positive: positivePrompt.trim(),
      negative: negativePrompt.trim()
    }
  }

  private getStrongNegativePrompt(): string {
    return `(worst quality, low quality, normal quality:1.8), watermark, signature, username, text, logo, copyright, trademark, artist name, error,
deformed, distorted, disfigured, bad anatomy, wrong anatomy, malformed, mutation, mutated, ugly, disgusting, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts,
stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, latex, mannequin, wax figure,
cloned face, airbrushed, uncanny valley, fake looking, computer generated,
asymmetrical breasts, malformed nipples, asymmetrical areolas, poorly drawn nipples, blurry nipples, unnatural nipples,
extra fingers, fused fingers, too many fingers, long neck, long body, extra limb, missing limb, floating limbs, disconnected limbs,
poorly drawn hands, poorly drawn face, poorly drawn feet, malformed toes, deformed feet, awkward arm positions, disjointed limbs, malformed elbows, distorted knees,
makeup streaks, messy makeup, smudged eyeliner`
  }

  async generateSpecializedImage(prompt: string, outputPath: string): Promise<boolean> {
    try {
      console.log(`🎨 Generating specialized image: ${path.basename(outputPath)}`)
      
      const response = await this.zai.images.generations.create({
        prompt: prompt,
        size: '1024x1024',
        quality: 'hd'
      })

      if (response.data && response.data[0] && response.data[0].base64) {
        const imageBuffer = Buffer.from(response.data[0].base64, 'base64')
        
        // Ensure directory exists
        const dir = path.dirname(outputPath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        
        fs.writeFileSync(outputPath, imageBuffer)
        console.log(`✅ Specialized image generated: ${path.basename(outputPath)}`)
        return true
      } else {
        console.error('❌ No image data in response')
        return false
      }
    } catch (error) {
      console.error(`❌ Failed to generate specialized image:`, error)
      return false
    }
  }

  async fixMarketplaceImages() {
    console.log('🎯 Starting Nipple Inpainting & Attire Enhancement...')
    console.log('📋 Fixing white bras, adding nipple visibility, ensuring proper nudity...')
    
    try {
      // Get all marketplace items that need fixing
      const items = await prisma.marketplaceItem.findMany({
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log(`📋 Found ${items.length} items to enhance`)

      let successCount = 0
      let failureCount = 0

      for (const item of items) {
        try {
          console.log(`🔄 Enhancing: ${item.title}`)
          
          // Analyze current issues and determine the fix needed
          const config: NippleInpaintingConfig = {
            type: item.isNsfw ? 
              (item.title.toLowerCase().includes('semi') ? 'SEMI_NUDE' : 'NUDE') : 
              'CLOTHED',
            ethnicity: item.promptConfig?.ethnicity || 'Caucasian',
            age: item.promptConfig?.age || 23,
            hairColor: item.promptConfig?.hairColor || 'brown',
            eyeColor: item.promptConfig?.eyeColor || 'brown',
            setting: item.promptConfig?.setting || 'professional studio',
            currentIssues: [
              'white bra issues',
              'lack of nipple visibility', 
              'poor prompt adherence',
              'too much similarity'
            ]
          }

          // Generate specialized prompt
          const prompts = this.generateSpecializedPrompt(config)
          
          // Generate new image filename
          const timestamp = Date.now()
          const randomId = Math.random().toString(36).substring(2, 8)
          const category = item.isNsfw ? 'nsfw' : 'sfw'
          const imageName = `${category}-fixed-${timestamp}-${randomId}.jpg`
          const imagePath = path.join(process.cwd(), 'public', 'marketplace-images', 'fixed', imageName)
          
          // Generate the enhanced image
          const success = await this.generateSpecializedImage(prompts.positive, imagePath)
          
          if (success) {
            // Update the database with new image information
            const imageUrl = `/marketplace-images/fixed/${imageName}`
            
            await prisma.marketplaceItem.update({
              where: { id: item.id },
              data: {
                thumbnail: imageUrl,
                images: JSON.stringify([imageUrl]),
                positivePrompt: prompts.positive,
                negativePrompt: prompts.negative,
                fullPrompt: prompts.positive + '\n\n' + prompts.negative
              }
            })
            
            console.log(`✅ Enhanced item: ${item.title}`)
            successCount++
          } else {
            console.error(`❌ Failed to enhance item: ${item.title}`)
            failureCount++
          }

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))
          
        } catch (error) {
          console.error(`❌ Error enhancing item ${item.title}:`, error)
          failureCount++
        }
      }

      console.log(`🎉 Enhancement complete!`)
      console.log(`✅ Successfully enhanced: ${successCount} images`)
      console.log(`❌ Failed to enhance: ${failureCount} images`)
      
      return { successCount, failureCount }
      
    } catch (error) {
      console.error('❌ Error in fixMarketplaceImages:', error)
      throw error
    }
  }
}

// Main execution function
async function main() {
  console.log('🎯 Nipple Inpainting & Attire Enhancement System')
  console.log('===============================================')
  console.log('📋 Fixing: white bras, adding nipple visibility, ensuring proper nudity')
  console.log('🎨 Creating: unique diverse attire, prompt adherence')
  
  const specialist = new NippleInpaintingSpecialist()
  
  try {
    // Initialize specialist
    await specialist.initialize()
    
    // Fix all marketplace images
    const result = await specialist.fixMarketplaceImages()
    
    console.log('🏆 Enhancement completed successfully!')
    console.log(`📊 Results: ${result.successCount} enhanced, ${result.failureCount} failed`)
    
    process.exit(0)
  } catch (error) {
    console.error('💥 Enhancement failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { NippleInpaintingSpecialist, NippleInpaintingConfig }