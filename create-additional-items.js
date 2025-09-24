const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Define additional marketplace items to reach 60 total
const additionalMarketplaceItems = [
  // Additional SFW Items
  {
    title: "Caucasian Yoga Instructor - Wellness Setting",
    description: "A serene Caucasian yoga instructor in peaceful wellness setting, perfect for health content, lifestyle projects, and wellness materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 83,
    isNsfw: false,
    ethnicity: "Caucasian",
    hairColor: "Blond",
    eyeColor: "Blue",
    positivePrompt: "Serene Caucasian yoga instructor, age 18-25, wellness setting, peaceful environment, perfect anatomy, flawless hands and fingers, wellness photography, natural lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Software Developer - Tech Environment",
    description: "A skilled Asian software developer in modern tech environment, perfect for technology content, coding projects, and innovation materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 97,
    isNsfw: false,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Skilled Asian software developer, age 18-25, tech environment, coding setting, perfect anatomy, flawless hands and fingers, technology photography, modern lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Journalist - Media Setting",
    description: "A dedicated mixed race journalist in dynamic media setting, perfect for news content, journalism projects, and media materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 89,
    isNsfw: false,
    ethnicity: "Mixed Race",
    hairColor: "Red",
    eyeColor: "Green",
    positivePrompt: "Dedicated mixed race journalist, age 18-25, media setting, news environment, perfect anatomy, flawless hands and fingers, journalism photography, professional lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Translator - Academic Setting",
    description: "A professional Persian translator in academic setting, perfect for language content, education projects, and cultural materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 86,
    isNsfw: false,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Professional Persian translator, age 18-25, academic setting, language environment, perfect anatomy, flawless hands and fingers, educational photography, warm lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Photographer - Creative Studio",
    description: "A creative Caucasian photographer in well-equipped studio, perfect for art content, photography projects, and creative materials.",
    type: "AI_MODEL",
    category: "SFW",
    price: 93,
    isNsfw: false,
    ethnicity: "Caucasian",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Creative Caucasian photographer, age 18-25, studio setting, photography equipment, perfect anatomy, flawless hands and fingers, artistic photography, studio lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  
  // Additional NSFW Items
  {
    title: "Caucasian Fine Art Nude - Gallery Setting",
    description: "An elegant Caucasian fine art nude in gallery setting, perfect for artistic photography, fine art content, and sophisticated adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 265,
    isNsfw: true,
    ethnicity: "Caucasian",
    hairColor: "Red",
    eyeColor: "Blue",
    positivePrompt: "Elegant Caucasian fine art nude, age 18-25, gallery setting, artistic environment, perfect anatomy, flawless hands and fingers, fine art photography, gallery lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Asian Erotic Art - Traditional Style",
    description: "A sophisticated Asian erotic art in traditional style, perfect for artistic content, cultural expression, and refined adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 245,
    isNsfw: true,
    ethnicity: "Asian",
    hairColor: "Dark",
    eyeColor: "Brown",
    positivePrompt: "Sophisticated Asian erotic art, age 18-25, traditional style, cultural setting, perfect anatomy, flawless hands and fingers, artistic photography, traditional lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Mixed Race Sensual Art - Modern Style",
    description: "A contemporary mixed race sensual art in modern style, perfect for artistic photography, creative expression, and modern adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 235,
    isNsfw: true,
    ethnicity: "Mixed Race",
    hairColor: "Blond",
    eyeColor: "Brown",
    positivePrompt: "Contemporary mixed race sensual art, age 18-25, modern style, creative setting, perfect anatomy, flawless hands and fingers, artistic photography, modern lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Persian Intimate Art - Royal Theme",
    description: "A luxurious Persian intimate art with royal theme, perfect for artistic content, cultural expression, and premium adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 275,
    isNsfw: true,
    ethnicity: "Persian",
    hairColor: "Dark",
    eyeColor: "Green",
    positivePrompt: "Luxurious Persian intimate art, age 18-25, royal theme, opulent setting, perfect anatomy, flawless hands and fingers, artistic photography, royal lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  },
  {
    title: "Caucasian Fantasy Nude - Mystical Setting",
    description: "An enchanting Caucasian fantasy nude in mystical setting, perfect for fantasy content, artistic expression, and imaginative adult materials.",
    type: "AI_MODEL",
    category: "NSFW",
    price: 255,
    isNsfw: true,
    ethnicity: "Caucasian",
    hairColor: "Blond",
    eyeColor: "Blue",
    positivePrompt: "Enchanting Caucasian fantasy nude, age 18-25, mystical setting, fantasy environment, perfect anatomy, flawless hands and fingers, fantasy photography, mystical lighting, hand inpainting to ensure perfect fingers and no deformities, limb correction for perfect anatomy",
    negativePrompt: "deformed hands, deformed fingers, deformed limbs, extra fingers, missing fingers, blurry, low quality, unrealistic"
  }
]

async function createAdditionalMarketplaceItems() {
  try {
    console.log('Creating 10 additional marketplace items...')
    
    // Get a default user ID
    const user = await prisma.user.findFirst()
    const userId = user.id
    
    let createdCount = 0
    
    for (const itemData of additionalMarketplaceItems) {
      try {
        // Create placeholder thumbnail URL
        const thumbnailUrl = `/placeholder-${itemData.ethnicity.toLowerCase().replace(' ', '-')}-${itemData.category.toLowerCase()}.jpg`
        
        // Create marketplace item
        const item = await prisma.marketplaceItem.create({
          data: {
            title: itemData.title,
            description: itemData.description,
            type: itemData.type,
            category: itemData.category,
            price: itemData.price,
            currency: 'USD',
            thumbnail: thumbnailUrl,
            images: JSON.stringify([thumbnailUrl]),
            tags: JSON.stringify([
              itemData.ethnicity,
              itemData.hairColor,
              itemData.eyeColor,
              itemData.category
            ]),
            isNsfw: itemData.isNsfw,
            userId: userId,
            positivePrompt: itemData.positivePrompt,
            negativePrompt: itemData.negativePrompt,
            fullPrompt: `${itemData.positivePrompt} ${itemData.negativePrompt}`
          }
        })
        
        console.log(`Created item ${createdCount + 1}: ${item.title}`)
        createdCount++
        
      } catch (error) {
        console.error(`Error creating item ${itemData.title}:`, error)
        // Continue with next item even if one fails
      }
    }
    
    console.log(`\nSuccessfully created ${createdCount} additional marketplace items`)
    
    // Verify total count
    const totalItems = await prisma.marketplaceItem.count()
    console.log(`Total marketplace items in database: ${totalItems}`)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

createAdditionalMarketplaceItems()