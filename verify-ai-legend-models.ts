import { db } from './src/lib/db'

async function verifyModels() {
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

    console.log(`Verifying models for user: ${aiLegendUser.name} (${aiLegendUser.id})`)

    // Get all marketplace items by AI legend
    const marketplaceItems = await db.marketplaceItem.findMany({
      where: {
        userId: aiLegendUser.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`\nTotal marketplace items by AI legend: ${marketplaceItems.length}`)

    // Count by type
    const semiNudeCount = marketplaceItems.filter(item => {
      const config = item.promptConfig as any
      return config && config.isFullNude === false
    }).length

    const fullNudeCount = marketplaceItems.filter(item => {
      const config = item.promptConfig as any
      return config && config.isFullNude === true
    }).length

    console.log(`- Semi-nude models: ${semiNudeCount}`)
    console.log(`- Full-nude models: ${fullNudeCount}`)

    // Show first few items as examples
    console.log('\nFirst 5 models:')
    marketplaceItems.slice(0, 5).forEach((item, index) => {
      const config = item.promptConfig as any
      console.log(`${index + 1}. ${item.title} - $${item.price} (${config?.isFullNude ? 'Full Nude' : 'Semi-Nude'})`)
    })

    // Check price ranges
    const semiNudePrices = marketplaceItems
      .filter(item => {
        const config = item.promptConfig as any
        return config && config.isFullNude === false
      })
      .map(item => item.price)

    const fullNudePrices = marketplaceItems
      .filter(item => {
        const config = item.promptConfig as any
        return config && config.isFullNude === true
      })
      .map(item => item.price)

    console.log('\nPrice ranges:')
    console.log(`- Semi-nude: $${Math.min(...semiNudePrices)} - $${Math.max(...semiNudePrices)}`)
    console.log(`- Full-nude: $${Math.min(...fullNudePrices)} - $${Math.max(...fullNudePrices)}`)

    // Ethnicity distribution
    const ethnicityCount: Record<string, number> = {}
    marketplaceItems.forEach(item => {
      const config = item.promptConfig as any
      if (config && config.ethnicity) {
        ethnicityCount[config.ethnicity] = (ethnicityCount[config.ethnicity] || 0) + 1
      }
    })

    console.log('\nEthnicity distribution:')
    Object.entries(ethnicityCount).forEach(([ethnicity, count]) => {
      console.log(`- ${ethnicity}: ${count}`)
    })

  } catch (error) {
    console.error('Error verifying models:', error)
    throw error
  }
}

// Run the verification
verifyModels()
  .then(() => {
    console.log('\nVerification completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Verification failed:', error)
    process.exit(1)
  })