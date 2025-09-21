/**
 * Script to generate 60 marketplace models (30 SFW, 30 NSFW)
 * This script will:
 * 1. Generate model data using the enhanced template
 * 2. Create actual images using AI image generation
 * 3. Store the models in the database
 */

import { db } from '../src/lib/db';
import { generateMarketplaceModelsV2, generateAllModelImages, getAllMarketplaceModels } from '../src/lib/marketplace-model-generator-v2';
import fs from 'fs';
import path from 'path';

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
    const creators = [
      'EDN Master', 'EDN Digital Artist', 'EDN Creative Pro', 'EDN Vision Studio', 'EDN Artisan AI',
      'EDN Pixel Perfect', 'EDN Dream Weaver', 'EDN Neural Artist', 'EDN Creative Mind', 'EDN Imagination Lab'
    ];
    
    for (let i = 0; i < creators.length; i++) {
      const creatorName = creators[i];
      const creatorEmail = `creator-${i + 1}@edn.com`;
      
      try {
        await db.user.upsert({
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
    
    // Generate images (commented out for now - we'll use existing images)
    console.log('🖼️  Skipping image generation (using existing images)...');
    // await generateAllModelImages();
    
    // Store models in database
    console.log('💾 Storing models in database...');
    
    for (let i = 0; i < allModels.length; i++) {
      const model = allModels[i];
      
      try {
        // Check if model already exists
        const existingModel = await db.marketplaceItem.findUnique({
          where: { id: model.id }
        });
        
        if (existingModel) {
          console.log(`⚠️  Model ${model.title} already exists, skipping...`);
          continue;
        }
        
        await db.marketplaceItem.create({
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
if (require.main === module) {
  generateMarketplaceModels()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { generateMarketplaceModels };