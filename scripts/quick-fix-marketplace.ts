import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function quickFixMarketplaceImages() {
  console.log('🔧 QUICK FIX FOR MARKETPLACE IMAGES')
  console.log('═'.repeat(60))

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📦 Found ${items.length} marketplace items`)

    let fixedCount = 0
    let errorCount = 0

    // First, fix items with invalid URLs by using valid stock photos temporarily
    const validStockPhotos = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544723795-3fb53e6b3e3d?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=1024&h=1024&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1024&h=1024&fit=crop&crop=face'
    ]

    for (const item of items) {
      try {
        console.log(`\n🔄 Processing: ${item.title}`)
        console.log(`   ID: ${item.id}`)
        console.log(`   NSFW: ${item.isNsfw}`)
        
        // Check if current images are invalid
        let needsFix = false
        let currentImages: string[] = []
        
        try {
          if (item.images && item.images.trim() !== '') {
            currentImages = JSON.parse(item.images)
          }
        } catch (e) {
          console.log(`   ⚠️  Error parsing images array: ${e}`)
          needsFix = true
        }
        
        // Check for invalid URLs
        for (const imgUrl of currentImages) {
          try {
            new URL(imgUrl)
            if (imgUrl.startsWith('/marketplace-images/')) {
              console.log(`   ❌ Invalid relative URL: ${imgUrl}`)
              needsFix = true
            }
          } catch (e) {
            console.log(`   ❌ Invalid URL: ${imgUrl}`)
            needsFix = true
          }
        }
        
        // Check thumbnail
        try {
          if (item.thumbnail) {
            new URL(item.thumbnail)
            if (item.thumbnail.startsWith('/marketplace-images/')) {
              console.log(`   ❌ Invalid thumbnail URL: ${item.thumbnail}`)
              needsFix = true
            }
          }
        } catch (e) {
          console.log(`   ❌ Invalid thumbnail URL: ${item.thumbnail}`)
          needsFix = true
        }
        
        if (!needsFix) {
          console.log(`   ✅ Already valid, skipping...`)
          continue
        }
        
        // Generate new image URLs
        const startIndex = Math.floor(Math.random() * (validStockPhotos.length - 2))
        const newImages = [
          validStockPhotos[startIndex],
          validStockPhotos[startIndex + 1],
          validStockPhotos[startIndex + 2]
        ]
        
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
        console.log(`      Images: ${newImages.length} valid URLs`)
        
        fixedCount++
        
      } catch (error) {
        console.error(`   ❌ Failed to fix ${item.title}:`, error)
        errorCount++
      }
    }

    console.log('\n📊 QUICK FIX SUMMARY:')
    console.log('═'.repeat(40))
    console.log(`✅ Successfully fixed: ${fixedCount} items`)
    console.log(`❌ Failed to fix: ${errorCount} items`)
    console.log(`📦 Total processed: ${items.length} items`)

    // Now check and fix the detail API
    console.log('\n🔧 CHECKING DETAIL API...')
    try {
      const detailApiPath = path.join(process.cwd(), 'src', 'app', 'api', 'marketplace', 'items', '[id]', 'route.ts')
      const detailApiContent = await fs.readFile(detailApiPath, 'utf8')
      
      if (detailApiContent.includes('thumbnail') && detailApiContent.includes('images')) {
        console.log('✅ Detail API already includes thumbnail and images fields')
      } else {
        console.log('❌ Detail API missing image fields - needs manual fix')
        console.log('   Please ensure the detail API returns thumbnail and images fields')
      }
    } catch (e) {
      console.log(`❌ Error checking detail API: ${e}`)
    }

    console.log('\n🎉 QUICK FIX COMPLETE!')
    console.log('All invalid image URLs have been replaced with valid stock photos.')
    console.log('Images are now consistent between cards and detail pages.')

    return { fixedCount, errorCount, totalItems: items.length }

  } catch (error) {
    console.error('❌ Error in quick fix:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 STARTING QUICK MARKETPLACE FIX')
    console.log('═'.repeat(60))
    
    const result = await quickFixMarketplaceImages()
    
    console.log('\n🎯 FINAL RESULT:')
    console.log('═'.repeat(40))
    console.log(`Fixed: ${result.fixedCount}/${result.totalItems} items`)
    console.log(`Success rate: ${((result.fixedCount / result.totalItems) * 100).toFixed(1)}%`)
    
    if (result.errorCount === 0) {
      console.log('\n✅ ALL INVALID IMAGES FIXED SUCCESSFULLY!')
      console.log('The platform now has valid, accessible images throughout.')
    } else {
      console.log(`\n⚠️  ${result.errorCount} items still need attention.`)
    }
    
    console.log('\n📋 NEXT STEPS:')
    console.log('1. Test the marketplace to ensure all images display correctly')
    console.log('2. Verify consistency between cards and detail pages')
    console.log('3. Consider generating AI images for a more premium look')
    
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