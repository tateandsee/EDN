import { db } from './src/lib/db'
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

// Model configuration arrays for diversity
const ETHNICITIES = [
  { type: 'Caucasian', count: 10 },
  { type: 'Mixed Race', count: 8 },
  { type: 'Asian', count: 7 },
  { type: 'Persian', count: 5 }
]

const AGES = [18, 19, 20, 21, 22, 23]

const HAIR_STYLES = [
  'long slicked-back hair',
  'soft wavy layers',
  'blunt bob with face-framing layers',
  'middle-parted sleek hair'
]

const HAIR_COLORS = [
  'platinum blonde',
  'jet black',
  'light brown balayage',
  'honey blonde',
  'rich auburn'
]

const EYE_COLORS = ['blue', 'green', 'hazel', 'brown']

const SETTINGS = [
  'reclining elegantly on a velvet sofa',
  'leaning against a floor-to-ceiling window',
  'posing on a luxurious bed',
  'standing in a modern penthouse shower'
]

const OUTFITS = [
  'wearing only unbuttoned denim shorts',
  'wearing an unzipped leather jacket',
  'wearing sheer black stockings',
  'wearing an open silk robe'
]

// Negative prompt (non-negotiable)
const NEGATIVE_PROMPT = `(worst quality, low quality, normal quality:1.8), watermark, signature, username, text, logo, copyright, trademark, artist name, error,
deformed, distorted, disfigured, bad anatomy, wrong anatomy, malformed, mutation, mutated, ugly, disgusting, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts,
stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, latex, mannequin, wax figure,
cloned face, airbrushed, uncanny valley, fake looking, computer generated,
asymmetrical breasts, malformed nipples, asymmetrical areolas, poorly drawn nipples, blurry nipples, unnatural nipples,
extra fingers, fused fingers, too many fingers, long neck, long body, extra limb, missing limb, floating limbs, disconnected limbs,
poorly drawn hands, poorly drawn face, poorly drawn feet, malformed toes, deformed feet, awkward arm positions, disjointed limbs, malformed elbows, distorted knees,
makeup streaks, messy makeup, smudged eyeliner`

interface ModelData {
  id: string
  title: string
  description: string
  prompt: string
  negativePrompt: string
  price: number
  isNsfw: boolean
  isFullNude: boolean
  ethnicity: string
  age: number
  hairColor: string
  eyeColor: string
  setting: string
  imagePath?: string
}

function generateModelData(isFullNude: boolean, index: number): ModelData {
  // Select ethnicity based on distribution
  let ethnicity = ''
  let ethnicityCounter = 0
  for (const eth of ETHNICITIES) {
    ethnicityCounter += eth.count
    if (index < ethnicityCounter) {
      ethnicity = eth.type
      break
    }
  }

  const age = AGES[Math.floor(Math.random() * AGES.length)]
  const hairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)]
  const hairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)]
  const eyeColor = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)]
  const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)]
  
  const outfitOption = isFullNude 
    ? 'artistic nude:1.3'
    : `${OUTFITS[Math.floor(Math.random() * OUTFITS.length)]}:1.3`

  // Generate positive prompt
  const positivePrompt = `(masterpiece, photorealistic, best quality, ultra detailed, 8k:1.4),
a stunningly beautiful ${age} year old ${ethnicity} woman,
(extremely large, perfectly round surgically enhanced breasts:1.6), (perky, symmetrical areolas:1.5), (perfect nipple detail:1.5),
(toned stomach, wide hips, shapely thighs:1.4), (perfect female anatomy:1.6),
${hairStyle} of ${hairColor} hair,
(sparkling ${eyeColor} eyes:1.3), (doe-eyed expression, long eyelashes:1.2), (full glossy lips:1.2), (clean glass skin, subtle highlight:1.3), (soft natural makeup:1.1),
${setting},
(${outfitOption}),
(sensual, confident expression:1.2), (looking at viewer:1.1),
(shot on Canon EOS R5, 85mm f/1.2:1.3), (cinematic lighting, soft shadows:1.3), (sharp focus on eyes and face:1.4), (professional studio lighting:1.2), (ultra-detailed skin texture:1.4)`

  // Generate title
  const state = isFullNude ? 'Full Nude' : 'Semi-Nude'
  const settingName = setting.split(' ').slice(-2).join(' ') // Get last two words for setting name
  const title = `${age}yo ${ethnicity} ${hairColor} Beauty ${state} in ${settingName}`

  // Generate description
  const bodyType = 'voluptuous'
  const lighting = 'professional studio'
  const description = `Exclusive, hyper-realistic AI-generated model. Stunning ${age}-year-old ${ethnicity} woman with ${hairColor} hair and ${eyeColor} eyes. Featuring an incredible ${bodyType} physique with perfectly enhanced breasts. Captured in an artistic ${state.toLowerCase()} pose in a ${setting} with professional ${lighting} lighting. Perfect anatomy verified. This unique character was generated from a single, intricate prompt for flawless consistency.`

  // Set price
  const price = isFullNude 
    ? Math.floor(Math.random() * 51) + 250 // $250-300
    : Math.floor(Math.random() * 51) + 150 // $150-200

  return {
    id: `model-${Date.now()}-${index}`,
    title,
    description,
    prompt: positivePrompt,
    negativePrompt: NEGATIVE_PROMPT,
    price,
    isNsfw: true,
    isFullNude,
    ethnicity,
    age,
    hairColor,
    eyeColor,
    setting
  }
}

async function generateImage(prompt: string, outputPath: string): Promise<void> {
  try {
    const zai = await ZAI.create()
    
    const response = await zai.images.generations.create({
      prompt,
      size: '1024x1024'
    })

    if (response.data && response.data[0] && response.data[0].base64) {
      const imageBuffer = Buffer.from(response.data[0].base64, 'base64')
      fs.writeFileSync(outputPath, imageBuffer)
      console.log(`Generated image: ${outputPath}`)
    } else {
      throw new Error('No image data received from API')
    }
  } catch (error) {
    console.error(`Error generating image for ${outputPath}:`, error)
    throw error
  }
}

async function createMarketplaceItem(modelData: ModelData, userId: string, imagePath: string) {
  try {
    const marketplaceItem = await db.marketplaceItem.create({
      data: {
        title: modelData.title,
        description: modelData.description,
        type: 'AI_MODEL',
        category: 'NSFW',
        price: modelData.price,
        currency: 'USD',
        status: 'ACTIVE',
        thumbnail: imagePath,
        isNsfw: modelData.isNsfw,
        positivePrompt: modelData.prompt,
        negativePrompt: modelData.negativePrompt,
        fullPrompt: modelData.prompt,
        userId: userId,
        promptConfig: {
          ethnicity: modelData.ethnicity,
          age: modelData.age,
          hairColor: modelData.hairColor,
          eyeColor: modelData.eyeColor,
          setting: modelData.setting,
          isFullNude: modelData.isFullNude
        }
      }
    })

    console.log(`Created marketplace item: ${marketplaceItem.id} - ${marketplaceItem.title}`)
    return marketplaceItem
  } catch (error) {
    console.error('Error creating marketplace item:', error)
    throw error
  }
}

async function main() {
  try {
    console.log('Starting generation of 30 NSFW models...')
    
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

    console.log(`Using user: ${aiLegendUser.name} (${aiLegendUser.id})`)

    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'marketplace-images', 'ai-legend-nsfw-models')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    const generatedModels: ModelData[] = []
    
    // Generate 15 semi-nude models
    console.log('Generating 15 semi-nude models...')
    for (let i = 0; i < 15; i++) {
      console.log(`Generating semi-nude model ${i + 1}/15...`)
      const modelData = generateModelData(false, i)
      
      try {
        const imagePath = path.join(outputDir, `semi-nude-${i + 1}.jpg`)
        await generateImage(modelData.prompt, imagePath)
        modelData.imagePath = `/marketplace-images/ai-legend-nsfw-models/semi-nude-${i + 1}.jpg`
        
        await createMarketplaceItem(modelData, aiLegendUser.id, modelData.imagePath)
        generatedModels.push(modelData)
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Failed to generate semi-nude model ${i + 1}:`, error)
        // Continue with next model
      }
    }

    // Generate 15 full-nude models
    console.log('Generating 15 full-nude models...')
    for (let i = 0; i < 15; i++) {
      console.log(`Generating full-nude model ${i + 1}/15...`)
      const modelData = generateModelData(true, i + 15)
      
      try {
        const imagePath = path.join(outputDir, `full-nude-${i + 1}.jpg`)
        await generateImage(modelData.prompt, imagePath)
        modelData.imagePath = `/marketplace-images/ai-legend-nsfw-models/full-nude-${i + 1}.jpg`
        
        await createMarketplaceItem(modelData, aiLegendUser.id, modelData.imagePath)
        generatedModels.push(modelData)
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Failed to generate full-nude model ${i + 1}:`, error)
        // Continue with next model
      }
    }

    console.log(`\nGeneration complete! Created ${generatedModels.length} models:`)
    console.log(`- Semi-nude models: ${generatedModels.filter(m => !m.isFullNude).length}`)
    console.log(`- Full-nude models: ${generatedModels.filter(m => m.isFullNude).length}`)
    
    // Save generation summary
    const summaryPath = path.join(process.cwd(), 'ai-legend-nsfw-models-summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify({
      generatedAt: new Date().toISOString(),
      totalModels: generatedModels.length,
      semiNudeCount: generatedModels.filter(m => !m.isFullNude).length,
      fullNudeCount: generatedModels.filter(m => m.isFullNude).length,
      models: generatedModels.map(m => ({
        id: m.id,
        title: m.title,
        price: m.price,
        isFullNude: m.isFullNude,
        ethnicity: m.ethnicity,
        age: m.age,
        hairColor: m.hairColor,
        eyeColor: m.eyeColor,
        setting: m.setting
      }))
    }, null, 2))
    
    console.log(`Summary saved to: ${summaryPath}`)
    
  } catch (error) {
    console.error('Error in main process:', error)
    throw error
  }
}

// Run the main function
main()
  .then(() => {
    console.log('Process completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Process failed:', error)
    process.exit(1)
  })