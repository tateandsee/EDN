/**
 * Enhanced Marketplace Model Generator for EDN Platform
 * Generates AI female models with diverse characteristics using the provided template
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

export interface ModelCharacteristics {
  age: number;
  ethnicity: string;
  bodyType: string;
  breastSize: string;
  facialExpression: string;
  eyeColor: string;
  eyeDetail: string;
  hairStyle: string;
  hairColor: string;
  lips: string;
  modification: string;
  accessories: string;
  setting: string;
  lighting: string;
  environmentDetail: string;
  attire: string;
  pose: string;
  action: string;
  camera: string;
  lens: string;
}

export interface MarketplaceModel {
  id: string;
  title: string;
  description: string;
  type: 'AI_MODEL';
  category: 'SFW' | 'NSFW';
  price: number;
  currency: string;
  status: 'ACTIVE';
  isNsfw: boolean;
  thumbnail?: string;
  images?: string[];
  tags?: string[];
  userId: string;
  characteristics: ModelCharacteristics;
  positivePrompt: string;
  negativePrompt: string;
}

// Template options based on the provided prompt structure
const TEMPLATE_OPTIONS = {
  age: [20, 22, 25, 28, 30],
  ethnicity: ['Caucasian', 'African', 'Asian', 'Hispanic', 'Mixed'],
  bodyType: ['athletic and toned', 'voluptuous and curvaceous', 'slim and graceful', 'strong and powerful'],
  breastSize: ['modest', 'large enhanced', 'very large enhanced'],
  facialExpression: ['smiling confidently', 'soft smile', 'playful smirk', 'sultry gaze', 'neutral and thoughtful', 'laughing'],
  eyeColor: ['deep blue', 'emerald green', 'amber', 'hazel', 'dark brown', 'steel gray'],
  eyeDetail: ['sparkling', 'detailed iris patterns', 'reflective catchlights'],
  hairStyle: ['long flowing waves', 'sleek ponytail', 'messy pixie cut', 'elegant braids', 'curly afro', 'shoulder-length bob'],
  hairColor: ['jet black', 'platinum blonde', 'chestnut brown', 'auburn', 'fiery red', 'pastel pink', 'silver'],
  lips: ['full and natural', 'rosebud', 'with gloss'],
  modification: ['with intricate sleeve tattoo', 'with subtle lower back tattoo', 'with nose piercing', 'with multiple ear piercings', 'completely natural'],
  accessories: ['delicate gold necklace', 'leather choker', 'wide-brimmed hat', 'aviator sunglasses', 'none'],
  setting: ['sun-drenched tropical beach', 'luxurious minimalist apartment', 'neon-lit nightclub', 'misty mountain forest', 'modern coffee shop', 'opulent penthouse rooftop', 'professional photo studio', 'rain-soaked city street', 'private poolside'],
  lighting: ['golden hour sunset', 'soft window light', 'dramatic studio rim light', 'moody neon glow', 'sparkling fairy lights', 'cinematic lighting'],
  environmentDetail: ['wind blowing hair', 'water droplets on skin', 'rain misting on face', 'sunbeams through leaves', 'city lights in bokeh', 'studio smoke swirl'],
  attire_sfw: ['an elegant evening gown', 'casual jeans and a t-shirt', 'a cozy knit sweater', 'sophisticated business attire', 'sporty activewear'],
  attire_nsfw: ['a silk robe', 'black lace lingerie', 'completely nude, tastefully framed', 'wearing only a towel', 'a revealing micro bikini'],
  pose: ['standing confidently', 'leaning against a wall', 'sitting gracefully', 'walking on the beach', 'lounging on a couch', 'looking over shoulder'],
  action: ['laughing', 'adjusting hair', 'sipping a drink', 'applying lip gloss', 'looking at the viewer', 'looking away thoughtfully'],
  camera: ['shot on a Canon EOS R5', 'Hasselblad medium format camera', 'Sony Cinema camera'],
  lens: ['85mm f/1.2 portrait lens', '50mm f/1.4 prime lens', 'cinematic anamorphic lens']
};

// Universal negative prompt
const UNIVERSAL_NEGATIVE_PROMPT = `(deformed, distorted, disfigured:1.5), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, malformed hands, malformed fingers, poorly drawn hands, poorly drawn face, poorly drawn feet, extra fingers, fused fingers, too many fingers, long neck, long body, mutated, mutation, ugly, disgusting, amputation, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts, text, watermark, username, signature, copyright, artist name, trademark, logo, username, error, stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, latex, mannequin, wax figure, man, male, boy, child, infant, elderly, old, zombie, corpse, skeleton, ghost, monster, alien, animal, insect, (cloned face:1.3), (airbrushed:1.2), (uncanny valley:1.3), (fake looking:1.4), (computer generated:1.4)`;

function getRandomOption<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

function generateCharacteristics(isNsfw: boolean): ModelCharacteristics {
  return {
    age: getRandomOption(TEMPLATE_OPTIONS.age),
    ethnicity: getRandomOption(TEMPLATE_OPTIONS.ethnicity),
    bodyType: getRandomOption(TEMPLATE_OPTIONS.bodyType),
    breastSize: getRandomOption(TEMPLATE_OPTIONS.breastSize),
    facialExpression: getRandomOption(TEMPLATE_OPTIONS.facialExpression),
    eyeColor: getRandomOption(TEMPLATE_OPTIONS.eyeColor),
    eyeDetail: getRandomOption(TEMPLATE_OPTIONS.eyeDetail),
    hairStyle: getRandomOption(TEMPLATE_OPTIONS.hairStyle),
    hairColor: getRandomOption(TEMPLATE_OPTIONS.hairColor),
    lips: getRandomOption(TEMPLATE_OPTIONS.lips),
    modification: getRandomOption(TEMPLATE_OPTIONS.modification),
    accessories: getRandomOption(TEMPLATE_OPTIONS.accessories),
    setting: getRandomOption(TEMPLATE_OPTIONS.setting),
    lighting: getRandomOption(TEMPLATE_OPTIONS.lighting),
    environmentDetail: getRandomOption(TEMPLATE_OPTIONS.environmentDetail),
    attire: getRandomOption(isNsfw ? TEMPLATE_OPTIONS.attire_nsfw : TEMPLATE_OPTIONS.attire_sfw),
    pose: getRandomOption(TEMPLATE_OPTIONS.pose),
    action: getRandomOption(TEMPLATE_OPTIONS.action),
    camera: getRandomOption(TEMPLATE_OPTIONS.camera),
    lens: getRandomOption(TEMPLATE_OPTIONS.lens)
  };
}

function generatePositivePrompt(characteristics: ModelCharacteristics): string {
  return `(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), Subject: a stunningly beautiful ${characteristics.age} year old woman, ${characteristics.ethnicity}, ${characteristics.bodyType}, ${characteristics.breastSize}, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), Face & Expression: ${characteristics.facialExpression}, ${characteristics.eyeColor} eyes, ${characteristics.eyeDetail}, ${characteristics.hairStyle} hair, ${characteristics.hairColor}, ${characteristics.lips}, Style & Attributes: ${characteristics.modification}, ${characteristics.accessories}, Scene & Environment: ${characteristics.setting}, ${characteristics.lighting}, ${characteristics.environmentDetail}, Attire: ${characteristics.attire}, Pose & Action: ${characteristics.pose}, ${characteristics.action}, Camera & Technical: ${characteristics.camera}, ${characteristics.lens}, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)`;
}

function generateModelTitle(characteristics: ModelCharacteristics, isNsfw: boolean): string {
  const ethnicity = characteristics.ethnicity;
  const ageGroup = characteristics.age <= 22 ? 'Young' : characteristics.age <= 25 ? 'Mature' : 'Elegant';
  const style = characteristics.hairColor.replace(' ', '');
  const category = isNsfw ? 'Premium' : 'Classic';
  
  return `EDN ${category} ${ethnicity} ${ageGroup} ${style} Model`;
}

function generateModelDescription(characteristics: ModelCharacteristics, isNsfw: boolean): string {
  const category = isNsfw ? 'NSFW' : 'SFW';
  const setting = characteristics.setting;
  const style = characteristics.hairStyle;
  const expression = characteristics.facialExpression;
  
  return `Exquisite ${category} EDN AI model featuring a ${characteristics.age}-year-old ${characteristics.ethnicity} woman with ${characteristics.bodyType} physique and ${characteristics.hairColor} ${style} hair. This model captures ${expression} in a ${setting} with ${characteristics.lighting}, creating ${characteristics.environmentDetail} for ultra-realistic results. Perfect for premium ${category.toLowerCase()} content creation with professional-grade quality.`;
}

function generateTags(characteristics: ModelCharacteristics, isNsfw: boolean): string[] {
  const baseTags = [
    characteristics.ethnicity.toLowerCase(),
    characteristics.hairColor.toLowerCase(),
    characteristics.bodyType.split(' ')[0],
    characteristics.setting.split(' ')[0],
    'photorealistic',
    '8k',
    'ultra-detailed'
  ];
  
  if (isNsfw) {
    baseTags.push('nsfw', 'premium', 'adult');
  } else {
    baseTags.push('sfw', 'classic', 'elegant');
  }
  
  return baseTags;
}

function generatePrice(isNsfw: boolean): number {
  if (isNsfw) {
    // NSFW models: $120-250
    return 120 + Math.floor(Math.random() * 130);
  } else {
    // SFW models: $80-180
    return 80 + Math.floor(Math.random() * 100);
  }
}

export function generateMarketplaceModel(id: string, userId: string, isNsfw: boolean): MarketplaceModel {
  const characteristics = generateCharacteristics(isNsfw);
  const positivePrompt = generatePositivePrompt(characteristics);
  
  return {
    id,
    title: generateModelTitle(characteristics, isNsfw),
    description: generateModelDescription(characteristics, isNsfw),
    type: 'AI_MODEL',
    category: isNsfw ? 'NSFW' : 'SFW',
    price: generatePrice(isNsfw),
    currency: 'USD',
    status: 'ACTIVE',
    isNsfw,
    thumbnail: `/marketplace-${isNsfw ? 'nsfw' : 'sfw'}-${id}.jpg`,
    images: [`/marketplace-${isNsfw ? 'nsfw' : 'sfw'}-${id}.jpg`],
    tags: generateTags(characteristics, isNsfw),
    userId,
    characteristics,
    positivePrompt,
    negativePrompt: UNIVERSAL_NEGATIVE_PROMPT
  };
}

export function generateMarketplaceModels(count: number, isNsfw: boolean): MarketplaceModel[] {
  const models: MarketplaceModel[] = [];
  const creators = [
    'EDN Master', 'EDN Digital Artist', 'EDN Creative Pro', 'EDN Vision Studio', 'EDN Artisan AI',
    'EDN Pixel Perfect', 'EDN Dream Weaver', 'EDN Neural Artist', 'EDN Creative Mind', 'EDN Imagination Lab'
  ];
  
  for (let i = 1; i <= count; i++) {
    const creatorIndex = (i - 1) % creators.length;
    const userId = `edn-creator-${creatorIndex + 1}`;
    const model = generateMarketplaceModel(`model-${isNsfw ? 'nsfw' : 'sfw'}-${i}`, userId, isNsfw);
    models.push(model);
  }
  
  return models;
}

export async function generateModelImage(model: MarketplaceModel): Promise<string> {
  try {
    const zai = await ZAI.create();
    
    const response = await zai.images.generations.create({
      prompt: model.positivePrompt,
      negative_prompt: model.negativePrompt,
      size: '1024x1024',
      quality: 'hd'
    });
    
    const imageBase64 = response.data[0].base64;
    
    // Save image to public directory
    const imagePath = path.join(process.cwd(), 'public', `${model.thumbnail}`);
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    fs.writeFileSync(imagePath, imageBuffer);
    
    console.log(`✅ Generated image for model: ${model.title}`);
    return model.thumbnail;
    
  } catch (error) {
    console.error(`❌ Failed to generate image for model ${model.title}:`, error);
    throw error;
  }
}

export async function generateAllModelImages(models: MarketplaceModel[]): Promise<void> {
  console.log(`🖼️  Generating images for ${models.length} models...`);
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await generateModelImage(model);
      
      // Add delay to avoid rate limiting
      if (i < models.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Failed to generate image for model ${model.title}:`, error);
    }
  }
  
  console.log('✅ All model images generated!');
}