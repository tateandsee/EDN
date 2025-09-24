import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 INVESTIGATING MARKETPLACE IMAGE ISSUES')
  console.log('═'.repeat(60))

  try {
    // Get all marketplace items and analyze their image data
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📦 Found ${items.length} marketplace items`)

    let issuesFound = []
    let consistentImages = 0
    let inconsistentImages = 0
    let missingImages = 0

    console.log('\n🖼️  ANALYZING IMAGE DATA STRUCTURE:')
    console.log('═'.repeat(40))

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      console.log(`\n${i + 1}. ${item.title}`)
      console.log(`   ID: ${item.id}`)
      console.log(`   NSFW: ${item.isNsfw}`)
      
      // Check thumbnail
      if (!item.thumbnail || item.thumbnail.trim() === '') {
        console.log(`   ❌ MISSING THUMBNAIL`)
        missingImages++
        issuesFound.push(`Item ${item.title}: Missing thumbnail`)
      } else {
        console.log(`   ✅ Thumbnail: ${item.thumbnail.substring(0, 60)}...`)
      }
      
      // Check images array
      if (!item.images || item.images.trim() === '') {
        console.log(`   ❌ MISSING IMAGES ARRAY`)
        missingImages++
        issuesFound.push(`Item ${item.title}: Missing images array`)
      } else {
        try {
          const parsedImages = JSON.parse(item.images)
          console.log(`   ✅ Images array: ${parsedImages.length} images`)
          
          // Check if thumbnail matches first image in array
          if (item.thumbnail && parsedImages.length > 0) {
            if (item.thumbnail === parsedImages[0]) {
              console.log(`   ✅ CONSISTENT: Thumbnail matches first image`)
              consistentImages++
            } else {
              console.log(`   ❌ INCONSISTENT: Thumbnail differs from first image`)
              console.log(`      Thumbnail: ${item.thumbnail.substring(0, 60)}...`)
              console.log(`      First image: ${parsedImages[0].substring(0, 60)}...`)
              inconsistentImages++
              issuesFound.push(`Item ${item.title}: Thumbnail inconsistent with gallery`)
            }
          }
          
          // Check image URLs for validity
          for (let j = 0; j < parsedImages.length; j++) {
            const imgUrl = parsedImages[j]
            try {
              new URL(imgUrl)
              // Check if it's a placeholder or actual generated image
              if (imgUrl.includes('ui-avatars.com') || imgUrl.includes('placeholder')) {
                console.log(`   ⚠️  PLACEHOLDER IMAGE: ${imgUrl.substring(0, 60)}...`)
                issuesFound.push(`Item ${item.title}: Using placeholder image`)
              } else if (imgUrl.includes('unsplash.com') || imgUrl.includes('picsum.photos')) {
                console.log(`   ⚠️  STOCK PHOTO: ${imgUrl.substring(0, 60)}...`)
                issuesFound.push(`Item ${item.title}: Using stock photo instead of AI generated`)
              } else {
                console.log(`   ✅ VALID IMAGE URL: ${imgUrl.substring(0, 60)}...`)
              }
            } catch (e) {
              console.log(`   ❌ INVALID URL: ${imgUrl}`)
              issuesFound.push(`Item ${item.title}: Invalid image URL - ${imgUrl}`)
            }
          }
        } catch (e) {
          console.log(`   ❌ ERROR PARSING IMAGES: ${e}`)
          issuesFound.push(`Item ${item.title}: Error parsing images array - ${e}`)
        }
      }
    }

    console.log('\n📊 IMAGE CONSISTENCY SUMMARY:')
    console.log('═'.repeat(40))
    console.log(`✅ Consistent images: ${consistentImages}`)
    console.log(`❌ Inconsistent images: ${inconsistentImages}`)
    console.log(`❌ Missing images: ${missingImages}`)
    console.log(`📋 Total issues found: ${issuesFound.length}`)

    if (issuesFound.length > 0) {
      console.log('\n🚨 DETAILED ISSUES:')
      console.log('═'.repeat(40))
      issuesFound.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`)
      })
    }

    // Check frontend components for image handling issues
    console.log('\n🔧 CHECKING FRONTEND COMPONENTS:')
    console.log('═'.repeat(40))

    // Check marketplace item card
    console.log('\n📱 MARKETPLACE ITEM CARD:')
    try {
      const cardComponent = await import('fs').then(fs => 
        fs.readFileSync('./src/components/marketplace-item-card.tsx', 'utf8')
      )
      
      if (cardComponent.includes('item.thumbnail')) {
        console.log('✅ Uses item.thumbnail for card display')
      } else {
        console.log('❌ Does not use item.thumbnail for card display')
        issuesFound.push('Marketplace item card: Does not use item.thumbnail')
      }
      
      if (cardComponent.includes('AIModelProtection')) {
        console.log('⚠️  Still uses AIModelProtection (may block images)')
        issuesFound.push('Marketplace item card: Still uses restrictive AIModelProtection')
      }
    } catch (e) {
      console.log(`❌ Error reading marketplace-item-card.tsx: ${e}`)
      issuesFound.push('Cannot read marketplace-item-card.tsx')
    }

    // Check individual item page
    console.log('\n📄 INDIVIDUAL ITEM PAGE:')
    try {
      const detailPage = await import('fs').then(fs => 
        fs.readFileSync('./src/app/marketplace/[id]/page.tsx', 'utf8')
      )
      
      if (detailPage.includes('item.images?.[0] || item.thumbnail')) {
        console.log('✅ Uses item.images[0] || item.thumbnail for detail page')
      } else {
        console.log('❌ Does not use proper image fallback logic')
        issuesFound.push('Individual item page: Incorrect image fallback logic')
      }
      
      if (detailPage.includes('AIModelProtection')) {
        console.log('⚠️  Still uses AIModelProtection (may block images)')
        issuesFound.push('Individual item page: Still uses restrictive AIModelProtection')
      }
    } catch (e) {
      console.log(`❌ Error reading individual item page: ${e}`)
      issuesFound.push('Cannot read individual item page')
    }

    // Check API endpoints
    console.log('\n📡 CHECKING API ENDPOINTS:')
    try {
      const listApi = await import('fs').then(fs => 
        fs.readFileSync('./src/app/api/marketplace/items/route.ts', 'utf8')
      )
      
      if (listApi.includes('thumbnail') && listApi.includes('images')) {
        console.log('✅ List API includes thumbnail and images fields')
      } else {
        console.log('❌ List API missing image fields')
        issuesFound.push('List API: Missing image fields')
      }
    } catch (e) {
      console.log(`❌ Error reading list API: ${e}`)
      issuesFound.push('Cannot read list API')
    }

    try {
      const detailApi = await import('fs').then(fs => 
        fs.readFileSync('./src/app/api/marketplace/items/[id]/route.ts', 'utf8')
      )
      
      if (detailApi.includes('thumbnail') && detailApi.includes('images')) {
        console.log('✅ Detail API includes thumbnail and images fields')
      } else {
        console.log('❌ Detail API missing image fields')
        issuesFound.push('Detail API: Missing image fields')
      }
    } catch (e) {
      console.log(`❌ Error reading detail API: ${e}`)
      issuesFound.push('Cannot read detail API')
    }

    console.log('\n🎯 FINAL ASSESSMENT:')
    console.log('═'.repeat(40))
    if (issuesFound.length === 0) {
      console.log('✅ NO ISSUES FOUND - MARKETPLACE IS LAUNCH READY')
    } else {
      console.log(`❌ ${issuesFound.length} ISSUES FOUND - NEEDS FIXES`)
      console.log('\n📋 REQUIRED ACTIONS:')
      console.log('1. Generate proper AI model images using mandated prompts')
      console.log('2. Ensure thumbnail matches first image in gallery')
      console.log('3. Remove any remaining image protection that blocks display')
      console.log('4. Verify all images are accessible and consistent')
      console.log('5. Test end-to-end functionality')
    }

    return {
      issuesFound,
      consistentImages,
      inconsistentImages,
      missingImages,
      totalItems: items.length
    }

  } catch (error) {
    console.error('❌ Error investigating image issues:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error investigating image issues:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })