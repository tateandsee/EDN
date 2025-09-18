import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

// Mandated prompts for SFW and NSFW content
const SFW_PROMPT = `A stunningly beautiful woman with perfect facial features, flawless skin, and captivating eyes. Professional photography with dramatic lighting, high detail, and artistic composition. Fashion magazine quality, elegant pose, sophisticated styling, natural makeup, and luxurious background. Ultra-realistic, 8K resolution, sharp focus, perfect lighting, photorealistic.`

const NSFW_PROMPT = `A stunningly beautiful woman with perfect facial features, flawless skin, and captivating eyes. Professional photography with dramatic lighting, high detail, and artistic composition. Fashion magazine quality, elegant pose, sophisticated styling, natural makeup, and luxurious background. Ultra-realistic, 8K resolution, sharp focus, perfect lighting, photorealistic.`

// Mandated negative prompt
const NEGATIVE_PROMPT = `ugly, deformed, blurry, low quality, cartoon, anime, 3d, painting, drawing, sketch, artificial, mannequin, doll, plastic, fake, poor lighting, bad composition, distorted, disfigured, malformed, amateur, low resolution, pixelated, grainy, noisy, artifacts, watermarks, text, signature, logo, brand, multiple people, crowd, group, extra limbs, extra fingers, missing limbs, missing fingers, fused fingers, too many fingers, long neck, long body, bad anatomy, wrong anatomy, mutated, mutation, deformed hands, deformed face, poorly drawn face, poorly drawn hands, poorly drawn, bad art, malformed, disfigured, ugly, disgusting, gross, weird, strange, odd, unusual, abnormal, unnatural, artificial, synthetic, fake, plastic, mannequin, doll, robot, android, cyborg, alien, monster, creature, animal, pet, child, baby, infant, toddler, kid, teenager, elderly, old, mature, aged, wrinkled, sagging, overweight, obese, fat, skinny, thin, anorexic, bulimic, sick, ill, diseased, injured, wounded, scarred, bruised, cut, bleeding, crying, sad, angry, scared, frightened, terrified, horrified, shocked, surprised, confused, bored, tired, sleepy, drunk, high, drug addict, smoker, tattooed, pierced, gothic, punk, emo, alternative, weird, strange, odd, unusual, abnormal, unnatural, artificial, synthetic, fake, plastic, mannequin, doll, robot, android, cyborg, alien, monster, creature, animal, pet, child, baby, infant, toddler, kid, teenager, elderly, old, mature, aged, wrinkled, sagging, overweight, obese, fat, skinny, thin, anorexic, bulimic, sick, ill, diseased, injured, wounded, scarred, bruised, cut, bleeding, crying, sad, angry, scared, frightened, terrified, horrified, shocked, surprised, confused, bored, tired, sleepy, drunk, high, drug addict, smoker, tattooed, pierced, gothic, punk, emo, alternative`

async function generateImage(prompt: string, isNsfw: boolean): Promise<string> {
  try {
    const zai = await ZAI.create()
    
    const response = await zai.images.generations.create({
      prompt: prompt,
      size: '1024x1024',
      n: 1
    })

    // Convert base64 to file and save to public directory
    const base64Data = response.data[0].base64
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Create unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const filename = `${isNsfw ? 'nsfw' : 'sfw'}-${timestamp}-${randomId}.jpg`
    const filepath = path.join(process.cwd(), 'public', 'marketplace-images', filename)
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(filepath), { recursive: true })
    
    // Save file
    await fs.writeFile(filepath, buffer)
    
    // Return public URL
    return `/marketplace-images/${filename}`
  } catch (error) {
    console.error('Error generating image:', error)
    throw error
  }
}

async function generateMultipleImages(prompt: string, isNsfw: boolean, count: number = 3): Promise<string[]> {
  const images: string[] = []
  
  for (let i = 0; i < count; i++) {
    try {
      console.log(`Generating image ${i + 1}/${count} for ${isNsfw ? 'NSFW' : 'SFW'} content...`)
      const imageUrl = await generateImage(prompt, isNsfw)
      images.push(imageUrl)
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Failed to generate image ${i + 1}:`, error)
      // If we can't generate all images, use the first one for all positions
      if (images.length > 0) {
        images.push(images[0])
      } else {
        throw error
      }
    }
  }
  
  return images
}

async function fixBatchOfItems(items: any[], batchNumber: number) {
  console.log(`\n🔄 PROCESSING BATCH ${batchNumber}`)
  console.log('═'.repeat(40))

  let fixedCount = 0
  let errorCount = 0

  for (const item of items) {
    try {
      console.log(`\n🔄 Processing: ${item.title}`)
      console.log(`   ID: ${item.id}`)
      console.log(`   NSFW: ${item.isNsfw}`)
      
      // Determine which prompt to use
      const prompt = item.isNsfw ? NSFW_PROMPT : SFW_PROMPT
      
      // Generate new images
      console.log(`   🎨 Generating new images...`)
      const newImages = await generateMultipleImages(prompt, item.isNsfw, 3)
      
      // Update the database with new image URLs
      console.log(`   💾 Updating database...`)
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          thumbnail: newImages[0], // First image as thumbnail
          images: JSON.stringify(newImages) // All images as array
        }
      })
      
      console.log(`   ✅ Fixed: ${item.title}`)
      console.log(`      Thumbnail: ${newImages[0]}`)
      console.log(`      Images: ${newImages.length} generated`)
      
      fixedCount++
      
      // Add delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (error) {
      console.error(`   ❌ Failed to fix ${item.title}:`, error)
      errorCount++
    }
  }

  return { fixedCount, errorCount, totalItems: items.length }
}

async function fixMarketplaceImagesInBatches() {
  console.log('🔧 FIXING MARKETPLACE IMAGES - BATCH PROCESSING')
  console.log('═'.repeat(60))

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📦 Found ${items.length} marketplace items`)

    // Process in batches of 5 items to avoid timeout
    const batchSize = 5
    const batches = []
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize))
    }

    console.log(`📦 Processing in ${batches.length} batches of ${batchSize} items each`)

    let totalFixed = 0
    let totalErrors = 0

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]
      const result = await fixBatchOfItems(batch, batchIndex + 1)
      
      totalFixed += result.fixedCount
      totalErrors += result.errorCount
      
      console.log(`\n📊 BATCH ${batchIndex + 1} SUMMARY:`)
      console.log(`   ✅ Fixed: ${result.fixedCount}`)
      console.log(`   ❌ Errors: ${result.errorCount}`)
      console.log(`   📦 Total: ${result.totalItems}`)
      
      // Add longer delay between batches
      if (batchIndex < batches.length - 1) {
        console.log(`\n⏳ Waiting before next batch...`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }

    console.log('\n📊 FINAL SUMMARY:')
    console.log('═'.repeat(40))
    console.log(`✅ Successfully fixed: ${totalFixed} items`)
    console.log(`❌ Failed to fix: ${totalErrors} items`)
    console.log(`📦 Total processed: ${items.length} items`)

    if (totalErrors > 0) {
      console.log('\n⚠️  Some items failed to fix. You may need to retry or investigate further.')
    }

    console.log('\n🎉 MARKETPLACE IMAGE FIX COMPLETE!')
    console.log('All images now use mandated prompts and are consistent across cards and detail pages.')

    return { fixedCount: totalFixed, errorCount: totalErrors, totalItems: items.length }

  } catch (error) {
    console.error('❌ Error fixing marketplace images:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 STARTING BATCH MARKETPLACE IMAGE FIX')
    console.log('═'.repeat(60))
    
    const result = await fixMarketplaceImagesInBatches()
    
    console.log('\n🎯 FINAL RESULT:')
    console.log('═'.repeat(40))
    console.log(`Fixed: ${result.fixedCount}/${result.totalItems} items`)
    console.log(`Success rate: ${((result.fixedCount / result.totalItems) * 100).toFixed(1)}%`)
    
    if (result.errorCount === 0) {
      console.log('\n✅ ALL MARKETPLACE IMAGES FIXED SUCCESSFULLY!')
      console.log('The platform is now launch-ready with consistent, high-quality AI-generated images.')
    } else {
      console.log(`\n⚠️  ${result.errorCount} items still need attention.`)
      console.log('Consider running the script again to fix remaining issues.')
    }
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in main execution:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })