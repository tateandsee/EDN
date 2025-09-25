import { db } from './src/lib/db'
import fs from 'fs'
import path from 'path'

interface ModelData {
  id: string
  title: string
  description: string
  type: 'AI_MODEL'
  category: 'SFW' | 'NSFW'
  price: number
  currency: string
  status: 'ACTIVE'
  isNsfw: boolean
  positivePrompt: string
  negativePrompt: string
  fullPrompt: string
  promptConfig: any
  thumbnail: string
  images: string[]
}

interface ModelsData {
  generatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  totalModels: number
  sfwModels: number
  nsfwModels: number
  models: ModelData[]
}

async function insertMarketplaceListings() {
  console.log('Inserting AI Model Guru marketplace listings...')
  
  // Load the models data
  const dataPath = path.join(process.cwd(), 'public', 'marketplace-images', 'ai-model-guru-models', 'ai-model-guru-models-data.json')
  
  if (!fs.existsSync(dataPath)) {
    throw new Error('Models data file not found. Please run generate-ai-model-guru-models.ts first.')
  }

  const modelsData: ModelsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  
  console.log(`Found ${modelsData.totalModels} models to insert into marketplace`)
  console.log(`User: ${modelsData.user.name} (${modelsData.user.email})`)
  
  // Get the highest current listing number
  const highestListing = await db.marketplaceItem.findFirst({
    orderBy: { listingNumber: 'desc' },
    select: { listingNumber: true }
  })
  
  const startingListingNumber = (highestListing?.listingNumber || 0) + 1
  console.log(`Starting listing number: ${startingListingNumber}`)
  
  let insertedCount = 0
  let errorCount = 0
  
  for (let i = 0; i < modelsData.models.length; i++) {
    const modelData = modelsData.models[i]
    const listingNumber = startingListingNumber + i
    
    console.log(`\n[${i + 1}/${modelsData.totalModels}] Inserting listing #${listingNumber}: ${modelData.title}`)
    
    try {
      // Check if listing already exists (by title and user)
      const existingListing = await db.marketplaceItem.findFirst({
        where: {
          userId: modelsData.user.id,
          title: modelData.title
        }
      })
      
      if (existingListing) {
        console.log(`  ⏭️  Listing already exists, skipping...`)
        continue
      }
      
      // Verify image files exist
      const imagePath = path.join(process.cwd(), 'public', modelData.thumbnail)
      if (!fs.existsSync(imagePath)) {
        console.log(`  ⚠️  Image file not found: ${modelData.thumbnail}`)
        // Continue anyway, we'll insert the listing with the path
      }
      
      // Insert the marketplace item
      const marketplaceItem = await db.marketplaceItem.create({
        data: {
          listingNumber,
          title: modelData.title,
          description: modelData.description,
          type: modelData.type,
          category: modelData.category,
          price: modelData.price,
          currency: modelData.currency,
          status: modelData.status,
          thumbnail: modelData.thumbnail,
          images: JSON.stringify(modelData.images),
          isNsfw: modelData.isNsfw,
          promptConfig: modelData.promptConfig,
          positivePrompt: modelData.positivePrompt,
          negativePrompt: modelData.negativePrompt,
          fullPrompt: modelData.fullPrompt,
          userId: modelsData.user.id,
          tags: JSON.stringify([
            modelData.category.toLowerCase(),
            'ai-model',
            'female',
            'photorealistic',
            modelData.isNsfw ? 'nude' : 'clothed',
            'ai-model-guru-collection'
          ])
        }
      })
      
      console.log(`  ✅ Inserted marketplace item ID: ${marketplaceItem.id}`)
      insertedCount++
      
    } catch (error) {
      console.error(`  ❌ Error inserting listing for ${modelData.title}:`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Database Insertion Summary:`)
  console.log(`   - Total Models: ${modelsData.totalModels}`)
  console.log(`   - Successfully Inserted: ${insertedCount}`)
  console.log(`   - Errors: ${errorCount}`)
  console.log(`   - Success Rate: ${Math.round((insertedCount / modelsData.totalModels) * 100)}%`)
  
  // Get final marketplace stats
  const finalStats = await db.marketplaceItem.groupBy({
    by: ['category', 'isNsfw'],
    _count: { id: true },
    where: {
      userId: modelsData.user.id
    }
  })
  
  console.log(`\n📈 AI Model Guru's Marketplace Stats:`)
  finalStats.forEach(stat => {
    console.log(`   - ${stat.category} (${stat.isNsfw ? 'NSFW' : 'SFW'}): ${stat._count.id} listings`)
  })
  
  return {
    totalModels: modelsData.totalModels,
    insertedCount,
    errorCount,
    successRate: Math.round((insertedCount / modelsData.totalModels) * 100),
    finalStats
  }
}

// Main execution
async function main() {
  try {
    const result = await insertMarketplaceListings()
    console.log('\n✅ Successfully completed marketplace listings insertion!')
    
    if (result.insertedCount === result.totalModels) {
      console.log('🎉 All listings inserted successfully!')
    } else {
      console.log('⚠️  Some listings failed to insert. Check the logs above for details.')
    }
    
    console.log('\n📋 Next steps:')
    console.log('   1. Verify the listings appear in the marketplace')
    console.log('   2. Replace placeholder images with actual AI-generated images')
    console.log('   3. Test the marketplace functionality')
    console.log('   4. Monitor user engagement with the new listings')
    
  } catch (error) {
    console.error('❌ Error during marketplace listings insertion:', error)
    process.exit(1)
  }
}

main()