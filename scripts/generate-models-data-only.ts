/**
 * Script to generate model data only (without actual AI image generation)
 * This will create the marketplace models and showcase images data structure
 * and store them in the database, but skip the actual image generation
 */

import { db } from '../src/lib/db';
import { generateMarketplaceModels, MarketplaceModel } from '../src/lib/marketplace-model-generator';
import { generateShowcaseImages, ShowcaseImage } from '../src/lib/showcase-image-generator';
import fs from 'fs';
import path from 'path';

async function generateModelsDataOnly() {
  console.log('🚀 Starting model data generation (no image generation)...');
  
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
    
    // Step 4: Store marketplace models in database
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
            // Store characteristics in promptConfig
            promptConfig: JSON.stringify({
              characteristics: model.characteristics
            }),
            // Store prompts
            positivePrompt: model.positivePrompt,
            negativePrompt: model.negativePrompt,
            fullPrompt: `${model.positivePrompt}\n\nNegative: ${model.negativePrompt}`
          }
        });
        
        console.log(`✅ Created marketplace model: ${model.title}`);
        
      } catch (error) {
        console.error(`❌ Failed to create marketplace model ${model.title}:`, error);
      }
    }
    
    // Step 5: Create placeholder images for marketplace models
    console.log('🖼️  Creating placeholder images for marketplace models...');
    
    for (let i = 0; i < allMarketplaceModels.length; i++) {
      const model = allMarketplaceModels[i];
      
      try {
        const imagePath = path.join(process.cwd(), 'public', model.thumbnail);
        
        // Check if image already exists
        if (fs.existsSync(imagePath)) {
          console.log(`⚠️  Image already exists: ${model.thumbnail}`);
          continue;
        }
        
        // Create a simple placeholder image (1x1 pixel)
        const placeholderBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
        fs.writeFileSync(imagePath, placeholderBuffer);
        
        console.log(`✅ Created placeholder image: ${model.thumbnail}`);
        
      } catch (error) {
        console.error(`❌ Failed to create placeholder image ${model.thumbnail}:`, error);
      }
    }
    
    // Step 6: Create placeholder images for showcase
    console.log('🖼️  Creating placeholder images for showcase...');
    
    for (let i = 0; i < showcaseImages.length; i++) {
      const showcaseImage = showcaseImages[i];
      
      try {
        const imagePath = path.join(process.cwd(), 'public', showcaseImage.imagePath);
        
        // Check if image already exists
        if (fs.existsSync(imagePath)) {
          console.log(`⚠️  Showcase image already exists: ${showcaseImage.imagePath}`);
          continue;
        }
        
        // Create a simple placeholder image (1x1 pixel)
        const placeholderBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
        fs.writeFileSync(imagePath, placeholderBuffer);
        
        console.log(`✅ Created placeholder showcase image: ${showcaseImage.imagePath}`);
        
      } catch (error) {
        console.error(`❌ Failed to create placeholder showcase image ${showcaseImage.imagePath}:`, error);
      }
    }
    
    console.log('🎉 Model data generation completed!');
    
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
    
    // Save the data to JSON files for later use
    console.log('\n💾 Saving data to JSON files...');
    
    const dataDir = path.join(process.cwd(), 'temp', 'generated-models');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.join(dataDir, 'marketplace-models.json'),
      JSON.stringify(allMarketplaceModels, null, 2)
    );
    
    fs.writeFileSync(
      path.join(dataDir, 'showcase-images.json'),
      JSON.stringify(showcaseImages, null, 2)
    );
    
    console.log('✅ Data saved to JSON files');
    
  } catch (error) {
    console.error('❌ Error in model data generation:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateModelsDataOnly()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export { generateModelsDataOnly };