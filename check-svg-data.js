const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkSVGData() {
  try {
    const item = await prisma.marketplaceItem.findFirst({
      select: {
        id: true,
        title: true,
        thumbnail: true
      }
    })

    if (item && item.thumbnail) {
      console.log('=== SVG Data Check ===')
      console.log(`Item ID: ${item.id}`)
      console.log(`Title: ${item.title}`)
      console.log(`Thumbnail starts with: ${item.thumbnail.substring(0, 100)}...`)
      
      // Check if it's a valid SVG
      if (item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
        const base64Data = item.thumbnail.split(',')[1]
        const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8')
        console.log('\n=== Decoded SVG Content ===')
        console.log(svgContent.substring(0, 500) + '...')
        
        // Check if it's a valid SVG
        if (svgContent.includes('<svg') && svgContent.includes('</svg>')) {
          console.log('\n✅ Valid SVG detected')
        } else {
          console.log('\n❌ Invalid SVG detected')
        }
      } else {
        console.log('\n❌ Not a base64 SVG')
      }
    } else {
      console.log('No item with thumbnail found')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSVGData()