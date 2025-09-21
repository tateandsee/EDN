import { db } from './src/lib/db'
import fs from 'fs'
import path from 'path'

// AI Model Guru user details
const AI_MODEL_GURU_EMAIL = 'ai-model-guru@example.com'
const AI_MODEL_GURU_NAME = 'AI Model Guru'

// Model generation parameters
const ETHNICITIES = ['Asian', 'Caucasian', 'Mixed Race', 'Persian'] as const
const HAIR_COLORS = ['jet black', 'platinum blonde', 'dark brown', 'auburn', 'burgundy', 'pastel pink'] as const
const HAIR_STYLES = ['straight', 'wavy', 'curly', 'braided'] as const
const EYE_COLORS = ['emerald green', 'sapphire blue', 'amber', 'deep brown', 'violet', 'heterochromia'] as const
const PHYSIQUES = ['athletic and toned', 'voluptuous and curvy', 'slim and shapely'] as const
const AGES = [18, 19, 20, 21, 22, 23, 24, 25] as const

// SFW Outfits (30 variations)
const SFW_OUTFITS = [
  'sexy police uniform',
  'naughty nurse costume',
  'dominatrix outfit',
  'latex dress',
  'bondage-inspired fashion',
  'corset with stockings',
  'see-through mesh top',
  'leather harness',
  'wet look outfit',
  'chainmail top',
  'cosplay bunny outfit',
  'sexy schoolgirl uniform',
  'evil queen costume',
  'vampire seductress',
  'cyberpunk streetwear',
  'fetish wear',
  'fishnet bodysuit',
  'velvet lingerie',
  'choker with pendant',
  'thigh-high boots with mini skirt',
  'barely-there bikini',
  'peekaboo lingerie',
  'cutout bodysuit',
  'tactical gear with exposed midriff',
  'gothic lolita',
  'metal breastplate armor',
  'feathered robe',
  'silk kimono open at front',
  'bandage wrap outfit',
  'shibari rope art over clothing'
] as const

// NSFW Outfits (30 variations)
const NSFW_OUTFITS = [
  'completely nude',
  'semi-nude with pasties',
  'see-through wet t-shirt',
  'unbuttoned police shirt',
  'open nurse uniform',
  'partially removed cosplay',
  'lingerie pulled aside',
  'body jewelry only',
  'wrapped in silk sheets',
  'covered in oil',
  'water droplets on nude skin',
  'bathing suit pulled down',
  'strategically placed shadows',
  'artistic nude posing',
  'implied nudity',
  'suggestive positioning',
  'bedroom eyes expression',
  'inviting gaze',
  'seductive smile',
  'playful covering',
  'back view with glance over shoulder',
  'side profile emphasizing curves',
  'leaning forward pose',
  'kneeling elegantly',
  'stretching sensually',
  'bending over slightly',
  'lying provocatively',
  'arms raised highlighting anatomy',
  'legs positioned alluringly',
  'hair covering just enough'
] as const

// Settings & Atmosphere (60 variations)
const SETTINGS = [
  'luxury bedroom',
  'neo-noire nightclub',
  'rain-soaked alley',
  'penthouse suite',
  'private yacht',
  'abandoned mansion',
  'futuristic cityscape',
  'ancient temple',
  'rose petal covered bed',
  'steamy bathroom',
  'dimly lit bar',
  'art gallery',
  'recording studio',
  'dance rehearsal room',
  'private library',
  'rooftop pool',
  'sunset beach',
  'moonlit forest',
  'luxury spa',
  'hidden lounge',
  'VIP casino',
  'theater stage',
  'photo studio',
  'dressing room',
  'night garden',
  'skyscraper office',
  'underground club',
  'palace bedroom',
  'vintage boudoir',
  'infinity pool',
  'gothic cathedral',
  'industrial warehouse',
  'desert oasis',
  'snowy mountain lodge',
  'tropical paradise',
  'medieval castle',
  'futuristic laboratory',
  'abandoned factory',
  'rooftop helipad',
  'private jet interior',
  'subway station',
  'abandoned church',
  'jungle temple',
  'ice palace',
  'volcanic landscape',
  'underwater palace',
  'space station',
  'cyberpunk alley',
  'victorian greenhouse',
  'modern art museum',
  'opera house balcony',
  'train compartment',
  'elevator',
  'fire escape',
  'rooftop garden',
  'abandoned theater',
  'secret laboratory',
  'vintage car interior',
  'yacht deck',
  'hotel suite',
  'mansion balcony',
  'forest clearing',
  'beach house'
] as const

// Positive prompt template
const POSITIVE_PROMPT_TEMPLATE = `(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.7), RAW photo,
Subject: stunningly beautiful [AGE] year old [ETHNICITY] woman,
(perfect feminine anatomy:1.6), (flawless skin, realistic pores, natural texture:1.5),
(very large surgically enhanced breasts:1.6), perfectly proportioned augmented breasts,
(perfectly formed nipples:1.5), (symmetrical areolas:1.4),
Physical Attributes:
[PHYSIQUE] physique,
[HAIR_COLOR] [HAIR_STYLE] hair,
[EYE_COLOR] eyes, (sparkling, detailed iris:1.4),
Outfit: [OUTFIT]
Setting: [SETTING]
Technical Specifications:
(shot on ARRI Alexa 65:1.4), (85mm f/1.2 lens:1.3), cinematic lighting, professional color grading,
(perfect hands:1.5), (flawless feet:1.4), (natural skin texture:1.4), (sharp focus:1.3),
(dramatic shadows:1.2), (volumetric lighting:1.2), (film grain:1.1)`

// Negative prompt
const NEGATIVE_PROMPT = `(deformed, distorted, disfigured:1.7), bad anatomy, wrong anatomy, malformed, mutation, mutated,
ugly, disgusting, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts,
watermark, signature, text, username, logo, copyright, artist name, trademark, error,
stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet,
latex, mannequin, wax figure, cloned face, airbrushed, uncanny valley, fake looking,
computer-generated, asymmetrical, imperfect, blemish, wrinkle, stretch marks,
extra fingers, fused fingers, too many fingers, long neck, long body, extra limb, missing limb,
floating limbs, disconnected limbs, poorly drawn hands, poorly drawn face, poorly drawn feet,
malformed toes, deformed feet, awkward arm positions, disjointed limbs, malformed elbows,
distorted knees, malformed nipples, asymmetrical areolas, blurry nipples, poorly drawn nipples,
unnatural nipples, disproportionate body, uneven breasts, strange anatomy,
low quality, normal quality, worst quality, lowres, jpeg artifacts, compressed, compressed image,
grainy, noisy, oversaturated, undersaturated, overexposed, underexposed, harsh lighting,
flat lighting, dull, boring, uninteresting, common, average, typical,
child, infant, teenager, underage, young, minor, elderly, old, aged, senior, man, male, boy,
animal, insect, monster, alien, zombie, skeleton, ghost, demon, mythical, fantasy`

// Generation parameters
const GENERATION_PARAMS = {
  steps: 35,
  sampler: 'DPM++ 2M Karras',
  cfg_scale: 7.5,
  seed: -1,
  width: 1024,
  height: 1024,
  model: 'sd_xl_base_1.0.safetensors',
  clip_skip: 2,
  hires_fix: true,
  hires_upscale: 1.5,
  hires_steps: 15,
  denoising_strength: 0.4
}

// Model names for variety
const MODEL_NAMES = [
  'Sophia', 'Luna', 'Bella', 'Stella', 'Aurora', 'Emma', 'Olivia', 'Ava', 'Isabella', 'Mia',
  'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Lily', 'Chloe',
  'Grace', 'Avery', 'Scarlett', 'Ella', 'Penelope', 'Riley', 'Zoey', 'Nora', 'Aria', 'Victoria',
  'Layla', 'Maya', 'Hannah', 'Addison', 'Nova', 'Kennedy', 'Lucy', 'Samantha', 'Eleanor', 'Camila',
  'Stella', 'Madison', 'Aurora', 'Natalie', 'Violet', 'Hazel', 'Leah', 'Brooklyn', 'Sofia'
]

async function findOrCreateAIModelGuru() {
  console.log('Looking for AI Model Guru user...')
  
  let user = await db.user.findUnique({
    where: { email: AI_MODEL_GURU_EMAIL }
  })

  if (!user) {
    console.log('Creating AI Model Guru user...')
    user = await db.user.create({
      data: {
        email: AI_MODEL_GURU_EMAIL,
        name: AI_MODEL_GURU_NAME,
        role: 'CREATOR',
        verified: true,
        isPaidMember: true,
        onboardingCompleted: true
      }
    })
    console.log(`Created user: ${user.name} (${user.email})`)
  } else {
    console.log(`Found existing user: ${user.name} (${user.email})`)
  }

  return user
}

function generatePrompt(
  age: number,
  ethnicity: string,
  hairColor: string,
  hairStyle: string,
  eyeColor: string,
  physique: string,
  outfit: string,
  setting: string
): string {
  return POSITIVE_PROMPT_TEMPLATE
    .replace('[AGE]', age.toString())
    .replace('[ETHNICITY]', ethnicity)
    .replace('[PHYSIQUE]', physique)
    .replace('[HAIR_COLOR]', hairColor)
    .replace('[HAIR_STYLE]', hairStyle)
    .replace('[EYE_COLOR]', eyeColor)
    .replace('[OUTFIT]', outfit)
    .replace('[SETTING]', setting)
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

async function generateModels() {
  console.log('Starting generation of 60 unique models for AI Model Guru...')
  
  const user = await findOrCreateAIModelGuru()
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'public', 'marketplace-images', 'ai-model-guru-models')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Generate combinations for variety
  const shuffledEthnicities = shuffleArray([...ETHNICITIES])
  const shuffledHairColors = shuffleArray([...HAIR_COLORS])
  const shuffledHairStyles = shuffleArray([...HAIR_STYLES])
  const shuffledEyeColors = shuffleArray([...EYE_COLORS])
  const shuffledPhysiques = shuffleArray([...PHYSIQUES])
  const shuffledAges = shuffleArray([...AGES])
  const shuffledSettings = shuffleArray([...SETTINGS])
  const shuffledModelNames = shuffleArray([...MODEL_NAMES])

  const models = []

  // Generate 30 SFW models
  for (let i = 0; i < 30; i++) {
    const ethnicity = shuffledEthnicities[i % shuffledEthnicities.length]
    const hairColor = shuffledHairColors[i % shuffledHairColors.length]
    const hairStyle = shuffledHairStyles[i % shuffledHairStyles.length]
    const eyeColor = shuffledEyeColors[i % shuffledEyeColors.length]
    const physique = shuffledPhysiques[i % shuffledPhysiques.length]
    const age = shuffledAges[i % shuffledAges.length]
    const outfit = SFW_OUTFITS[i % SFW_OUTFITS.length]
    const setting = shuffledSettings[i % shuffledSettings.length]
    const modelName = shuffledModelNames[i % shuffledModelNames.length]

    const positivePrompt = generatePrompt(
      age,
      ethnicity,
      hairColor,
      hairStyle,
      eyeColor,
      physique,
      outfit,
      setting
    )

    const price = Math.floor(Math.random() * 61) + 60 // $60-$120

    const model = {
      listingNumber: 0, // Will be set by database
      title: `${modelName} - ${ethnicity} ${age}yo ${physique.split(' ')[0]} model`,
      description: `Stunning ${ethnicity} model, ${age} years old with ${physique} physique. Features ${hairColor} ${hairStyle} hair and captivating ${eyeColor} eyes. Wearing ${outfit} in a ${setting} atmosphere.`,
      type: 'AI_MODEL' as const,
      category: 'SFW' as const,
      price,
      currency: 'USD',
      status: 'ACTIVE' as const,
      isNsfw: false,
      positivePrompt,
      negativePrompt: NEGATIVE_PROMPT,
      fullPrompt: positivePrompt + '\n\n' + NEGATIVE_PROMPT,
      promptConfig: GENERATION_PARAMS,
      userId: user.id,
      images: [] // Will be populated after image generation
    }

    models.push(model)
  }

  // Generate 30 NSFW models
  for (let i = 0; i < 30; i++) {
    const ethnicity = shuffledEthnicities[(i + 15) % shuffledEthnicities.length]
    const hairColor = shuffledHairColors[(i + 15) % shuffledHairColors.length]
    const hairStyle = shuffledHairStyles[(i + 15) % shuffledHairStyles.length]
    const eyeColor = shuffledEyeColors[(i + 15) % shuffledEyeColors.length]
    const physique = shuffledPhysiques[(i + 15) % shuffledPhysiques.length]
    const age = shuffledAges[(i + 15) % shuffledAges.length]
    const outfit = NSFW_OUTFITS[i % NSFW_OUTFITS.length]
    const setting = shuffledSettings[(i + 30) % shuffledSettings.length]
    const modelName = shuffledModelNames[(i + 25) % shuffledModelNames.length]

    const positivePrompt = generatePrompt(
      age,
      ethnicity,
      hairColor,
      hairStyle,
      eyeColor,
      physique,
      outfit,
      setting
    )

    const price = Math.floor(Math.random() * 151) + 150 // $150-$300

    const model = {
      listingNumber: 0, // Will be set by database
      title: `${modelName} - ${ethnicity} ${age}yo ${physique.split(' ')[0]} model`,
      description: `Exquisite ${ethnicity} model, ${age} years old with ${physique} physique. Features ${hairColor} ${hairStyle} hair and mesmerizing ${eyeColor} eyes. Artistic ${outfit} presentation in a ${setting} setting.`,
      type: 'AI_MODEL' as const,
      category: 'NSFW' as const,
      price,
      currency: 'USD',
      status: 'ACTIVE' as const,
      isNsfw: true,
      positivePrompt,
      negativePrompt: NEGATIVE_PROMPT,
      fullPrompt: positivePrompt + '\n\n' + NEGATIVE_PROMPT,
      promptConfig: GENERATION_PARAMS,
      userId: user.id,
      images: [] // Will be populated after image generation
    }

    models.push(model)
  }

  // Save models data to file for reference
  const modelsData = {
    generatedAt: new Date().toISOString(),
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    totalModels: models.length,
    sfwModels: models.filter(m => !m.isNsfw).length,
    nsfwModels: models.filter(m => m.isNsfw).length,
    models: models.map((model, index) => ({
      ...model,
      id: `temp-${index + 1}`,
      thumbnail: `/marketplace-images/ai-model-guru-models/${model.isNsfw ? 'nsfw' : 'sfw'}-${index + 1}.jpg`,
      images: [`/marketplace-images/ai-model-guru-models/${model.isNsfw ? 'nsfw' : 'sfw'}-${index + 1}.jpg`]
    }))
  }

  fs.writeFileSync(
    path.join(outputDir, 'ai-model-guru-models-data.json'),
    JSON.stringify(modelsData, null, 2)
  )

  console.log(`Generated ${models.length} models (${models.filter(m => !m.isNsfw).length} SFW, ${models.filter(m => m.isNsfw).length} NSFW)`)
  console.log(`Data saved to: ${path.join(outputDir, 'ai-model-guru-models-data.json')}`)
  
  return modelsData
}

// Main execution
async function main() {
  try {
    const modelsData = await generateModels()
    console.log('✅ Successfully generated AI Model Guru models data!')
    console.log(`📊 Summary:`)
    console.log(`   - Total Models: ${modelsData.totalModels}`)
    console.log(`   - SFW Models: ${modelsData.sfwModels}`)
    console.log(`   - NSFW Models: ${modelsData.nsfwModels}`)
    console.log(`   - User: ${modelsData.user.name} (${modelsData.user.email})`)
    console.log(`\n📁 Next steps:`)
    console.log(`   1. Generate images using the prompts in the data file`)
    console.log(`   2. Run the database insertion script`)
    console.log(`   3. Verify marketplace listings`)
  } catch (error) {
    console.error('❌ Error generating models:', error)
    process.exit(1)
  }
}

main()