const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCurrentModels() {
  try {
    console.log('=== Checking Current Models ===')
    
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        price: true,
        thumbnail: true,
        images: true,
        promptConfig: true,
        positivePrompt: true,
        negativePrompt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`Found ${items.length} marketplace items\n`)

    // Check for placeholders
    const placeholders = items.filter(item => 
      !item.thumbnail || 
      (item.thumbnail && !item.thumbnail.startsWith('data:')) ||
      (item.thumbnail && item.thumbnail.includes('placeholder'))
    )

    console.log(`Items with placeholder or missing thumbnails: ${placeholders.length}`)

    // Check pricing
    const prices = items.map(item => item.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

    console.log(`Price range: $${minPrice} - $${maxPrice}`)
    console.log(`Average price: $${avgPrice.toFixed(2)}`)

    // Check tags for diversity
    const allTags = new Set()
    items.forEach(item => {
      if (item.tags) {
        try {
          const tags = JSON.parse(item.tags)
          tags.forEach(tag => allTags.add(tag))
        } catch (e) {
          console.log(`Error parsing tags for item ${item.id}`)
        }
      }
    })

    console.log(`Unique tags: ${allTags.size}`)
    console.log('Tags:', Array.from(allTags).sort())

    // Check for duplicate titles
    const titles = items.map(item => item.title)
    const duplicateTitles = titles.filter((title, index) => titles.indexOf(title) !== index)
    const uniqueDuplicates = [...new Set(duplicateTitles)]

    console.log(`Duplicate titles: ${uniqueDuplicates.length}`)
    if (uniqueDuplicates.length > 0) {
      console.log('Duplicate title examples:', uniqueDuplicates.slice(0, 5))
    }

    // Check prompt configurations for variety
    const promptConfigs = items.filter(item => item.promptConfig)
    console.log(`Items with prompt config: ${promptConfigs.length}`)

    const positivePrompts = items.filter(item => item.positivePrompt)
    console.log(`Items with positive prompt: ${positivePrompts.length}`)

    return {
      totalItems: items.length,
      placeholders: placeholders.length,
      priceRange: { min: minPrice, max: maxPrice, avg: avgPrice },
      uniqueTags: allTags.size,
      duplicateTitles: uniqueDuplicates.length,
      hasPromptConfigs: promptConfigs.length,
      hasPositivePrompts: positivePrompts.length
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCurrentModels()