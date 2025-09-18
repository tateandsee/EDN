import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying marketplace items state...')
  
  try {
    // Fetch all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    console.log(`\n📊 Total marketplace items: ${items.length}`)
    
    // Check for duplicates
    const titles = items.map(item => item.title)
    const duplicateTitles = titles.filter((title, index) => titles.indexOf(title) !== index)
    const uniqueDuplicates = [...new Set(duplicateTitles)]
    
    console.log(`\n🔄 Duplicate titles found: ${uniqueDuplicates.length}`)
    if (uniqueDuplicates.length > 0) {
      console.log('Duplicate titles:', uniqueDuplicates)
    } else {
      console.log('✅ No duplicate titles found')
    }
    
    // Check NSFW status
    const nsfwItems = items.filter(item => item.isNsfw)
    console.log(`\n🔥 NSFW items: ${nsfwItems.length}/${items.length}`)
    
    // Check category distribution
    const categories = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    console.log('\n📂 Category distribution:')
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`)
    })
    
    // Check image types
    let svgCount = 0
    let placeholderCount = 0
    let otherCount = 0
    
    items.forEach(item => {
      if (item.thumbnail?.includes('data:image/svg+xml')) {
        svgCount++
      } else if (item.thumbnail?.includes('placeholder-')) {
        placeholderCount++
      } else {
        otherCount++
      }
    })
    
    console.log('\n🖼️ Image types:')
    console.log(`   SVG images: ${svgCount}`)
    console.log(`   Placeholder images: ${placeholderCount}`)
    console.log(`   Other images: ${otherCount}`)
    
    // Check items with placeholder images
    if (placeholderCount > 0) {
      console.log('\n⚠️  Items still using placeholder images:')
      items.filter(item => item.thumbnail?.includes('placeholder-')).forEach(item => {
        console.log(`   - ${item.title} (${item.thumbnail})`)
      })
    }
    
    // Check tag distribution for ethnicity, hair color, eye color
    const ethnicities = ['caucasian', 'asian', 'mixed race', 'persian']
    const hairColors = ['golden', 'red', 'dark']
    const eyeColors = ['blue', 'green', 'brown']
    
    console.log('\n🏷️  Tag distribution:')
    
    ethnicities.forEach(ethnicity => {
      const count = items.filter(item => {
        const tags = Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || '[]')
        return tags.some((tag: string) => tag.toLowerCase() === ethnicity)
      }).length
      console.log(`   ${ethnicity}: ${count}`)
    })
    
    hairColors.forEach(color => {
      const count = items.filter(item => {
        const tags = Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || '[]')
        return tags.some((tag: string) => tag.toLowerCase() === color)
      }).length
      console.log(`   ${color} hair: ${count}`)
    })
    
    eyeColors.forEach(color => {
      const count = items.filter(item => {
        const tags = Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || '[]')
        return tags.some((tag: string) => tag.toLowerCase() === color)
      }).length
      console.log(`   ${color} eyes: ${count}`)
    })
    
    // Price range
    const prices = items.map(item => item.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
    
    console.log('\n💰 Price information:')
    console.log(`   Price range: $${minPrice} - $${maxPrice}`)
    console.log(`   Average price: $${avgPrice.toFixed(2)}`)
    
    console.log('\n✅ Verification completed!')
    
  } catch (error) {
    console.error('❌ Error verifying marketplace items:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error verifying marketplace items:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })