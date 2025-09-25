const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const prisma = new PrismaClient();

async function generateImagesForListings() {
  try {
    console.log('Starting image generation for marketplace listings...');
    
    // Get all marketplace listings
    const listings = await prisma.marketplaceItem.findMany({
      orderBy: {
        listingNumber: 'asc'
      }
    });
    
    console.log(`Found ${listings.length} listings to generate images for`);
    
    // Create public/models directory if it doesn't exist
    const modelsDir = path.join(__dirname, 'public', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    for (const listing of listings) {
      console.log(`Generating image for listing ${listing.listingNumber}: ${listing.title}`);
      
      // Generate image using z-ai-generate CLI
      const imageName = `AI_GODDESS_EMPIRE_${listing.listingNumber.toString().padStart(2, '0')}.jpg`;
      const imagePath = path.join(modelsDir, imageName);
      
      try {
        // Use the positive prompt from the listing
        const prompt = listing.positivePrompt;
        
        // Generate the image using z-ai-generate
        const command = `z-ai-generate -p "${prompt}" -o "${imagePath}" -s 1024x1024`;
        console.log(`Executing: ${command}`);
        
        execSync(command, { stdio: 'inherit' });
        
        // Check if image was generated successfully
        if (fs.existsSync(imagePath)) {
          console.log(`✓ Generated image: ${imageName}`);
          
          // Update the marketplace item with the image path
          await prisma.marketplaceItem.update({
            where: { id: listing.id },
            data: {
              thumbnail: `/models/${imageName}`,
              images: JSON.stringify([`/models/${imageName}`])
            }
          });
          
          console.log(`✓ Updated listing ${listing.listingNumber} with image reference`);
        } else {
          console.log(`✗ Failed to generate image for listing ${listing.listingNumber}`);
        }
        
        // Add a small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error generating image for listing ${listing.listingNumber}:`, error.message);
        
        // Create a placeholder image if generation fails
        const placeholderPath = path.join(__dirname, 'public', 'placeholder.jpg');
        if (fs.existsSync(placeholderPath)) {
          const placeholderName = `AI_GODDESS_EMPIRE_${listing.listingNumber.toString().padStart(2, '0')}_placeholder.jpg`;
          const placeholderDest = path.join(modelsDir, placeholderName);
          
          fs.copyFileSync(placeholderPath, placeholderDest);
          
          await prisma.marketplaceItem.update({
            where: { id: listing.id },
            data: {
              thumbnail: `/models/${placeholderName}`,
              images: JSON.stringify([`/models/${placeholderName}`])
            }
          });
          
          console.log(`✓ Created placeholder for listing ${listing.listingNumber}`);
        }
      }
    }
    
    console.log('Image generation completed!');
    
  } catch (error) {
    console.error('Error during image generation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the image generation
generateImagesForListings()
  .then(() => {
    console.log('Image generation script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Image generation script failed:', error);
    process.exit(1);
  });