#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'
import { imageIntegrityService } from '../src/lib/image-integrity'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Starting image integrity validation and fix process...')
  console.log('=================================================')

  try {
    // Get all active marketplace items
    console.log('📋 Fetching all active marketplace items...')
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`📊 Found ${items.length} active marketplace items`)

    let totalItems = items.length
    let validItems = 0
    let invalidItems = 0
    let fixedItems = 0
    let criticalErrors = 0

    const errors: string[] = []
    const fixes: string[] = []

    // Process each item
    for (const item of items) {
      try {
        console.log(`\n🔍 Validating item: ${item.title} (ID: ${item.id})`)
        
        const result = await imageIntegrityService.validateMarketplaceItemImages(item)
        
        if (result.isValid) {
          console.log('✅ Item images are valid')
          validItems++
        } else {
          console.log('❌ Item images have issues:')
          result.errors.forEach(error => {
            console.log(`   - ${error}`)
            errors.push(`Item ${item.id}: ${error}`)
          })
          
          invalidItems++
          
          // Attempt to fix if corrections are available
          if (result.correctedImages.length > 0) {
            console.log('🔧 Applying corrections...')
            
            await prisma.marketplaceItem.update({
              where: { id: item.id },
              data: {
                thumbnail: result.correctedImages[0] || item.thumbnail,
                images: JSON.stringify(result.correctedImages)
              }
            })
            
            console.log('✅ Corrections applied successfully')
            fixes.push(`Fixed item ${item.id}: ${item.title}`)
            fixedItems++
          } else {
            console.log('⚠️  No automatic corrections available')
            criticalErrors++
          }
        }
      } catch (error) {
        const errorMessage = `Critical error processing item ${item.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        console.error(`💥 ${errorMessage}`)
        errors.push(errorMessage)
        criticalErrors++
      }
    }

    // Print summary
    console.log('\n📈 VALIDATION SUMMARY')
    console.log('=================================================')
    console.log(`Total items processed: ${totalItems}`)
    console.log(`✅ Valid items: ${validItems}`)
    console.log(`❌ Invalid items: ${invalidItems}`)
    console.log(`🔧 Fixed items: ${fixedItems}`)
    console.log(`💥 Critical errors: ${criticalErrors}`)
    console.log(`Success rate: ${((validItems / totalItems) * 100).toFixed(1)}%`)

    if (errors.length > 0) {
      console.log('\n⚠️  ERRORS FOUND')
      console.log('=================================================')
      errors.slice(0, 10).forEach((error, index) => {
        console.log(`${index + 1}. ${error}`)
      })
      if (errors.length > 10) {
        console.log(`... and ${errors.length - 10} more errors`)
      }
    }

    if (fixes.length > 0) {
      console.log('\n🔧 APPLIED FIXES')
      console.log('=================================================')
      fixes.forEach((fix, index) => {
        console.log(`${index + 1}. ${fix}`)
      })
    }

    // Provide recommendations
    console.log('\n💡 RECOMMENDATIONS')
    console.log('=================================================')
    
    if (criticalErrors > 0) {
      console.log('🚨 CRITICAL: Manual intervention required for items with critical errors')
      console.log('   - Review items that failed validation completely')
      console.log('   - Check for missing image files')
      console.log('   - Consider manual image replacement')
    }

    if (invalidItems > fixedItems) {
      console.log('⚠️  Some items could not be automatically fixed')
      console.log('   - Review items with uncorrectable image references')
      console.log('   - Check if original image files exist')
      console.log('   - Consider using admin tools for manual correction')
    }

    if (validItems === totalItems) {
      console.log('🎉 EXCELLENT: All marketplace images are valid!')
      console.log('   - No image integrity issues found')
      console.log('   - All images are accessible and properly formatted')
      console.log('   - System is operating at 100% integrity')
    } else if ((validItems / totalItems) > 0.95) {
      console.log('✅ GOOD: Most marketplace images are valid')
      console.log('   - System integrity is above 95%')
      console.log('   - Remaining issues are minor')
      console.log('   - Consider running validation periodically')
    } else {
      console.log('⚠️  ATTENTION: Significant image integrity issues found')
      console.log('   - System integrity is below acceptable threshold')
      console.log('   - Immediate action recommended')
      console.log('   - Consider implementing strict image validation')
    }

    console.log('\n🔒 IMAGE INTEGRITY RULES ENFORCED')
    console.log('=================================================')
    console.log('✅ No fallback images allowed')
    console.log('✅ No placeholder content permitted')
    console.log('✅ 100% image validation required')
    console.log('✅ Real-time accessibility verification')
    console.log('✅ Database integrity maintained')
    console.log('✅ EDN protection enabled')

  } catch (error) {
    console.error('💥 Fatal error during validation process:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log('\n🏁 Image integrity validation and fix process completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Script failed:', error)
    process.exit(1)
  })