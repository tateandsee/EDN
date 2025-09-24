import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Testing marketplace image data...')

  try {
    // Get first NSFW item
    const item = await prisma.marketplaceItem.findFirst({
      where: { 
        category: 'NSFW',
        isNsfw: true 
      },
      include: {
        user: true
      }
    })

    if (!item) {
      console.log('❌ No NSFW items found')
      return
    }

    console.log('📦 Found NSFW item:', {
      id: item.id,
      title: item.title,
      hasThumbnail: !!item.thumbnail,
      thumbnailLength: item.thumbnail?.length || 0,
      thumbnailPrefix: item.thumbnail?.substring(0, 50) + '...',
      hasImages: !!item.images,
      isNsfw: item.isNsfw
    })

    // Test if thumbnail is valid base64 SVG
    if (item.thumbnail) {
      console.log('🖼️ Testing thumbnail validation...')
      
      if (item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
        console.log('✅ Thumbnail is a base64-encoded SVG')
        
        try {
          const base64Data = item.thumbnail.split(',')[1]
          const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8')
          
          console.log('🔍 SVG validation:', {
            isValid: svgContent.includes('<svg') && svgContent.includes('</svg>'),
            length: svgContent.length,
            preview: svgContent.substring(0, 100) + '...'
          })
          
          // Check for common SVG issues
          const hasXmlDeclaration = svgContent.includes('<?xml')
          const hasDoctype = svgContent.includes('<!DOCTYPE')
          const hasForeignObject = svgContent.includes('<foreignObject')
          const hasScript = svgContent.includes('<script')
          
          console.log('🔍 SVG security check:', {
            hasXmlDeclaration,
            hasDoctype,
            hasForeignObject,
            hasScript,
            isClean: !hasForeignObject && !hasScript
          })
          
        } catch (error) {
          console.error('❌ Error decoding thumbnail:', error)
        }
      } else {
        console.log('❌ Thumbnail is not a base64-encoded SVG')
        console.log('🔍 Thumbnail prefix:', item.thumbnail.substring(0, 100))
      }
    }

    // Test images array
    if (item.images) {
      try {
        const images = JSON.parse(item.images)
        console.log('📸 Images array:', {
          count: images.length,
          firstImagePrefix: images[0]?.substring(0, 50) + '...'
        })
        
        if (images[0]?.startsWith('data:image/svg+xml;base64,')) {
          console.log('✅ First image is a base64-encoded SVG')
        }
      } catch (error) {
        console.error('❌ Error parsing images array:', error)
      }
    }

  } catch (error) {
    console.error('❌ Error testing marketplace images:', error)
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