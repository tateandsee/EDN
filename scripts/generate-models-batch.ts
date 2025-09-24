/**
 * Script to generate model images in batches to avoid timeout issues
 */

import { db } from '../src/lib/db';
import fs from 'fs';
import path from 'path';
import ZAI from 'z-ai-web-dev-sdk';

interface MarketplaceItem {
  id: string;
  title: string;
  positivePrompt?: string;
  negativePrompt?: string;
  thumbnail?: string;
  isNsfw: boolean;
}

class BatchImageGenerator {
  private batchSize = 5; // Process 5 images at a time
  private delayBetweenImages = 3000; // 3 seconds between images
  private delayBetweenBatches = 10000; // 10 seconds between batches

  async generateImagesForBatch(items: MarketplaceItem[]): Promise<void> {
    console.log(`🖼️  Generating images for batch of ${items.length} models...`);
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      try {
        await this.generateImageForItem(item);
        
        // Add delay between images to avoid rate limiting
        if (i < items.length - 1) {
          console.log(`⏳ Waiting ${this.delayBetweenImages / 1000} seconds before next image...`);
          await new Promise(resolve => setTimeout(resolve, this.delayBetweenImages));
        }
      } catch (error) {
        console.error(`❌ Failed to generate image for ${item.title}:`, error);
      }
    }
  }

  private async generateImageForItem(item: MarketplaceItem): Promise<void> {
    try {
      const zai = await ZAI.create();
      
      console.log(`🎨 Generating image for ${item.title}...`);
      
      // Use the prompt from the item or generate a default one
      const prompt = item.positivePrompt || this.generateDefaultPrompt(item);
      const negativePrompt = item.negativePrompt || this.generateDefaultNegativePrompt();
      
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
      
    } catch (error) {
      console.error(`❌ Failed to generate image for ${item.title}:`, error);
      throw error;
    }
  }

  private generateDefaultPrompt(item: MarketplaceItem): string {
    const category = item.isNsfw ? 'NSFW' : 'SFW';
    const basePrompt = `(masterpiece, photorealistic, 8k resolution, best quality, ultra-detailed:1.5), Subject: a stunningly beautiful woman, `;
    
    if (item.isNsfw) {
      return `${basePrompt}sensual and alluring expression, artistic composition, professional photography, dramatic lighting, sophisticated style, mature content`;
    } else {
      return `${basePrompt}natural beauty and soft lighting, artistic photography, professional model, high quality, elegant pose`;
    }
  }

  private generateDefaultNegativePrompt(): string {
    return `(deformed, distorted, disfigured:1.5), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, malformed hands, malformed fingers, poorly drawn hands, poorly drawn face, poorly drawn feet, extra fingers, fused fingers, too many fingers, long neck, long body, mutated, mutation, ugly, disgusting, amputation, blurry, fuzzy, out of focus, soft, jpeg artifacts, compression artifacts, text, watermark, username, signature, copyright, artist name, trademark, logo, username, error, stock photo, cartoon, 3d, render, cgi, illustration, painting, anime, doll, plastic, puppet, latex, mannequin, wax figure, man, male, boy, child, infant, elderly, old, zombie, corpse, skeleton, ghost, monster, alien, animal, insect, (cloned face:1.3), (airbrushed:1.2), (uncanny valley:1.3), (fake looking:1.4), (computer generated:1.4)`;
  }

  async processAllModels(): Promise<void> {
    console.log('🚀 Starting batch image generation for all models...');
    
    try {
      // Get all models that need images (placeholder thumbnails)
      const items = await db.marketplaceItem.findMany({
        where: {
          OR: [
            { thumbnail: { startsWith: '/models/' } },
            { thumbnail: null },
            { thumbnail: '' }
          ]
        },
        orderBy: { createdAt: 'asc' }
      });

      console.log(`📦 Found ${items.length} models that need image generation`);

      // Process in batches
      for (let i = 0; i < items.length; i += this.batchSize) {
        const batch = items.slice(i, i + this.batchSize);
        const batchNumber = Math.floor(i / this.batchSize) + 1;
        const totalBatches = Math.ceil(items.length / this.batchSize);
        
        console.log(`\n🔄 Processing batch ${batchNumber}/${totalBatches} (${batch.length} models)`);
        
        await this.generateImagesForBatch(batch);
        
        // Add delay between batches (except for the last batch)
        if (i + this.batchSize < items.length) {
          console.log(`⏳ Waiting ${this.delayBetweenBatches / 1000} seconds before next batch...`);
          await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
        }
      }

      console.log('\n🎉 All model images generated successfully!');
      
      // Print summary
      const updatedItems = await db.marketplaceItem.findMany({
        where: {
          thumbnail: { startsWith: '/models/' }
        },
        take: 5
      });

      console.log('\n📝 Sample Updated Items:');
      updatedItems.forEach((item, index) => {
        console.log(`\n${index + 1}. ${item.title}`);
        console.log(`   Thumbnail: ${item.thumbnail}`);
        try {
          const images = JSON.parse(item.images || '[]');
          console.log(`   Images: ${images.length} images`);
          images.forEach((img: string, idx: number) => {
            console.log(`     ${idx + 1}. ${img}`);
          });
        } catch (e) {
          console.log(`   Images: Error parsing images`);
        }
      });

    } catch (error) {
      console.error('❌ Error in batch image generation:', error);
      throw error;
    }
  }
}

// Run the script
async function main() {
  const generator = new BatchImageGenerator();
  
  try {
    await generator.processAllModels();
    console.log('✅ Script completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { BatchImageGenerator };