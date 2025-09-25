import { db } from './src/lib/db'
import fs from 'fs'
import path from 'path'

async function verifyAIModelGuruListings() {
  console.log('Verifying AI Model Guru marketplace listings...')
  
  try {
    // Get AI Model Guru user
    const user = await db.user.findUnique({
      where: { email: 'ai-model-guru@example.com' }
    })
    
    if (!user) {
      throw new Error('AI Model Guru user not found')
    }
    
    console.log(`✅ Found user: ${user.name} (${user.email})`)
    
    // Get marketplace stats for this user
    const marketplaceStats = await db.marketplaceItem.groupBy({
      by: ['category', 'isNsfw'],
      _count: { id: true },
      _sum: { price: true },
      where: {
        userId: user.id,
        status: 'ACTIVE'
      }
    })
    
    console.log('\n📊 Marketplace Statistics:')
    let totalListings = 0
    let totalValue = 0
    
    marketplaceStats.forEach(stat => {
      const count = stat._count.id
      const value = stat._sum.price || 0
      totalListings += count
      totalValue += value
      
      console.log(`   ${stat.category} (${stat.isNsfw ? 'NSFW' : 'SFW'}): ${count} listings, $${value.toFixed(2)}`)
    })
    
    console.log(`\n📈 Total Summary:`)
    console.log(`   Total Listings: ${totalListings}`)
    console.log(`   Total Value: $${totalValue.toFixed(2)}`)
    console.log(`   Average Price: $${(totalValue / totalListings).toFixed(2)}`)
    
    // Get listing number range
    const listingRange = await db.marketplaceItem.aggregate({
      where: {
        userId: user.id
      },
      _min: {
        listingNumber: true
      },
      _max: {
        listingNumber: true
      }
    })
    
    console.log(`\n📋 Listing Numbers: ${listingRange._min.listingNumber} - ${listingRange._max.listingNumber}`)
    
    // Check image files
    const imageDir = path.join(process.cwd(), 'public', 'marketplace-images', 'ai-model-guru-models')
    let imageCount = 0
    let missingImages = 0
    
    if (fs.existsSync(imageDir)) {
      const imageFiles = fs.readdirSync(imageDir).filter(file => file.endsWith('.jpg'))
      imageCount = imageFiles.length
      
      // Check each marketplace item has corresponding images
      const marketplaceItems = await db.marketplaceItem.findMany({
        where: {
          userId: user.id
        },
        select: {
          id: true,
          title: true,
          thumbnail: true,
          images: true
        }
      })
      
      for (const item of marketplaceItems) {
        const thumbnailPath = path.join(process.cwd(), 'public', item.thumbnail)
        if (!fs.existsSync(thumbnailPath)) {
          missingImages++
          console.log(`⚠️  Missing thumbnail for: ${item.title}`)
        }
      }
    }
    
    console.log(`\n🖼️  Image Files:`)
    console.log(`   Images in directory: ${imageCount}`)
    console.log(`   Missing thumbnails: ${missingImages}`)
    
    // Sample a few listings to verify data quality
    console.log('\n📝 Sample Listings:')
    const sampleListings = await db.marketplaceItem.findMany({
      where: {
        userId: user.id
      },
      take: 5,
      orderBy: {
        listingNumber: 'asc'
      },
      select: {
        listingNumber: true,
        title: true,
        category: true,
        isNsfw: true,
        price: true,
        positivePrompt: true,
        thumbnail: true
      }
    })
    
    sampleListings.forEach((listing, index) => {
      console.log(`\n   ${index + 1}. Listing #${listing.listingNumber}`)
      console.log(`      Title: ${listing.title}`)
      console.log(`      Category: ${listing.category} (${listing.isNsfw ? 'NSFW' : 'SFW'})`)
      console.log(`      Price: $${listing.price}`)
      console.log(`      Prompt Length: ${listing.positivePrompt?.length || 0} chars`)
      console.log(`      Thumbnail: ${listing.thumbnail}`)
    })
    
    // Load the generated data file for comparison
    const dataPath = path.join(imageDir, 'ai-model-guru-models-data.json')
    if (fs.existsSync(dataPath)) {
      const modelsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
      console.log('\n📄 Generated Data File:')
      console.log(`   Generated At: ${modelsData.generatedAt}`)
      console.log(`   Total Models in Data: ${modelsData.totalModels}`)
      console.log(`   SFW Models in Data: ${modelsData.sfwModels}`)
      console.log(`   NSFW Models in Data: ${modelsData.nsfwModels}`)
    }
    
    console.log('\n✅ Verification Complete!')
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      marketplaceStats,
      totalListings,
      totalValue,
      listingRange,
      imageStats: {
        imageCount,
        missingImages
      },
      sampleListings
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    const results = await verifyAIModelGuruListings()
    
    console.log('\n🎉 AI Model Guru Marketplace Setup Summary:')
    console.log(`✅ User Created: ${results.user.name}`)
    console.log(`✅ Listings Inserted: ${results.totalListings}`)
    console.log(`✅ Total Portfolio Value: $${results.totalValue.toFixed(2)}`)
    console.log(`✅ Image Files: ${results.imageStats.imageCount} generated`)
    
    if (results.imageStats.missingImages === 0) {
      console.log('✅ All images accounted for')
    } else {
      console.log(`⚠️  ${results.imageStats.missingImages} images need to be generated/replaced`)
    }
    
    console.log('\n📋 Next Steps:')
    console.log('   1. Replace placeholder images with actual AI-generated images')
    console.log('   2. Test marketplace functionality with these listings')
    console.log('   3. Monitor user engagement and sales performance')
    console.log('   4. Consider generating additional model variations')
    
  } catch (error) {
    console.error('❌ Verification failed:', error)
    process.exit(1)
  }
}

main()