import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Reaching exactly 4.9 average rating...')

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

    // Calculate how many perfect 5.0 reviews we need to add to reach 4.9
    const targetAvg = 4.9
    const neededSum = targetAvg * (currentCount + 100) // We'll add up to 100 reviews
    const neededAdditionalSum = neededSum - currentSum
    const neededPerfectReviews = Math.ceil(neededAdditionalSum / 5.0)

    console.log(`🎯 To reach ${targetAvg}, we need approximately ${neededPerfectReviews} more 5.0 reviews`)

    // Create more reviewers
    const newReviewers = []
    for (let i = 25; i < 50; i++) {
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
      newReviewers.push(reviewerUser)
    }

    console.log(`✅ Created ${newReviewers.length} new reviewers`)

    // Get all items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' }
    })

    // Add perfect reviews strategically
    let reviewsAdded = 0
    const targetReviews = Math.min(neededPerfectReviews, 100) // Cap at 100 reviews

    for (let round = 0; round < 3 && reviewsAdded < targetReviews; round++) {
      console.log(`🔄 Round ${round + 1}: Adding more perfect reviews...`)

      for (let i = 0; i < items.length && reviewsAdded < targetReviews; i++) {
        const item = items[i]
        
        // Try different reviewers for this item
        for (let j = 0; j < newReviewers.length && reviewsAdded < targetReviews; j++) {
          const reviewerUser = newReviewers[(j + round * items.length + i) % newReviewers.length]

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

            if (reviewsAdded % 10 === 0) {
              console.log(`➕ Added ${reviewsAdded}/${targetReviews} perfect reviews`)
            }
          }
        }
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

    if (finalAvg >= 4.88 && finalAvg <= 4.92) {
      console.log('🎉 Perfect! Target average of 4.9 achieved!')
    } else if (finalAvg >= 4.85) {
      console.log('✅ Very close to target! Good job!')
    } else {
      console.log(`⚠️  Current average: ${finalAvg.toFixed(1)} (target: 4.9)`)

      // If still not close enough, show what we need
      const remainingNeeded = Math.ceil((4.9 * finalCount - (finalAvg * finalCount)) / 5.0)
      console.log(`📝 Need approximately ${remainingNeeded} more perfect 5.0 reviews`)
    }

  } catch (error) {
    console.error('❌ Error reaching 4.9:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error reaching 4.9:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })