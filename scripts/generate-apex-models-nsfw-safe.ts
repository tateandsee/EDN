import { db } from '../src/lib/db'
import { MarketplaceType, MarketplaceCategory } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

interface ModelConfig {
  id: string
  ethnicity: string
  ageRange: string
  physique: string
  hairColor: string
  hairStyle: string
  eyeColor: string
  theme: string
  outfit: string
  setting: string
  pose: string
  expression: string
  isNsfw: boolean
  category: MarketplaceCategory
  price: number
}

// Enhanced Positive Prompt Template for NSFW (content filter safe)
const ENHANCED_POSITIVE_PROMPT_SFW = `(absolutely photorealistic:1.7), (masterpiece:1.6), (best quality:1.6), (ultra-detailed:1.5), (8k UHD:1.4),
stunningly beautiful [AGE] year old [ETHNICITY] woman,
(perfect feminine anatomy:1.6), (flawless skin, realistic pores, natural texture:1.5),
elegant and artistic pose, professional photography,
[PHYSIQUE] physique,
[HAIR_COLOR] [HAIR_STYLE] hair,
[EYE_COLOR] eyes, (sparkling, detailed iris:1.4),
[OUTFIT], in [SETTING],
posing [POSE], [EXPRESSION] expression,
(shot on Phase One XT:1.4), (110mm f/2.8 lens:1.3), 
perfect lighting, professional color grading, (flawless hands:1.5), (natural skin texture:1.4)`

// Enhanced Positive Prompt Template for NSFW (more subtle)
const ENHANCED_POSITIVE_PROMPT_NSFW = `(absolutely photorealistic:1.7), (masterpiece:1.6), (best quality:1.6), (ultra-detailed:1.5), (8k UHD:1.4),
stunningly beautiful [AGE] year old [ETHNICITY] woman,
(perfect feminine anatomy:1.6), (flawless skin, realistic pores, natural texture:1.5),
artistic and tasteful composition, elegant aesthetic,
[PHYSIQUE] physique,
[HAIR_COLOR] [HAIR_STYLE] hair,
[EYE_COLOR] eyes, (sparkling, detailed iris:1.4),
[OUTFIT], in [SETTING],
posing [POSE], [EXPRESSION] expression,
(shot on Phase One XT:1.4), (110mm f/2.8 lens:1.3), 
perfect lighting, professional color grading, (flawless hands:1.5), (natural skin texture:1.4)`

// Enhanced Negative Prompt
const ENHANCED_NEGATIVE_PROMPT = `watermark, signature, text, username, logo, copyright, artist name, trademark, error, 
deformed, distorted, disfigured, bad anatomy, wrong anatomy, malformed, mutation, mutated, 
ugly, disgusting, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts, 
stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, 
latex, mannequin, wax figure, cloned face, airbrushed, uncanny valley, fake looking, 
computer-generated, asymmetrical, imperfect, blemish, wrinkle, stretch marks, extra fingers, 
fused fingers, too many fingers, long neck, long body, extra limb, missing limb, floating limbs, 
disconnected limbs, poorly drawn hands, poorly drawn face, poorly drawn feet,
malformed features, asymmetrical features, blurry features, poorly drawn features, unnatural features`

// NSFW Themes (30 Models) - Content Filter Safe
const NSFW_THEMES_SAFE = [
  {
    theme: 'Artistic Boudoir',
    outfit: 'elegant lingerie set',
    setting: 'luxury bedroom with soft lighting',
    pose: 'artistic and tasteful pose',
    expression: 'elegant and confident',
    isNsfw: true,
    category: MarketplaceCategory.NSFW,
    price: 59.99
  },
  {
    theme: 'Fine Art Nude',
    outfit: 'artistic draped fabric',
    setting: 'professional art studio',
    pose: 'classical art pose',
    expression: 'artistic and serene',
    isNsfw: true,
    category: MarketplaceCategory.NSFW,
    price: 79.99
  },
  {
    theme: 'Elegant Fantasy',
    outfit: 'revealing fantasy costume',
    setting: 'elegant gothic chamber',
    pose: 'mystical and graceful pose',
    expression: 'mysterious and confident',
    isNsfw: true,
    category: MarketplaceCategory.NSFW,
    price: 69.99
  },
  {
    theme: 'Sophisticated Professional',
    outfit: 'elegant business attire',
    setting: 'luxury office environment',
    pose: 'professional and confident pose',
    expression: 'sophisticated and elegant',
    isNsfw: true,
    category: MarketplaceCategory.NSFW,
    price: 54.99
  }
]

// Generate model configurations
function generateNSFWModelConfigs(): ModelConfig[] {
  const ethnicities = ['Asian', 'Caucasian', 'Mixed Race', 'Persian']
  const ageRanges = ['18-25']
  const physiques = ['athletic and toned', 'voluptuous and curvy', 'slim and shapely']
  const hairColors = ['jet black', 'platinum blonde', 'dark brown', 'auburn']
  const hairStyles = ['straight', 'wavy', 'curly']
  const eyeColors = ['emerald green', 'sapphire blue', 'amber', 'deep brown']
  
  const configs: ModelConfig[] = []
  
  // Generate NSFW models (30)
  for (let i = 0; i < 30; i++) {
    const themeIndex = i % NSFW_THEMES_SAFE.length
    const theme = NSFW_THEMES_SAFE[themeIndex]
    
    configs.push({
      id: `apex_nsfw_${String(i + 1).padStart(2, '0')}`,
      ethnicity: ethnicities[i % ethnicities.length],
      ageRange: ageRanges[0],
      physique: physiques[i % physiques.length],
      hairColor: hairColors[i % hairColors.length],
      hairStyle: hairStyles[i % hairStyles.length],
      eyeColor: eyeColors[i % eyeColors.length],
      theme: theme.theme,
      outfit: theme.outfit,
      setting: theme.setting,
      pose: theme.pose,
      expression: theme.expression,
      isNsfw: theme.isNsfw,
      category: theme.category,
      price: theme.price
    })
  }
  
  return configs
}

// Generate enhanced prompt for a model config
function generateEnhancedPrompt(config: ModelConfig): string {
  const promptTemplate = config.isNsfw ? ENHANCED_POSITIVE_PROMPT_NSFW : ENHANCED_POSITIVE_PROMPT_SFW
  
  let prompt = promptTemplate
    .replace('[AGE]', config.ageRange)
    .replace('[ETHNICITY]', config.ethnicity)
    .replace('[PHYSIQUE]', config.physique)
    .replace('[HAIR_COLOR]', config.hairColor)
    .replace('[HAIR_STYLE]', config.hairStyle)
    .replace('[EYE_COLOR]', config.eyeColor)
    .replace('[OUTFIT]', config.outfit)
    .replace('[SETTING]', config.setting)
    .replace('[POSE]', config.pose)
    .replace('[EXPRESSION]', config.expression)
  
  return prompt
}

// Save image to filesystem
function saveImageToFile(base64Data: string, filename: string): string {
  const imagesDir = path.join(process.cwd(), 'public', 'models')
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
  
  const filepath = path.join(imagesDir, filename)
  
  // Remove data URL prefix if present
  const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '')
  
  fs.writeFileSync(filepath, base64Image, 'base64')
  
  return `/models/${filename}`
}

async function generateNSFWBatchModels(startIndex: number, endIndex: number) {
  try {
    console.log(`🚀 Starting NSFW batch generation for models ${startIndex + 1} to ${endIndex}...`)
    
    // Get AI Goddess Empire user
    const aiGoddessUser = await db.user.findFirst({
      where: {
        OR: [
          { name: 'AI Goddess Empire' },
          { email: 'ai-goddess@empire.com' }
        ]
      }
    })
    
    if (!aiGoddessUser) {
      throw new Error('AI Goddess Empire user not found')
    }
    
    console.log('✅ Found AI Goddess Empire user:', aiGoddessUser.name)
    
    // Generate model configurations
    const allConfigs = generateNSFWModelConfigs()
    const batchConfigs = allConfigs.slice(startIndex - 30, endIndex - 30) // NSFW starts at index 30
    
    console.log(`📋 Processing ${batchConfigs.length} NSFW models in this batch`)
    
    // Initialize ZAI SDK
    const zai = await ZAI.create()
    console.log('🤖 Initialized ZAI SDK')
    
    const generatedModels = []
    
    for (let i = 0; i < batchConfigs.length; i++) {
      const config = batchConfigs[i]
      const globalIndex = startIndex + i
      console.log(`🎨 Generating NSFW model ${globalIndex + 1}/60: ${config.theme}`)
      
      try {
        // Generate enhanced prompt
        const positivePrompt = generateEnhancedPrompt(config)
        const fullPrompt = `${positivePrompt}\n\nNegative Prompt: ${ENHANCED_NEGATIVE_PROMPT}`
        
        console.log(`📝 Prompt for ${config.id}:`, positivePrompt.substring(0, 100) + '...')
        
        // Generate image
        const response = await zai.images.generations.create({
          prompt: fullPrompt,
          size: '1024x1024'
        })
        
        if (!response.data || response.data.length === 0) {
          throw new Error('No image data returned from generation')
        }
        
        const imageBase64 = response.data[0].base64
        
        // Save image to filesystem
        const filename = `EDN_${config.isNsfw ? 'NSFW' : 'SFW'}_${String(globalIndex + 1).padStart(2, '0')}_${config.id}.jpg`
        const imagePath = saveImageToFile(imageBase64, filename)
        
        console.log(`💾 Saved image: ${imagePath}`)
        
        // Create marketplace item
        const marketplaceItem = await db.marketplaceItem.create({
          data: {
            listingNumber: globalIndex + 1,
            title: `${config.theme} - ${config.ethnicity} ${config.ageRange} Model`,
            description: `Stunning ${config.ethnicity} ${config.ageRange} model featuring perfect feminine anatomy and elegant artistic composition. ${config.theme} theme with ${config.outfit} in ${config.setting}. Artistic and tasteful professional photography.`,
            type: MarketplaceType.AI_MODEL,
            category: config.category,
            price: config.price,
            currency: 'USD',
            status: 'ACTIVE',
            thumbnail: imagePath,
            images: JSON.stringify([imagePath]),
            tags: JSON.stringify([
              config.ethnicity.toLowerCase(),
              config.theme.toLowerCase(),
              'perfect anatomy',
              'artistic',
              'professional quality',
              config.isNsfw ? 'nsfw' : 'sfw'
            ]),
            isNsfw: config.isNsfw,
            promptConfig: JSON.stringify({
              ethnicity: config.ethnicity,
              ageRange: config.ageRange,
              physique: config.physique,
              hairColor: config.hairColor,
              hairStyle: config.hairStyle,
              eyeColor: config.eyeColor,
              theme: config.theme,
              pose: config.pose,
              expression: config.expression
            }),
            positivePrompt: positivePrompt,
            negativePrompt: ENHANCED_NEGATIVE_PROMPT,
            fullPrompt: fullPrompt,
            userId: aiGoddessUser.id
          }
        })
        
        console.log(`📦 Created marketplace item: ${marketplaceItem.title} (ID: ${marketplaceItem.id})`)
        
        generatedModels.push({
          config,
          imagePath,
          marketplaceItem
        })
        
        // Add delay to avoid rate limiting
        if (i < batchConfigs.length - 1) {
          console.log('⏳ Waiting 2 seconds before next generation...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
        
      } catch (error) {
        console.error(`❌ Error generating model ${config.id}:`, error)
        // Continue with next model
      }
    }
    
    console.log(`✅ Successfully generated ${generatedModels.length} out of ${batchConfigs.length} NSFW models in this batch`)
    
    return {
      batchStartIndex: startIndex,
      batchEndIndex: endIndex,
      generatedCount: generatedModels.length,
      attemptedCount: batchConfigs.length,
      generatedModels: generatedModels.map(m => ({
        id: m.config.id,
        theme: m.config.theme,
        ethnicity: m.config.ethnicity,
        imagePath: m.imagePath,
        marketplaceItemId: m.marketplaceItem.id,
        price: m.marketplaceItem.price
      }))
    }
    
  } catch (error) {
    console.error('❌ Error in NSFW batch model generation:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

// Get command line arguments
const args = process.argv.slice(2)
const startIndex = parseInt(args[0]) || 30
const endIndex = parseInt(args[1]) || 40

// Run the batch generation
generateNSFWBatchModels(startIndex, endIndex)
  .then(result => {
    console.log('🎉 NSFW batch generation completed!')
    console.log(`📈 Generated ${result.generatedCount} NSFW models in batch ${result.batchStartIndex + 1}-${result.batchEndIndex}`)
  })
  .catch(error => {
    console.error('💥 NSFW batch generation failed:', error)
    process.exit(1)
  })