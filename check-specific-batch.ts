import { db } from './src/lib/db'
import fs from 'fs'
import path from 'path'

async function checkSpecificBatch() {
  try {
    // Read our summary file
    const summaryPath = path.join(process.cwd(), 'ai-legend-nsfw-models-summary.json')
    if (!fs.existsSync(summaryPath)) {
      throw new Error('Summary file not found')
    }

    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
    console.log(`Summary generated at: ${summary.generatedAt}`)
    console.log(`Expected models: ${summary.totalModels} (${summary.semiNudeCount} semi-nude, ${summary.fullNudeCount} full-nude)`)

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

    // Get all marketplace items by AI legend
    const allItems = await db.marketplaceItem.findMany({
      where: {
        userId: aiLegendUser.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Find items that match our summary titles
    const summaryTitles = summary.models.map((m: any) => m.title)
    const matchedItems = allItems.filter(item => summaryTitles.includes(item.title))

    console.log(`\nMatching items found: ${matchedItems.length} out of ${summary.totalModels}`)

    // Count by type
    const semiNudeCount = matchedItems.filter(item => {
      const config = item.promptConfig as any
      return config && config.isFullNude === false
    }).length

    const fullNudeCount = matchedItems.filter(item => {
      const config = item.promptConfig as any
      return config && config.isFullNude === true
    }).length

    console.log(`- Semi-nude models: ${semiNudeCount}`)
    console.log(`- Full-nude models: ${fullNudeCount}`)

    // Show matched items
    console.log('\nMatched models:')
    matchedItems.forEach((item, index) => {
      const config = item.promptConfig as any
      const nudeType = config?.isFullNude ? 'Full Nude' : 'Semi-Nude'
      const summaryModel = summary.models.find((m: any) => m.title === item.title)
      console.log(`${index + 1}. ${item.title} - $${item.price} (${nudeType})`)
    })

    // Check if any summary titles are missing
    const missingTitles = summaryTitles.filter(title => !matchedItems.some(item => item.title === title))
    if (missingTitles.length > 0) {
      console.log(`\nMissing titles (${missingTitles.length}):`)
      missingTitles.forEach((title, index) => {
        console.log(`${index + 1}. ${title}`)
      })
    }

    // Final verification
    if (matchedItems.length === summary.totalModels && semiNudeCount === summary.semiNudeCount && fullNudeCount === summary.fullNudeCount) {
      console.log('\n✅ Perfect! All expected models found with correct counts.')
    } else {
      console.log('\n❌ Some models are missing or counts do not match.')
    }

  } catch (error) {
    console.error('Error checking specific batch:', error)
    throw error
  }
}

// Run the check
checkSpecificBatch()
  .then(() => {
    console.log('\nCheck completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Check failed:', error)
    process.exit(1)
  })