const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Configuration for the 60 models
const MODEL_CONFIG = {
  races: ['Asian', 'Caucasian', 'Mixed Race', 'Persian'],
  ages: ['18-21', '22-25'],
  physiques: ['athletic and toned', 'voluptuous and curvy', 'slim and shapely'],
  hairColors: ['jet black', 'platinum blonde', 'dark brown', 'auburn', 'burgundy', 'pastel pink'],
  hairStyles: ['straight', 'wavy', 'curly', 'braided'],
  eyeColors: ['emerald green', 'sapphire blue', 'amber', 'deep brown', 'violet', 'heterochromia'],
  
  // SFW Outfits (30 Models)
  sfwOutfits: [
    'sexy police uniform', 'naughty nurse costume', 'dominatrix outfit', 'latex dress', 'bondage-inspired fashion',
    'corset with stockings', 'see-through mesh top', 'leather harness', 'wet look outfit', 'chainmail top',
    'cosplay bunny outfit', 'sexy schoolgirl uniform', 'evil queen costume', 'vampire seductress',
    'cyberpunk streetwear', 'fetish wear', 'fishnet bodysuit', 'velvet lingerie', 'choker with pendant',
    'thigh-high boots with mini skirt', 'barely-there bikini', 'peekaboo lingerie', 'cutout bodysuit',
    'tactical gear with exposed midriff', 'gothic lolita', 'metal breastplate armor', 'feathered robe',
    'silk kimono open at front', 'bandage wrap outfit', 'shibari rope art over clothing'
  ],
  
  // NSFW Outfits (30 Models)
  nsfwOutfits: [
    'completely nude', 'semi-nude with pasties', 'see-through wet t-shirt', 'unbuttoned police shirt',
    'open nurse uniform', 'partially removed cosplay', 'lingerie pulled aside', 'body jewelry only',
    'wrapped in silk sheets', 'covered in oil', 'water droplets on nude skin', 'bathing suit pulled down',
    'strategically placed shadows', 'artistic nude posing', 'implied nudity', 'suggestive positioning',
    'bedroom eyes expression', 'inviting gaze', 'seductive smile', 'playful covering',
    'back view with glance over shoulder', 'side profile emphasizing curves', 'leaning forward pose',
    'kneeling elegantly', 'stretching sensually', 'bending over slightly', 'lying provocatively',
    'arms raised highlighting anatomy', 'legs positioned alluringly', 'hair covering just enough'
  ],
  
  settings: [
    'luxury bedroom', 'neo-noire nightclub', 'rain-soaked alley', 'penthouse suite', 'private yacht',
    'abandoned mansion', 'futuristic cityscape', 'ancient temple', 'rose petal covered bed',
    'steamy bathroom', 'dimly lit bar', 'art gallery', 'recording studio', 'dance rehearsal room',
    'private library', 'rooftop pool', 'sunset beach', 'moonlit forest', 'luxury spa', 'hidden lounge',
    'VIP casino', 'theater stage', 'photo studio', 'dressing room', 'night garden', 'skyscraper office',
    'underground club', 'palace bedroom', 'vintage boudoir', 'infinity pool'
  ]
};

// Positive prompt template
const POSITIVE_PROMPT_TEMPLATE = `(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.7), RAW photo,
Subject: stunningly beautiful [AGE] year old [RACE] woman,
(perfect feminine anatomy:1.6), (flawless skin, realistic pores, natural texture:1.5),
(very large surgically enhanced breasts:1.6), perfectly proportioned augmented breasts,
(perfectly formed nipples:1.5), (symmetrical areolas:1.4),
Physical Attributes:
[PHYSIQUE] physique,
[HAIR_COLOR] [HAIR_STYLE] hair,
[EYE_COLOR] eyes, (sparkling, detailed iris:1.4),
Outfit: [OUTFIT],
Setting: [SETTING],
Technical Specifications:
(shot on ARRI Alexa 65:1.4), (85mm f/1.2 lens:1.3), cinematic lighting, professional color grading,
(perfect hands:1.5), (flawless feet:1.4), (natural skin texture:1.4), (sharp focus:1.3),
(dramatic shadows:1.2), (volumetric lighting:1.2), (film grain:1.1)`;

// Negative prompt
const NEGATIVE_PROMPT = `(deformed, distorted, disfigured:1.7), bad anatomy, wrong anatomy, malformed, mutation, mutated,
ugly, disgusting, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts,
watermark, signature, text, username, logo, copyright, artist name, trademark, error,
stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet,
latex, mannequin, wax figure, cloned face, airbrushed, uncanny valley, fake looking,
computer-generated, asymmetrical, imperfect, blemish, wrinkle, stretch marks,
Anatomy Filters:
extra fingers, fused fingers, too many fingers, long neck, long body, extra limb, missing limb,
floating limbs, disconnected limbs, poorly drawn hands, poorly drawn face, poorly drawn feet,
malformed toes, deformed feet, awkward arm positions, disjointed limbs, malformed elbows,
distorted knees, malformed nipples, asymmetrical areolas, blurry nipples, poorly drawn nipples,
unnatural nipples, disproportionate body, uneven breasts, strange anatomy,
Quality Filters:
low quality, normal quality, worst quality, lowres, jpeg artifacts, compressed, compressed image,
grainy, noisy, oversaturated, undersaturated, overexposed, underexposed, harsh lighting,
flat lighting, dull, boring, uninteresting, common, average, typical,
Content Filters:
child, infant, teenager, underage, young, minor, elderly, old, aged, senior, man, male, boy,
animal, insect, monster, alien, zombie, skeleton, ghost, demon, mythical, fantasy`;

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
};

function generateUniqueCombinations() {
  const combinations = [];
  
  // Generate SFW combinations (30 models)
  for (let i = 0; i < 30; i++) {
    const race = MODEL_CONFIG.races[i % MODEL_CONFIG.races.length];
    const age = MODEL_CONFIG.ages[i % MODEL_CONFIG.ages.length];
    const physique = MODEL_CONFIG.physiques[i % MODEL_CONFIG.physiques.length];
    const hairColor = MODEL_CONFIG.hairColors[i % MODEL_CONFIG.hairColors.length];
    const hairStyle = MODEL_CONFIG.hairStyles[i % MODEL_CONFIG.hairStyles.length];
    const eyeColor = MODEL_CONFIG.eyeColors[i % MODEL_CONFIG.eyeColors.length];
    const outfit = MODEL_CONFIG.sfwOutfits[i];
    const setting = MODEL_CONFIG.settings[i % MODEL_CONFIG.settings.length];
    
    combinations.push({
      race,
      age,
      physique,
      hairColor,
      hairStyle,
      eyeColor,
      outfit,
      setting,
      isNsfw: false,
      price: Math.floor(Math.random() * 61) + 60, // $60-$120
      category: 'SFW'
    });
  }
  
  // Generate NSFW combinations (30 models)
  for (let i = 0; i < 30; i++) {
    const race = MODEL_CONFIG.races[(i + 2) % MODEL_CONFIG.races.length];
    const age = MODEL_CONFIG.ages[(i + 1) % MODEL_CONFIG.ages.length];
    const physique = MODEL_CONFIG.physiques[(i + 1) % MODEL_CONFIG.physiques.length];
    const hairColor = MODEL_CONFIG.hairColors[(i + 3) % MODEL_CONFIG.hairColors.length];
    const hairStyle = MODEL_CONFIG.hairStyles[(i + 2) % MODEL_CONFIG.hairStyles.length];
    const eyeColor = MODEL_CONFIG.eyeColors[(i + 1) % MODEL_CONFIG.eyeColors.length];
    const outfit = MODEL_CONFIG.nsfwOutfits[i];
    const setting = MODEL_CONFIG.settings[(i + 15) % MODEL_CONFIG.settings.length];
    
    combinations.push({
      race,
      age,
      physique,
      hairColor,
      hairStyle,
      eyeColor,
      outfit,
      setting,
      isNsfw: true,
      price: Math.floor(Math.random() * 151) + 150, // $150-$300
      category: 'NSFW'
    });
  }
  
  return combinations;
}

function generatePrompt(combination) {
  return POSITIVE_PROMPT_TEMPLATE
    .replace('[AGE]', combination.age)
    .replace('[RACE]', combination.race)
    .replace('[PHYSIQUE]', combination.physique)
    .replace('[HAIR_COLOR]', combination.hairColor)
    .replace('[HAIR_STYLE]', combination.hairStyle)
    .replace('[EYE_COLOR]', combination.eyeColor)
    .replace('[OUTFIT]', combination.outfit)
    .replace('[SETTING]', combination.setting);
}

function generateTitle(combination) {
  const descriptors = {
    'Asian': ['Exotic', 'Enchanting', 'Mysterious', 'Alluring'],
    'Caucasian': ['Stunning', 'Breathtaking', 'Gorgeous', 'Divine'],
    'Mixed Race': ['Unique', 'Exotic', 'Mesmerizing', 'Captivating'],
    'Persian': ['Exotic', 'Mystical', 'Enchanting', 'Royal']
  };
  
  const outfitDescriptors = {
    'sexy police uniform': 'Police Officer',
    'naughty nurse costume': 'Naughty Nurse',
    'dominatrix outfit': 'Dominatrix',
    'latex dress': 'Latex Queen',
    'completely nude': 'Nude Beauty',
    'semi-nude with pasties': 'Semi-Nude Goddess'
  };
  
  const raceDescriptor = descriptors[combination.race][Math.floor(Math.random() * descriptors[combination.race].length)];
  const outfitDescriptor = outfitDescriptors[combination.outfit] || 'Model';
  
  return `${raceDescriptor} ${combination.race} ${outfitDescriptor}`;
}

async function findOrCreateUser() {
  let user = await prisma.user.findFirst({
    where: {
      name: 'AI Goddess Empire'
    }
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'AI Goddess Empire',
        email: 'ai-goddess-empire@example.com',
        verified: true,
        role: 'CREATOR'
      }
    });
    console.log('Created user: AI Goddess Empire');
  } else {
    console.log('Found existing user: AI Goddess Empire');
  }
  
  return user;
}

async function generateMarketplaceListings() {
  try {
    console.log('Starting generation of 60 unique erotic models...');
    
    const user = await findOrCreateUser();
    const combinations = generateUniqueCombinations();
    
    console.log(`Generated ${combinations.length} unique combinations`);
    
    for (let i = 0; i < combinations.length; i++) {
      const combination = combinations[i];
      const positivePrompt = generatePrompt(combination);
      const title = generateTitle(combination);
      
      const listingNumber = i + 1;
      
      const marketplaceItem = await prisma.marketplaceItem.create({
        data: {
          listingNumber,
          title,
          description: `Stunning ${combination.race} model with ${combination.physique} physique, ${combination.hairColor} ${combination.hairStyle} hair, and ${combination.eyeColor} eyes. ${combination.outfit} in ${combination.setting}.`,
          type: 'AI_MODEL',
          category: combination.category,
          price: combination.price,
          currency: 'USD',
          status: 'ACTIVE',
          isNsfw: combination.isNsfw,
          promptConfig: {
            ...GENERATION_PARAMS,
            combination
          },
          positivePrompt,
          negativePrompt: NEGATIVE_PROMPT,
          fullPrompt: positivePrompt,
          userId: user.id,
          tags: JSON.stringify([
            combination.race.toLowerCase(),
            combination.age,
            combination.physique,
            combination.hairColor,
            combination.hairStyle,
            combination.eyeColor,
            combination.outfit.toLowerCase().replace(/\s+/g, '_'),
            combination.setting.toLowerCase().replace(/\s+/g, '_'),
            combination.isNsfw ? 'nsfw' : 'sfw'
          ])
        }
      });
      
      console.log(`Created listing ${listingNumber}: ${title} (${combination.category})`);
    }
    
    console.log('Successfully generated 60 marketplace listings!');
    
  } catch (error) {
    console.error('Error generating marketplace listings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the generation
generateMarketplaceListings()
  .then(() => {
    console.log('Generation script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Generation script failed:', error);
    process.exit(1);
  });