import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate SVG image as base64
function generateSvgImage(ethnicity: string, hairColor: string, eyeColor: string, isNsfw: boolean): string {
  const colorSchemes = {
    sfw: {
      skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642'],
      hair: ['#8B4513', '#D2691E', '#FFD700', '#FF4500'],
      eyes: ['#4169E1', '#228B22', '#8B4513']
    },
    nsfw: {
      skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642'],
      hair: ['#8B4513', '#D2691E', '#FFD700', '#FF4500', '#FF1493'],
      eyes: ['#4169E1', '#228B22', '#8B4513', '#DC143C']
    }
  }

  const scheme = colorSchemes[isNsfw ? 'nsfw' : 'sfw']
  
  // Map ethnicity to skin color
  const skinColors = {
    'Caucasian': scheme.skin[0],
    'Asian': scheme.skin[1],
    'Mixed Race': scheme.skin[2],
    'Persian': scheme.skin[3]
  }

  // Map hair color
  const hairColors = {
    'Golden': scheme.hair[2],
    'Red': scheme.hair[3],
    'Dark': scheme.hair[0]
  }

  // Map eye color
  const eyeColors = {
    'Blue': scheme.eyes[0],
    'Green': scheme.eyes[1],
    'Brown': scheme.eyes[2]
  }

  const skinColor = skinColors[ethnicity] || scheme.skin[0]
  const hairColorValue = hairColors[hairColor] || scheme.hair[0]
  const eyeColorValue = eyeColors[eyeColor] || scheme.eyes[2]

  // Create SVG based on NSFW/SFW mode
  const svg = isNsfw ? createNsfwSvg(skinColor, hairColorValue, eyeColorValue) : createSfwSvg(skinColor, hairColorValue, eyeColorValue)
  
  // Convert to base64
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

function createSfwSvg(skinColor: string, hairColor: string, eyeColor: string): string {
  return `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="600" fill="#f0f0f0"/>
  
  <!-- Head -->
  <ellipse cx="200" cy="150" rx="80" ry="90" fill="${skinColor}"/>
  
  <!-- Hair -->
  <path d="M 120 100 Q 200 60 280 100 Q 300 140 280 180 L 270 170 Q 200 130 130 170 L 120 180 Q 100 140 120 100" fill="${hairColor}"/>
  
  <!-- Eyes -->
  <ellipse cx="170" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="230" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  
  <!-- Pupils -->
  <ellipse cx="170" cy="140" rx="6" ry="6" fill="#000"/>
  <ellipse cx="230" cy="140" rx="6" ry="6" fill="#000"/>
  
  <!-- Nose -->
  <path d="M 200 150 L 195 165 L 200 170 L 205 165 Z" fill="${skinColor}" stroke="#000" stroke-width="0.5"/>
  
  <!-- Mouth -->
  <path d="M 180 185 Q 200 195 220 185" fill="none" stroke="#000" stroke-width="1.5"/>
  
  <!-- Neck -->
  <rect x="180" y="230" width="40" height="60" fill="${skinColor}"/>
  
  <!-- Shoulders -->
  <ellipse cx="200" cy="290" rx="100" ry="40" fill="${skinColor}"/>
  
  <!-- Clothing -->
  <rect x="100" y="280" width="200" height="150" fill="#4169E1" rx="10"/>
  
  <!-- EDN Watermark -->
  <text x="200" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">EDN Protected</text>
</svg>`
}

function createNsfwSvg(skinColor: string, hairColor: string, eyeColor: string): string {
  return `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="600" fill="#1a1a1a"/>
  
  <!-- Head -->
  <ellipse cx="200" cy="150" rx="80" ry="90" fill="${skinColor}"/>
  
  <!-- Hair -->
  <path d="M 120 100 Q 200 60 280 100 Q 300 140 280 180 L 270 170 Q 200 130 130 170 L 120 180 Q 100 140 120 100" fill="${hairColor}"/>
  
  <!-- Eyes -->
  <ellipse cx="170" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="230" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  
  <!-- Pupils -->
  <ellipse cx="170" cy="140" rx="6" ry="6" fill="#000"/>
  <ellipse cx="230" cy="140" rx="6" ry="6" fill="#000"/>
  
  <!-- Eyelashes -->
  <path d="M 158 135 Q 165 130 172 135" fill="none" stroke="#000" stroke-width="1"/>
  <path d="M 228 135 Q 235 130 242 135" fill="none" stroke="#000" stroke-width="1"/>
  
  <!-- Nose -->
  <path d="M 200 150 L 195 165 L 200 170 L 205 165 Z" fill="${skinColor}" stroke="#000" stroke-width="0.5"/>
  
  <!-- Lips -->
  <path d="M 180 185 Q 200 195 220 185" fill="${skinColor}" stroke="#000" stroke-width="1.5"/>
  <path d="M 185 190 Q 200 198 215 190" fill="#FF1493" stroke="#000" stroke-width="0.5"/>
  
  <!-- Neck -->
  <rect x="180" y="230" width="40" height="60" fill="${skinColor}"/>
  
  <!-- Shoulders -->
  <ellipse cx="200" cy="290" rx="100" ry="40" fill="${skinColor}"/>
  
  <!-- Lingerie Top -->
  <path d="M 100 280 Q 200 260 300 280 L 300 320 Q 200 340 100 320 Z" fill="#FF1493" stroke="#000" stroke-width="1"/>
  
  <!-- Details -->
  <circle cx="150" cy="300" r="3" fill="#FFF"/>
  <circle cx="250" cy="300" r="3" fill="#FFF"/>
  
  <!-- EDN Watermark -->
  <text x="200" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#FF1493">EDN Protected</text>
</svg>`
}

async function main() {
  console.log('🎨 Generating actual SVG images for marketplace items...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      include: {
        user: true
      }
    })

    console.log(`📦 Found ${items.length} marketplace items`)

    for (const item of items) {
      // Parse tags to get ethnicity, hair color, eye color
      const tags = item.tags ? JSON.parse(item.tags) : []
      const ethnicity = tags.find(tag => ['caucasian', 'asian', 'mixed race', 'persian'].includes(tag.toLowerCase())) || 'Caucasian'
      const hairColor = tags.find(tag => ['golden', 'red', 'dark'].includes(tag.toLowerCase())) || 'Golden'
      const eyeColor = tags.find(tag => ['blue', 'green', 'brown'].includes(tag.toLowerCase())) || 'Blue'
      
      // Generate actual SVG image
      const svgImage = generateSvgImage(ethnicity, hairColor, eyeColor, item.isNsfw)
      
      // Update the item with real image
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          thumbnail: svgImage,
          images: JSON.stringify([svgImage])
        }
      })
      
      console.log(`✅ Updated item "${item.title}" with actual SVG image`)
    }

    console.log('🎉 All marketplace items updated with actual SVG images!')

  } catch (error) {
    console.error('❌ Error generating images:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error generating images:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })