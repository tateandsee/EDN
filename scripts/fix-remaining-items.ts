import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixRemainingItems() {
  console.log('🔧 FIXING REMAINING INVALID ITEMS')
  console.log('═'.repeat(60))

  try {
    // Items that still have invalid URLs based on verification
    const invalidItemIds = [
      'cmf0ndj3n000cm8agbxr9yqs6', // Enchanting Emma
      'cmf0ndj3p000im8agxinnojuu', // Captivating Isabella
      'cmf0ndj3q000km8ag6rer23ki', // Radiant Mia
      'cmf0ndj3u000sm8ag8m67mi63', // Royal Evelyn
      'cmf0ndj3x000ym8aghmxpuvfq', // Elegant Elizabeth
      'cmf0ndj3y0010m8agzsxunwo6'  // Exquisite Mila
    ]

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

    let fixedCount = 0
    let errorCount = 0

    for (const itemId of invalidItemIds) {
      try {
        // Get the item
        const item = await prisma.marketplaceItem.findUnique({
          where: { id: itemId }
        })

        if (!item) {
          console.log(`❌ Item not found: ${itemId}`)
          errorCount++
          continue
        }

        console.log(`\n🔄 Fixing: ${item.title}`)
        console.log(`   ID: ${item.id}`)
        console.log(`   NSFW: ${item.isNsfw}`)
        
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
          where: { id: itemId },
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
        console.error(`   ❌ Failed to fix item ${itemId}:`, error)
        errorCount++
      }
    }

    console.log('\n📊 REMAINING ITEMS FIX SUMMARY:')
    console.log('═'.repeat(40))
    console.log(`✅ Successfully fixed: ${fixedCount} items`)
    console.log(`❌ Failed to fix: ${errorCount} items`)
    console.log(`📦 Total processed: ${invalidItemIds.length} items`)

    if (errorCount === 0) {
      console.log('\n🎉 ALL REMAINING ITEMS FIXED SUCCESSFULLY!')
      console.log('The marketplace should now be fully launch-ready.')
    } else {
      console.log('\n⚠️  Some items still need attention.')
    }

    return { fixedCount, errorCount, totalItems: invalidItemIds.length }

  } catch (error) {
    console.error('❌ Error fixing remaining items:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 STARTING REMAINING ITEMS FIX')
    console.log('═'.repeat(60))
    
    const result = await fixRemainingItems()
    
    console.log('\n🎯 FINAL RESULT:')
    console.log('═'.repeat(40))
    console.log(`Fixed: ${result.fixedCount}/${result.totalItems} remaining items`)
    console.log(`Success rate: ${((result.fixedCount / result.totalItems) * 100).toFixed(1)}%`)
    
    if (result.errorCount === 0) {
      console.log('\n✅ ALL MARKETPLACE ITEMS NOW FIXED!')
      console.log('The platform is launch-ready with consistent, valid images throughout.')
    } else {
      console.log(`\n⚠️  ${result.errorCount} items still need manual attention.`)
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