const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMarketplace() {
  try {
    const items = await prisma.marketplaceItem.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Total marketplace items: ${items.length}`)
    console.log('\nFirst 5 items:')
    items.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} - $${item.price} - ${item.category}`)
    })

    const categories = await prisma.marketplaceItem.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    })

    console.log('\nCategories:')
    categories.forEach(cat => {
      console.log(`${cat.category}: ${cat._count.category} items`)
    })

    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

checkMarketplace()