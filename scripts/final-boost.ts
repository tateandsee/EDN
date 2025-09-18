import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Final boost to reach exactly 4.9...')

  try {
    // Get current statistics
    const currentStats = await prisma.marketplaceReview.aggregate({
      _avg: {
        rating: true
      },
      _count: {
        _all: true
      },
      _sum: {
        rating: true
      },
      where: {
        item: {
          status: 'ACTIVE'
        }
      }
    })

    const currentAvg = currentStats._avg.rating || 0
    const currentCount = currentStats._count._all
    const currentSum = currentStats._sum.rating || 0

    console.log(`📊 Current stats:`)
    console.log(`   - Average: ${currentAvg.toFixed(1)}`)
    console.log(`   - Count: ${currentCount}`)
    console.log(`   - Sum: ${currentSum}`)

    // Calculate exactly how many 5.0 reviews we need
    const targetAvg = 4.9
    const neededSum = targetAvg * currentCount
    const deficit = neededSum - currentSum
    const neededPerfectReviews = Math.ceil(deficit / 5.0)

    console.log(`🎯 Need ${neededPerfectReviews} more 5.0 reviews to reach exactly ${targetAvg}`)

    // Create final batch of reviewers
    const finalReviewers = []
    for (let i = 50; i < 65; i++) {
      const email = `marketplace-reviewer-${i + 1}@edn.com`
      let reviewerUser = await prisma.user.findFirst({
        where: { email }
      })

      if (!reviewerUser) {
        reviewerUser = await prisma.user.create({
          data: {
            name: `Marketplace Reviewer ${i + 1}`,
            email,
            role: 'CREATOR',
            verified: true,
            isPaidMember: true
          }
        })
      }
      finalReviewers.push(reviewerUser)
    }

    console.log(`✅ Created ${finalReviewers.length} final reviewers`)

    // Get all items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Add the exact number of perfect reviews needed
    let reviewsAdded = 0

    for (let i = 0; i < items.length && reviewsAdded < neededPerfectReviews; i++) {
      const item = items[i]
      const reviewerUser = finalReviewers[reviewsAdded % finalReviewers.length]

      // Check if this combination already exists
      const existingReview = await prisma.marketplaceReview.findFirst({
        where: {
          userId: reviewerUser.id,
          itemId: item.id
        }
      })

      if (!existingReview) {
        await prisma.marketplaceReview.create({
          data: {
            userId: reviewerUser.id,
            itemId: item.id,
            rating: 5.0,
            comment: 'Absolutely perfect! Exceptional quality and stunning artistry!'
          }
        })
        reviewsAdded++
        console.log(`➕ Added perfect review ${reviewsAdded}/${neededPerfectReviews}`)
      }
    }

    // Calculate final statistics
    const finalStats = await prisma.marketplaceReview.aggregate({
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

    const finalAvg = finalStats._avg.rating || 0
    const finalCount = finalStats._count._all

    console.log(`\n📊 Final Statistics:`)
    console.log(`   - Average Rating: ${finalAvg.toFixed(1)}`)
    console.log(`   - Total Reviews: ${finalCount}`)
    console.log(`   - Reviews Added: ${reviewsAdded}`)

    if (finalAvg >= 4.89 && finalAvg <= 4.91) {
      console.log('🎉 Perfect! Target average of 4.9 achieved!')
    } else if (finalAvg >= 4.88 && finalAvg <= 4.92) {
      console.log('✅ Excellent! Very close to target 4.9!')
    } else {
      console.log(`📊 Current average: ${finalAvg.toFixed(1)} (target: 4.9)`)
    }

    // Show item-level averages
    console.log(`\n📈 Sample item averages:`)
    const sampleItems = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      take: 5,
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    for (const item of sampleItems) {
      const itemReviews = item.reviews
      const itemAvg = itemReviews.reduce((sum, review) => sum + review.rating, 0) / itemReviews.length
      console.log(`   - ${item.title.substring(0, 30)}...: ${itemAvg.toFixed(1)} (${itemReviews.length} reviews)`)
    }

  } catch (error) {
    console.error('❌ Error in final boost:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error in final boost:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })