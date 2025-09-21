import { db } from './src/lib/db'

async function checkLatestModels() {
  try {
    // Get AI legend user
    const aiLegendUser = await db.user.findFirst({
      where: {
        OR: [
          { name: 'AI legend' },
          { email: 'ai.legend@example.com' }
        ]
      }
    })

    if (!aiLegendUser) {
      throw new Error('AI legend user not found')
    }

    console.log(`Checking latest models for user: ${aiLegendUser.name} (${aiLegendUser.id})`)

    // Get the latest 30 marketplace items by AI legend
    const latestItems = await db.marketplaceItem.findMany({
      where: {
        userId: aiLegendUser.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 30
    })

    console.log(`\nLatest 30 marketplace items by AI legend:`)

    // Count by type
    const semiNudeCount = latestItems.filter(item => {
      const config = item.promptConfig as any
      return config && config.isFullNude === false
    }).length

    const fullNudeCount = latestItems.filter(item => {
      const config = item.promptConfig as any
      return config && config.isFullNude === true
    }).length

    console.log(`- Semi-nude models: ${semiNudeCount}`)
    console.log(`- Full-nude models: ${fullNudeCount}`)

    // Show all items
    console.log('\nAll 30 latest models:')
    latestItems.forEach((item, index) => {
      const config = item.promptConfig as any
      const nudeType = config?.isFullNude ? 'Full Nude' : 'Semi-Nude'
      console.log(`${index + 1}. ${item.title} - $${item.price} (${nudeType})`)
    })

    // Check if these match our expected pattern
    console.log('\nVerification:')
    console.log(`- Total models: ${latestItems.length}`)
    console.log(`- Expected 15 semi-nude + 15 full-nude = 30`)
    console.log(`- Actual: ${semiNudeCount} semi-nude + ${fullNudeCount} full-nude = ${semiNudeCount + fullNudeCount}`)
    
    if (semiNudeCount === 15 && fullNudeCount === 15) {
      console.log('✅ Perfect! Exactly 15 semi-nude and 15 full-nude models created.')
    } else {
      console.log('❌ Model counts do not match expected values.')
    }

  } catch (error) {
    console.error('Error checking latest models:', error)
    throw error
  }
}

// Run the check
checkLatestModels()
  .then(() => {
    console.log('\nCheck completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Check failed:', error)
    process.exit(1)
  })