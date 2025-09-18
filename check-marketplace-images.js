const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMarketplaceImages() {
  try {
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true,
        isNsfw: true,
        category: true,
        type: true
      },
      take: 10
    })

    console.log('=== Marketplace Items Image Check ===')
    console.log(`Found ${items.length} items\n`)

    items.forEach((item, index) => {
      console.log(`Item ${index + 1}:`)
      console.log(`  ID: ${item.id}`)
      console.log(`  Title: ${item.title}`)
      console.log(`  Category: ${item.category}`)
      console.log(`  Type: ${item.type}`)
      console.log(`  NSFW: ${item.isNsfw}`)
      console.log(`  Thumbnail: ${item.thumbnail ? item.thumbnail.substring(0, 100) + '...' : 'NULL'}`)
      console.log(`  Images: ${item.images ? JSON.parse(item.images).length + ' images' : 'NULL'}`)
      console.log('---')
    })

    // Check for items with null thumbnails
    const itemsWithoutThumbnails = await prisma.marketplaceItem.count({
      where: {
        thumbnail: null
      }
    })

    console.log(`\nItems without thumbnails: ${itemsWithoutThumbnails}`)

    // Check for items with null images
    const itemsWithoutImages = await prisma.marketplaceItem.count({
      where: {
        images: null
      }
    })

    console.log(`Items without images: ${itemsWithoutImages}`)

    // Check total items
    const totalItems = await prisma.marketplaceItem.count()
    console.log(`Total marketplace items: ${totalItems}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMarketplaceImages()