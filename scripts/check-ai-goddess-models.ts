import { db } from '../src/lib/db'

async function checkAIGoddessModels() {
  try {
    console.log('Checking models created by AI Goddess Empire...')
    
    // Get AI Goddess Empire user
    const aiGoddessUser = await db.user.findFirst({
      where: {
        OR: [
          { name: 'AI Goddess Empire' },
          { email: 'ai-goddess@empire.com' }
        ]
      }
    })
    
    if (!aiGoddessUser) {
      console.log('❌ AI Goddess Empire user not found')
      return
    }
    
    console.log('✅ Found AI Goddess Empire user:', aiGoddessUser.name)
    
    // Count models by AI Goddess Empire
    const totalModels = await db.marketplaceItem.count({
      where: {
        userId: aiGoddessUser.id
      }
    })
    
    console.log(`📦 Total models created by AI Goddess Empire: ${totalModels}`)
    
    // Count SFW vs NSFW models
    const sfwModels = await db.marketplaceItem.count({
      where: {
        userId: aiGoddessUser.id,
        isNsfw: false
      }
    })
    
    const nsfwModels = await db.marketplaceItem.count({
      where: {
        userId: aiGoddessUser.id,
        isNsfw: true
      }
    })
    
    console.log(`📦 SFW models: ${sfwModels}, NSFW models: ${nsfwModels}`)
    
    // Get sample models
    const sampleModels = await db.marketplaceItem.findMany({
      where: {
        userId: aiGoddessUser.id
      },
      take: 5,
      orderBy: {
        listingNumber: 'asc'
      }
    })
    
    console.log('📄 Sample models:')
    sampleModels.forEach((model, index) => {
      console.log(`${index + 1}. ${model.title} (${model.isNsfw ? 'NSFW' : 'SFW'}) - $${model.price}`)
    })
    
    // Check price ranges
    const priceStats = await db.marketplaceItem.groupBy({
      by: ['isNsfw'],
      where: {
        userId: aiGoddessUser.id
      },
      _min: {
        price: true
      },
      _max: {
        price: true
      },
      _avg: {
        price: true
      }
    })
    
    console.log('💰 Price statistics:')
    priceStats.forEach(stat => {
      console.log(`${stat.isNsfw ? 'NSFW' : 'SFW'}: Min $${stat._min.price}, Max $${stat._max.price}, Avg $${stat._avg.price?.toFixed(2)}`)
    })
    
    // Check themes distribution
    const models = await db.marketplaceItem.findMany({
      where: {
        userId: aiGoddessUser.id
      },
      select: {
        title: true,
        isNsfw: true,
        tags: true
      }
    })
    
    const themeCounts: { [key: string]: number } = {}
    
    models.forEach(model => {
      const tags = JSON.parse(model.tags || '[]') as string[]
      tags.forEach(tag => {
        if (['sexy police officer', 'attractive nurse', 'fitness influencer', 'elegant cosplay', 'beach model', 'artistic boudoir', 'fine art nude', 'elegant fantasy', 'sophisticated professional'].includes(tag)) {
          themeCounts[tag] = (themeCounts[tag] || 0) + 1
        }
      })
    })
    
    console.log('🎭 Theme distribution:')
    Object.entries(themeCounts).forEach(([theme, count]) => {
      console.log(`${theme}: ${count} models`)
    })
    
    console.log('✅ AI Goddess Empire models verification completed!')
    
  } catch (error) {
    console.error('Error checking AI Goddess models:', error)
  } finally {
    await db.$disconnect()
  }
}

checkAIGoddessModels()