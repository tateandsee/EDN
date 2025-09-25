import { PrismaClient } from '@prisma/client'
import { MarketplaceType, MarketplaceCategory, MarketplaceStatus } from '@prisma/client'

const prisma = new PrismaClient()

// AI-generated female model names and descriptions
const femaleModelNames = [
  'Aurora', 'Luna', 'Stella', 'Bella', 'Sophia', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Mia',
  'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery',
  'Sofia', 'Camila', 'Aria', 'Scarlett', 'Victoria', 'Madison', 'Luna', 'Grace', 'Chloe', 'Penelope',
  'Layla', 'Riley', 'Zoey', 'Nora', 'Hannah', 'Lily', 'Eleanor', 'Hazel', 'Violet', 'Aurora',
  'Stella', 'Natalie', 'Leah', 'Hannah', 'Addison', 'Lucy', 'Audrey', 'Brooklyn', 'Bella', 'Nova',
  'Genesis', 'Aaliyah', 'Kennedy', 'Samantha', 'Maya', 'Willow', 'Kinsley', 'Naomi', 'Aaliyah', 'Paisley'
]

<<<<<<< HEAD
const ethnicities = ['Caucasian', 'Asian', 'Mixed Race', 'Persian']
const hairColors = ['Golden', 'Red', 'Dark']
const eyeColors = ['Blue', 'Green', 'Brown']

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
const sfwDescriptions = [
  'Elegant AI-generated female model with professional portrait photography',
  'Beautiful digital art featuring a sophisticated female character',
  'Stunning AI-created model with natural beauty and grace',
  'Professional female model portrait with artistic lighting',
  'Captivating AI-generated woman with expressive features',
  'Artistic digital portrait of a female model with unique style',
  'Sophisticated AI-created female character with elegant pose',
  'Beautiful woman portrait with professional photography techniques',
  'AI-generated female model with natural and authentic appearance',
  'Stunning digital art featuring a graceful female character',
  'Professional portrait of an AI-generated female model',
  'Elegant woman with sophisticated styling and artistic composition',
  'Beautiful AI-created female character with realistic features',
  'Artistic digital portrait with professional lighting techniques',
  'Captivating female model with unique AI-generated characteristics',
  'Sophisticated portrait of a woman with elegant presentation',
  'Professional AI-generated female model with natural beauty',
  'Stunning digital art featuring an expressive female character',
  'Elegant woman portrait with artistic and creative styling',
  'Beautiful AI-created model with graceful and authentic appearance',
  'Professional female portrait with sophisticated composition',
  'AI-generated woman with natural features and artistic lighting',
  'Captivating digital portrait of a female model with unique style',
  'Elegant AI-created female character with professional presentation',
  'Beautiful woman with sophisticated and artistic digital rendering',
  'Professional AI-generated model with natural and graceful appearance',
  'Stunning female portrait with artistic lighting and composition',
  'AI-generated woman with expressive features and elegant styling',
  'Beautiful digital art featuring a sophisticated female character',
  'Professional portrait of an AI-generated female model with unique characteristics'
]

const nsfwDescriptions = [
  'Sultry AI-generated female model with sensual and captivating presence',
  'Bold digital art featuring an alluring female character with confidence',
  'Provocative AI-created model with striking and seductive features',
  'Intense female portrait with artistic and sensual composition',
  'Captivating AI-generated woman with passionate and expressive aura',
  'Artistic digital portrait of a female model with daring and unique style',
  'Seductive AI-created female character with confident and elegant pose',
  'Alluring woman portrait with professional and sensual photography',
  'AI-generated female model with bold and authentic sensual appearance',
  'Stunning digital art featuring a passionate and captivating female character',
  'Intimate portrait of an AI-generated female model with artistic flair',
  'Sensual woman with sophisticated styling and provocative composition',
  'Beautiful AI-created female character with striking and realistic features',
  'Artistic digital portrait with sensual and professional lighting techniques',
  'Captivating female model with unique and alluring AI-generated characteristics',
  'Seductive portrait of a woman with elegant and daring presentation',
  'Professional AI-generated female model with sensual and confident beauty',
  'Stunning digital art featuring an expressive and passionate female character',
  'Bold woman portrait with artistic and sensual creative styling',
  'Beautiful AI-created model with graceful and alluring appearance',
  'Intimate female portrait with sophisticated and sensual composition',
  'AI-generated woman with striking features and artistic sensual lighting',
  'Captivating digital portrait of a female model with daring and unique style',
  'Seductive AI-created female character with professional and confident presentation',
  'Alluring woman with sophisticated and artistic digital rendering',
  'Professional AI-generated model with sensual and captivating appearance',
  'Stunning female portrait with artistic and sensual lighting composition',
  'AI-generated woman with expressive and passionate features',
  'Beautiful digital art featuring a sophisticated and alluring female character',
  'Professional portrait of an AI-generated female model with unique and sensual characteristics'
]

const modelPrompts = [
  'Professional portrait photography, studio lighting, high fashion, elegant pose, natural beauty, detailed facial features, realistic skin texture, professional makeup, sophisticated styling',
  'Digital art, hyperrealistic, detailed character design, beautiful woman, artistic composition, soft lighting, elegant features, professional rendering, high quality',
  'AI-generated model, photorealistic, studio portrait, professional photography, natural expression, detailed features, artistic lighting, sophisticated appearance',
  'Female character, digital painting, realistic details, elegant pose, professional composition, beautiful features, artistic styling, high resolution',
  'Portrait photography, model shoot, professional lighting, natural beauty, detailed facial features, realistic texture, artistic composition, elegant presentation'
]

const priceRanges = {
  sfw: [15, 25, 35, 45, 55, 65, 75, 85, 95, 125],
  nsfw: [25, 35, 45, 55, 75, 85, 95, 125, 150, 175, 200, 250]
}

function getRandomPrice(isNsfw: boolean): number {
  const prices = isNsfw ? priceRanges.nsfw : priceRanges.sfw
  return prices[Math.floor(Math.random() * prices.length)]
}

function getRandomDescription(isNsfw: boolean): string {
  const descriptions = isNsfw ? nsfwDescriptions : sfwDescriptions
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

function getRandomPrompt(): string {
  return modelPrompts[Math.floor(Math.random() * modelPrompts.length)]
}

<<<<<<< HEAD
function getRandomEthnicity(): string {
  return ethnicities[Math.floor(Math.random() * ethnicities.length)]
}

function getRandomHairColor(): string {
  return hairColors[Math.floor(Math.random() * hairColors.length)]
}

function getRandomEyeColor(): string {
  return eyeColors[Math.floor(Math.random() * eyeColors.length)]
}

function generateActualImage(ethnicity: string, hairColor: string, eyeColor: string, isNsfw: boolean): string {
  const colorSchemes = {
    sfw: {
      skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642'],
      hair: ['#8B4513', '#D2691E', '#FFD700', '#FF4500'],
      eyes: ['#4169E1', '#228B22', '#8B4513']
    },
    nsfw: {
      skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642'],
      hair: ['#8B4513', '#D2691E', '#FFD700', '#FF4500', '#FF1493'],
      eyes: ['#4169E1', '#228B22', '#8B4513', '#DC143C']
    }
  }

  const scheme = colorSchemes[isNsfw ? 'nsfw' : 'sfw']
  
  const skinColors = {
    'Caucasian': scheme.skin[0],
    'Asian': scheme.skin[1],
    'Mixed Race': scheme.skin[2],
    'Persian': scheme.skin[3]
  }

  const hairColors = {
    'Golden': scheme.hair[2],
    'Red': scheme.hair[3],
    'Dark': scheme.hair[0]
  }

  const eyeColors = {
    'Blue': scheme.eyes[0],
    'Green': scheme.eyes[1],
    'Brown': scheme.eyes[2]
  }

  const skinColor = skinColors[ethnicity] || scheme.skin[0]
  const hairColorValue = hairColors[hairColor] || scheme.hair[0]
  const eyeColorValue = eyeColors[eyeColor] || scheme.eyes[2]

  const svg = isNsfw ? createNsfwSvg(skinColor, hairColorValue, eyeColorValue) : createSfwSvg(skinColor, hairColorValue, eyeColorValue)
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

function createSfwSvg(skinColor: string, hairColor: string, eyeColor: string): string {
  return `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#f0f0f0"/>
  <ellipse cx="200" cy="150" rx="80" ry="90" fill="${skinColor}"/>
  <path d="M 120 100 Q 200 60 280 100 Q 300 140 280 180 L 270 170 Q 200 130 130 170 L 120 180 Q 100 140 120 100" fill="${hairColor}"/>
  <ellipse cx="170" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="230" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="170" cy="140" rx="6" ry="6" fill="#000"/>
  <ellipse cx="230" cy="140" rx="6" ry="6" fill="#000"/>
  <path d="M 200 150 L 195 165 L 200 170 L 205 165 Z" fill="${skinColor}" stroke="#000" stroke-width="0.5"/>
  <path d="M 180 185 Q 200 195 220 185" fill="none" stroke="#000" stroke-width="1.5"/>
  <rect x="180" y="230" width="40" height="60" fill="${skinColor}"/>
  <ellipse cx="200" cy="290" rx="100" ry="40" fill="${skinColor}"/>
  <rect x="100" y="280" width="200" height="150" fill="#4169E1" rx="10"/>
  <text x="200" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">EDN Protected</text>
</svg>`
}

function createNsfwSvg(skinColor: string, hairColor: string, eyeColor: string): string {
  return `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#1a1a1a"/>
  <ellipse cx="200" cy="150" rx="80" ry="90" fill="${skinColor}"/>
  <path d="M 120 100 Q 200 60 280 100 Q 300 140 280 180 L 270 170 Q 200 130 130 170 L 120 180 Q 100 140 120 100" fill="${hairColor}"/>
  <ellipse cx="170" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="230" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="170" cy="140" rx="6" ry="6" fill="#000"/>
  <ellipse cx="230" cy="140" rx="6" ry="6" fill="#000"/>
  <path d="M 158 135 Q 165 130 172 135" fill="none" stroke="#000" stroke-width="1"/>
  <path d="M 228 135 Q 235 130 242 135" fill="none" stroke="#000" stroke-width="1"/>
  <path d="M 200 150 L 195 165 L 200 170 L 205 165 Z" fill="${skinColor}" stroke="#000" stroke-width="0.5"/>
  <path d="M 180 185 Q 200 195 220 185" fill="${skinColor}" stroke="#000" stroke-width="1.5"/>
  <path d="M 185 190 Q 200 198 215 190" fill="#FF1493" stroke="#000" stroke-width="0.5"/>
  <rect x="180" y="230" width="40" height="60" fill="${skinColor}"/>
  <ellipse cx="200" cy="290" rx="100" ry="40" fill="${skinColor}"/>
  <path d="M 100 280 Q 200 260 300 280 L 300 320 Q 200 340 100 320 Z" fill="#FF1493" stroke="#000" stroke-width="1"/>
  <circle cx="150" cy="300" r="3" fill="#FFF"/>
  <circle cx="250" cy="300" r="3" fill="#FFF"/>
  <text x="200" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#FF1493">EDN Protected</text>
</svg>`
}

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
async function main() {
  console.log('🌱 Seeding marketplace with AI-generated female models...')

  try {
    // Find or create the "AI Model Goddess" user
    let aiModelGoddess = await prisma.user.findFirst({
      where: { name: 'AI Model Goddess' }
    })

    if (!aiModelGoddess) {
      aiModelGoddess = await prisma.user.create({
        data: {
          name: 'AI Model Goddess',
          email: 'ai-model-goddess@edn.com',
          role: 'CREATOR',
          verified: true,
          isPaidMember: true,
          bio: 'Premium AI-generated female models and digital art creator',
          avatar: 'https://ui-avatars.com/api/?name=AI+Model+Goddess&background=FF6B35&color=fff'
        }
      })
      console.log('✅ Created AI Model Goddess user')
    } else {
      console.log('✅ Found existing AI Model Goddess user')
    }

    // Remove existing marketplace items from "test user"
    const testUser = await prisma.user.findFirst({
      where: { name: 'test user' }
    })

    if (testUser) {
      const deletedTestUserItems = await prisma.marketplaceItem.deleteMany({
        where: { userId: testUser.id }
      })
      console.log(`🗑️  Deleted ${deletedTestUserItems.count} items from test user`)
    }

    // Remove all existing marketplace items to start fresh
    const deletedAllItems = await prisma.marketplaceItem.deleteMany({})
    console.log(`🗑️  Deleted ${deletedAllItems.count} existing marketplace items`)

    // Create 30 SFW items
    console.log('📸 Creating 30 SFW AI-generated female model listings...')
    const sfwItems = []
    for (let i = 0; i < 30; i++) {
      const modelName = femaleModelNames[i]
<<<<<<< HEAD
      const ethnicity = getRandomEthnicity()
      const hairColor = getRandomHairColor()
      const eyeColor = getRandomEyeColor()
      const actualImage = generateActualImage(ethnicity, false)
      
      const itemData = {
        title: `EDN ${modelName} - Premium AI Female Model`,
        description: getRandomDescription(false),
        type: MarketplaceType.AI_MODEL,
        category: MarketplaceCategory.SFW,
        price: getRandomPrice(false),
        currency: 'USD',
        status: MarketplaceStatus.ACTIVE,
        isNsfw: false,
        tags: JSON.stringify(['AI model', 'female', ethnicity.toLowerCase(), hairColor.toLowerCase(), eyeColor.toLowerCase(), 'portrait', 'digital art', 'premium', 'professional']),
        positivePrompt: getRandomPrompt(),
        negativePrompt: 'deformed, ugly, disfigured, poor quality, blurry, low resolution',
        fullPrompt: `${getRandomPrompt()} deformed, ugly, disfigured, poor quality, blurry, low resolution`,
        userId: aiModelGoddess.id,
        thumbnail: actualImage,
        images: JSON.stringify([actualImage])
      }
      
      const item = await prisma.marketplaceItem.create({
        data: itemData
=======
      const item = await prisma.marketplaceItem.create({
        data: {
          title: `EDN ${modelName} - Premium AI Female Model`,
          description: getRandomDescription(false),
          type: MarketplaceType.AI_MODEL,
          category: MarketplaceCategory.SFW,
          price: getRandomPrice(false),
          currency: 'USD',
          status: MarketplaceStatus.ACTIVE,
          isNsfw: false,
          tags: JSON.stringify(['AI model', 'female', 'portrait', 'digital art', 'premium', 'professional']),
          positivePrompt: getRandomPrompt(),
          negativePrompt: 'deformed, ugly, disfigured, poor quality, blurry, low resolution',
          fullPrompt: `${getRandomPrompt()} deformed, ugly, disfigured, poor quality, blurry, low resolution`,
          userId: aiModelGoddess.id,
          thumbnail: `https://ui-avatars.com/api/?name=${modelName}&background=FF6B35&color=fff`,
          images: JSON.stringify([`https://ui-avatars.com/api/?name=${modelName}&background=FF6B35&color=fff`])
        }
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
      })
      sfwItems.push(item)
    }

<<<<<<< HEAD
    // Create 30 NSFW items
    console.log('🔥 Creating 30 NSFW AI-generated female model listings...')
    const nsfwItems = []
    for (let i = 30; i < 60; i++) {
      const modelName = femaleModelNames[i]
      const ethnicity = getRandomEthnicity()
      const hairColor = getRandomHairColor()
      const eyeColor = getRandomEyeColor()
      const actualImage = generateActualImage(ethnicity, true)
      
      const itemData = {
        title: `EDN ${modelName} - Premium AI Female Model`,
        description: getRandomDescription(true),
        type: MarketplaceType.AI_MODEL,
        category: MarketplaceCategory.NSFW,
        price: getRandomPrice(true),
        currency: 'USD',
        status: MarketplaceStatus.ACTIVE,
        isNsfw: true,
        tags: JSON.stringify(['AI model', 'female', ethnicity.toLowerCase(), hairColor.toLowerCase(), eyeColor.toLowerCase(), 'portrait', 'digital art', 'premium', 'sensual']),
        positivePrompt: getRandomPrompt(),
        negativePrompt: 'deformed, ugly, disfigured, poor quality, blurry, low resolution',
        fullPrompt: `${getRandomPrompt()} deformed, ugly, disfigured, poor quality, blurry, low resolution`,
        userId: aiModelGoddess.id,
        thumbnail: actualImage,
        images: JSON.stringify([actualImage])
      }
      
      const item = await prisma.marketplaceItem.create({
        data: itemData
=======
    // Create 30 NSFW items with specific attire categories
    console.log('🔥 Creating 30 NSFW AI-generated female model listings...')
    const nsfwItems = []
    const attireCategories = ['erotic', 'swimwear', 'cosplay', 'sexy', 'underwear', 'semi-nude', 'nude']
    
    for (let i = 30; i < 60; i++) {
      const modelName = femaleModelNames[i]
      const attireIndex = Math.floor(Math.random() * attireCategories.length)
      const attireCategory = attireCategories[attireIndex]
      
      // Create specific tags based on attire category
      const baseTags = ['AI model', 'female', 'portrait', 'digital art', 'premium']
      const attireTags = {
        'erotic': ['erotic', 'sensual', 'passionate', 'alluring'],
        'swimwear': ['swimwear', 'bikini', 'beach', 'summer', 'swimsuit'],
        'cosplay': ['cosplay', 'costume', 'roleplay', 'character', 'fantasy'],
        'sexy': ['sexy', 'hot', 'attractive', 'stunning', 'beautiful'],
        'underwear': ['underwear', 'lingerie', 'intimate', 'seductive', 'elegant'],
        'semi-nude': ['semi-nude', 'partially clothed', 'suggestive', 'artistic', 'tasteful'],
        'nude': ['nude', 'naked', 'unclothed', 'bare', 'natural']
      }
      
      const item = await prisma.marketplaceItem.create({
        data: {
          title: `EDN ${modelName} - Premium AI Female Model`,
          description: getRandomDescription(true),
          type: MarketplaceType.AI_MODEL,
          category: MarketplaceCategory.NSFW,
          price: getRandomPrice(true),
          currency: 'USD',
          status: MarketplaceStatus.ACTIVE,
          isNsfw: true,
          tags: JSON.stringify([...baseTags, ...attireTags[attireCategory]]),
          positivePrompt: getRandomPrompt(),
          negativePrompt: 'deformed, ugly, disfigured, poor quality, blurry, low resolution',
          fullPrompt: `${getRandomPrompt()} deformed, ugly, disfigured, poor quality, blurry, low resolution`,
          userId: aiModelGoddess.id,
          thumbnail: `https://ui-avatars.com/api/?name=${modelName}&background=FF1493&color=fff`,
          images: JSON.stringify([`https://ui-avatars.com/api/?name=${modelName}&background=FF1493&color=fff`])
        }
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
      })
      nsfwItems.push(item)
    }

<<<<<<< HEAD
    // Create some completed orders to establish the baseline revenue
=======
    // Create some completed orders to establish the baseline revenue of $9,747
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    console.log('💰 Creating baseline revenue data...')
    
    // Create a buyer user for the orders
    let buyerUser = await prisma.user.findFirst({
      where: { email: 'marketplace-buyer@edn.com' }
    })

    if (!buyerUser) {
      buyerUser = await prisma.user.create({
        data: {
          name: 'Marketplace Buyer',
          email: 'marketplace-buyer@edn.com',
          role: 'CREATOR',
          verified: true,
          isPaidMember: true
        }
      })
    }

<<<<<<< HEAD
    // Create orders with random items
    const allItems = [...sfwItems, ...nsfwItems]
    const orders = []
    
    for (let i = 0; i < 50; i++) {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
=======
    // Calculate how many orders we need to reach approximately $9,747
    const targetRevenue = 9747
    let currentRevenue = 0
    const orders = []

    // Create orders with random items until we reach the target
    const allItems = [...sfwItems, ...nsfwItems]
    
    while (currentRevenue < targetRevenue && orders.length < 200) {
      const randomItem = allItems[Math.floor(Math.random() * allItems.length)]
      const orderAmount = randomItem.price
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
      
      await prisma.marketplaceOrder.create({
        data: {
          userId: buyerUser.id,
          itemId: randomItem.id,
<<<<<<< HEAD
          amount: randomItem.price,
=======
          amount: orderAmount,
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
          currency: 'USD',
          status: 'COMPLETED',
          paymentId: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      })
      
<<<<<<< HEAD
      orders.push(randomItem.price)
    }

    const totalRevenue = orders.reduce((sum, price) => sum + price, 0)
    console.log(`✅ Created ${orders.length} orders with total revenue: $${totalRevenue.toFixed(2)}`)
=======
      currentRevenue += orderAmount
      orders.push(orderAmount)
    }

    console.log(`✅ Created ${orders.length} orders with total revenue: $${currentRevenue.toFixed(2)}`)
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

    console.log('🎉 Marketplace seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Total items: ${sfwItems.length + nsfwItems.length}`)
    console.log(`   - SFW items: ${sfwItems.length}`)
    console.log(`   - NSFW items: ${nsfwItems.length}`)
    console.log(`   - Creator: AI Model Goddess`)
<<<<<<< HEAD
    console.log(`   - Total revenue: $${totalRevenue.toFixed(2)}`)
=======
    console.log(`   - Baseline revenue: $${currentRevenue.toFixed(2)}`)
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

  } catch (error) {
    console.error('❌ Error seeding marketplace:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding marketplace:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })