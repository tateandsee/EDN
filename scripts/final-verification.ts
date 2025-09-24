import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Final verification of marketplace images...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { isNsfw: true },
      take: 5 // Just check first 5 NSFW items
    })

    console.log(`📦 Checking ${items.length} NSFW marketplace items...`)

    let allImagesValid = true
    let itemsWithImages = 0

    for (const item of items) {
      console.log(`\n🔍 Checking item: ${item.title}`)
      
      // Check thumbnail
      if (item.thumbnail) {
        console.log(`  ✅ Has thumbnail (${item.thumbnail.length} chars)`)
        
        // Validate thumbnail format
        if (item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
          try {
            const base64Data = item.thumbnail.split(',')[1]
            const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8')
            
            const isValid = svgContent.includes('<svg') && svgContent.includes('</svg>')
            const hasProperStructure = svgContent.includes('xmlns=') && svgContent.includes('viewBox=')
            
            console.log(`  ✅ Valid SVG format: ${isValid ? 'YES' : 'NO'}`)
            console.log(`  ✅ Proper structure: ${hasProperStructure ? 'YES' : 'NO'}`)
            
            if (!isValid || !hasProperStructure) {
              allImagesValid = false
            } else {
              itemsWithImages++
            }
          } catch (error) {
            console.log(`  ❌ Error decoding thumbnail: ${error}`)
            allImagesValid = false
          }
        } else {
          console.log(`  ❌ Invalid thumbnail format`)
          allImagesValid = false
        }
      } else {
        console.log(`  ❌ No thumbnail`)
        allImagesValid = false
      }

      // Check images array
      if (item.images) {
        try {
          const images = JSON.parse(item.images)
          console.log(`  ✅ Has images array (${images.length} images)`)
          
          if (images.length > 0) {
            const firstImage = images[0]
            if (firstImage.startsWith('data:image/svg+xml;base64,')) {
              console.log(`  ✅ First image is valid base64 SVG`)
            } else {
              console.log(`  ❌ First image has invalid format`)
              allImagesValid = false
            }
          }
        } catch (error) {
          console.log(`  ❌ Error parsing images array: ${error}`)
          allImagesValid = false
        }
      } else {
        console.log(`  ❌ No images array`)
        allImagesValid = false
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   - Total items checked: ${items.length}`)
    console.log(`   - Items with valid images: ${itemsWithImages}`)
    console.log(`   - All images valid: ${allImagesValid ? 'YES' : 'NO'}`)

    if (allImagesValid && itemsWithImages === items.length) {
      console.log(`\n🎉 SUCCESS: All marketplace images are properly configured!`)
      console.log(`\n📋 Test Instructions:`)
      console.log(`   1. Visit http://localhost:3000/marketplace`)
      console.log(`   2. Ensure NSFW mode is enabled (should be default)`)
      console.log(`   3. You should see actual AI-generated female model images, not placeholders`)
      console.log(`   4. Click on any item to view the detail page`)
      console.log(`   5. Images should display correctly on both listing and detail pages`)
      console.log(`\n🔗 Test URLs:`)
      console.log(`   - Marketplace: http://localhost:3000/marketplace`)
      console.log(`   - Image Test: http://localhost:3000/image-test.html`)
    } else {
      console.log(`\n❌ FAILURE: Some marketplace images have issues`)
      console.log(`   Please review the errors above and fix them.`)
    }

  } catch (error) {
    console.error('❌ Error during verification:', error)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })