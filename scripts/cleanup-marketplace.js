const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function cleanupMarketplace() {
  try {
    console.log('Starting marketplace cleanup...');
    
    // Get all marketplace items with their images
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        thumbnail: true,
        images: true,
        listingNumber: true,
        title: true
      }
    });
    
    console.log(`Found ${items.length} marketplace items to remove`);
    
    // Delete physical image files
    for (const item of items) {
      // Delete thumbnail if it exists
      if (item.thumbnail) {
        const thumbnailPath = path.join(__dirname, 'public', item.thumbnail.replace(/^\//, ''));
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
          console.log(`Deleted thumbnail: ${thumbnailPath}`);
        }
      }
      
      // Delete additional images if they exist
      if (item.images) {
        try {
          const images = JSON.parse(item.images);
          for (const imageUrl of images) {
            const imagePath = path.join(__dirname, 'public', imageUrl.replace(/^\//, ''));
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log(`Deleted image: ${imagePath}`);
            }
          }
        } catch (e) {
          console.log(`Could not parse images for item ${item.id}: ${e.message}`);
        }
      }
    }
    
    // Delete all marketplace-related data in correct order to respect foreign keys
    console.log('Deleting marketplace prompt access records...');
    await prisma.marketplacePromptAccess.deleteMany({});
    
    console.log('Deleting marketplace orders...');
    await prisma.marketplaceOrder.deleteMany({});
    
    console.log('Deleting marketplace reviews...');
    await prisma.marketplaceReview.deleteMany({});
    
    console.log('Deleting marketplace items...');
    await prisma.marketplaceItem.deleteMany({});
    
    console.log('Marketplace cleanup completed successfully!');
    
  } catch (error) {
    console.error('Error during marketplace cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupMarketplace()
  .then(() => {
    console.log('Cleanup script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup script failed:', error);
    process.exit(1);
  });