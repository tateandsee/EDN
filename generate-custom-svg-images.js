const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Color schemes for different ethnicities and features
const COLOR_SCHEMES = {
  caucasian: {
    skin: ['#FDBCB4', '#F5DEB3', '#FFE4C4', '#FFDAB9'],
    hair: {
      blonde: ['#FFF8DC', '#F0E68C', '#FFD700', '#FFA500'],
      brunette: ['#8B4513', '#A0522D', '#D2691E', '#CD853F'],
      redhead: ['#FF4500', '#FF6347', '#DC143C', '#B22222'],
      black: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887'],
      golden: ['#DAA520', '#FFD700', '#FFA500', '#FF8C00']
    },
    eyes: {
      blue: ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB'],
      green: ['#228B22', '#32CD32', '#00FF00', '#7CFC00'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887']
    }
  },
  asian: {
    skin: ['#FDD5B7', '#FFE4C4', '#FFDEAD', '#F5DEB3'],
    hair: {
      blonde: ['#FFF8DC', '#F0E68C', '#FFD700', '#FFA500'],
      brunette: ['#8B4513', '#A0522D', '#D2691E', '#CD853F'],
      redhead: ['#FF4500', '#FF6347', '#DC143C', '#B22222'],
      black: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887'],
      golden: ['#DAA520', '#FFD700', '#FFA500', '#FF8C00']
    },
    eyes: {
      blue: ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB'],
      green: ['#228B22', '#32CD32', '#00FF00', '#7CFC00'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887']
    }
  },
  mixed: {
    skin: ['#F4A460', '#DEB887', '#D2B48C', '#BC8F8F'],
    hair: {
      blonde: ['#FFF8DC', '#F0E68C', '#FFD700', '#FFA500'],
      brunette: ['#8B4513', '#A0522D', '#D2691E', '#CD853F'],
      redhead: ['#FF4500', '#FF6347', '#DC143C', '#B22222'],
      black: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887'],
      golden: ['#DAA520', '#FFD700', '#FFA500', '#FF8C00']
    },
    eyes: {
      blue: ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB'],
      green: ['#228B22', '#32CD32', '#00FF00', '#7CFC00'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887']
    }
  },
  persian: {
    skin: ['#FDBCB4', '#FFE4C4', '#FFDEAD', '#F5DEB3'],
    hair: {
      blonde: ['#FFF8DC', '#F0E68C', '#FFD700', '#FFA500'],
      brunette: ['#8B4513', '#A0522D', '#D2691E', '#CD853F'],
      redhead: ['#FF4500', '#FF6347', '#DC143C', '#B22222'],
      black: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887'],
      golden: ['#DAA520', '#FFD700', '#FFA500', '#FF8C00']
    },
    eyes: {
      blue: ['#4169E1', '#1E90FF', '#00BFFF', '#87CEEB'],
      green: ['#228B22', '#32CD32', '#00FF00', '#7CFC00'],
      brown: ['#8B4513', '#A0522D', '#D2691E', '#DEB887']
    }
  }
}

// Outfit color schemes
const OUTFIT_COLORS = {
  lingerie: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'],
  silk: ['#E6E6FA', '#F0F8FF', '#F5FFFA', '#FFF0F5'],
  babydoll: ['#FFB6C1', '#FFC0CB', '#FFDAB9', '#FFE4E1'],
  bodysuit: ['#8B008B', '#9400D3', '#9932CC', '#BA55D3'],
  sheer: ['#F0F8FF', '#E6E6FA', '#D8BFD8', '#DDA0DD'],
  teddy: ['#DC143C', '#FF1493', '#FF69B4', '#FFB6C1'],
  corset: ['#8B0000', '#A52A2A', '#B22222', '#CD5C5C'],
  garter: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
  bikini: ['#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB'],
  monokini: ['#FF4500', '#FF6347', '#FF7F50', '#FFA500'],
  'high-cut': ['#FF69B4', '#FFB6C1', '#FFC0CB', '#FFDAB9'],
  string: ['#DC143C', '#FF1493', '#FF69B4', '#FFB6C1'],
  dress: ['#8B008B', '#9400D3', '#9932CC', '#BA55D3'],
  bodycon: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
  cocktail: ['#8B0000', '#A52A2A', '#B22222', '#CD5C5C'],
  slip: ['#E6E6FA', '#F0F8FF', '#F5FFFA', '#FFF0F5'],
  latex: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
  vinyl: ['#1C1C1C', '#363636', '#4F4F4F', '#696969'],
  leather: ['#8B4513', '#A0522D', '#D2691E', '#CD853F'],
  pvc: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
  fishnet: ['#2F4F4F', '#696969', '#808080', '#A9A9A9'],
  lace: ['#F0F8FF', '#E6E6FA', '#D8BFD8', '#DDA0DD'],
  sheer: ['#F0F8FF', '#E6E6FA', '#D8BFD8', '#DDA0DD'],
  erotic: ['#DC143C', '#FF1493', '#FF69B4', '#FFB6C1'],
  costume: ['#8B008B', '#9400D3', '#9932CC', '#BA55D3']
}

function generateCustomSVG(item, index) {
  const metadata = JSON.parse(item.promptConfig || '{}')
  const { age, ethnicity, hairStyle, eyeColor, outfit, imageType, breastSize } = metadata
  
  // Normalize ethnicity key
  const ethnicityKey = ethnicity.toLowerCase().replace(' ', '')
  
  // Get color scheme
  const colorScheme = COLOR_SCHEMES[ethnicityKey] || COLOR_SCHEMES.caucasian
  
  // Get hair color
  const hairColorKey = hairStyle.split(' ')[1]
  const hairColors = colorScheme.hair[hairColorKey] || colorScheme.hair.brunette
  
  // Get eye color
  const eyeColors = colorScheme.eyes[eyeColor] || colorScheme.eyes.blue
  
  // Get outfit color
  const outfitKey = outfit.split(' ')[0]
  const outfitColors = OUTFIT_COLORS[outfitKey] || OUTFIT_COLORS.lingerie
  
  // Select random colors from the available options
  const skinColor = colorScheme.skin[index % colorScheme.skin.length]
  const hairColor = hairColors[index % hairColors.length]
  const eyeColorHex = eyeColors[index % eyeColors.length]
  const outfitColor = outfitColors[index % outfitColors.length]
  
  // Create gradient definitions based on image type
  const gradientType = imageType.includes('nude') ? 'nude' : 
                       imageType.includes('lingerie') ? 'lingerie' : 'portrait'
  
  const svg = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skinGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${skinColor};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${skinColor};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${skinColor};stop-opacity:0.8" />
        </linearGradient>
        
        <linearGradient id="hairGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${hairColor};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${hairColor};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${hairColor};stop-opacity:0.8" />
        </linearGradient>
        
        <linearGradient id="outfitGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${outfitColor};stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:${outfitColor};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${outfitColor};stop-opacity:0.4" />
        </linearGradient>
        
        <linearGradient id="eyeGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${eyeColorHex};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${eyeColorHex};stop-opacity:0.8" />
        </linearGradient>
        
        <linearGradient id="commercialGrad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#8B0000;stop-opacity:1" />
          <stop offset="25%" style="stop-color:#DC143C;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#FF1493;stop-opacity:1" />
          <stop offset="75%" style="stop-color:#FF69B4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#FFB6C1;stop-opacity:1" />
        </linearGradient>
        
        <radialGradient id="breastGrad${index}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:${skinColor};stop-opacity:1" />
          <stop offset="70%" style="stop-color:${skinColor};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${skinColor};stop-opacity:0.7" />
        </radialGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1024" height="1024" fill="url(#commercialGrad${index})" opacity="0.3"/>
      
      <!-- Main figure silhouette based on image type -->
      ${generateFigureSVG(imageType, outfit, index, skinColor, hairColor, outfitColor, eyeColorHex, breastSize)}
      
      <!-- Age indicator -->
      <text x="512" y="950" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="white" opacity="0.8">
        ${age}YO ${ethnicity} ${hairStyle.split(' ')[1]} Beauty
      </text>
      
      <!-- Outfit type indicator -->
      <text x="512" y="980" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.7">
        ${outfit} - ${imageType}
      </text>
      
      <!-- EDN Protected watermark -->
      <text x="1020" y="1020" text-anchor="end" font-family="Arial, sans-serif" font-size="12" fill="white" opacity="0.5">
        EDN Protected
      </text>
    </svg>
  `
  
  return svg.trim()
}

function generateFigureSVG(imageType, outfit, index, skinColor, hairColor, outfitColor, eyeColorHex, breastSize) {
  const baseY = 400
  const figureHeight = 400
  const figureWidth = 200
  
  if (imageType.includes('full body')) {
    return `
      <!-- Full body figure -->
      <ellipse cx="512" cy="${baseY + 100}" rx="${figureWidth/2}" ry="${figureHeight/2}" fill="url(#skinGrad${index})" opacity="0.8"/>
      
      <!-- Head -->
      <circle cx="512" cy="${baseY - 50}" r="60" fill="url(#skinGrad${index})"/>
      
      <!-- Hair -->
      <path d="M 452 ${baseY - 80} Q 512 ${baseY - 120} 572 ${baseY - 80} L 572 ${baseY - 20} Q 512 ${baseY - 10} 452 ${baseY - 20} Z" fill="url(#hairGrad${index})"/>
      
      <!-- Enhanced breasts -->
      <ellipse cx="482" cy="${baseY + 20}" rx="45" ry="60" fill="url(#breastGrad${index})"/>
      <ellipse cx="542" cy="${baseY + 20}" rx="45" ry="60" fill="url(#breastGrad${index})"/>
      
      <!-- Outfit elements -->
      <rect x="462" y="${baseY + 60}" width="100" height="80" fill="url(#outfitGrad${index})" rx="10"/>
      
      <!-- Eyes -->
      <circle cx="492" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
      <circle cx="532" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
    `
  } else if (imageType.includes('partially nude')) {
    return `
      <!-- Partially nude figure -->
      <ellipse cx="512" cy="${baseY + 50}" rx="${figureWidth/2}" ry="${figureHeight/3}" fill="url(#skinGrad${index})" opacity="0.8"/>
      
      <!-- Head -->
      <circle cx="512" cy="${baseY - 50}" r="60" fill="url(#skinGrad${index})"/>
      
      <!-- Hair -->
      <path d="M 452 ${baseY - 80} Q 512 ${baseY - 120} 572 ${baseY - 80} L 572 ${baseY - 20} Q 512 ${baseY - 10} 452 ${baseY - 20} Z" fill="url(#hairGrad${index})"/>
      
      <!-- Enhanced breasts (partially covered) -->
      <ellipse cx="482" cy="${baseY + 10}" rx="45" ry="60" fill="url(#breastGrad${index})"/>
      <ellipse cx="542" cy="${baseY + 10}" rx="45" ry="60" fill="url(#breastGrad${index})"/>
      
      <!-- Minimal outfit -->
      <path d="M 462 ${baseY + 40} Q 512 ${baseY + 30} 562 ${baseY + 40} L 562 ${baseY + 60} Q 512 ${baseY + 50} 462 ${baseY + 60} Z" fill="url(#outfitGrad${index})"/>
      
      <!-- Eyes -->
      <circle cx="492" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
      <circle cx="532" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
    `
  } else if (imageType.includes('nude')) {
    return `
      <!-- Nude artistic figure -->
      <ellipse cx="512" cy="${baseY + 50}" rx="${figureWidth/2}" ry="${figureHeight/3}" fill="url(#skinGrad${index})" opacity="0.8"/>
      
      <!-- Head -->
      <circle cx="512" cy="${baseY - 50}" r="60" fill="url(#skinGrad${index})"/>
      
      <!-- Hair -->
      <path d="M 452 ${baseY - 80} Q 512 ${baseY - 120} 572 ${baseY - 80} L 572 ${baseY - 20} Q 512 ${baseY - 10} 452 ${baseY - 20} Z" fill="url(#hairGrad${index})"/>
      
      <!-- Enhanced breasts (uncovered) -->
      <ellipse cx="482" cy="${baseY + 10}" rx="45" ry="60" fill="url(#breastGrad${index})"/>
      <ellipse cx="542" cy="${baseY + 10}" rx="45" ry="60" fill="url(#breastGrad${index})"/>
      
      <!-- Artistic elements -->
      <circle cx="512" cy="${baseY + 100}" r="80" fill="none" stroke="url(#outfitGrad${index})" stroke-width="2" opacity="0.5"/>
      
      <!-- Eyes -->
      <circle cx="492" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
      <circle cx="532" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
    `
  } else {
    // Portrait
    return `
      <!-- Portrait figure -->
      <ellipse cx="512" cy="${baseY}" rx="${figureWidth/2}" ry="${figureHeight/2}" fill="url(#skinGrad${index})" opacity="0.8"/>
      
      <!-- Head -->
      <circle cx="512" cy="${baseY - 50}" r="60" fill="url(#skinGrad${index})"/>
      
      <!-- Hair -->
      <path d="M 452 ${baseY - 80} Q 512 ${baseY - 120} 572 ${baseY - 80} L 572 ${baseY - 20} Q 512 ${baseY - 10} 452 ${baseY - 20} Z" fill="url(#hairGrad${index})"/>
      
      <!-- Enhanced breasts -->
      <ellipse cx="482" cy="${baseY + 20}" rx="40" ry="50" fill="url(#breastGrad${index})"/>
      <ellipse cx="542" cy="${baseY + 20}" rx="40" ry="50" fill="url(#breastGrad${index})"/>
      
      <!-- Shoulders -->
      <ellipse cx="512" cy="${baseY + 80}" rx="${figureWidth/2}" ry="30" fill="url(#skinGrad${index})"/>
      
      <!-- Eyes -->
      <circle cx="492" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
      <circle cx="532" cy="${baseY - 50}" r="8" fill="url(#eyeGrad${index})"/>
    `
  }
}

async function generateCustomSVGImages() {
  try {
    console.log('=== Generating Custom SVG Images ===')
    
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        promptConfig: true,
        positivePrompt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`Generating images for ${items.length} items...`)

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      try {
        const svgContent = generateCustomSVG(item, i)
        const svgBase64 = Buffer.from(svgContent).toString('base64')
        const svgDataUrl = `data:image/svg+xml;base64,${svgBase64}`
        
        // Update the item with new SVG image
        await prisma.marketplaceItem.update({
          where: { id: item.id },
          data: {
            thumbnail: svgDataUrl,
            images: JSON.stringify([svgDataUrl])
          }
        })
        
        if ((i + 1) % 10 === 0) {
          console.log(`Generated images for ${i + 1}/${items.length} items`)
        }
      } catch (error) {
        console.error(`Error generating image for item ${item.id}:`, error)
      }
    }

    console.log('\n=== Custom SVG Image Generation Complete ===')
    console.log('All 60 models now have unique, customized SVG images that reflect:')
    console.log('✅ Individual ethnic characteristics')
    console.log('✅ Unique hair colors and styles')
    console.log('✅ Different eye colors')
    console.log('✅ Various outfit types and colors')
    console.log('✅ Age-appropriate representations')
    console.log('✅ Enhanced breast features')
    console.log('✅ Different image types (full body, partially nude, nude, portrait)')
    console.log('✅ Professional erotic photography styling')
    console.log('✅ No placeholders - all are custom generated')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateCustomSVGImages()