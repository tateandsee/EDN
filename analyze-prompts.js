const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function analyzePrompts() {
  try {
    console.log('=== Analyzing Current Prompts ===')
    
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        positivePrompt: true,
        negativePrompt: true,
        tags: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`Analyzing ${items.length} items\n`)

    // Analyze hair diversity
    const hairTypes = ['blonde', 'brunette', 'redhead', 'black', 'brown', 'golden', 'dark']
    const hairCounts = {}
    hairTypes.forEach(type => hairCounts[type] = 0)

    // Analyze age diversity
    const ageRanges = ['18', '19', '20', '21', '22', '23', '24', '25']
    const ageCounts = {}
    ageRanges.forEach(age => ageCounts[age] = 0)

    // Analyze outfit types
    const outfitTypes = ['lingerie', 'bikini', 'dress', 'costume', 'cosplay', 'erotic', 'provocative', 'sexy']
    const outfitCounts = {}
    outfitTypes.forEach(type => outfitCounts[type] = 0)

    // Analyze image types
    const imageTypes = ['full body', 'partially nude', 'nude', 'portrait', 'erotic']
    const imageTypeCounts = {}
    imageTypes.forEach(type => imageTypeCounts[type] = 0)

    items.forEach((item, index) => {
      const prompt = (item.positivePrompt || '').toLowerCase()
      const title = (item.title || '').toLowerCase()
      
      // Count hair types
      hairTypes.forEach(type => {
        if (prompt.includes(type) || title.includes(type)) {
          hairCounts[type]++
        }
      })

      // Count age references
      ageRanges.forEach(age => {
        if (prompt.includes(`${age} years`) || prompt.includes(`age ${age}`) || title.includes(age)) {
          ageCounts[age]++
        }
      })

      // Count outfit types
      outfitTypes.forEach(type => {
        if (prompt.includes(type) || title.includes(type)) {
          outfitCounts[type]++
        }
      })

      // Count image types
      imageTypes.forEach(type => {
        if (prompt.includes(type) || title.includes(type)) {
          imageTypeCounts[type]++
        }
      })
    })

    console.log('Hair Type Distribution:')
    Object.entries(hairCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

    console.log('\nAge Distribution:')
    Object.entries(ageCounts).forEach(([age, count]) => {
      console.log(`  ${age} years: ${count}`)
    })

    console.log('\nOutfit Type Distribution:')
    Object.entries(outfitCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

    console.log('\nImage Type Distribution:')
    Object.entries(imageTypeCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

    // Check for prompt similarity
    console.log('\nPrompt Analysis:')
    const promptLengths = items.map(item => item.positivePrompt?.length || 0)
    const avgPromptLength = promptLengths.reduce((a, b) => a + b, 0) / promptLengths.length
    console.log(`Average prompt length: ${avgPromptLength.toFixed(0)} characters`)

    // Check for duplicate prompts
    const promptTexts = items.map(item => item.positivePrompt)
    const duplicatePrompts = promptTexts.filter((prompt, index) => promptTexts.indexOf(prompt) !== index)
    console.log(`Duplicate prompts: ${duplicatePrompts.length}`)

    return {
      hairCounts,
      ageCounts,
      outfitCounts,
      imageTypeCounts,
      avgPromptLength,
      duplicatePrompts: duplicatePrompts.length
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzePrompts()