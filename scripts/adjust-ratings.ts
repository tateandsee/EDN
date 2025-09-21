import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Adjusting ratings to achieve 4.9 average...')

  try {
    // Get all marketplace items with their reviews
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      include: {
        reviews: {
          include: {
            user: true
          }
        }
      }
    })

    console.log(`📦 Found ${items.length} marketplace items to adjust`)

    // Create additional high-rated reviews to boost the average
    const reviewerUsers = []
    for (let i = 5; i < 20; i++) { // Create 15 additional reviewers
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
        console.log(`✅ Created additional reviewer user ${i + 1}`)
      }
      reviewerUsers.push(reviewerUser)
    }

    const highRatingComments = [
      'Absolutely phenomenal! This exceeded all my expectations.',
      'Outstanding quality and attention to detail. Perfect!',
      'Exceptional work! Worth every single penny.',
      'Brilliant creation! The quality is unmatched.',
      'Perfect in every way! Highly recommended.',
      'Stunning artwork! Absolutely beautiful and professional.',
      'Exquisite quality! This is exactly what I needed.',
      'Fantastic work! The attention to detail is amazing.',
      'Superb quality! Very impressed with this purchase.',
      'Excellent work! Will definitely purchase again.',
      'Incredible craftsmanship! Love the artistic vision.',
      'Professional quality! Very satisfied overall.',
      'Beautiful execution! Truly impressive work.',
      'Stunning results! Exceeded all expectations.',
      'Perfect quality! Very happy with this purchase.',
      'Outstanding artistry! Highly recommend to everyone.',
      'Fantastic attention to detail! Absolutely love it!',
      'Brilliant work! Very professional and polished.',
      'Exquisite quality! Worth every penny invested.',
      'Amazing creation! Very pleased with the results.'
    ]

    // Add 2-3 additional high-rated reviews (4.9-5.0) to each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const additionalReviews = Math.floor(Math.random() * 2) + 2 // 2-3 additional reviews

      for (let j = 0; j < additionalReviews; j++) {
        const rating = Math.random() > 0.3 ? 5.0 : 4.9 // 70% chance of 5.0, 30% chance of 4.9
        const comment = highRatingComments[Math.floor(Math.random() * highRatingComments.length)]
        const reviewerUser = reviewerUsers[j % reviewerUsers.length]

        await prisma.marketplaceReview.create({
          data: {
            userId: reviewerUser.id,
            itemId: item.id,
            rating: rating,
            comment: comment
          }
        })
      }

      console.log(`📈 Added ${additionalReviews} high-rated reviews to item ${i + 1}`)
    }

    // Calculate new average rating
    const allReviews = await prisma.marketplaceReview.findMany({
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

    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / allReviews.length

    console.log(`📊 New average rating: ${averageRating.toFixed(1)}`)
    console.log(`📝 Total reviews: ${allReviews.length}`)

    // If still not close enough to 4.9, add more perfect reviews
    if (averageRating < 4.85) {
      console.log('🎯 Adding more perfect reviews to reach target...')

      for (let i = 0; i < items.length && averageRating < 4.85; i++) {
        const item = items[i]
        const reviewerUser = reviewerUsers[i % reviewerUsers.length]

        await prisma.marketplaceReview.create({
          data: {
            userId: reviewerUser.id,
            itemId: item.id,
            rating: 5.0,
            comment: 'Absolutely perfect! This is exceptional work!'
          }
        })

        // Recalculate average
        const updatedReviews = await prisma.marketplaceReview.findMany({
          where: {
            itemId: item.id
          }
        })

        const itemTotal = updatedReviews.reduce((sum, review) => sum + review.rating, 0)
        const itemAverage = itemTotal / updatedReviews.length

        console.log(`📊 Item ${i + 1} new average: ${itemAverage.toFixed(1)}`)
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

    console.log('✅ Rating adjustment completed!')

  } catch (error) {
    console.error('❌ Error adjusting ratings:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error adjusting ratings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })