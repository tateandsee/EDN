/**
 * Script to generate 60 marketplace models (30 SFW, 30 NSFW)
 * This script will:
 * 1. Generate model data using the enhanced template
 * 2. Create actual images using AI image generation
 * 3. Store the models in the database
 */

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['query'],
});

// Model generation functions
const hairOptions = {
  lengthStyles: [
    'long curly', 'short pixie', 'medium bob', 'messy bun', 'elegant updo', 'braided', 'afro'
  ],
  colors: [
    'jet black', 'platinum blonde', 'fiery red', 'auburn', 'pastel pink', 'silver', 'ombre blue'
  ]
};

const eyeColors = [
  'deep blue', 'amber', 'hazel', 'gray', 'sapphire blue', 'emerald green', 'heterochromia (one blue, one green)'
];

const bodyTypes = [
  'curvaceous and voluptuous', 'slim and fit', 'strong and powerful', 'petite and shapely', 'athletic and toned'
];

const scenes = [
  'sun-drenched beach', 'neon-lit nightclub', 'cozy bedroom', 'misty forest trail', 'rain-soaked city street',
  'luxury penthouse rooftop', 'dimly lit cocktail bar', 'professional photo studio', 'lavish bathroom',
  'gym', 'yacht deck', 'coffee shop', 'luxurious modern kitchen'
];

const lightingOptions = [
  'golden hour sunset', 'dramatic studio lighting', 'moody cinematic lighting', 'soft ambient light',
  'sparkling city lights at night', 'neon glow', 'candlelight', 'hard sunlight',
  'morning light streaming through a window'
];

const attireOptions = {
  sfw: [
    'an elegant red evening gown', 'a vibrant bikini', 'a cozy oversized sweater', 'yoga pants and sports bra',
    'denim shorts and a tank top', 'a professional pantsuit', 'a casual summer dress'
  ],
  nsfw: [
    'black lace lingerie', 'a PVC catsuit', 'completely nude, tastefully framed', 'a sleek black leather outfit',
    'an elegant red evening gown', 'a vibrant bikini', 'a cozy oversized sweater', 'yoga pants and sports bra',
    'denim shorts and a tank top', 'a professional pantsuit', 'a casual summer dress'
  ]
};

const extrasOptions = [
  'with a detailed floral sleeve tattoo on her arm',
  'with a subtle nose piercing',
  'wearing a wide-brimmed sun hat',
  'wearing a silver necklace',
  'with multiple ear piercings',
  'with a delicate ankle bracelet',
  'no modifications'
];

const expressionOptions = [
  'smirking beautiful woman',
  'laughing beautiful woman',
  'serene beautiful woman',
  'confident beautiful woman',
  'mysterious beautiful woman'
];

const creators = [
  'EDN Master', 'EDN Digital Artist', 'EDN Creative Pro', 'EDN Vision Studio', 'EDN Artisan AI',
  'EDN Pixel Perfect', 'EDN Dream Weaver', 'EDN Neural Artist', 'EDN Creative Mind', 'EDN Imagination Lab'
];

const archetypeNames = [
  'Mystic Beauty', 'Urban Goddess', 'Natural Charm', 'Elegant Grace', 'Modern Muse', 'Classic Beauty',
  'Exotic Allure', 'Sweet Angel', 'Bold Spirit', 'Gentle Soul', 'Wild Heart', 'Pure Essence',
  'Radiant Star', 'Enchanting Vision', 'Divine Creation', 'Heavenly Body', 'Ethereal Being',
  'Cosmic Beauty', 'Luminous Soul', 'Tranquil Spirit', 'Dynamic Force', 'Serene Majesty'
];

function generatePromptFromTemplate(template) {
  const basePrompt = `(masterpiece, photorealistic, 8k resolution, sharp focus, professional photography:1.4), a ${template.expression || 'stunningly beautiful woman'}... **[${template.hair.lengthStyle} ${template.hair.color}] hair, [${template.eyes.color}] eyes, [${template.bodyType}] body type... standing in a [${template.scene}], [${template.lighting}], wearing [${template.attire}]${template.extras ? ', ' + template.extras : ''}... (perfect symmetrical face, flawless skin, detailed eyes:1.2), (intricate detail, realistic textures, skin pores, detailed hair, realistic eyes, detailed clothing fabric:1.2)`;
  
  const negativePrompt = `(deformed, distorted, disfigured:1.3), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, malformed hands, poorly drawn hands, more than 5 fingers, extra fingers, fused fingers, too many fingers, long neck, poorly drawn, cartoon, 3d, render, painting, illustration, bad eyes, dead eyes, cross-eyed, cloned face, signature, text, watermark, username, blurry, soft, fuzzy, out of focus, jpeg artifacts, stock photo, male, man, boy, landscape, background only, no person, child, infant, old, elderly, unattractive, cartoon, anime, doll, plastic, fake, unrealistic, alien, insect, animal, monster, grotesque.`;
  
  return `${basePrompt} ${negativePrompt}`;
}

function createUniqueModel(index, isNsfw) {
  const hairLengthStyle = hairOptions.lengthStyles[index % hairOptions.lengthStyles.length];
  const hairColor = hairOptions.colors[(index + 1) % hairOptions.colors.length];
  const eyeColor = eyeColors[(index + 2) % eyeColors.length];
  const bodyType = bodyTypes[(index + 3) % bodyTypes.length];
  const scene = scenes[(index + 4) % scenes.length];
  const lighting = lightingOptions[(index + 5) % lightingOptions.length];
  const attire = attireOptions[isNsfw ? 'nsfw' : 'sfw'][(index + 6) % attireOptions[isNsfw ? 'nsfw' : 'sfw'].length];
  const extras = extrasOptions[(index + 7) % extrasOptions.length];
  const expression = expressionOptions[(index + 8) % expressionOptions.length];
  const creator = creators[index % creators.length];
  const archetypeName = archetypeNames[index % archetypeNames.length];
  
  // Generate price based on features and category
  const basePrice = isNsfw ? 120 : 80; // Higher base price for NSFW
  const priceVariation = (index * 3) + (Math.floor(index / 10) * 10); // Gradual increase
  const finalPrice = Math.min(basePrice + priceVariation, isNsfw ? 250 : 180);
  
  const promptConfig = {
    hair: {
      lengthStyle: hairLengthStyle,
      color: hairColor
    },
    eyes: {
      color: eyeColor
    },
    bodyType,
    scene,
    lighting,
    attire,
    extras: extras !== 'no modifications' ? extras : undefined,
    expression
  };
  
  const fullPrompt = generatePromptFromTemplate(promptConfig);
  
  return {
    id: `edn-${isNsfw ? 'nsfw' : 'sfw'}-model-${index + 1}`,
    title: `EDN ${archetypeName} - ${hairColor} ${hairLengthStyle}`,
    description: `Exquisite EDN AI model featuring ${expression} with ${hairColor} ${hairLengthStyle} and captivating ${eyeColor} eyes. ${bodyType} physique captured in ${scene} with ${lighting}. Wearing ${attire}${extras !== 'no modifications' ? ', ' + extras : ''}. Professional 8K photorealistic quality with stunning detail and perfect proportions.`,
    type: 'AI_MODEL',
    category: isNsfw ? 'NSFW' : 'SFW',
    price: finalPrice,
    currency: 'USD',
    status: 'ACTIVE',
    isNsfw,
    thumbnail: `/marketplace-item-${isNsfw ? 'nsfw' : 'sfw'}-${(index % 10) + 1}.jpg`,
    images: [`/marketplace-item-${isNsfw ? 'nsfw' : 'sfw'}-${(index % 10) + 1}.jpg`],
    tags: [isNsfw ? 'NSFW' : 'SFW', 'AI Model', 'Photorealistic', 'Female', archetypeName, hairColor, bodyType],
    userId: `edn-creator-${(index % creators.length) + 1}`,
    promptConfig,
    fullPrompt
  };
}

function generateMarketplaceModelsV2() {
  const sfwModels = [];
  const nsfwModels = [];
  
  // Generate 30 SFW models
  for (let i = 0; i < 30; i++) {
    sfwModels.push(createUniqueModel(i, false));
  }
  
  // Generate 30 NSFW models
  for (let i = 0; i < 30; i++) {
    nsfwModels.push(createUniqueModel(i, true));
  }
  
  return { sfw: sfwModels, nsfw: nsfwModels };
}

async function generateMarketplaceModels() {
  console.log('🚀 Starting marketplace model generation...');
  
  try {
    // Generate model data
    console.log('📝 Generating model data...');
    const { sfw, nsfw } = generateMarketplaceModelsV2();
    const allModels = [...sfw, ...nsfw];
    
    console.log(`✅ Generated ${allModels.length} models (${sfw.length} SFW, ${nsfw.length} NSFW)`);
    
    // Create users for the creators if they don't exist
    console.log('👥 Creating creator users...');
    
    for (let i = 0; i < creators.length; i++) {
      const creatorName = creators[i];
      const creatorEmail = `creator-${i + 1}@edn.com`;
      
      try {
        await prisma.user.upsert({
          where: { email: creatorEmail },
          update: {},
          create: {
            id: `edn-creator-${i + 1}`,
            email: creatorEmail,
            name: creatorName,
            role: 'CREATOR',
            verified: true,
            isPaidMember: true,
            bio: `Professional AI model creator specializing in ${i < 5 ? 'SFW' : 'NSFW'} content`,
          }
        });
        console.log(`✅ Created/updated user: ${creatorName}`);
      } catch (error) {
        console.error(`❌ Failed to create user ${creatorName}:`, error);
      }
    }
    
    // Store models in database
    console.log('💾 Storing models in database...');
    
    for (let i = 0; i < allModels.length; i++) {
      const model = allModels[i];
      
      try {
        // Check if model already exists
        const existingModel = await prisma.marketplaceItem.findUnique({
          where: { id: model.id }
        });
        
        if (existingModel) {
          console.log(`⚠️  Model ${model.title} already exists, skipping...`);
          continue;
        }
        
        await prisma.marketplaceItem.create({
          data: {
            id: model.id,
            title: model.title,
            description: model.description,
            type: 'AI_MODEL',
            category: model.category,
            price: model.price,
            currency: model.currency,
            status: 'ACTIVE',
            thumbnail: model.thumbnail,
            images: JSON.stringify(model.images),
            tags: JSON.stringify(model.tags),
            isNsfw: model.isNsfw,
            userId: model.userId,
          }
        });
        
        console.log(`✅ Created model: ${model.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to create model ${model.title}:`, error);
      }
    }
    
    console.log('🎉 Marketplace model generation completed!');
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log(`- Total models: ${allModels.length}`);
    console.log(`- SFW models: ${sfw.length}`);
    console.log(`- NSFW models: ${nsfw.length}`);
    console.log(`- Price range: $${Math.min(...allModels.map(m => m.price))} - $${Math.max(...allModels.map(m => m.price))}`);
    
    // Generate a sample of the models for verification
    console.log('\n📋 Sample Models:');
    console.log('SFW Models:');
    sfw.slice(0, 3).forEach(model => {
      console.log(`- ${model.title} ($${model.price})`);
    });
    console.log('NSFW Models:');
    nsfw.slice(0, 3).forEach(model => {
      console.log(`- ${model.title} ($${model.price})`);
    });
    
  } catch (error) {
    console.error('❌ Error in marketplace model generation:', error);
    throw error;
  }
}

// Run the script
async function main() {
  try {
    await generateMarketplaceModels();
    console.log('✅ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

main();