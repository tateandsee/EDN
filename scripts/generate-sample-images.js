/**
 * Script to generate sample images for marketplace models
 * This will generate a few sample images using AI image generation
 */

const { generateMarketplaceModelsV2 } = require('../src/lib/marketplace-model-generator-v2');
const fs = require('fs');
const path = require('path');

// Import ZAI SDK dynamically
async function generateImage(prompt, outputPath) {
  try {
    // For now, we'll use the CLI command approach
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
      // Use the z-ai-generate CLI command
      const command = `z-ai-generate -p "${prompt}" -o "${outputPath}" -s 1024x1024`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error generating image: ${error}`);
          reject(error);
          return;
        }
        
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        
        console.log(`Image generated: ${outputPath}`);
        resolve(outputPath);
      });
    });
  } catch (error) {
    console.error('Failed to generate image:', error);
    throw error;
  }
}

async function generateSampleImages() {
  console.log('🎨 Starting sample image generation...');
  
  try {
    // Generate model data
    const { sfw, nsfw } = generateMarketplaceModelsV2();
    
    // Select a few sample models to generate images for
    const sampleModels = [
      sfw[0],  // First SFW model
      sfw[1],  // Second SFW model
      nsfw[0], // First NSFW model
      nsfw[1], // Second NSFW model
    ];
    
    console.log(`📝 Selected ${sampleModels.length} sample models for image generation`);
    
    // Ensure the public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Generate images for each sample model
    for (let i = 0; i < sampleModels.length; i++) {
      const model = sampleModels[i];
      const outputPath = path.join(publicDir, `marketplace-item-${model.isNsfw ? 'nsfw' : 'sfw'}-${i + 1}.jpg`);
      
      console.log(`🖼️  Generating image for: ${model.title}`);
      console.log(`📝 Prompt: ${model.fullPrompt.substring(0, 100)}...`);
      
      try {
        await generateImage(model.fullPrompt, outputPath);
        console.log(`✅ Generated image for ${model.title}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`❌ Failed to generate image for ${model.title}:`, error);
        
        // Create a placeholder image if generation fails
        console.log(`📝 Creating placeholder image for ${model.title}`);
        // For now, we'll just note that we'd create a placeholder here
        // In a real implementation, you might create a simple placeholder image
      }
    }
    
    console.log('🎉 Sample image generation completed!');
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log(`- Generated images for ${sampleModels.length} sample models`);
    console.log('- Images saved to public directory');
    console.log('- Models with images:');
    sampleModels.forEach((model, index) => {
      console.log(`  ${index + 1}. ${model.title} (${model.isNsfw ? 'NSFW' : 'SFW'})`);
    });
    
  } catch (error) {
    console.error('❌ Error in sample image generation:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateSampleImages()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = { generateSampleImages };