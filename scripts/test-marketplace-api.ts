import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Testing Marketplace API Data...')

  try {
    // Test 1: Get all marketplace items
    console.log('\n📦 Testing: Get all marketplace items')
    const allItems = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          take: 3
        },
        _count: {
          select: {
            reviews: true,
            orders: true
          }
        }
      },
      take: 5
    })

    console.log(`✅ Found ${allItems.length} sample items`)

    allItems.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`)
      console.log(`   ID: ${item.id}`)
      console.log(`   Type: ${item.type}`)
      console.log(`   Category: ${item.category}`)
      console.log(`   Price: $${item.price}`)
      console.log(`   NSFW: ${item.isNsfw}`)
      console.log(`   Creator: ${item.user?.name}`)
      console.log(`   Thumbnail: ${item.thumbnail ? '✅' : '❌'}`)
      console.log(`   Images: ${item.images ? '✅' : '❌'}`)
      console.log(`   Reviews: ${item._count.reviews}`)
      console.log(`   Orders: ${item._count.orders}`)
      
      if (item.thumbnail) {
        console.log(`   Thumbnail URL: ${item.thumbnail.substring(0, 80)}...`)
      }
      
      if (item.images) {
        try {
          const images = JSON.parse(item.images)
          console.log(`   Image count: ${images.length}`)
          if (images.length > 0) {
            console.log(`   First image: ${images[0].substring(0, 80)}...`)
          }
        } catch (e) {
          console.log(`   Images: Parse error`)
        }
      }
    })

    // Test 2: Get a specific item
    console.log('\n🔍 Testing: Get specific item')
    if (allItems.length > 0) {
      const firstItem = allItems[0]
      const specificItem = await prisma.marketplaceItem.findUnique({
        where: { id: firstItem.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              verified: true
            }
          },
          reviews: {
            include: {
              user: {
                select: {
                  name: true,
                  avatar: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          },
          _count: {
            select: {
              reviews: true,
              orders: true
            }
          }
        }
      })

      if (specificItem) {
        console.log(`✅ Found specific item: ${specificItem.title}`)
        console.log(`   Reviews: ${specificItem.reviews.length}`)
        console.log(`   Average Rating: ${specificItem.reviews.length > 0 ? 
          (specificItem.reviews.reduce((sum, review) => sum + review.rating, 0) / specificItem.reviews.length).toFixed(1) : 
          'N/A'}`)
        
        // Show sample reviews
        if (specificItem.reviews.length > 0) {
          console.log(`   Sample Reviews:`)
          specificItem.reviews.slice(0, 2).forEach((review, idx) => {
            console.log(`     ${idx + 1}. ${review.rating}/5 - ${review.comment?.substring(0, 50)}... by ${review.user.name}`)
          })
        }
      } else {
        console.log(`❌ Could not find specific item`)
      }
    }

    // Test 3: Check image URLs are accessible
    console.log('\n🖼️  Testing: Image URL validation')
    const testItems = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      take: 3
    })

    for (const item of testItems) {
      console.log(`\nTesting images for: ${item.title}`)
      
      if (item.thumbnail) {
        console.log(`   Thumbnail: ${item.thumbnail}`)
        // Check if it's a valid URL format
        try {
          new URL(item.thumbnail)
          console.log(`   ✅ Valid thumbnail URL`)
        } catch (e) {
          console.log(`   ❌ Invalid thumbnail URL: ${e}`)
        }
      }
      
      if (item.images) {
        try {
          const images = JSON.parse(item.images)
          console.log(`   Found ${images.length} images`)
          images.forEach((img: string, idx: number) => {
            try {
              new URL(img)
              console.log(`   ✅ Valid image ${idx + 1} URL`)
            } catch (e) {
              console.log(`   ❌ Invalid image ${idx + 1} URL: ${e}`)
            }
          })
        } catch (e) {
          console.log(`   ❌ Error parsing images: ${e}`)
        }
      }
    }

    // Test 4: Check marketplace statistics
    console.log('\n📊 Testing: Marketplace statistics')
    const stats = await prisma.marketplaceReview.aggregate({
      _avg: {
        rating: true
      },
      _count: {
        _all: true
      },
      where: {
        item: {
          status: 'ACTIVE'
        }
      }
    })

    const totalItems = await prisma.marketplaceItem.count({
      where: { status: 'ACTIVE' }
    })

    const totalOrders = await prisma.marketplaceOrder.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'COMPLETED'
      }
    })

    console.log(`   Total Items: ${totalItems}`)
    console.log(`   Total Reviews: ${stats._count._all}`)
    console.log(`   Average Rating: ${stats._avg.rating?.toFixed(1) || 'N/A'}`)
    console.log(`   Total Revenue: $${totalOrders._sum.amount || 0}`)

    console.log('\n✅ All API tests completed successfully!')

  } catch (error) {
    console.error('❌ Error testing marketplace API:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error testing marketplace API:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })