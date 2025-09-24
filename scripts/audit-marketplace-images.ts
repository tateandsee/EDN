import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Auditing Marketplace Images...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`\n📦 Found ${items.length} marketplace items`)

    let itemsWithImages = 0
    let itemsWithoutImages = 0
    let itemsWithThumbnailOnly = 0
    let itemsWithFullImages = 0

    console.log('\n📊 Image Audit Results:')
    console.log('═'.repeat(60))

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      const hasThumbnail = item.thumbnail && item.thumbnail.trim() !== ''
      const hasImages = item.images && item.images.trim() !== ''
      
      let parsedImages = []
      if (hasImages) {
        try {
          parsedImages = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
        } catch (e) {
          console.log(`❌ Error parsing images for item ${item.id}: ${e}`)
        }
      }

      console.log(`\n${i + 1}. ${item.title}`)
      console.log(`   ID: ${item.id}`)
      console.log(`   Type: ${item.type}`)
      console.log(`   Category: ${item.category}`)
      console.log(`   NSFW: ${item.isNsfw}`)
      console.log(`   Thumbnail: ${hasThumbnail ? '✅' : '❌'} ${item.thumbnail || 'None'}`)
      console.log(`   Images: ${hasImages ? '✅' : '❌'} ${parsedImages.length} images`)
      
      if (hasImages) {
        parsedImages.forEach((img, idx) => {
          console.log(`     ${idx + 1}. ${img}`)
        })
      }

      // Count statistics
      if (hasThumbnail || hasImages) {
        itemsWithImages++
        if (hasThumbnail && !hasImages) {
          itemsWithThumbnailOnly++
        } else if (hasImages && parsedImages.length > 0) {
          itemsWithFullImages++
        }
      } else {
        itemsWithoutImages++
      }
    }

    console.log('\n📈 Summary Statistics:')
    console.log('═'.repeat(40))
    console.log(`Total Items: ${items.length}`)
    console.log(`Items With Any Images: ${itemsWithImages}`)
    console.log(`Items Without Images: ${itemsWithoutImages}`)
    console.log(`Items With Thumbnail Only: ${itemsWithThumbnailOnly}`)
    console.log(`Items With Full Images: ${itemsWithFullImages}`)

    if (itemsWithoutImages > 0) {
      console.log(`\n⚠️  ${itemsWithoutImages} items have no images at all!`)
    }

    if (itemsWithThumbnailOnly > 0) {
      console.log(`\n⚠️  ${itemsWithThumbnailOnly} items only have thumbnails, no full images`)
    }

    // Check for placeholder/default images
    console.log('\n🔍 Checking for placeholder images...')
    const placeholderPatterns = ['/placeholder', 'placeholder.jpg', 'default', 'no-image']
    
    for (const item of items) {
      const checkImage = (img: string) => {
        return placeholderPatterns.some(pattern => img.toLowerCase().includes(pattern))
      }

      if (item.thumbnail && checkImage(item.thumbnail)) {
        console.log(`❌ Item "${item.title}" has placeholder thumbnail: ${item.thumbnail}`)
      }

      if (item.images) {
        try {
          const images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
          images.forEach((img: string) => {
            if (checkImage(img)) {
              console.log(`❌ Item "${item.title}" has placeholder image: ${img}`)
            }
          })
        } catch (e) {
          // Skip parsing errors
        }
      }
    }

    console.log('\n✅ Image audit complete!')

  } catch (error) {
    console.error('❌ Error auditing marketplace images:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error auditing marketplace images:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })