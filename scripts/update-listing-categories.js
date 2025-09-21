const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapping functions to categorize the existing data
function mapRaceToEnum(race) {
  const raceMap = {
    'Asian': 'ASIAN',
    'Caucasian': 'CAUCASIAN',
    'Mixed Race': 'MIXED_RACE',
    'Persian': 'PERSIAN'
  };
  return raceMap[race] || null;
}

function mapHairColorToEnum(hairColor) {
  const hairColorMap = {
    'jet black': 'DARK',
    'dark brown': 'DARK',
    'platinum blonde': 'BLONDE',
    'auburn': 'RED',
    'burgundy': 'RED',
    'pastel pink': 'RED' // Treating pink as red category
  };
  return hairColorMap[hairColor.toLowerCase()] || null;
}

function mapAttireToEnum(outfit, isNsfw) {
  const outfitLower = outfit.toLowerCase();
  
  if (isNsfw) {
    if (outfitLower.includes('nude') || outfitLower.includes('semi-nude')) {
      return outfitLower.includes('semi') ? 'SEMI_NUDE' : 'NUDE';
    }
    return 'SEXY'; // Default for NSFW
  } else {
    // SFW attire mapping
    if (outfitLower.includes('lingerie') || outfitLower.includes('corset')) {
      return 'LINGERIE';
    } else if (outfitLower.includes('bikini')) {
      return 'BIKINI';
    } else if (outfitLower.includes('costume') || outfitLower.includes('outfit') || outfitLower.includes('uniform')) {
      return 'COSPLAY';
    } else if (outfitLower.includes('dominatrix') || outfitLower.includes('bondage') || outfitLower.includes('harness')) {
      return 'S_AND_M';
    } else {
      return 'SEXY'; // Default for SFW
    }
  }
}

function mapAgeToEnum(age) {
  const ageMap = {
    '18-21': 'AGE_18_TO_21',
    '22-25': 'AGE_22_TO_25',
    '26-29': 'AGE_26_TO_29',
    '30-40': 'AGE_30_TO_40'
  };
  return ageMap[age] || null;
}

function mapProductToEnum(type) {
  return 'MODELS'; // All current listings are models
}

function mapStyleToEnum() {
  return 'PORTRAIT'; // Default to portrait for now
}

function mapBodyTypeToEnum(physique) {
  const physiqueMap = {
    'athletic and toned': 'ATHLETIC',
    'voluptuous and curvy': 'VOLUPTUOUS',
    'slim and shapely': 'SKINNY'
  };
  return physiqueMap[physique.toLowerCase()] || null;
}

async function updateListingsWithCategories() {
  try {
    console.log('Updating marketplace listings with new categorization...');
    
    // Get all marketplace listings
    const listings = await prisma.marketplaceItem.findMany({
      where: {
        promptConfig: {
          not: null
        }
      }
    });
    
    console.log(`Found ${listings.length} listings to categorize`);
    
    for (const listing of listings) {
      try {
        const combination = listing.promptConfig?.combination;
        
        if (!combination) {
          console.log(`Skipping listing ${listing.listingNumber}: No combination data`);
          continue;
        }
        
        const updateData = {
          race: mapRaceToEnum(combination.race),
          hairColor: mapHairColorToEnum(combination.hairColor),
          attire: mapAttireToEnum(combination.outfit, combination.isNsfw),
          age: mapAgeToEnum(combination.age),
          product: mapProductToEnum(combination.type),
          style: mapStyleToEnum(),
          bodyType: mapBodyTypeToEnum(combination.physique)
        };
        
        await prisma.marketplaceItem.update({
          where: { id: listing.id },
          data: updateData
        });
        
        console.log(`✓ Updated listing ${listing.listingNumber}: ${listing.title}`);
        console.log(`  Race: ${updateData.race}`);
        console.log(`  Hair Color: ${updateData.hairColor}`);
        console.log(`  Attire: ${updateData.attire}`);
        console.log(`  Age: ${updateData.age}`);
        console.log(`  Product: ${updateData.product}`);
        console.log(`  Style: ${updateData.style}`);
        console.log(`  Body Type: ${updateData.bodyType}`);
        console.log('');
        
      } catch (error) {
        console.error(`Error updating listing ${listing.listingNumber}:`, error.message);
      }
    }
    
    console.log('Categorization update completed!');
    
  } catch (error) {
    console.error('Error during categorization update:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the categorization update
updateListingsWithCategories()
  .then(() => {
    console.log('Categorization script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Categorization script failed:', error);
    process.exit(1);
  });