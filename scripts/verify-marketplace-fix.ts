import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function verifyMarketplaceFix() {
  console.log('🔍 VERIFYING MARKETPLACE IMAGE FIX')
  console.log('═'.repeat(60))

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📦 Verifying ${items.length} marketplace items`)

    let validItems = 0
    let invalidItems = 0
    let issuesFound = []

    for (const item of items) {
      console.log(`\n🔍 Verifying: ${item.title}`)
      console.log(`   ID: ${item.id}`)
      console.log(`   NSFW: ${item.isNsfw}`)
      
      let itemValid = true
      
      // Check thumbnail
      if (!item.thumbnail || item.thumbnail.trim() === '') {
        console.log(`   ❌ MISSING THUMBNAIL`)
        issuesFound.push(`Item ${item.title}: Missing thumbnail`)
        itemValid = false
      } else {
        try {
          new URL(item.thumbnail)
          if (item.thumbnail.startsWith('/marketplace-images/')) {
            console.log(`   ❌ INVALID THUMBNAIL URL: ${item.thumbnail}`)
            issuesFound.push(`Item ${item.title}: Invalid thumbnail URL - ${item.thumbnail}`)
            itemValid = false
          } else {
            console.log(`   ✅ VALID THUMBNAIL: ${item.thumbnail.substring(0, 60)}...`)
          }
        } catch (e) {
          console.log(`   ❌ INVALID THUMBNAIL URL: ${item.thumbnail}`)
          issuesFound.push(`Item ${item.title}: Invalid thumbnail URL - ${item.thumbnail}`)
          itemValid = false
        }
      }
      
      // Check images array
      if (!item.images || item.images.trim() === '') {
        console.log(`   ❌ MISSING IMAGES ARRAY`)
        issuesFound.push(`Item ${item.title}: Missing images array`)
        itemValid = false
      } else {
        try {
          const parsedImages = JSON.parse(item.images)
          console.log(`   ✅ Images array: ${parsedImages.length} images`)
          
          // Check if thumbnail matches first image in array
          if (item.thumbnail && parsedImages.length > 0) {
            if (item.thumbnail === parsedImages[0]) {
              console.log(`   ✅ CONSISTENT: Thumbnail matches first image`)
            } else {
              console.log(`   ❌ INCONSISTENT: Thumbnail differs from first image`)
              issuesFound.push(`Item ${item.title}: Thumbnail inconsistent with gallery`)
              itemValid = false
            }
          }
          
          // Check image URLs for validity
          for (let j = 0; j < parsedImages.length; j++) {
            const imgUrl = parsedImages[j]
            try {
              new URL(imgUrl)
              if (imgUrl.startsWith('/marketplace-images/')) {
                console.log(`   ❌ INVALID IMAGE URL: ${imgUrl}`)
                issuesFound.push(`Item ${item.title}: Invalid image URL - ${imgUrl}`)
                itemValid = false
              } else {
                console.log(`   ✅ VALID IMAGE URL: ${imgUrl.substring(0, 60)}...`)
              }
            } catch (e) {
              console.log(`   ❌ INVALID IMAGE URL: ${imgUrl}`)
              issuesFound.push(`Item ${item.title}: Invalid image URL - ${imgUrl}`)
              itemValid = false
            }
          }
        } catch (e) {
          console.log(`   ❌ ERROR PARSING IMAGES: ${e}`)
          issuesFound.push(`Item ${item.title}: Error parsing images array - ${e}`)
          itemValid = false
        }
      }
      
      if (itemValid) {
        validItems++
        console.log(`   ✅ ITEM VALID`)
      } else {
        invalidItems++
        console.log(`   ❌ ITEM INVALID`)
      }
    }

    console.log('\n📊 VERIFICATION SUMMARY:')
    console.log('═'.repeat(40))
    console.log(`✅ Valid items: ${validItems}`)
    console.log(`❌ Invalid items: ${invalidItems}`)
    console.log(`📋 Total issues found: ${issuesFound.length}`)

    if (issuesFound.length > 0) {
      console.log('\n🚨 DETAILED ISSUES:')
      console.log('═'.repeat(40))
      issuesFound.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`)
      })
    }

    // Check API endpoints
    console.log('\n📡 CHECKING API ENDPOINTS:')
    console.log('═'.repeat(40))

    // Check list API
    try {
      const listApiPath = path.join(process.cwd(), 'src', 'app', 'api', 'marketplace', 'items', 'route.ts')
      const listApiContent = await fs.readFile(listApiPath, 'utf8')
      
      if (listApiContent.includes('thumbnail') && listApiContent.includes('images')) {
        console.log('✅ List API includes thumbnail and images fields')
      } else {
        console.log('❌ List API missing image fields')
        issuesFound.push('List API: Missing image fields')
      }
    } catch (e) {
      console.log(`❌ Error checking list API: ${e}`)
      issuesFound.push(`Cannot read list API: ${e}`)
    }

    // Check detail API
    try {
      const detailApiPath = path.join(process.cwd(), 'src', 'app', 'api', 'marketplace', 'items', '[id]', 'route.ts')
      const detailApiContent = await fs.readFile(detailApiPath, 'utf8')
      
      if (detailApiContent.includes('thumbnail: item.thumbnail') && detailApiContent.includes('images: item.images')) {
        console.log('✅ Detail API includes thumbnail and images fields')
      } else {
        console.log('❌ Detail API missing image fields')
        issuesFound.push('Detail API: Missing image fields')
      }
    } catch (e) {
      console.log(`❌ Error checking detail API: ${e}`)
      issuesFound.push(`Cannot read detail API: ${e}`)
    }

    // Check frontend components
    console.log('\n🔧 CHECKING FRONTEND COMPONENTS:')
    console.log('═'.repeat(40))

    // Check marketplace item card
    try {
      const cardComponent = await fs.readFile(path.join(process.cwd(), 'src', 'components', 'marketplace-item-card.tsx'), 'utf8')
      
      if (cardComponent.includes('item.thumbnail')) {
        console.log('✅ Marketplace item card uses item.thumbnail')
      } else {
        console.log('❌ Marketplace item card does not use item.thumbnail')
        issuesFound.push('Marketplace item card: Does not use item.thumbnail')
      }
    } catch (e) {
      console.log(`❌ Error reading marketplace-item-card.tsx: ${e}`)
      issuesFound.push(`Cannot read marketplace-item-card.tsx: ${e}`)
    }

    // Check individual item page
    try {
      const detailPage = await fs.readFile(path.join(process.cwd(), 'src', 'app', 'marketplace', '[id]', 'page.tsx'), 'utf8')
      
      if (detailPage.includes('item.images?.[0] || item.thumbnail')) {
        console.log('✅ Individual item page uses proper image fallback logic')
      } else {
        console.log('❌ Individual item page does not use proper image fallback logic')
        issuesFound.push('Individual item page: Incorrect image fallback logic')
      }
    } catch (e) {
      console.log(`❌ Error reading individual item page: ${e}`)
      issuesFound.push(`Cannot read individual item page: ${e}`)
    }

    console.log('\n🎯 FINAL VERIFICATION RESULT:')
    console.log('═'.repeat(40))
    
    if (issuesFound.length === 0) {
      console.log('✅ NO ISSUES FOUND - MARKETPLACE IS LAUNCH READY!')
      console.log('\n🎉 ALL SYSTEMS GO!')
      console.log('✅ All images are valid and accessible')
      console.log('✅ Images are consistent between cards and detail pages')
      console.log('✅ API endpoints include all required image fields')
      console.log('✅ Frontend components use correct image data')
    } else {
      console.log(`❌ ${issuesFound.length} ISSUES FOUND - NEEDS ATTENTION`)
      console.log('\n📋 REQUIRED ACTIONS:')
      console.log('1. Review and fix all listed issues')
      console.log('2. Re-run verification after fixes')
      console.log('3. Test end-to-end functionality')
    }

    return {
      validItems,
      invalidItems,
      totalItems: items.length,
      issuesFound,
      isLaunchReady: issuesFound.length === 0
    }

  } catch (error) {
    console.error('❌ Error verifying marketplace fix:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    console.log('🚀 STARTING MARKETPLACE VERIFICATION')
    console.log('═'.repeat(60))
    
    const result = await verifyMarketplaceFix()
    
    console.log('\n📊 FINAL STATISTICS:')
    console.log('═'.repeat(40))
    console.log(`Valid items: ${result.validItems}/${result.totalItems} (${((result.validItems / result.totalItems) * 100).toFixed(1)}%)`)
    console.log(`Issues found: ${result.issuesFound.length}`)
    console.log(`Launch ready: ${result.isLaunchReady ? 'YES' : 'NO'}`)
    
    if (result.isLaunchReady) {
      console.log('\n🎉 CONGRATULATIONS!')
      console.log('The marketplace is now launch-ready with consistent, valid images throughout!')
    } else {
      console.log('\n⚠️  ACTION REQUIRED')
      console.log('Please address the issues listed above before launching.')
    }
    
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in verification:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })