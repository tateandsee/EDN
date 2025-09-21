#!/usr/bin/env tsx

/**
 * Batch Image Fix - Efficient Processing
 * 
 * Processes images in smaller batches to avoid timeouts
 * Focuses on the most critical issues first
 */

import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Critical fix prompts - focused on the main issues
const CRITICAL_FIX_PROMPTS = {
  // For NSFW items that should be nude but showing bras
  nudeFix: {
    positive: "(masterpiece, photorealistic, best quality, ultra detailed, 8k:1.4), RAW photo, a stunningly beautiful woman, ((completely naked, totally nude, absolutely no clothing:1.8)), (bare breasts fully exposed:1.7), (visible nipples and areolas:1.6), (no bra, no underwear, no fabric:1.8), (perfect female anatomy:1.6), (natural breast shape:1.5), (perky nipples:1.4), professional studio lighting, sharp focus",
    negative: "bra, underwear, panties, lingerie, clothing, fabric, textile, shirt, dress, covered, hidden, obscured, concealed, white bra, basic underwear"
  },
  
  // For SFW items with too many white bras
  diverseAttireFix: {
    positive: "(masterpiece, photorealistic, best quality, ultra detailed, 8k:1.4), RAW photo, a stunningly beautiful woman, elegant floor-length evening gown, sophisticated design, high fashion, ((subtle nipple visibility through fabric:1.6)), (natural breast contour under clothing:1.5), perfect feminine anatomy, flawless skin, professional studio lighting, sharp focus",
    negative: "white bra, plain bra, basic underwear, white underwear, simple lingerie, bra showing, visible bra lines, basic bra, ordinary underwear"
  },
  
  // For items needing nipple inpainting
  nippleInpaintingFix: {
    positive: "(masterpiece, photorealistic, best quality, ultra detailed, 8k:1.4), RAW photo, a stunningly beautiful woman, sheer elegant outfit, ((nipples clearly visible through clothing:1.7)), (areola impression through fabric:1.6), (natural breast shape defined:1.5), perfect feminine anatomy, flawless skin, soft backlighting, sharp focus",
    negative: "fully covered, opaque fabric, hidden breasts, no nipple visibility, concealed nipples, white bra"
  }
}

class BatchImageFixer {
  private zai: ZAI

  constructor() {
    this.zai = null as any
  }

  async initialize() {
    try {
      this.zai = await ZAI.create()
      console.log('✅ Batch Image Fixer initialized')
    } catch (error) {
      console.error('❌ Failed to initialize:', error)
      throw error
    }
  }

  async generateImage(prompt: string, outputPath: string): Promise<boolean> {
    try {
      console.log(`🎨 Generating: ${path.basename(outputPath)}`)
      
      const response = await this.zai.images.generations.create({
        prompt: prompt,
        size: '1024x1024',
        quality: 'hd'
      })

      if (response.data && response.data[0] && response.data[0].base64) {
        const imageBuffer = Buffer.from(response.data[0].base64, 'base64')
        
        const dir = path.dirname(outputPath)
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true })
        }
        
        fs.writeFileSync(outputPath, imageBuffer)
        console.log(`✅ Generated: ${path.basename(outputPath)}`)
        return true
      }
      return false
    } catch (error) {
      console.error(`❌ Failed to generate ${path.basename(outputPath)}:`, error.message)
      return false
    }
  }

  async processBatch(items: any[], batchNumber: number): Promise<{ success: number; failed: number }> {
    console.log(`🔄 Processing batch ${batchNumber} (${items.length} items)`)
    
    let success = 0
    let failed = 0

    for (const item of items) {
      try {
        console.log(`🎯 Fixing: ${item.title}`)
        
        // Determine the type of fix needed
        let promptConfig
        if (item.isNsfw) {
          if (item.title.toLowerCase().includes('semi')) {
            promptConfig = CRITICAL_FIX_PROMPTS.nippleInpaintingFix
          } else {
            promptConfig = CRITICAL_FIX_PROMPTS.nudeFix
          }
        } else {
          promptConfig = CRITICAL_FIX_PROMPTS.diverseAttireFix
        }
        
        // Generate new image
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 8)
        const category = item.isNsfw ? 'nsfw' : 'sfw'
        const imageName = `${category}-batch${batchNumber}-${timestamp}-${randomId}.jpg`
        const imagePath = path.join(process.cwd(), 'public', 'marketplace-images', 'batch-fixed', imageName)
        
        const imageSuccess = await this.generateImage(promptConfig.positive, imagePath)
        
        if (imageSuccess) {
          // Update database
          const imageUrl = `/marketplace-images/batch-fixed/${imageName}`
          
          await prisma.marketplaceItem.update({
            where: { id: item.id },
            data: {
              thumbnail: imageUrl,
              images: JSON.stringify([imageUrl]),
              positivePrompt: promptConfig.positive,
              negativePrompt: promptConfig.negative,
              fullPrompt: promptConfig.positive + '\n\n' + promptConfig.negative
            }
          })
          
          console.log(`✅ Fixed: ${item.title}`)
          success++
        } else {
          console.error(`❌ Failed to fix: ${item.title}`)
          failed++
        }
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000))
        
      } catch (error) {
        console.error(`❌ Error processing ${item.title}:`, error.message)
        failed++
      }
    }
    
    return { success, failed }
  }

  async fixAllImages() {
    console.log('🚀 Starting Batch Image Fix...')
    console.log('📋 Will process images in batches to avoid timeouts')
    
    try {
      // Get all active items
      const allItems = await prisma.marketplaceItem.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
      })

      console.log(`📋 Found ${allItems.length} items to fix`)

      // Process in batches of 5 items each
      const batchSize = 5
      const batches = []
      
      for (let i = 0; i < allItems.length; i += batchSize) {
        batches.push(allItems.slice(i, i + batchSize))
      }

      console.log(`📦 Created ${batches.length} batches of ${batchSize} items each`)

      let totalSuccess = 0
      let totalFailed = 0

      for (let i = 0; i < batches.length; i++) {
        console.log(`\\n🎬 Processing batch ${i + 1}/${batches.length}...`)
        
        const result = await this.processBatch(batches[i], i + 1)
        totalSuccess += result.success
        totalFailed += result.failed
        
        console.log(`📊 Batch ${i + 1} complete: ${result.success} success, ${result.failed} failed`)
        
        // Longer delay between batches
        if (i < batches.length - 1) {
          console.log('⏳ Pausing between batches...')
          await new Promise(resolve => setTimeout(resolve, 10000))
        }
      }

      console.log('\\n🎉 All batches processed!')
      console.log(`📊 Final results: ${totalSuccess} success, ${totalFailed} failed`)
      
      return { success: totalSuccess, failed: totalFailed }
      
    } catch (error) {
      console.error('❌ Error in fixAllImages:', error)
      throw error
    }
  }
}

// Main execution
async function main() {
  console.log('🎯 Batch Image Fix System')
  console.log('=========================')
  
  const fixer = new BatchImageFixer()
  
  try {
    await fixer.initialize()
    const result = await fixer.fixAllImages()
    
    console.log('\\n🏆 Batch fix completed!')
    console.log(`📊 Results: ${result.success} fixed, ${result.failed} failed`)
    
    process.exit(0)
  } catch (error) {
    console.error('💥 Batch fix failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}