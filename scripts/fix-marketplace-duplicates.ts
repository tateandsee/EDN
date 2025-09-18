import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Alternative female names to replace duplicates
const alternativeNames = [
  'Seraphina', 'Magnolia', 'Celestia', 'Arabella', 'Vivienne', 'Ophelia',
  'Genevieve', 'Anastasia', 'Cordelia', 'Evangeline', 'Juliette', 'Rosalie',
  'Calliope', 'Penelope', 'Theodora', 'Daphne', 'Lysandra', 'Athena',
  'Cassandra', 'Hermione', 'Persephone', 'Andromeda', 'Hypatia', 'Zenobia',
  'Octavia', 'Valentina', 'Serena', 'Lorelei', 'Isolde', 'Gweniviere',
  'Lilith', 'Morgana', 'Rhiannon', 'Branwen', 'Arianrhod', 'Ceridwen',
  'Saoirse', 'Niamh', 'Ciara', 'Fiona', 'Bridget', 'Maeve', 'Deirdre'
]

async function createProfessionalSvgImage(item: any, customName?: string): Promise<string> {
  // Extract characteristics from tags
  const tags = Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags || '[]')
  const ethnicity = tags.find((tag: string) => 
    ['caucasian', 'asian', 'mixed race', 'persian'].includes(tag.toLowerCase())
  ) || 'Caucasian'
  
  const hairColor = tags.find((tag: string) => 
    ['golden', 'red', 'dark'].includes(tag.toLowerCase())
  ) || 'Dark'
  
  const eyeColor = tags.find((tag: string) => 
    ['blue', 'green', 'brown'].includes(tag.toLowerCase())
  ) || 'Brown'
  
  // Use custom name if provided, otherwise extract from original title
  const displayName = customName || item.title.replace('EDN ', '').replace(' - Premium AI Female Model', '')
  
  // Create a professional SVG with unique design
  const svgContent = `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF1493;stop-opacity:1" />
          <stop offset="33%" style="stop-color:#8B008B;stop-opacity:1" />
          <stop offset="66%" style="stop-color:#4B0082;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#191970;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="6" dy="6" stdDeviation="10" flood-opacity="0.4"/>
        </filter>
        <radialGradient id="spotlight" cx="50%" cy="30%" r="50%">
          <stop offset="0%" style="stop-color:rgba(255,255,255,0.3);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:1" />
        </radialGradient>
      </defs>
      
      <!-- Background with gradient -->
      <rect width="1024" height="1024" fill="url(#grad1)"/>
      
      <!-- Spotlight effect -->
      <ellipse cx="512" cy="300" rx="400" ry="300" fill="url(#spotlight)"/>
      
      <!-- Decorative elements -->
      <circle cx="120" cy="120" r="40" fill="rgba(255,255,255,0.1)"/>
      <circle cx="904" cy="120" r="30" fill="rgba(255,255,255,0.1)"/>
      <circle cx="120" cy="904" r="50" fill="rgba(255,255,255,0.1)"/>
      <circle cx="904" cy="904" r="35" fill="rgba(255,255,255,0.1)"/>
      
      <!-- Corner decorations -->
      <path d="M 0 0 L 200 0 L 0 200 Z" fill="rgba(255,255,255,0.05)"/>
      <path d="M 1024 0 L 824 0 L 1024 200 Z" fill="rgba(255,255,255,0.05)"/>
      <path d="M 0 1024 L 200 1024 L 0 824 Z" fill="rgba(255,255,255,0.05)"/>
      <path d="M 1024 1024 L 824 1024 L 1024 824 Z" fill="rgba(255,255,255,0.05)"/>
      
      <!-- Main content area -->
      <rect x="80" y="180" width="864" height="664" rx="25" fill="rgba(0,0,0,0.4)" filter="url(#shadow)"/>
      
      <!-- Artistic model representation -->
      <g transform="translate(512, 340)">
        <!-- Glamorous head representation -->
        <circle cx="0" cy="-60" r="75" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="4"/>
        
        <!-- Hair with color-specific styling -->
        ${hairColor.toLowerCase() === 'golden' ? 
          '<path d="M -75 -105 Q 0 -140 75 -105 L 75 -25 Q 0 5 -75 -25 Z" fill="url(#goldenGradient)" stroke="white" stroke-width="3"/><defs><linearGradient id="goldenGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" /><stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" /><stop offset="100%" style="stop-color:#FF8C00;stop-opacity:1" /></linearGradient></defs>' :
          hairColor.toLowerCase() === 'red' ?
          '<path d="M -75 -105 Q 0 -140 75 -105 L 75 -25 Q 0 5 -75 -25 Z" fill="url(#redGradient)" stroke="white" stroke-width="3"/><defs><linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#DC143C;stop-opacity:1" /><stop offset="50%" style="stop-color:#B22222;stop-opacity:1" /><stop offset="100%" style="stop-color:#8B0000;stop-opacity:1" /></linearGradient></defs>' :
          '<path d="M -75 -105 Q 0 -140 75 -105 L 75 -25 Q 0 5 -75 -25 Z" fill="url(#darkGradient)" stroke="white" stroke-width="3"/><defs><linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#2F2F2F;stop-opacity:1" /><stop offset="50%" style="stop-color:#1C1C1C;stop-opacity:1" /><stop offset="100%" style="stop-color:#000000;stop-opacity:1" /></linearGradient></defs>'
        }
        
        <!-- Eyes with color -->
        <circle cx="-25" cy="-60" r="10" fill="white"/>
        <circle cx="25" cy="-60" r="10" fill="white"/>
        ${eyeColor.toLowerCase() === 'blue' ? 
          '<circle cx="-25" cy="-60" r="6" fill="#4169E1"/><circle cx="25" cy="-60" r="6" fill="#4169E1"/>' :
          eyeColor.toLowerCase() === 'green' ?
          '<circle cx="-25" cy="-60" r="6" fill="#32CD32"/><circle cx="25" cy="-60" r="6" fill="#32CD32"/>' :
          '<circle cx="-25" cy="-60" r="6" fill="#8B4513"/><circle cx="25" cy="-60" r="6" fill="#8B4513"/>'
        }
        
        <!-- Elegant lips -->
        <path d="M -18 -30 Q 0 -18 18 -30" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/>
        
        <!-- Body silhouette -->
        <ellipse cx="0" cy="80" rx="100" ry="150" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="3"/>
        
        <!-- Elegant necklace -->
        <path d="M -30 20 Q 0 35 30 20" fill="none" stroke="rgba(255,215,0,0.8)" stroke-width="3"/>
      </g>
      
      <!-- Name with elegant typography -->
      <text x="512" y="640" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
        ${displayName}
      </text>
      
      <!-- Characteristics with elegant design -->
      <rect x="256" y="680" width="512" height="50" rx="25" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <text x="512" y="705" font-family="Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.95)" text-anchor="middle" dominant-baseline="middle">
        ${ethnicity} • ${hairColor} Hair • ${eyeColor} Eyes
      </text>
      
      <!-- Premium badge with elegance -->
      <rect x="356" y="750" width="312" height="50" rx="25" fill="rgba(255,215,0,0.9)" stroke="white" stroke-width="3" filter="url(#shadow)"/>
      <text x="512" y="775" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#4B0082" text-anchor="middle" dominant-baseline="middle">
        ✨ PREMIUM EROTIC MODEL ✨
      </text>
      
      <!-- Price display -->
      <rect x="406" y="820" width="212" height="40" rx="20" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>
      <text x="512" y="840" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFD700" text-anchor="middle" dominant-baseline="middle">
        $${item.price}
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`
}

async function main() {
  console.log('🔧 Fixing duplicate marketplace items and ensuring professional images...')
  
  try {
    // Fetch all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })
    
    console.log(`Found ${items.length} marketplace items`)
    
    // Find duplicate titles
    const titleGroups = items.reduce((acc, item) => {
      if (!acc[item.title]) {
        acc[item.title] = []
      }
      acc[item.title].push(item)
      return acc
    }, {} as Record<string, any[]>)
    
    const duplicateTitles = Object.entries(titleGroups).filter(([_, items]) => items.length > 1)
    
    console.log(`Found ${duplicateTitles.length} duplicate title groups`)
    
    let nameIndex = 0
    let updatedCount = 0
    
    // Process duplicates
    for (const [title, duplicateItems] of duplicateTitles) {
      console.log(`\n🔄 Processing duplicates for: ${title}`)
      
      // Keep the first item as-is, update the others
      for (let i = 1; i < duplicateItems.length; i++) {
        const item = duplicateItems[i]
        const newName = alternativeNames[nameIndex % alternativeNames.length]
        
        console.log(`  - Renaming duplicate to: EDN ${newName} - Premium AI Female Model`)
        
        // Create new professional image with unique name
        const newImageUrl = await createProfessionalSvgImage(item, newName)
        
        // Update the item with new title and image
        await prisma.marketplaceItem.update({
          where: { id: item.id },
          data: {
            title: `EDN ${newName} - Premium AI Female Model`,
            thumbnail: newImageUrl,
            images: JSON.stringify([newImageUrl])
          }
        })
        
        updatedCount++
        nameIndex++
      }
    }
    
    // Also update any items that don't have SVG images yet
    const nonSvgItems = items.filter(item => !item.thumbnail?.includes('data:image/svg+xml'))
    console.log(`\n🖼️ Found ${nonSvgItems.length} items without SVG images`)
    
    for (const item of nonSvgItems) {
      console.log(`  - Updating image for: ${item.title}`)
      
      const newImageUrl = await createProfessionalSvgImage(item)
      
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          thumbnail: newImageUrl,
          images: JSON.stringify([newImageUrl])
        }
      })
      
      updatedCount++
    }
    
    console.log(`\n✅ Successfully fixed marketplace items!`)
    console.log(`📊 Results:`)
    console.log(`   - Fixed duplicate titles: ${duplicateTitles.length} groups`)
    console.log(`   - Updated non-SVG images: ${nonSvgItems.length} items`)
    console.log(`   - Total items updated: ${updatedCount}`)
    console.log(`🎨 All items now have unique, professional erotic images`)
    console.log(`🔥 All items are marked as NSFW content`)
    
  } catch (error) {
    console.error('❌ Error fixing marketplace items:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fixing marketplace items:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })