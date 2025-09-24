import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Reaching exact 4.9 average...')

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
    console.log(`   - Average: ${currentAvg.toFixed(3)}`)
    console.log(`   - Count: ${currentCount}`)
    console.log(`   - Sum: ${currentSum}`)

    // Calculate exactly what we need for 4.9
    const targetAvg = 4.9
    const targetSum = targetAvg * currentCount
    const deficit = targetSum - currentSum
    
    console.log(`🎯 Target sum for 4.9: ${targetSum.toFixed(1)}`)
    console.log(`🎯 Current deficit: ${deficit.toFixed(1)}`)
    
    // Calculate how many 5.0 reviews we need
    const neededPerfectReviews = Math.ceil(deficit / 5.0) + 5 // Add buffer
    
    console.log(`🎯 Adding ${neededPerfectReviews} more 5.0 reviews`)

    // Create more reviewers
    const additionalReviewers = []
    for (let i = 80; i < 100; i++) {
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
      additionalReviewers.push(reviewerUser)
    }

    // Get all items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' }
    })

    // Add perfect reviews systematically
    let reviewsAdded = 0

    for (let round = 0; round < 3 && reviewsAdded < neededPerfectReviews; round++) {
      console.log(`🔄 Round ${round + 1}...`)
      
      for (let i = 0; i < items.length && reviewsAdded < neededPerfectReviews; i++) {
        const item = items[i]
        const reviewerUser = additionalReviewers[(reviewsAdded + round * items.length + i) % additionalReviewers.length]

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
            console.log(`➕ Added ${reviewsAdded}/${neededPerfectReviews} perfect reviews`)
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
      _sum: {
        rating: true
      },
      where: {
        item: {
          status: 'ACTIVE'
        }
      }
    })

    const finalAvg = finalStats._avg.rating || 0
    const finalCount = finalStats._count._all
    const finalSum = finalStats._sum.rating || 0

    console.log(`\n📊 Final Statistics:`)
    console.log(`   - Average Rating: ${finalAvg.toFixed(3)}`)
    console.log(`   - Total Reviews: ${finalCount}`)
    console.log(`   - Total Sum: ${finalSum}`)
    console.log(`   - Reviews Added: ${reviewsAdded}`)

    const difference = Math.abs(finalAvg - targetAvg)
    if (difference <= 0.005) {
      console.log('🎉 Perfect! Target average of 4.9 achieved!')
    } else if (difference <= 0.01) {
      console.log('✅ Excellent! Very close to target 4.9!')
    } else if (difference <= 0.02) {
      console.log('✅ Good! Close to target 4.9!')
    } else {
      console.log(`📊 Current average: ${finalAvg.toFixed(3)} (target: 4.9)`)
      console.log(`📊 Difference: ${difference.toFixed(3)}`)
      
      // If still not close, calculate what else we need
      const remainingDeficit = (targetAvg * finalCount) - finalSum
      const remainingReviews = Math.ceil(remainingDeficit / 5.0)
      console.log(`📝 Need approximately ${remainingReviews} more perfect reviews`)
    }

    // Final verification
    console.log(`\n🔍 Final Verification:`)
    console.log(`📈 Marketplace Average Rating: ${finalAvg.toFixed(1)}`)
    console.log(`📈 Total Marketplace Reviews: ${finalCount}`)
    
    // Check individual item averages
    const itemStats = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      },
      take: 3
    })

    console.log(`\n📊 Sample Item Averages:`)
    for (const item of itemStats) {
      const itemAvg = item.reviews.length > 0 
        ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length 
        : 0
      console.log(`   - ${item.title.substring(0, 25)}...: ${itemAvg.toFixed(1)} (${item.reviews.length} reviews)`)
    }

  } catch (error) {
    console.error('❌ Error reaching exact 4.9:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error reaching exact 4.9:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })