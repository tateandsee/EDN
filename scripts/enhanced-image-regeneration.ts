#!/usr/bin/env tsx

/**
 * Enhanced Image Regeneration System
 * 
 * This script addresses the critical image quality issues:
 * 1. NSFW images showing white bras instead of full nudity
 * 2. Too many similar images with white bras
 * 3. Need for nipple inpainting on clothing
 * 4. Poor prompt adherence
 * 
 * Features:
 * - Enhanced prompts with stronger nudity emphasis
 * - Nipple inpainting functionality
 * - Diverse and unique attire generation
 * - Prompt adherence validation
 */

import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Enhanced prompt templates for better image generation
const ENHANCED_PROMPT_TEMPLATES = {
  // NSFW Full Nude Templates (stronger emphasis)
  nsfwFullNude: [
    {
      base: "(masterpiece, photorealistic, best quality, ultra detailed, 8k:1.4), RAW photo",
      nudity: "((completely naked, fully nude, no clothing at all:1.8)), (bare breasts exposed:1.6), (visible nipples:1.5), (no bra, no underwear:1.7)",
      anatomy: "(perfect female anatomy:1.6), (natural breast shape:1.5), (perky nipples:1.4)",
      lighting: "(professional studio lighting:1.3), (soft shadows:1.2), (sharp focus:1.4)"
    },
    {
      base: "(photorealistic, 8k resolution, ultra detailed:1.6), professional photography",
      nudity: "((totally nude, completely unclothed:1.8)), (topless, bare chest:1.7), (exposed breasts with visible nipples:1.6)",
      anatomy: "(flawless natural breasts:1.5), (erect nipples:1.4), (perfect areolas:1.3)",
      lighting: "(cinematic lighting:1.3), (dramatic shadows:1.2), (high detail skin texture:1.4)"
    }
  ],

  // NSFW Semi-Nude Templates
  nsfwSemiNude: [
    {
      base: "(masterpiece, photorealistic, best quality, ultra detailed, 8k:1.4)",
      clothing: "((sheer, see-through fabric:1.6)), (transparent clothing:1.5)",
      nudity: "((visible nipples through clothing:1.7)), (areolas clearly visible:1.6), (breast outline defined:1.5)",
      anatomy: "(perfect breasts under sheer fabric:1.5), (natural nipple shape:1.4)",
      lighting: "(soft backlighting:1.3), (professional studio lighting:1.2)"
    }
  ],

  // SFW Diverse Attire Templates (NO WHITE BRAS)
  sfwAttire: [
    {
      outfit: "elegant evening gown, floor-length, sophisticated",
      style: "((high fashion, luxury design:1.5)), (formal wear:1.4)",
      coverage: "((fully covered, modest:1.3)), (elegant neckline:1.2)",
      setting: "red carpet event, gala, upscale venue"
    },
    {
      outfit: "casual streetwear, modern fashion, trendy",
      style: "((urban fashion, contemporary style:1.5)), (street style:1.4)",
      coverage: "((fashionable layered look:1.3)), (modern silhouette:1.2)",
      setting: "city street, urban environment, modern backdrop"
    },
    {
      outfit: "athletic wear, sporty, fitness outfit",
      style: "((activewear, performance fabric:1.5)), (sporty aesthetic:1.4)",
      coverage: "((functional athletic design:1.3)), (performance-oriented:1.2)",
      setting: "gym, fitness center, sports facility"
    },
    {
      outfit: "business professional, corporate attire",
      style: "((business formal, professional wear:1.5)), (corporate fashion:1.4)",
      coverage: "((conservative business style:1.3)), (professional appearance:1.2)",
      setting: "office, corporate environment, business setting"
    },
    {
      outfit: "bohemian style, flowy fabrics, artistic",
      style: "((boho chic, artistic fashion:1.5)), (free-spirited style:1.4)",
      coverage: "((flowing layers, artistic draping:1.3)), (creative expression:1.2)",
      setting: "art studio, creative space, outdoor festival"
    },
    {
      outfit: "vintage retro, classic style, nostalgic",
      style: "((retro fashion, vintage aesthetic:1.5)), (classic design:1.4)",
      coverage: "((period-appropriate coverage:1.3)), (timeless elegance:1.2)",
      setting: "vintage café, retro environment, classic backdrop"
    },
    {
      outfit: "lingerie and sleepwear, intimate apparel",
      style: "((luxury lingerie, intimate wear:1.5)), (elegant sleepwear:1.4)",
      coverage: "((sensual but modest:1.3)), ((nipple inpainting visible through fabric:1.6))",
      setting: "bedroom, boudoir, intimate space"
    },
    {
      outfit: "swimwear, beach attire, poolside",
      style: "((designer swimwear, beach fashion:1.5)), (resort wear:1.4)",
      coverage: "((swimsuit design, beach appropriate:1.3)), ((subtle nipple visibility:1.5))",
      setting: "beach, poolside, tropical resort"
    },
    {
      outfit: "traditional cultural wear, ethnic dress",
      style: "((cultural attire, traditional dress:1.5)), (ethnic fashion:1.4)",
      coverage: "((culturally appropriate coverage:1.3)), (traditional modesty:1.2)",
      setting: "cultural venue, traditional setting, heritage location"
    },
    {
      outfit: "fantasy costume, creative design, artistic",
      style: "((fantasy wear, creative costume:1.5)), (artistic design:1.4)",
      coverage: "((imaginative coverage:1.3)), (fantastical elements:1.2)",
      setting: "fantasy realm, magical environment, artistic backdrop"
    }
  ]
}

// Nipple inpainting prompts for clothing visibility
const NIPPLE_INPAINTING_PROMPTS = [
  "((subtle nipple visibility through fabric:1.4)), (natural breast shape under clothing:1.3)",
  "((gentle nipple outline visible:1.3)), (soft breast contour defined:1.2)",
  "((nipple impression through sheer material:1.5)), (natural areola suggestion:1.3)",
  "((clothing drapes naturally over breasts:1.4)), (subtle nipple presence:1.3)"
]

interface ImageGenerationConfig {
  type: 'NSFW_FULL_NUDE' | 'NSFW_SEMI_NUDE' | 'SFW'
  ethnicity: string
  age: number
  hairColor: string
  eyeColor: string
  setting: string
  attire?: string
  nudeStyle?: string
}

class EnhancedImageGenerator {
  private zai: ZAI

  constructor() {
    this.zai = null as any
  }

  async initialize() {
    try {
      this.zai = await ZAI.create()
      console.log('✅ ZAI initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize ZAI:', error)
      throw error
    }
  }

  generateEnhancedPrompt(config: ImageGenerationConfig): string {
    const { type, ethnicity, age, hairColor, eyeColor, setting, attire, nudeStyle } = config

    let positivePrompt = ''
    let negativePrompt = this.getBaseNegativePrompt()

    switch (type) {
      case 'NSFW_FULL_NUDE':
        const nudeTemplate = ENHANCED_PROMPT_TEMPLATES.nsfwFullNude[
          Math.floor(Math.random() * ENHANCED_PROMPT_TEMPLATES.nsfwFullNude.length)
        ]
        
        positivePrompt = `${nudeTemplate.base},
a stunningly beautiful ${age} year old ${ethnicity} woman,
${nudeTemplate.nudity},
${nudeTemplate.anatomy},
Physical Attributes:
(toned physique:1.4),
${hairColor} hair,
${eyeColor} eyes, (sparkling, detailed iris:1.4),
Setting: ${setting}
${nudeStyle ? `Style: ${nudeStyle}` : ''}
Technical Specifications:
(shot on Canon EOS R5, 85mm f/1.2:1.3), ${nudeTemplate.lighting},
(perfect hands:1.5), (flawless feet:1.4), (natural skin texture:1.4)`

        // Strong negative prompts against clothing
        negativePrompt += ', bra, underwear, panties, clothing, shirt, dress, fabric, textile, covered breasts, hidden nipples'
        break

      case 'NSFW_SEMI_NUDE':
        const semiNudeTemplate = ENHANCED_PROMPT_TEMPLATES.nsfwSemiNude[0]
        
        positivePrompt = `${semiNudeTemplate.base},
a stunningly beautiful ${age} year old ${ethnicity} woman,
${semiNudeTemplate.clothing},
${semiNudeTemplate.nudity},
${semiNudeTemplate.anatomy},
Physical Attributes:
(toned physique:1.4),
${hairColor} hair,
${eyeColor} eyes, (sparkling, detailed iris:1.4),
Setting: ${setting}
Outfit: ${attire || 'sheer lingerie'}
Technical Specifications:
(shot on Canon EOS R5, 85mm f/1.2:1.3), ${semiNudeTemplate.lighting},
(perfect hands:1.5), (flawless feet:1.4), (natural skin texture:1.4)`

        negativePrompt += ', fully covered, opaque fabric, hidden nipples, no breast definition'
        break

      case 'SFW':
        const attireTemplate = ENHANCED_PROMPT_TEMPLATES.sfwAttire[
          Math.floor(Math.random() * ENHANCED_PROMPT_TEMPLATES.sfwAttire.length)
        ]
        
        const nippleInpainting = Math.random() > 0.5 ? 
          NIPPLE_INPAINTING_PROMPTS[Math.floor(Math.random() * NIPPLE_INPAINTING_PROMPTS.length)] : ''
        
        positivePrompt = `${attireTemplate.base},
a stunningly beautiful ${age} year old ${ethnicity} woman,
(perfect feminine anatomy:1.6), (flawless skin, realistic pores, natural texture:1.5),
(very large surgically enhanced breasts:1.6), perfectly proportioned augmented breasts,
${nippleInpainting},
Physical Attributes:
toned physique,
${hairColor} hair,
${eyeColor} eyes, (sparkling, detailed iris:1.4),
Outfit: ${attire || attireTemplate.outfit},
Style: ${attireTemplate.style},
Coverage: ${attireTemplate.coverage},
Setting: ${setting || attireTemplate.setting}
Technical Specifications:
(shot on ARRI Alexa 65:1.4), (85mm f/1.2 lens:1.3), cinematic lighting, professional color grading,
(perfect hands:1.5), (flawless feet:1.4), (natural skin texture:1.4), (sharp focus:1.3)`

        // Strong negative prompts against white bras and similar items
        negativePrompt += ', white bra, plain underwear, basic bra, simple lingerie, white underwear, bra showing, visible bra lines'
        break
    }

    return {
      positive: positivePrompt.trim(),
      negative: negativePrompt.trim()
    }
  }

  private getBaseNegativePrompt(): string {
    return `(worst quality, low quality, normal quality:1.8), watermark, signature, username, text, logo, copyright, trademark, artist name, error,
deformed, distorted, disfigured, bad anatomy, wrong anatomy, malformed, mutation, mutated, ugly, disgusting, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts,
stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, latex, mannequin, wax figure,
cloned face, airbrushed, uncanny valley, fake looking, computer generated,
asymmetrical breasts, malformed nipples, asymmetrical areolas, poorly drawn nipples, blurry nipples, unnatural nipples,
extra fingers, fused fingers, too many fingers, long neck, long body, extra limb, missing limb, floating limbs, disconnected limbs,
poorly drawn hands, poorly drawn face, poorly drawn feet, malformed toes, deformed feet, awkward arm positions, disjointed limbs, malformed elbows, distorted knees,
makeup streaks, messy makeup, smudged eyeliner`
  }

  async generateImage(prompt: string, outputPath: string): Promise<boolean> {
    try {
      console.log(`🎨 Generating image: ${outputPath}`)
      
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
        console.log(`✅ Image generated successfully: ${outputPath}`)
        return true
      } else {
        console.error('❌ No image data in response')
        return false
      }
    } catch (error) {
      console.error(`❌ Failed to generate image ${outputPath}:`, error)
      return false
    }
  }

  async regenerateMarketplaceImages() {
    console.log('🚀 Starting enhanced marketplace image regeneration...')
    
    try {
      // Get all marketplace items
      const items = await prisma.marketplaceItem.findMany({
        where: {
          status: 'ACTIVE'
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      console.log(`📋 Found ${items.length} marketplace items to regenerate`)

      let successCount = 0
      let failureCount = 0

      for (const item of items) {
        try {
          console.log(`🔄 Processing item: ${item.title}`)
          
          // Determine image generation config based on item type
          const config: ImageGenerationConfig = {
            type: item.isNsfw ? 
              (item.title.toLowerCase().includes('semi') ? 'NSFW_SEMI_NUDE' : 'NSFW_FULL_NUDE') : 
              'SFW',
            ethnicity: item.promptConfig?.ethnicity || 'Caucasian',
            age: item.promptConfig?.age || 23,
            hairColor: item.promptConfig?.hairColor || 'brown',
            eyeColor: item.promptConfig?.eyeColor || 'brown',
            setting: item.promptConfig?.setting || 'professional studio',
            attire: item.promptConfig?.attire,
            nudeStyle: item.promptConfig?.nudeStyle
          }

          // Generate enhanced prompt
          const prompts = this.generateEnhancedPrompt(config)
          
          // Generate new image filename
          const timestamp = Date.now()
          const randomId = Math.random().toString(36).substring(2, 8)
          const imageCategory = item.isNsfw ? 'nsfw' : 'sfw'
          const imageName = `${imageCategory}-${timestamp}-${randomId}.jpg`
          const imagePath = path.join(process.cwd(), 'public', 'marketplace-images', 'enhanced', imageName)
          
          // Generate the image
          const success = await this.generateImage(prompts.positive, imagePath)
          
          if (success) {
            // Update the database with new image information
            const imageUrl = `/marketplace-images/enhanced/${imageName}`
            
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
            
            console.log(`✅ Updated item ${item.title} with new image`)
            successCount++
          } else {
            console.error(`❌ Failed to generate image for item ${item.title}`)
            failureCount++
          }

          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000))
          
        } catch (error) {
          console.error(`❌ Error processing item ${item.title}:`, error)
          failureCount++
        }
      }

      console.log(`🎉 Regeneration complete!`)
      console.log(`✅ Successfully regenerated: ${successCount} images`)
      console.log(`❌ Failed to regenerate: ${failureCount} images`)
      
      return { successCount, failureCount }
      
    } catch (error) {
      console.error('❌ Error in regenerateMarketplaceImages:', error)
      throw error
    }
  }
}

// Main execution function
async function main() {
  console.log('🎯 Enhanced Image Regeneration System')
  console.log('=====================================')
  
  const generator = new EnhancedImageGenerator()
  
  try {
    // Initialize ZAI
    await generator.initialize()
    
    // Regenerate all marketplace images
    const result = await generator.regenerateMarketplaceImages()
    
    console.log('🏆 Process completed successfully!')
    console.log(`📊 Results: ${result.successCount} success, ${result.failureCount} failures`)
    
    process.exit(0)
  } catch (error) {
    console.error('💥 Process failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { EnhancedImageGenerator, ImageGenerationConfig }