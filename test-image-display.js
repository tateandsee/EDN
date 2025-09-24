const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testImageDisplay() {
  try {
    // Get a sample marketplace item
    const item = await prisma.marketplaceItem.findFirst({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true
      }
    })

    if (item) {
      console.log('=== Testing Image Display ===')
      console.log(`Item ID: ${item.id}`)
      console.log(`Title: ${item.title}`)
      
      // Test thumbnail
      if (item.thumbnail) {
        console.log('\n--- Thumbnail Test ---')
        console.log(`Has thumbnail: YES`)
        console.log(`Is data URL: ${item.thumbnail.startsWith('data:')}`)
        console.log(`Is SVG: ${item.thumbnail.includes('svg')}`)
        
        // Test the cache-busting fix
        const cacheBust = Date.now()
        const getCacheBustedUrl = (url) => {
          if (url.startsWith('data:')) {
            return url
          }
          return url.includes('?') ? `${url}&_cb=${cacheBust}` : `${url}?_cb=${cacheBust}`
        }
        
        const processedUrl = getCacheBustedUrl(item.thumbnail)
        console.log(`Original URL length: ${item.thumbnail.length}`)
        console.log(`Processed URL length: ${processedUrl.length}`)
        console.log(`URLs match: ${item.thumbnail === processedUrl}`)
      }
      
      // Test images array
      if (item.images) {
        const parsedImages = JSON.parse(item.images)
        console.log('\n--- Images Array Test ---')
        console.log(`Number of images: ${parsedImages.length}`)
        if (parsedImages.length > 0) {
          console.log(`First image is data URL: ${parsedImages[0].startsWith('data:')}`)
          console.log(`First image is SVG: ${parsedImages[0].includes('svg')}`)
        }
      }
    } else {
      console.log('No marketplace items found')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testImageDisplay()