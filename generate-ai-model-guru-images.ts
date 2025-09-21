import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface ModelData {
  id: string
  title: string
  isNsfw: boolean
  positivePrompt: string
  negativePrompt: string
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

async function generateImages() {
  console.log('Starting image generation for AI Model Guru models...')
  
  // Load the models data
  const dataPath = path.join(process.cwd(), 'public', 'marketplace-images', 'ai-model-guru-models', 'ai-model-guru-models-data.json')
  
  if (!fs.existsSync(dataPath)) {
    throw new Error('Models data file not found. Please run generate-ai-model-guru-models.ts first.')
  }

  const modelsData: ModelsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'public', 'marketplace-images', 'ai-model-guru-models')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log(`Found ${modelsData.totalModels} models to generate images for`)
  
  let generatedCount = 0
  let errorCount = 0

  for (let i = 0; i < modelsData.models.length; i++) {
    const model = modelsData.models[i]
    const imageType = model.isNsfw ? 'nsfw' : 'sfw'
    const outputFileName = `${imageType}-${i + 1}.jpg`
    const outputPath = path.join(outputDir, outputFileName)
    
    console.log(`\n[${i + 1}/${modelsData.totalModels}] Generating ${imageType.toUpperCase()} image: ${model.title}`)
    
    try {
      // Skip if image already exists
      if (fs.existsSync(outputPath)) {
        console.log(`  ⏭️  Image already exists, skipping...`)
        generatedCount++
        continue
      }

      // Create a simplified prompt for the CLI (avoid complex formatting)
      const simplifiedPrompt = model.positivePrompt
        .replace(/\([^)]*\)/g, '') // Remove weighted terms
        .replace(/\d+\.?\d*/g, '') // Remove numbers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
        .substring(0, 500) // Limit length

      // Generate image using CLI
      const command = `z-ai-generate -p "${simplifiedPrompt}" -o "${outputPath}" -s 1024x1024`
      
      console.log(`  🎨 Generating image...`)
      execSync(command, { 
        stdio: 'pipe',
        timeout: 120000 // 2 minute timeout
      })
      
      if (fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath)
        console.log(`  ✅ Generated: ${outputFileName} (${Math.round(stats.size / 1024)}KB)`)
        generatedCount++
      } else {
        throw new Error('Image file was not created')
      }
      
      // Add a small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error(`  ❌ Error generating image for ${model.title}:`, error.message)
      errorCount++
      
      // Create a placeholder image if generation failed
      try {
        // Copy a placeholder image or create a simple one
        const placeholderPath = path.join(process.cwd(), 'public', 'placeholder.jpg')
        if (fs.existsSync(placeholderPath)) {
          fs.copyFileSync(placeholderPath, outputPath)
          console.log(`  📋 Created placeholder image`)
        }
      } catch (copyError) {
        console.error(`  ❌ Could not create placeholder:`, copyError.message)
      }
    }
  }

  console.log(`\n📊 Image Generation Summary:`)
  console.log(`   - Total Models: ${modelsData.totalModels}`)
  console.log(`   - Successfully Generated: ${generatedCount}`)
  console.log(`   - Errors: ${errorCount}`)
  console.log(`   - Success Rate: ${Math.round((generatedCount / modelsData.totalModels) * 100)}%`)

  // Update the models data with actual image paths
  const updatedModelsData = {
    ...modelsData,
    imagesGeneratedAt: new Date().toISOString(),
    generationStats: {
      total: modelsData.totalModels,
      successful: generatedCount,
      errors: errorCount,
      successRate: Math.round((generatedCount / modelsData.totalModels) * 100)
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(updatedModelsData, null, 2))
  console.log(`\n📁 Updated models data saved to: ${dataPath}`)
  
  return updatedModelsData
}

// Main execution
async function main() {
  try {
    const modelsData = await generateImages()
    console.log('\n✅ Successfully completed image generation!')
    
    if (modelsData.generationStats.successful === modelsData.totalModels) {
      console.log('🎉 All images generated successfully!')
    } else {
      console.log('⚠️  Some images failed to generate. Check the logs above for details.')
    }
    
    console.log('\n📋 Next steps:')
    console.log('   1. Review the generated images')
    console.log('   2. Run the database insertion script to create marketplace listings')
    console.log('   3. Verify the listings appear in the marketplace')
    
  } catch (error) {
    console.error('❌ Error during image generation:', error)
    process.exit(1)
  }
}

main()