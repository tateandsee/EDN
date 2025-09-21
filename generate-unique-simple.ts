import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const prisma = new PrismaClient()

// Define all the variations from the prompt
const AGES = ['18', '19', '20', '21', '22', '23', '24', '25']
const ETHNICITIES = ['Asian', 'Caucasian', 'Mixed Race', 'Persian']
const PHYSIQUES = ['athletic and toned', 'voluptuous and curvy', 'slim and shapely']
const HAIR_COLORS = ['jet black', 'platinum blonde', 'dark brown', 'auburn', 'burgundy', 'pastel pink']
const HAIR_STYLES = ['straight', 'wavy', 'curly', 'braided']
const EYE_COLORS = ['emerald green', 'sapphire blue', 'amber', 'deep brown', 'violet', 'heterochromia']

// SFW Outfits (30 Models)
const SFW_OUTFITS = [
  'sexy police uniform', 'naughty nurse costume', 'dominatrix outfit', 'latex dress', 'bondage-inspired fashion',
  'corset with stockings', 'see-through mesh top', 'leather harness', 'wet look outfit', 'chainmail top',
  'cosplay bunny outfit', 'sexy schoolgirl uniform', 'evil queen costume', 'vampire seductress',
  'cyberpunk streetwear', 'fetish wear', 'fishnet bodysuit', 'velvet lingerie', 'choker with pendant',
  'thigh-high boots with mini skirt', 'barely-there bikini', 'peekaboo lingerie', 'cutout bodysuit',
  'tactical gear with exposed midriff', 'gothic lolita', 'metal breastplate armor', 'feathered robe',
  'silk kimono open at front', 'bandage wrap outfit', 'shibari rope art over clothing'
]

// NSFW Outfits (30 Models)
const NSFW_OUTFITS = [
  'completely nude', 'semi-nude with pasties', 'see-through wet t-shirt', 'unbuttoned police shirt',
  'open nurse uniform', 'partially removed cosplay', 'lingerie pulled aside', 'body jewelry only',
  'wrapped in silk sheets', 'covered in oil', 'water droplets on nude skin', 'bathing suit pulled down',
  'strategically placed shadows', 'artistic nude posing', 'implied nudity', 'suggestive positioning',
  'bedroom eyes expression', 'inviting gaze', 'seductive smile', 'playful covering',
  'back view with glance over shoulder', 'side profile emphasizing curves', 'leaning forward pose',
  'kneeling elegantly', 'stretching sensually', 'bending over slightly', 'lying provocatively',
  'arms raised highlighting anatomy', 'legs positioned alluringly', 'hair covering just enough'
]

const SETTINGS = [
  'luxury bedroom', 'neo-noire nightclub', 'rain-soaked alley', 'penthouse suite', 'private yacht',
  'abandoned mansion', 'futuristic cityscape', 'ancient temple', 'rose petal covered bed',
  'steamy bathroom', 'dimly lit bar', 'art gallery', 'recording studio', 'dance rehearsal room',
  'private library', 'rooftop pool', 'sunset beach', 'moonlit forest', 'luxury spa', 'hidden lounge',
  'VIP casino', 'theater stage', 'photo studio', 'dressing room', 'night garden', 'skyscraper office',
  'underground club', 'palace bedroom', 'vintage boudoir', 'infinity pool'
]

// Model names for variety
const MODEL_NAMES = [
  'Aurora', 'Luna', 'Stella', 'Bella', 'Sophia', 'Olivia', 'Emma', 'Ava', 'Isabella', 'Mia',
  'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery',
  'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Penelope', 'Riley', 'Aria', 'Lily', 'Zoey', 'Nora',
  'Hannah', 'Addison', 'Maya', 'Layla', 'Kennedy', 'Genesis', 'Nova', 'Brooklyn', 'Audrey', 'Lucy',
  'Kinsley', 'Naomi', 'Aaliyah', 'Willow', 'Samantha', 'Leah', 'Natalie', 'Violet', 'Hazel', 'Eleanor',
  'Camila', 'Sofia', 'Madison', 'Camila', 'Aurora', 'Stella', 'Bella', 'Sophia'
]

function generateUniquePrompt(listingNumber: number, isNsfw: boolean) {
  // Use listing number to ensure deterministic but unique combinations
  const ageIndex = (listingNumber * 7) % AGES.length
  const ethnicityIndex = (listingNumber * 11) % ETHNICITIES.length
  const physiqueIndex = (listingNumber * 13) % PHYSIQUES.length
  const hairColorIndex = (listingNumber * 17) % HAIR_COLORS.length
  const hairStyleIndex = (listingNumber * 19) % HAIR_STYLES.length
  const eyeColorIndex = (listingNumber * 23) % EYE_COLORS.length
  const settingIndex = (listingNumber * 29) % SETTINGS.length
  
  const age = AGES[ageIndex]
  const ethnicity = ETHNICITIES[ethnicityIndex]
  const physique = PHYSIQUES[physiqueIndex]
  const hairColor = HAIR_COLORS[hairColorIndex]
  const hairStyle = HAIR_STYLES[hairStyleIndex]
  const eyeColor = EYE_COLORS[eyeColorIndex]
  const setting = SETTINGS[settingIndex]
  
  // Select outfit based on NSFW status and ensure uniqueness
  const outfitPool = isNsfw ? NSFW_OUTFITS : SFW_OUTFITS
  const outfitIndex = (listingNumber * 31) % outfitPool.length
  const outfit = outfitPool[outfitIndex]
  
  // Generate the positive prompt
  const positivePrompt = `Stunningly beautiful ${age} year old ${ethnicity} woman with ${physique} physique, ${hairColor} ${hairStyle} hair, and ${eyeColor} eyes. Wearing ${outfit} in a ${setting} atmosphere. Perfect feminine anatomy with very large surgically enhanced breasts, flawless skin, and realistic texture. Photorealistic 8k resolution, ultra-detailed, professional photography.`
  
  return {
    positivePrompt,
    age,
    ethnicity,
    physique,
    hairColor,
    hairStyle,
    eyeColor,
    outfit,
    setting,
    modelName: MODEL_NAMES[listingNumber % MODEL_NAMES.length]
  }
}

// Function to generate image using CLI tool
async function generateAndSaveImage(prompt: string, filename: string, listingNumber: number) {
  try {
    console.log(`🎨 Generating image for listing ${listingNumber}: ${filename}`)
    
    const outputPath = path.join('/home/z/my-project/public/marketplace-images/unique-models', filename)
    
    // Use the CLI tool to generate the image
    const command = `z-ai-generate -p "${prompt}" -o "${outputPath}" -s 1024x1024`
    
    try {
      execSync(command, { timeout: 120000, stdio: 'pipe' }) // 2 minute timeout
      console.log(`✅ Generated and saved: ${filename}`)
      return `/marketplace-images/unique-models/${filename}`
    } catch (cliError) {
      console.error(`❌ CLI generation failed for ${filename}:`, cliError.message)
      return null
    }
    
  } catch (error) {
    console.error(`❌ Failed to generate image for ${filename}:`, error.message)
    return null
  }
}

async function processSingleListing(listing: number) {
  try {
    // Get the marketplace listing
    const marketplaceListing = await prisma.marketplaceItem.findFirst({
      where: {
        listingNumber: listing
      }
    })
    
    if (!marketplaceListing) {
      console.log(`❌ Listing ${listing} not found`)
      return null
    }
    
    console.log(`\\n🔄 Processing listing ${listing}: ${marketplaceListing.title}`)
    
    // Generate unique prompt for this listing
    const promptData = generateUniquePrompt(listing - 1, marketplaceListing.isNsfw)
    
    // Generate filename
    const prefix = marketplaceListing.isNsfw ? 'nsfw' : 'sfw'
    const modelName = promptData.modelName.toLowerCase().replace(/\s+/g, '-')
    const filename = `${prefix}-${listing.toString().padStart(2, '0')}-${modelName}-${marketplaceListing.id.slice(0, 8)}.jpg`
    
    console.log(`📝 Unique characteristics:`)
    console.log(`   Age: ${promptData.age} | Ethnicity: ${promptData.ethnicity} | Physique: ${promptData.physique}`)
    console.log(`   Hair: ${promptData.hairColor} ${promptData.hairStyle} | Eyes: ${promptData.eyeColor}`)
    console.log(`   Outfit: ${promptData.outfit} | Setting: ${promptData.setting}`)
    
    // Generate the unique image
    const imageUrl = await generateAndSaveImage(promptData.positivePrompt, filename, listing)
    
    if (imageUrl) {
      // Update the marketplace listing with the new unique image
      await prisma.marketplaceItem.update({
        where: { id: marketplaceListing.id },
        data: {
          thumbnail: imageUrl,
          images: JSON.stringify([imageUrl]),
          positivePrompt: promptData.positivePrompt
        }
      })
      
      console.log(`✅ Updated listing ${listing} with unique image`)
      
      return {
        listingNumber: listing,
        title: marketplaceListing.title,
        imageUrl: imageUrl,
        promptData: promptData
      }
    } else {
      console.log(`⚠️  Failed to generate image for listing ${listing}`)
      return null
    }
    
  } catch (error) {
    console.error(`Error processing listing ${listing}:`, error)
    return null
  }
}

async function generateUniqueImagesForListings() {
  try {
    console.log('🎨 Starting to generate 60 truly unique images for marketplace listings...')
    
    const generatedImages = []
    
    // Process listings one by one with delays
    for (let i = 1; i <= 60; i++) {
      console.log(`\\n🚀 Starting listing ${i}/60...`)
      
      const result = await processSingleListing(i)
      if (result) {
        generatedImages.push(result)
      }
      
      // Add delay between generations
      if (i < 60) {
        console.log(`⏳ Waiting before next generation...`)
        await new Promise(resolve => setTimeout(resolve, 5000)) // 5 second delay
      }
    }
    
    console.log('\\n🎉 All unique image generation completed!')
    
    // Show detailed summary
    console.log('\\n📊 Final Generation Summary:')
    console.log(`- Total listings processed: 60`)
    console.log(`- Successfully generated images: ${generatedImages.length}`)
    console.log(`- Success rate: ${Math.round((generatedImages.length / 60) * 100)}%`)
    
    // Show variety breakdown
    const ethnicities = [...new Set(generatedImages.map(img => img.promptData.ethnicity))]
    const physiques = [...new Set(generatedImages.map(img => img.promptData.physique))]
    const hairColors = [...new Set(generatedImages.map(img => img.promptData.hairColor))]
    const outfits = [...new Set(generatedImages.map(img => img.promptData.outfit))]
    const settings = [...new Set(generatedImages.map(img => img.promptData.setting))]
    
    console.log('\\n🌈 Variety Breakdown:')
    console.log(`- Ethnicities: ${ethnicities.length} (${ethnicities.join(', ')})`)
    console.log(`- Physiques: ${physiques.length} (${physiques.join(', ')})`)
    console.log(`- Hair Colors: ${hairColors.length} (${hairColors.join(', ')})`)
    console.log(`- Unique Outfits: ${outfits.length}`)
    console.log(`- Unique Settings: ${settings.length}`)
    
    // Show sample generated images
    console.log('\\n📸 Sample Generated Images:')
    generatedImages.slice(0, 5).forEach(img => {
      console.log(`${img.listingNumber}. ${img.title}`)
      console.log(`   ${img.promptData.ethnicity} ${img.promptData.age}yo ${img.promptData.physique}`)
      console.log(`   Outfit: ${img.promptData.outfit}`)
      console.log(`   Setting: ${img.promptData.setting}`)
      console.log(`   Image: ${img.imageUrl}`)
      console.log('')
    })
    
    return generatedImages
    
  } catch (error) {
    console.error('Error in unique image generation process:', error)
    throw error
  }
}

generateUniqueImagesForListings().then(() => {
  console.log('\\n✅ All unique image generation completed successfully')
  process.exit(0)
}).catch((error) => {
  console.error('\\n❌ Unique image generation failed:', error)
  process.exit(1)
})