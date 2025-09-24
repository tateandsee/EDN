const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function finalVerification() {
  try {
    console.log('=== Final Verification of Marketplace Images ===')
    
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true,
        isNsfw: true,
        category: true
      },
      take: 5
    })

    console.log(`\nChecking ${items.length} sample items...\n`)

    let validThumbnails = 0
    let validImages = 0
    let svgCount = 0

    items.forEach((item, index) => {
      console.log(`Item ${index + 1}: ${item.title}`)
      
      // Check thumbnail
      if (item.thumbnail) {
        const isDataUrl = item.thumbnail.startsWith('data:')
        const isSvg = item.thumbnail.includes('svg')
        
        if (isDataUrl && isSvg) {
          validThumbnails++
          svgCount++
        }
        
        console.log(`  Thumbnail: ${isDataUrl ? 'Data URL' : 'External URL'}, ${isSvg ? 'SVG' : 'Other format'}`)
      } else {
        console.log(`  Thumbnail: MISSING`)
      }
      
      // Check images array
      if (item.images) {
        try {
          const parsedImages = JSON.parse(item.images)
          if (parsedImages.length > 0) {
            const firstImage = parsedImages[0]
            const isDataUrl = firstImage.startsWith('data:')
            const isSvg = firstImage.includes('svg')
            
            if (isDataUrl && isSvg) {
              validImages++
              if (!item.thumbnail || !item.thumbnail.includes('svg')) {
                svgCount++
              }
            }
            
            console.log(`  Images: ${parsedImages.length} images, first is ${isDataUrl ? 'Data URL' : 'External URL'}, ${isSvg ? 'SVG' : 'Other format'}`)
          } else {
            console.log(`  Images: Empty array`)
          }
        } catch (error) {
          console.log(`  Images: Invalid JSON`)
        }
      } else {
        console.log(`  Images: MISSING`)
      }
      
      console.log('---')
    })

    // Get totals
    const totalItems = await prisma.marketplaceItem.count()
    const itemsWithThumbnails = await prisma.marketplaceItem.count({
      where: {
        thumbnail: {
          not: null
        }
      }
    })
    const itemsWithImages = await prisma.marketplaceItem.count({
      where: {
        images: {
          not: null
        }
      }
    })

    console.log('\n=== Summary ===')
    console.log(`Total marketplace items: ${totalItems}`)
    console.log(`Items with thumbnails: ${itemsWithThumbnails}`)
    console.log(`Items with images: ${itemsWithImages}`)
    console.log(`Sample valid thumbnails: ${validThumbnails}/${items.length}`)
    console.log(`Sample valid images: ${validImages}/${items.length}`)
    console.log(`Total SVG images detected: ${svgCount}`)

    if (validThumbnails === items.length && validImages === items.length) {
      console.log('\n✅ All sample images are properly formatted as SVG data URLs')
      console.log('✅ The cache-busting fix should resolve image display issues')
    } else {
      console.log('\n❌ Some images may still have issues')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

finalVerification()