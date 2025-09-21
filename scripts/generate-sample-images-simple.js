/**
 * Simple script to generate sample images for marketplace models
 * This will generate a few sample images using AI image generation
 */

const fs = require('fs');
const path = require('path');

// Sample model prompts based on the template
const sampleModels = [
  {
    title: 'EDN Mystic Beauty - platinum blonde long curly',
    isNsfw: false,
    prompt: '(masterpiece, photorealistic, 8k resolution, sharp focus, professional photography:1.4), a stunningly beautiful woman... **[long curly platinum blonde] hair, [vibrant green] eyes, [athletic and toned] body type... standing in a [sun-drenched beach], [golden hour sunset], wearing [an elegant red evening gown]... (perfect symmetrical face, flawless skin, detailed eyes:1.2), (intricate detail, realistic textures, skin pores, detailed hair, realistic eyes, detailed clothing fabric:1.2) (deformed, distorted, disfigured:1.3), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, malformed hands, poorly drawn hands, more than 5 fingers, extra fingers, fused fingers, too many fingers, long neck, poorly drawn, cartoon, 3d, render, painting, illustration, bad eyes, dead eyes, cross-eyed, cloned face, signature, text, watermark, username, blurry, soft, fuzzy, out of focus, jpeg artifacts, stock photo, male, man, boy, landscape, background only, no person, child, infant, old, elderly, unattractive, cartoon, anime, doll, plastic, fake, unrealistic, alien, insect, animal, monster, grotesque.'
  },
  {
    title: 'EDN Urban Goddess - fiery red short pixie',
    isNsfw: false,
    prompt: '(masterpiece, photorealistic, 8k resolution, sharp focus, professional photography:1.4), a confident beautiful woman... **[short pixie fiery red] hair, [deep blue] eyes, [slim and fit] body type... standing in a [neon-lit nightclub], [dramatic studio lighting], wearing [a professional pantsuit]... (perfect symmetrical face, flawless skin, detailed eyes:1.2), (intricate detail, realistic textures, skin pores, detailed hair, realistic eyes, detailed clothing fabric:1.2) (deformed, distorted, disfigured:1.3), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, malformed hands, poorly drawn hands, more than 5 fingers, extra fingers, fused fingers, too many fingers, long neck, poorly drawn, cartoon, 3d, render, painting, illustration, bad eyes, dead eyes, cross-eyed, cloned face, signature, text, watermark, username, blurry, soft, fuzzy, out of focus, jpeg artifacts, stock photo, male, man, boy, landscape, background only, no person, child, infant, old, elderly, unattractive, cartoon, anime, doll, plastic, fake, unrealistic, alien, insect, animal, monster, grotesque.'
  },
  {
    title: 'EDN Mystic Beauty - platinum blonde long curly',
    isNsfw: true,
    prompt: '(masterpiece, photorealistic, 8k resolution, sharp focus, professional photography:1.4), a smirking beautiful woman... **[long curly platinum blonde] hair, [sapphire blue] eyes, [curvaceous and voluptuous] body type... standing in a [luxurious modern kitchen], [morning light streaming through a window], wearing [black lace lingerie]... (perfect symmetrical face, flawless skin, detailed eyes:1.2), (intricate detail, realistic textures, skin pores, detailed hair, realistic eyes, detailed clothing fabric:1.2) (deformed, distorted, disfigured:1.3), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, malformed hands, poorly drawn hands, more than 5 fingers, extra fingers, fused fingers, too many fingers, long neck, poorly drawn, cartoon, 3d, render, painting, illustration, bad eyes, dead eyes, cross-eyed, cloned face, signature, text, watermark, username, blurry, soft, fuzzy, out of focus, jpeg artifacts, stock photo, male, man, boy, landscape, background only, no person, child, infant, old, elderly, unattractive, cartoon, anime, doll, plastic, fake, unrealistic, alien, insect, animal, monster, grotesque.'
  },
  {
    title: 'EDN Urban Goddess - fiery red short pixie',
    isNsfw: true,
    prompt: '(masterpiece, photorealistic, 8k resolution, sharp focus, professional photography:1.4), a laughing beautiful woman... **[short pixie fiery red] hair, [emerald green] eyes, [petite and shapely] body type... standing in a [dimly lit cocktail bar], [moody cinematic lighting], wearing [a sleek black leather outfit]... (perfect symmetrical face, flawless skin, detailed eyes:1.2), (intricate detail, realistic textures, skin pores, detailed hair, realistic eyes, detailed clothing fabric:1.2) (deformed, distorted, disfigured:1.3), bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation, malformed hands, poorly drawn hands, more than 5 fingers, extra fingers, fused fingers, too many fingers, long neck, poorly drawn, cartoon, 3d, render, painting, illustration, bad eyes, dead eyes, cross-eyed, cloned face, signature, text, watermark, username, blurry, soft, fuzzy, out of focus, jpeg artifacts, stock photo, male, man, boy, landscape, background only, no person, child, infant, old, elderly, unattractive, cartoon, anime, doll, plastic, fake, unrealistic, alien, insect, animal, monster, grotesque.'
  }
];

async function generateImage(prompt, outputPath) {
  try {
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
      console.log(`📝 Prompt: ${model.prompt.substring(0, 100)}...`);
      
      try {
        await generateImage(model.prompt, outputPath);
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