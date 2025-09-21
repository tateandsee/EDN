import fs from 'fs'
import path from 'path'

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

async function createPlaceholderImages() {
  console.log('Creating placeholder images for AI Model Guru models...')
  
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

  console.log(`Creating placeholder images for ${modelsData.totalModels} models...`)
  
  // Check if placeholder image exists
  const placeholderPath = path.join(process.cwd(), 'public', 'placeholder.jpg')
  if (!fs.existsSync(placeholderPath)) {
    console.log('Placeholder image not found. Using existing marketplace images as templates...')
    
    // Use some existing marketplace images as templates
    const templateDir = path.join(process.cwd(), 'public', 'marketplace-images')
    const templateFiles = fs.readdirSync(templateDir)
      .filter(file => file.endsWith('.jpg') && !file.includes('unique-models'))
      .slice(0, 10) // Use first 10 as templates
    
    if (templateFiles.length === 0) {
      throw new Error('No template images found. Please ensure there are images in the marketplace-images directory.')
    }
    
    console.log(`Found ${templateFiles.length} template images to use`)
    
    for (let i = 0; i < modelsData.models.length; i++) {
      const model = modelsData.models[i]
      const imageType = model.isNsfw ? 'nsfw' : 'sfw'
      const outputFileName = `${imageType}-${i + 1}.jpg`
      const outputPath = path.join(outputDir, outputFileName)
      
      // Skip if image already exists
      if (fs.existsSync(outputPath)) {
        console.log(`[${i + 1}/${modelsData.totalModels}] ⏭️  Image already exists: ${outputFileName}`)
        continue
      }
      
      // Use a template image (cycle through available templates)
      const templateFile = templateFiles[i % templateFiles.length]
      const templatePath = path.join(templateDir, templateFile)
      
      try {
        fs.copyFileSync(templatePath, outputPath)
        console.log(`[${i + 1}/${modelsData.totalModels}] ✅ Created placeholder: ${outputFileName} (from ${templateFile})`)
      } catch (error) {
        console.error(`[${i + 1}/${modelsData.totalModels}] ❌ Error copying ${templateFile}:`, error.message)
      }
    }
  } else {
    console.log('Using placeholder.jpg as template for all images...')
    
    for (let i = 0; i < modelsData.models.length; i++) {
      const model = modelsData.models[i]
      const imageType = model.isNsfw ? 'nsfw' : 'sfw'
      const outputFileName = `${imageType}-${i + 1}.jpg`
      const outputPath = path.join(outputDir, outputFileName)
      
      // Skip if image already exists
      if (fs.existsSync(outputPath)) {
        console.log(`[${i + 1}/${modelsData.totalModels}] ⏭️  Image already exists: ${outputFileName}`)
        continue
      }
      
      try {
        fs.copyFileSync(placeholderPath, outputPath)
        console.log(`[${i + 1}/${modelsData.totalModels}] ✅ Created placeholder: ${outputFileName}`)
      } catch (error) {
        console.error(`[${i + 1}/${modelsData.totalModels}] ❌ Error creating placeholder:`, error.message)
      }
    }
  }

  console.log('\n✅ Placeholder images created successfully!')
  
  // Update the models data with generation info
  const updatedModelsData = {
    ...modelsData,
    placeholdersCreated: true,
    placeholdersCreatedAt: new Date().toISOString(),
    note: 'These are placeholder images. Replace with actual generated images using the AI generation tool.'
  }

  fs.writeFileSync(dataPath, JSON.stringify(updatedModelsData, null, 2))
  console.log(`📁 Updated models data saved to: ${dataPath}`)
  
  return updatedModelsData
}

// Main execution
async function main() {
  try {
    const modelsData = await createPlaceholderImages()
    console.log('\n✅ Successfully created placeholder images!')
    console.log('\n📋 Next steps:')
    console.log('   1. Replace placeholder images with actual AI-generated images')
    console.log('   2. Run the database insertion script to create marketplace listings')
    console.log('   3. Verify the listings appear in the marketplace')
    
  } catch (error) {
    console.error('❌ Error creating placeholder images:', error)
    process.exit(1)
  }
}

main()