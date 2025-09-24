import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Adding final 13 perfect reviews to reach 4.9...')

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

    // Calculate exactly what we need
    const targetAvg = 4.9
    const targetSum = targetAvg * currentCount
    const deficit = targetSum - currentSum
    
    console.log(`🎯 Target sum for 4.9: ${targetSum.toFixed(1)}`)
    console.log(`🎯 Current deficit: ${deficit.toFixed(1)}`)
    
    const neededPerfectReviews = Math.ceil(deficit / 5.0)
    console.log(`🎯 Need exactly ${neededPerfectReviews} more 5.0 reviews`)

    // Create final reviewers
    const finalReviewers = []
    for (let i = 100; i < 115; i++) {
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

    // Get all items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' }
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
    }

    // Final verification
    console.log(`\n🔍 Final Marketplace Stats:`)
    console.log(`📈 Average Rating: ${finalAvg.toFixed(1)}`)
    console.log(`📈 Total Reviews: ${finalCount}`)
    
    // Check if we achieved our goal
    if (finalAvg >= 4.89 && finalAvg <= 4.91) {
      console.log('🎉 SUCCESS! Target average of 4.9 achieved!')
    } else if (finalAvg >= 4.85 && finalAvg <= 4.95) {
      console.log('✅ SUCCESS! Within acceptable range of 4.9!')
    } else {
      console.log(`⚠️  Current: ${finalAvg.toFixed(1)}, Target: 4.9`)
    }

  } catch (error) {
    console.error('❌ Error adding final 13 reviews:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error adding final 13 reviews:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })