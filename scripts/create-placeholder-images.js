const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createPlaceholderImages() {
  try {
    console.log('Creating placeholder images for marketplace listings...');
    
    // Get all marketplace listings
    const listings = await prisma.marketplaceItem.findMany({
      orderBy: {
        listingNumber: 'asc'
      }
    });
    
    console.log(`Found ${listings.length} listings to create placeholder images for`);
    
    // Create public/models directory if it doesn't exist
    const modelsDir = path.join(__dirname, 'public', 'models');
    if (!fs.existsSync(modelsDir)) {
      fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    // Copy the placeholder image for each listing
    const placeholderPath = path.join(__dirname, 'public', 'placeholder.jpg');
    
    if (!fs.existsSync(placeholderPath)) {
      console.log('Placeholder image not found. Creating simple placeholder text file...');
      // Create a simple placeholder
      const placeholderContent = 'Placeholder Image - Will be replaced with generated image';
      fs.writeFileSync(placeholderPath, placeholderContent);
    }
    
    for (const listing of listings) {
      console.log(`Creating placeholder for listing ${listing.listingNumber}: ${listing.title}`);
      
      const imageName = `AI_GODDESS_EMPIRE_${listing.listingNumber.toString().padStart(2, '0')}.jpg`;
      const imagePath = path.join(modelsDir, imageName);
      
      try {
        // Copy placeholder image
        fs.copyFileSync(placeholderPath, imagePath);
        
        // Update the marketplace item with the image path
        await prisma.marketplaceItem.update({
          where: { id: listing.id },
          data: {
            thumbnail: `/models/${imageName}`,
            images: JSON.stringify([`/models/${imageName}`])
          }
        });
        
        console.log(`✓ Created placeholder for listing ${listing.listingNumber}`);
        
      } catch (error) {
        console.error(`Error creating placeholder for listing ${listing.listingNumber}:`, error.message);
      }
    }
    
    console.log('Placeholder creation completed!');
    
  } catch (error) {
    console.error('Error during placeholder creation:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the placeholder creation
createPlaceholderImages()
  .then(() => {
    console.log('Placeholder creation script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Placeholder creation script failed:', error);
    process.exit(1);
  });