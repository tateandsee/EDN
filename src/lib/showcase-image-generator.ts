/**
 * Showcase Image Generator for EDN Platform
 * Generates 16 unique showcase images with diverse themes and compositions
 */

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

export interface ShowcaseImage {
  id: string;
  title: string;
  description: string;
  category: 'portrait' | 'lifestyle' | 'fashion' | 'artistic';
  theme: string;
  positivePrompt: string;
  negativePrompt: string;
  imagePath: string;
  isNsfw: boolean;
}

// Showcase themes with specific prompts
const SHOWCASE_THEMES = [
  {
    category: 'portrait' as const,
    theme: 'Corporate Executive',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 28 year old Caucasian woman, athletic and toned, large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), confident professional expression, deep blue sparkling eyes, sleek ponytail platinum blonde hair, full and natural lips with gloss, completely natural, delicate gold necklace, modern corporate office, soft window light, city lights in bokeh, sophisticated business attire, standing confidently, looking at the viewer, shot on a Canon EOS R5, 85mm f/1.2 portrait lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'lifestyle' as const,
    theme: 'Beach Paradise',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 25 year old Mixed woman, voluptuous and curvaceous, modest, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), laughing joyfully, emerald green sparkling eyes, long flowing waves chestnut brown hair, rosebud lips, with nose piercing, none, sun-drenched tropical beach, golden hour sunset, wind blowing hair, casual jeans and a t-shirt, walking on the beach, laughing, shot on a Hasselblad medium format camera, 50mm f/1.4 prime lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'fashion' as const,
    theme: 'High Fashion Model',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 22 year old Asian woman, slim and graceful, modest, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), playful smirk, amber detailed iris patterns, elegant braids jet black hair, full and natural lips, with intricate sleeve tattoo, wide-brimmed hat, neon-lit nightclub, moody neon glow, rain misting on face, an elegant evening gown, leaning against a wall, adjusting hair, Sony Cinema camera, cinematic anamorphic lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'artistic' as const,
    theme: 'Mystical Forest',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 30 year old Hispanic woman, strong and powerful, large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), neutral and thoughtful, steel gray reflective catchlights, curly afro fiery red hair, rosebud with gloss, completely natural, none, misty mountain forest, sparkling fairy lights, sunbeams through leaves, a cozy knit sweater, sitting gracefully, looking away thoughtfully, shot on a Canon EOS R5, 85mm f/1.2 portrait lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'portrait' as const,
    theme: 'Luxury Lifestyle',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 28 year old Caucasian woman, athletic and toned, very large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), smiling confidently, deep blue sparkling eyes, shoulder-length bob platinum blonde hair, full and natural lips, with subtle lower back tattoo, delicate gold necklace, opulent penthouse rooftop, cinematic lighting, city lights in bokeh, sophisticated business attire, standing confidently, sipping a drink, shot on a Hasselblad medium format camera, 50mm f/1.4 prime lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'lifestyle' as const,
    theme: 'Urban Chic',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 25 year old African woman, voluptuous and curvaceous, large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), soft smile, emerald green detailed iris patterns, messy pixie cut auburn hair, rosebud lips, with multiple ear piercings, aviator sunglasses, rain-soaked city street, dramatic studio rim light, rain misting on face, sporty activewear, walking on the beach, looking at the viewer, Sony Cinema camera, cinematic anamorphic lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'fashion' as const,
    theme: 'Bohemian Dream',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 22 year old Mixed woman, slim and graceful, modest, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), sultry gaze, amber sparkling eyes, long flowing waves pastel pink hair, full and natural with gloss, completely natural, none, modern coffee shop, soft window light, studio smoke swirl, casual jeans and a t-shirt, lounging on a couch, applying lip gloss, shot on a Canon EOS R5, 85mm f/1.2 portrait lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'artistic' as const,
    theme: 'Studio Art',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 30 year old Asian woman, strong and powerful, very large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), laughing, hazel reflective catchlights, elegant braids silver hair, rosebud lips, with intricate sleeve tattoo, leather choker, professional photo studio, dramatic studio rim light, studio smoke swirl, an elegant evening gown, sitting gracefully, laughing, shot on a Hasselblad medium format camera, 50mm f/1.4 prime lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'portrait' as const,
    theme: 'Tropical Beauty',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 28 year old Hispanic woman, athletic and toned, large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), smiling confidently, dark brown sparkling eyes, long flowing waves chestnut brown hair, full and natural lips, with nose piercing, none, private poolside, golden hour sunset, water droplets on skin, a cozy knit sweater, standing confidently, looking at the viewer, shot on a Sony Cinema camera, cinematic anamorphic lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'lifestyle' as const,
    theme: 'City Lights',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 25 year old Caucasian woman, voluptuous and curvaceous, modest, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), soft smile, steel gray detailed iris patterns, sleek ponytail jet black hair, rosebud with gloss, completely natural, delicate gold necklace, luxurious minimalist apartment, moody neon glow, city lights in bokeh, sophisticated business attire, sitting gracefully, looking away thoughtfully, shot on a Canon EOS R5, 85mm f/1.2 portrait lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'fashion' as const,
    theme: 'Street Style',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 22 year old African woman, slim and graceful, large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), playful smirk, violet purple sparkling eyes, curly afro fiery red hair, full and natural lips, with multiple ear piercings, aviator sunglasses, neon-lit nightclub, cinematic lighting, wind blowing hair, sporty activewear, leaning against a wall, adjusting hair, Sony Cinema camera, cinematic anamorphic lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'artistic' as const,
    theme: 'Natural Beauty',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 30 year old Mixed woman, strong and powerful, very large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), neutral and thoughtful, emerald green reflective catchlights, shoulder-length bob chestnut brown hair, rosebud lips, completely natural, none, misty mountain forest, golden hour sunset, sunbeams through leaves, casual jeans and a t-shirt, sitting gracefully, looking away thoughtfully, shot on a Hasselblad medium format camera, 50mm f/1.4 prime lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'portrait' as const,
    theme: 'Evening Elegance',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 28 year old Asian woman, athletic and toned, large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), sultry gaze, amber sparkling eyes, elegant braids platinum blonde hair, full and natural with gloss, with subtle lower back tattoo, delicate gold necklace, opulent penthouse rooftop, sparkling fairy lights, city lights in bokeh, an elegant evening gown, standing confidently, looking at the viewer, shot on a Canon EOS R5, 85mm f/1.2 portrait lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'lifestyle' as const,
    theme: 'Coffee Shop Moments',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 25 year old Hispanic woman, voluptuous and curvaceous, modest, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), laughing, deep blue detailed iris patterns, messy pixie cut auburn hair, rosebud lips, completely natural, none, modern coffee shop, soft window light, studio smoke swirl, a cozy knit sweater, lounging on a couch, laughing, shot on a Sony Cinema camera, cinematic anamorphic lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'fashion' as const,
    theme: 'Athletic Chic',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 22 year old Caucasian woman, slim and graceful, large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), smiling confidently, hazel sparkling eyes, long flowing waves jet black hair, full and natural lips, with nose piercing, wide-brimmed hat, sun-drenched tropical beach, golden hour sunset, wind blowing hair, sporty activewear, walking on the beach, looking at the viewer, shot on a Hasselblad medium format camera, 50mm f/1.4 prime lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  },
  {
    category: 'artistic' as const,
    theme: 'Dramatic Arts',
    prompt: '(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), a stunningly beautiful 30 year old African woman, strong and powerful, very large enhanced, (perfect feminine anatomy, flawless skin with realistic pores and texture:1.4), neutral and thoughtful, steel gray reflective catchlights, sleek ponytail silver hair, full and natural with gloss, with intricate sleeve tattoo, leather choker, professional photo studio, dramatic studio rim light, studio smoke swirl, an elegant evening gown, sitting gracefully, looking away thoughtfully, shot on a Canon EOS R5, 85mm f/1.2 portrait lens, (sharp focus on eyes:1.3), (shallow depth of field:1.2), (professional color grading:1.1), (film grain:1.05)'
  }
];

// Universal negative prompt
const UNIVERSAL_NEGATIVE_PROMPT = `(deformed, distorted, disfigured:1.5), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, malformed hands, malformed fingers, poorly drawn hands, poorly drawn face, poorly drawn feet, extra fingers, fused fingers, too many fingers, long neck, long body, mutated, mutation, ugly, disgusting, amputation, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts, text, watermark, username, signature, copyright, artist name, trademark, logo, username, error, stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, latex, mannequin, wax figure, man, male, boy, child, infant, elderly, old, zombie, corpse, skeleton, ghost, monster, alien, animal, insect, (cloned face:1.3), (airbrushed:1.2), (uncanny valley:1.3), (fake looking:1.4), (computer generated:1.4)`;

export function generateShowcaseImages(): ShowcaseImage[] {
  const showcaseImages: ShowcaseImage[] = [];
  
  SHOWCASE_THEMES.forEach((theme, index) => {
    const id = `showcase-${index + 1}`;
    const isNsfw = index >= 12; // Last 4 images are NSFW
    
    showcaseImages.push({
      id,
      title: `EDN ${theme.theme} Showcase`,
      description: `Exquisite ${theme.category} showcase featuring ${theme.theme.toLowerCase()} theme with professional-grade photorealistic quality and ultra-detailed 8K resolution.`,
      category: theme.category,
      theme: theme.theme,
      positivePrompt: theme.prompt,
      negativePrompt: UNIVERSAL_NEGATIVE_PROMPT,
      imagePath: `/showcase-${isNsfw ? 'nsfw' : 'sfw'}-${index + 1}.jpg`,
      isNsfw
    });
  });
  
  return showcaseImages;
}

export async function generateShowcaseImage(showcaseImage: ShowcaseImage): Promise<string> {
  try {
    const zai = await ZAI.create();
    
    const response = await zai.images.generations.create({
      prompt: showcaseImage.positivePrompt,
      negative_prompt: showcaseImage.negativePrompt,
      size: '1024x1024',
      quality: 'hd'
    });
    
    const imageBase64 = response.data[0].base64;
    
    // Save image to public directory
    const imagePath = path.join(process.cwd(), 'public', showcaseImage.imagePath);
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    fs.writeFileSync(imagePath, imageBuffer);
    
    console.log(`✅ Generated showcase image: ${showcaseImage.title}`);
    return showcaseImage.imagePath;
    
  } catch (error) {
    console.error(`❌ Failed to generate showcase image ${showcaseImage.title}:`, error);
    throw error;
  }
}

export async function generateAllShowcaseImages(showcaseImages: ShowcaseImage[]): Promise<void> {
  console.log(`🖼️  Generating ${showcaseImages.length} showcase images...`);
  
  for (let i = 0; i < showcaseImages.length; i++) {
    const showcaseImage = showcaseImages[i];
    try {
      await generateShowcaseImage(showcaseImage);
      
      // Add delay to avoid rate limiting
      if (i < showcaseImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Failed to generate showcase image ${showcaseImage.title}:`, error);
    }
  }
  
  console.log('✅ All showcase images generated!');
}