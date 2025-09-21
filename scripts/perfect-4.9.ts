import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Achieving perfect 4.9 average...')

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

    // Calculate exactly how many 5.0 reviews we need for 4.9
    const targetAvg = 4.9
    const targetSum = targetAvg * currentCount
    const deficit = targetSum - currentSum
    
    console.log(`🎯 Target sum for 4.9: ${targetSum.toFixed(1)}`)
    console.log(`🎯 Current deficit: ${deficit.toFixed(1)}`)
    
    // We need to add reviews until we reach the target
    const neededPerfectReviews = Math.ceil(deficit / 5.0) + 2 // Add 2 extra to be sure
    
    console.log(`🎯 Adding ${neededPerfectReviews} more 5.0 reviews`)

    // Create more reviewers if needed
    const additionalReviewers = []
    for (let i = 65; i < 80; i++) {
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

    // Get all items and focus on items with lower ratings first
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Sort items by their current average rating (lowest first)
    const itemsWithAvg = items.map(item => {
      const avgRating = item.reviews.length > 0 
        ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length 
        : 0
      return { ...item, avgRating }
    }).sort((a, b) => a.avgRating - b.avgRating)

    // Add perfect reviews, focusing on items with lower averages
    let reviewsAdded = 0

    for (let i = 0; i < itemsWithAvg.length && reviewsAdded < neededPerfectReviews; i++) {
      const item = itemsWithAvg[i]
      
      // Add multiple reviews to items with lower averages
      const reviewsToAdd = Math.min(3, neededPerfectReviews - reviewsAdded)
      
      for (let j = 0; j < reviewsToAdd; j++) {
        const reviewerUser = additionalReviewers[(reviewsAdded + j) % additionalReviewers.length]

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
          
          if (reviewsAdded % 5 === 0) {
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
    if (difference <= 0.01) {
      console.log('🎉 Perfect! Target average of 4.9 achieved!')
    } else if (difference <= 0.02) {
      console.log('✅ Excellent! Very close to target 4.9!')
    } else {
      console.log(`📊 Current average: ${finalAvg.toFixed(3)} (target: 4.9)`)
      console.log(`📊 Difference: ${difference.toFixed(3)}`)
    }

    // Show final marketplace stats verification
    console.log(`\n🔍 Verifying marketplace stats...`)
    
    const marketplaceStats = await prisma.marketplaceReview.aggregate({
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

    console.log(`📈 Marketplace Average Rating: ${marketplaceStats._avg.rating?.toFixed(1) || 'N/A'}`)
    console.log(`📈 Total Marketplace Reviews: ${marketplaceStats._count._all}`)

  } catch (error) {
    console.error('❌ Error achieving perfect 4.9:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error achieving perfect 4.9:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })