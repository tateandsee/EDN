/**
 * Script to generate one image at a time for a specific model
 */

import { db } from '../src/lib/db';
import fs from 'fs';
import path from 'path';
import ZAI from 'z-ai-web-dev-sdk';

async function generateOneImage(modelId: string) {
  try {
    console.log(`🎨 Generating image for model: ${modelId}`);
    
    // Get the model from database
    const item = await db.marketplaceItem.findUnique({
      where: { id: modelId }
    });
    
    if (!item) {
      console.error(`❌ Model not found: ${modelId}`);
      return;
    }
    
    console.log(`📝 Found model: ${item.title}`);
    
    // Create ZAI instance
    const zai = await ZAI.create();
    
    // Use the prompt from the item or generate a default one
    const prompt = item.positivePrompt || generateDefaultPrompt(item);
    const negativePrompt = item.negativePrompt || generateDefaultNegativePrompt();
    
    console.log(`🖼️  Generating image with prompt...`);
    
    const response = await zai.images.generations.create({
      prompt: prompt,
      negative_prompt: negativePrompt,
      size: '1024x1024',
      quality: 'hd'
    });
    
    const imageBase64 = response.data[0].base64;
    
    // Save image to public directory
    const imageName = `${item.id}.jpg`;
    const imagePath = path.join(process.cwd(), 'public', 'models', imageName);
    const imageDir = path.dirname(imagePath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    fs.writeFileSync(imagePath, imageBuffer);
    
    // Update the item in the database with the correct image path
    const imageUrl = `/models/${imageName}`;
    await db.marketplaceItem.update({
      where: { id: item.id },
      data: {
        thumbnail: imageUrl,
        images: JSON.stringify([imageUrl])
      }
    });
    
    console.log(`✅ Generated and saved image for ${item.title}: ${imageUrl}`);
    console.log(`📁 Image saved to: ${imagePath}`);
    
  } catch (error) {
    console.error(`❌ Failed to generate image for ${modelId}:`, error);
  } finally {
    await db.$disconnect();
  }
}

function generateDefaultPrompt(item: any): string {
  const category = item.isNsfw ? 'NSFW' : 'SFW';
  const basePrompt = `(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), Subject: a stunningly beautiful woman, `;
  
  if (item.isNsfw) {
    return `${basePrompt}sensual and alluring expression, artistic composition, professional photography, dramatic lighting, sophisticated style, mature content`;
  } else {
    return `${basePrompt}natural beauty and soft lighting, artistic photography, professional model, high quality, elegant pose`;
  }
}

function generateDefaultNegativePrompt(): string {
  return `(deformed, distorted, disfigured:1.5), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, malformed hands, malformed fingers, poorly drawn hands, poorly drawn face, poorly drawn feet, extra fingers, fused fingers, too many fingers, long neck, long body, mutated, mutation, ugly, disgusting, amputation, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts, text, watermark, username, signature, copyright, artist name, trademark, logo, username, error, stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, latex, mannequin, wax figure, man, male, boy, child, infant, elderly, old, zombie, corpse, skeleton, ghost, monster, alien, animal, insect, (cloned face:1.3), (airbrushed:1.2), (uncanny valley:1.3), (fake looking:1.4), (computer generated:1.4)`;
}

// Get model ID from command line argument
const modelId = process.argv[2];

if (!modelId) {
  console.error('❌ Please provide a model ID as argument');
  console.log('Usage: npx tsx generate-one-image.ts <model-id>');
  process.exit(1);
}

generateOneImage(modelId).catch(console.error);