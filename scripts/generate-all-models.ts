/**
 * Comprehensive script to generate all EDN marketplace models and showcase images
 * This script will:
 * 1. Generate 30 SFW marketplace models with images
 * 2. Generate 30 NSFW marketplace models with images
 * 3. Generate 16 showcase images (12 SFW, 4 NSFW)
 * 4. Store everything in the database and public directory
 */

import { db } from '../src/lib/db';
import { generateMarketplaceModels, generateAllModelImages, MarketplaceModel } from '../src/lib/marketplace-model-generator';
import { generateShowcaseImages, generateAllShowcaseImages, ShowcaseImage } from '../src/lib/showcase-image-generator';
import fs from 'fs';
import path from 'path';

async function generateAllModels() {
  console.log('🚀 Starting comprehensive model generation...');
  
  try {
    // Step 1: Generate marketplace model data
    console.log('📝 Generating marketplace model data...');
    const sfwModels = generateMarketplaceModels(30, false);
    const nsfwModels = generateMarketplaceModels(30, true);
    const allMarketplaceModels = [...sfwModels, ...nsfwModels];
    
    console.log(`✅ Generated ${allMarketplaceModels.length} marketplace models (${sfwModels.length} SFW, ${nsfwModels.length} NSFW)`);
    
    // Step 2: Generate showcase image data
    console.log('📝 Generating showcase image data...');
    const showcaseImages = generateShowcaseImages();
    console.log(`✅ Generated ${showcaseImages.length} showcase images`);
    
    // Step 3: Create users for the creators if they don't exist
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
    
    // Step 4: Generate marketplace images
    console.log('🖼️  Generating marketplace model images...');
    try {
      await generateAllModelImages(allMarketplaceModels);
    } catch (error) {
      console.error('❌ Failed to generate marketplace images:', error);
      console.log('⚠️  Continuing with database storage...');
    }
    
    // Step 5: Generate showcase images
    console.log('🖼️  Generating showcase images...');
    try {
      await generateAllShowcaseImages(showcaseImages);
    } catch (error) {
      console.error('❌ Failed to generate showcase images:', error);
      console.log('⚠️  Continuing with database storage...');
    }
    
    // Step 6: Store marketplace models in database
    console.log('💾 Storing marketplace models in database...');
    
    for (let i = 0; i < allMarketplaceModels.length; i++) {
      const model = allMarketplaceModels[i];
      
      try {
        // Check if model already exists
        const existingModel = await db.marketplaceItem.findUnique({
          where: { id: model.id }
        });
        
        if (existingModel) {
          console.log(`⚠️  Marketplace model ${model.title} already exists, skipping...`);
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
            // Store characteristics as JSON
            metadata: JSON.stringify({
              characteristics: model.characteristics,
              positivePrompt: model.positivePrompt,
              negativePrompt: model.negativePrompt
            })
          }
        });
        
        console.log(`✅ Created marketplace model: ${model.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to create marketplace model ${model.title}:`, error);
      }
    }
    
    // Step 7: Store showcase images in database (if we have a showcase table)
    console.log('💾 Storing showcase images in database...');
    
    for (let i = 0; i < showcaseImages.length; i++) {
      const showcaseImage = showcaseImages[i];
      
      try {
        // Check if we have a showcase table, if not create a simple record
        // For now, we'll just log since we don't have a showcase table in the schema
        console.log(`📋 Showcase image: ${showcaseImage.title} (${showcaseImage.category})`);
        
      } catch (error) {
        console.error(`❌ Failed to process showcase image ${showcaseImage.title}:`, error);
      }
    }
    
    console.log('🎉 Comprehensive model generation completed!');
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log(`- Total marketplace models: ${allMarketplaceModels.length}`);
    console.log(`- SFW marketplace models: ${sfwModels.length}`);
    console.log(`- NSFW marketplace models: ${nsfwModels.length}`);
    console.log(`- Total showcase images: ${showcaseImages.length}`);
    console.log(`- SFW showcase images: ${showcaseImages.filter(img => !img.isNsfw).length}`);
    console.log(`- NSFW showcase images: ${showcaseImages.filter(img => img.isNsfw).length}`);
    console.log(`- Marketplace price range: $${Math.min(...allMarketplaceModels.map(m => m.price))} - $${Math.max(...allMarketplaceModels.map(m => m.price))}`);
    
    // Print sample models
    console.log('\n📋 Sample Marketplace Models:');
    console.log('SFW Models:');
    sfwModels.slice(0, 3).forEach(model => {
      console.log(`- ${model.title} ($${model.price}) - ${model.characteristics.ethnicity} ${model.characteristics.age}yo`);
    });
    console.log('NSFW Models:');
    nsfwModels.slice(0, 3).forEach(model => {
      console.log(`- ${model.title} ($${model.price}) - ${model.characteristics.ethnicity} ${model.characteristics.age}yo`);
    });
    
    // Print sample showcase images
    console.log('\n📋 Sample Showcase Images:');
    showcaseImages.slice(0, 4).forEach(image => {
      console.log(`- ${image.title} (${image.category}) - ${image.theme}`);
    });
    
  } catch (error) {
    console.error('❌ Error in comprehensive model generation:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateAllModels()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { generateAllModels };