/**
 * Script to add sequential listing numbers to all marketplace items
 */

import { db } from '../src/lib/db';

async function addListingNumbers() {
  console.log('🔢 Adding sequential listing numbers to marketplace items...');
  
  try {
    // Get all marketplace items ordered by creation date
    const items = await db.marketplaceItem.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log(`📦 Found ${items.length} marketplace items to process`);

    // Add listing numbers sequentially
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const listingNumber = i + 1; // Start from 1
      
      try {
        await db.marketplaceItem.update({
          where: { id: item.id },
          data: { listingNumber }
        });
        
        console.log(`✅ Added listing number #${listingNumber.toString().padStart(3, '0')} to: ${item.title}`);
      } catch (error) {
        console.error(`❌ Failed to add listing number to ${item.title}:`, error);
      }
    }

    console.log('\n🎉 All listing numbers added successfully!');
    
    // Verify the results
    const updatedItems = await db.marketplaceItem.findMany({
      orderBy: { listingNumber: 'asc' },
      take: 10
    });

    console.log('\n📋 Sample Updated Items:');
    updatedItems.forEach((item, index) => {
      console.log(`${index + 1}. #${item.listingNumber?.toString().padStart(3, '0')} - ${item.title}`);
    });

  } catch (error) {
    console.error('❌ Error adding listing numbers:', error);
    throw error;
  }
}

// Run the script
addListingNumbers()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });