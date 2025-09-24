import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Enhanced descriptive titles for female models
const sfwTitleTemplates = [
  'Elegant {name} - Professional Portrait Photography',
  'Stunning {name} - High Fashion Digital Art',
  'Graceful {name} - Sophisticated Studio Portrait',
  'Beautiful {name} - Artistic Digital Creation',
  'Captivating {name} - Professional Model Photography',
  'Sophisticated {name} - Elegant Digital Portrait',
  'Radiant {name} - High-Resolution Artwork',
  'Exquisite {name} - Professional Photography',
  'Charming {name} - Artistic Digital Model',
  'Ethereal {name} - Stunning Visual Creation',
  'Polished {name} - High-End Digital Art',
  'Refined {name} - Professional Portrait Series',
  'Alluring {name} - Sophisticated Photography',
  'Timeless {name} - Classic Digital Beauty',
  'Majestic {name} - Regal Portrait Creation',
  'Serene {name} - Peaceful Digital Art',
  'Vibrant {name} - Colorful Photography',
  'Poised {name} - Elegant Model Portrait',
  'Luminous {name} - Glowing Digital Art',
  'Enchanting {name} - Magical Photography',
  'Distinguished {name} - High-Class Portrait',
  'Graceful {name} - Flowing Digital Creation',
  'Stellar {name} - Star-Quality Photography',
  'Exquisite {name} - Fine Art Digital Model',
  'Celestial {name} - Heavenly Portrait Art',
  'Mystical {name} - Enchanting Digital Creation',
  'Royal {name} - Noble Photography Style',
  'Divine {name} - Goddess-Like Portrait',
  'Angelic {name} - Heavenly Digital Art',
  'Sublime {name} - Transcendent Photography',
  'Perfect {name} - Flawless Digital Creation'
]

const nsfwTitleTemplates = [
  'Sultry {name} - Sensual Portrait Photography',
  'Passionate {name} - Intimate Digital Art',
  'Bold {name} - Daring Model Creation',
  'Alluring {name} - Seductive Photography',
  'Captivating {name} - Enthralling Digital Portrait',
  'Sensual {name} - Intimate Art Creation',
  'Provocative {name} - Bold Photography Style',
  'Magnetic {name} - Irresistible Digital Art',
  'Fiery {name} - Passionate Portrait Series',
  'Enchanting {name} - Mesmerizing Photography',
  'Seductive {name} - Alluring Digital Creation',
  'Intense {name} - Powerful Portrait Art',
  'Dazzling {name} - Stunning Photography',
  'Exotic {name} - Unique Digital Model',
  'Voluptuous {name} - Curvy Portrait Creation',
  'Tempting {name} - Irresistible Photography',
  'Mysterious {name} - Enigmatic Digital Art',
  'Ravishing {name} - Gorgeous Portrait Style',
  'Sizzling {name} - Hot Photography Creation',
  'Hypnotic {name} - Mesmerizing Digital Portrait',
  'Sensual {name} - Intimate Photography Art',
  'Passionate {name} - Emotional Digital Creation',
  'Bold {name} - Confident Portrait Series',
  'Alluring {name} - Charming Photography',
  'Seductive {name} - Enticing Digital Art',
  'Intoxicating {name} - Captivating Portrait',
  'Sultry {name} - Sensual Photography Style',
  'Fiery {name} - Passionate Digital Creation',
  'Magnetic {name} - Attractive Portrait Art',
  'Dazzling {name} - Brilliant Photography',
  'Exotic {name} - Unusual Digital Model'
]

const femaleModelNames = [
  'Aurora', 'Luna', 'Stella', 'Bella', 'Sophia', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Mia',
  'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery',
  'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope',
  'Layla', 'Riley', 'Zoey', 'Nora', 'Hannah', 'Lily', 'Eleanor', 'Hazel', 'Violet', 'Aurora',
  'Stella', 'Natalie', 'Leah', 'Hannah', 'Addison', 'Lucy', 'Audrey', 'Brooklyn', 'Bella', 'Nova',
  'Genesis', 'Aaliyah', 'Kennedy', 'Samantha', 'Maya', 'Willow', 'Kinsley', 'Naomi', 'Aaliyah', 'Paisley'
]

const reviewComments = [
  'Absolutely stunning! The quality is exceptional.',
  'Beautiful work, exceeded my expectations completely.',
  'Perfect! Exactly what I was looking for.',
  'Amazing attention to detail, highly recommended.',
  'Outstanding quality and professional presentation.',
  'Fantastic work, worth every penny.',
  'Exquisite craftsmanship, truly impressive.',
  'Brilliant creation, love the artistic vision.',
  'Superb quality, very satisfied with purchase.',
  'Excellent work, will definitely buy again.',
  'Incredible attention to detail, amazing results.',
  'Professional quality, highly satisfied.',
  'Beautiful execution, very impressive work.',
  'Stunning results, exceeded all expectations.',
  'Perfect quality, very happy with this.',
  'Outstanding artistry, highly recommend.',
  'Fantastic attention to detail, love it!',
  'Brilliant work, very professional.',
  'Exquisite quality, worth the investment.',
  'Amazing creation, very pleased overall.'
]

function getRandomRating(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10
}

function getRandomTitle(isNsfw: boolean, modelName: string): string {
  const templates = isNsfw ? nsfwTitleTemplates : sfwTitleTemplates
  const template = templates[Math.floor(Math.random() * templates.length)]
  return template.replace('{name}', modelName)
}

function getRandomComment(): string {
  return reviewComments[Math.floor(Math.random() * reviewComments.length)]
}

async function main() {
  console.log('🎨 Enhancing marketplace with ratings and improved titles...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      include: {
        user: true,
        reviews: true
      }
    })

    console.log(`📦 Found ${items.length} marketplace items to enhance`)

    // Create multiple reviewer users for the reviews
    const reviewerUsers = []
    for (let i = 0; i < 5; i++) {
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
        console.log(`✅ Created marketplace reviewer user ${i + 1}`)
      }
      reviewerUsers.push(reviewerUser)
    }

    // Process each item
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const modelName = femaleModelNames[i]
      const isNsfw = item.isNsfw
      
      // Generate improved title
      const improvedTitle = getRandomTitle(isNsfw, modelName)
      
      // Generate rating between 4.7 and 5.0
      const rating = getRandomRating(4.7, 5.0)
      
      // Update the item with improved title
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          title: improvedTitle
        }
      })

      // Remove existing reviews for this item
      await prisma.marketplaceReview.deleteMany({
        where: { itemId: item.id }
      })

      // Create 3-5 reviews for each item with high ratings
      const numReviews = Math.floor(Math.random() * 3) + 3 // 3-5 reviews
      for (let j = 0; j < numReviews; j++) {
        const reviewRating = getRandomRating(4.7, 5.0)
        const comment = getRandomComment()
        const reviewerUser = reviewerUsers[j % reviewerUsers.length] // Cycle through reviewers
        
        await prisma.marketplaceReview.create({
          data: {
            userId: reviewerUser.id,
            itemId: item.id,
            rating: reviewRating,
            comment: comment
          }
        })
      }

      console.log(`🎯 Enhanced item ${i + 1}/${items.length}: ${improvedTitle} (Rating: ${rating})`)
    }

    console.log('✅ All marketplace items enhanced successfully!')

    // Verify the average rating
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

    console.log(`📊 Average rating across all items: ${averageRating.toFixed(1)}`)
    console.log(`📝 Total reviews created: ${allReviews.length}`)

    // Update marketplace stats to reflect the new average
    console.log('📈 Marketplace enhancement completed!')
    console.log(`🎯 Target average: 4.9`)
    console.log(`📊 Actual average: ${averageRating.toFixed(1)}`)

    if (averageRating >= 4.85 && averageRating <= 4.95) {
      console.log('✅ Average rating is within target range!')
    } else {
      console.log('⚠️  Average rating may need adjustment')
    }

  } catch (error) {
    console.error('❌ Error enhancing marketplace:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error enhancing marketplace:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })