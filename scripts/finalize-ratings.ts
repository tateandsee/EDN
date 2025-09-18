import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Finalizing ratings to achieve 4.9 average...')

  try {
    // Get all existing reviews
    const existingReviews = await prisma.marketplaceReview.findMany({
      include: {
        item: {
          select: {
            status: true
          }
        }
      },
      where: {
        item: {
          status: 'ACTIVE'
        }
      }
    })

    console.log(`📝 Found ${existingReviews.length} existing reviews`)

    // Update existing reviews to have higher ratings (4.8-5.0)
    for (let i = 0; i < existingReviews.length; i++) {
      const review = existingReviews[i]
      
      // Generate rating between 4.8 and 5.0, weighted towards 5.0
      let newRating
      const rand = Math.random()
      if (rand < 0.7) {
        newRating = 5.0 // 70% chance of perfect rating
      } else if (rand < 0.9) {
        newRating = 4.9 // 20% chance of 4.9
      } else {
        newRating = 4.8 // 10% chance of 4.8
      }

      await prisma.marketplaceReview.update({
        where: { id: review.id },
        data: {
          rating: newRating,
          comment: review.comment || 'Absolutely exceptional work! Highly recommended.'
        }
      })

      if ((i + 1) % 50 === 0) {
        console.log(`📈 Updated ${i + 1}/${existingReviews.length} reviews`)
      }
    }

    // Calculate new average rating
    const updatedReviews = await prisma.marketplaceReview.findMany({
      include: {
        item: {
          select: {
            status: true
          }
        }
      },
      where: {
        item: {
          status: 'ACTIVE'
        }
      }
    })

    const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / updatedReviews.length

    console.log(`📊 Updated average rating: ${averageRating.toFixed(1)}`)
    console.log(`📝 Total reviews: ${updatedReviews.length}`)

    // If still not close enough to 4.9, add some new perfect reviews
    if (averageRating < 4.88) {
      console.log('🎯 Adding additional perfect reviews...')

      // Get all items
      const items = await prisma.marketplaceItem.findMany({
        where: { status: 'ACTIVE' }
      })

      // Create a few more reviewers
      const additionalReviewers = []
      for (let i = 20; i < 25; i++) {
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

      // Add one perfect review per item from new reviewers
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const reviewerUser = additionalReviewers[i % additionalReviewers.length]

        // Check if this reviewer already reviewed this item
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
              comment: 'Absolutely perfect! Exceptional quality and artistry!'
            }
          })

          if ((i + 1) % 10 === 0) {
            console.log(`➕ Added ${i + 1}/${items.length} perfect reviews`)
          }
        }
      }

      // Final calculation
      const finalReviews = await prisma.marketplaceReview.findMany({
        include: {
          item: {
            select: {
              status: true
            }
          }
        },
        where: {
          item: {
            status: 'ACTIVE'
          }
        }
      })

      const finalTotal = finalReviews.reduce((sum, review) => sum + review.rating, 0)
      const finalAverage = finalTotal / finalReviews.length

      console.log(`🎯 Final average rating: ${finalAverage.toFixed(1)}`)
      console.log(`📝 Final total reviews: ${finalReviews.length}`)
    }

    console.log('✅ Rating finalization completed!')

    // Show final statistics
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

    console.log(`\n📊 Final Statistics:`)
    console.log(`   - Average Rating: ${finalStats._avg.rating?.toFixed(1) || 'N/A'}`)
    console.log(`   - Total Reviews: ${finalStats._count._all}`)

    if (finalStats._avg.rating && finalStats._avg.rating >= 4.88 && finalStats._avg.rating <= 4.92) {
      console.log('🎉 Perfect! Target average of 4.9 achieved!')
    } else if (finalStats._avg.rating && finalStats._avg.rating >= 4.85) {
      console.log('✅ Very close to target! Good job!')
    } else {
      console.log(`⚠️  Current average: ${finalStats._avg.rating?.toFixed(1)} (target: 4.9)`)
    }

  } catch (error) {
    console.error('❌ Error finalizing ratings:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error finalizing ratings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })