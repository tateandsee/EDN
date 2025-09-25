import { PrismaClient } from '@prisma/client'
<<<<<<< HEAD

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
=======
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// Image generation prompts for each model
const sfwImagePrompts = [
  'Professional portrait of Aurora with elegant makeup and sophisticated styling, studio lighting, high fashion photography, 8k resolution',
  'Beautiful portrait of Luna with natural beauty and soft lighting, artistic photography, professional model, high quality',
  'Stunning portrait of Stella with glamorous makeup and elegant pose, fashion photography, studio setting',
  'Charming portrait of Bella with fresh natural look and warm lighting, lifestyle photography, professional quality',
  'Luminous portrait of Sophia with radiant beauty and golden hour lighting, artistic photography, high resolution',
  'Enchanting portrait of Emma with mystical atmosphere and ethereal beauty, fantasy photography, detailed',
  'Graceful portrait of Olivia with flowing hair and elegant posture, classical photography, sophisticated',
  'Captivating portrait of Ava with intense gaze and dramatic lighting, portrait photography, professional',
  'Professional portrait of Isabella with high fashion styling and studio lighting, model photography, 8k',
  'Radiant portrait of Mia with joyful expression and natural beauty, lifestyle photography, high quality',
  'Ethereal portrait of Charlotte with dreamy atmosphere and soft focus, artistic photography, beautiful',
  'Perfect portrait of Amelia with flawless makeup and elegant styling, beauty photography, professional',
  'Polished portrait of Harper with sophisticated look and high-end fashion, studio photography, luxury',
  'Royal portrait of Evelyn with regal styling and majestic presence, portrait photography, elegant',
  'Graceful portrait of Abigail with gentle expression and classical beauty, traditional photography, refined',
  'Perfect portrait of Emily with timeless beauty and professional styling, portrait photography, classic',
  'Elegant portrait of Elizabeth with sophisticated pose and high fashion, studio photography, luxury',
  'Exquisite portrait of Mila with natural beauty and artistic composition, lifestyle photography, high end',
  'Majestic portrait of Ella with commanding presence and elegant styling, portrait photography, professional',
  'Elegant portrait of Avery with contemporary fashion and modern styling, fashion photography, trendy',
  'Distinguished portrait of Sofia with mature beauty and sophisticated styling, portrait photography, classy',
  'Ethereal portrait of Camila with otherworldly beauty and artistic lighting, fantasy photography, magical',
  'Serene portrait of Aria with peaceful expression and natural beauty, lifestyle photography, calm',
  'Alluring portrait of Scarlett with captivating gaze and dramatic lighting, portrait photography, intense',
  'Poised portrait of Victoria with elegant posture and sophisticated styling, classical photography, refined',
  'Poised portrait of Madison with confident expression and modern styling, contemporary photography, chic',
  'Distinguished portrait of Luna with mature beauty and elegant presence, portrait photography, sophisticated',
  'Ethereal portrait of Grace with angelic features and soft lighting, artistic photography, divine',
  'Perfect portrait of Chloe with fresh beauty and natural styling, lifestyle photography, wholesome',
  'Beautiful portrait of Penelope with classical features and elegant styling, portrait photography, timeless'
]

const nsfwImagePrompts = [
  'Sultry portrait of Layla with seductive gaze and alluring expression, boudoir photography, sensual',
  'Alluring portrait of Riley with captivating beauty and intimate atmosphere, portrait photography, seductive',
  'Ravishing portrait of Zoey with glamorous styling and confident pose, fashion photography, bold',
  'Ravishing portrait of Nora with striking features and dramatic lighting, portrait photography, intense',
  'Seductive portrait of Hannah with sensual expression and artistic composition, boudoir photography, passionate',
  'Mysterious portrait of Lily with enigmatic beauty and shadowy atmosphere, artistic photography, intriguing',
  'Ravishing portrait of Eleanor with sophisticated styling and captivating presence, portrait photography, alluring',
  'Passionate portrait of Hazel with emotional expression and dramatic lighting, artistic photography, intense',
  'Tempting portrait of Violet with seductive gaze and intimate setting, boudoir photography, sensual',
  'Fiery portrait of Aurora with bold styling and confident expression, portrait photography, passionate',
  'Seductive portrait of Stella with alluring beauty and artistic composition, fashion photography, sensual',
  'Dazzling portrait of Natalie with glamorous styling and radiant beauty, portrait photography, stunning',
  'Fiery portrait of Leah with passionate expression and dramatic lighting, artistic photography, intense',
  'Hypnotic portrait of Hannah with mesmerizing gaze and ethereal beauty, fantasy photography, captivating',
  'Hypnotic portrait of Addison with intense expression and artistic lighting, portrait photography, compelling',
  'Ravishing portrait of Lucy with elegant features and sensual styling, boudoir photography, sophisticated',
  'Alluring portrait of Audrey with captivating beauty and intimate atmosphere, portrait photography, seductive',
  'Alluring portrait of Brooklyn with bold styling and confident presence, fashion photography, daring',
  'Exotic portrait of Bella with unique features and artistic composition, portrait photography, distinctive',
  'Alluring portrait of Nova with ethereal beauty and mystical atmosphere, fantasy photography, enchanting',
  'Intoxicating portrait of Genesis with sensual expression and artistic lighting, boudoir photography, passionate',
  'Mysterious portrait of Aaliyah with enigmatic beauty and shadowy atmosphere, artistic photography, intriguing',
  'Magnetic portrait of Kennedy with captivating presence and dramatic styling, portrait photography, compelling',
  'Alluring portrait of Samantha with seductive gaze and intimate setting, boudoir photography, sensual',
  'Seductive portrait of Maya with passionate expression and artistic composition, portrait photography, intense',
  'Hypnotic portrait of Willow with mystical beauty and ethereal atmosphere, fantasy photography, enchanting',
  'Ravishing portrait of Kinsley with glamorous styling and confident pose, fashion photography, bold',
  'Fiery portrait of Naomi with passionate expression and dramatic lighting, artistic photography, intense',
  'Passionate portrait of Aaliyah with emotional intensity and artistic composition, portrait photography, compelling',
  'Voluptuous portrait of Paisley with sensual curves and confident expression, boudoir photography, alluring'
]

// Create public directory for images if it doesn't exist
const imagesDir = path.join(process.cwd(), 'public', 'marketplace-images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

async function generateImage(prompt: string, filename: string): Promise<string> {
  try {
    console.log(`🎨 Generating image: ${filename}`)
    
    // Use the CLI tool to generate the image
    const { execSync } = require('child_process')
    const outputPath = path.join(imagesDir, filename)
    
    // Generate the image using z-ai-generate
    execSync(`z-ai-generate -p "${prompt}" -o "${outputPath}" -s 1024x1024`, {
      stdio: 'inherit'
    })
    
    // Return the public path
    return `/marketplace-images/${filename}`
  } catch (error) {
    console.error(`❌ Error generating image ${filename}:`, error)
    // Fallback to a placeholder image URL
    return `https://picsum.photos/seed/${filename}/1024/1024.jpg`
  }
}

async function main() {
  console.log('🎨 Generating AI Model Images for Marketplace...')
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
<<<<<<< HEAD
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
=======
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📦 Found ${items.length} marketplace items to process`)

    // Process SFW items first
    const sfwItems = items.filter(item => !item.isNsfw)
    const nsfwItems = items.filter(item => item.isNsfw)

    console.log(`📊 SFW Items: ${sfwItems.length}`)
    console.log(`📊 NSFW Items: ${nsfwItems.length}`)

    // Generate images for SFW items
    for (let i = 0; i < sfwItems.length; i++) {
      const item = sfwItems[i]
      const prompt = sfwImagePrompts[i]
      const filename = `sfw-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`
      
      console.log(`\n🎯 Processing SFW item ${i + 1}/${sfwItems.length}: ${item.title}`)
      
      // Generate thumbnail
      const thumbnailUrl = await generateImage(prompt, filename)
      
      // Generate additional images for the gallery
      const additionalImages = []
      for (let j = 1; j <= 2; j++) {
        const additionalFilename = `sfw-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}-${j}.jpg`
        const additionalPrompt = `${prompt}, variation ${j}, different angle and lighting`
        const additionalUrl = await generateImage(additionalPrompt, additionalFilename)
        additionalImages.push(additionalUrl)
      }
      
      // Update the item with new images
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          thumbnail: thumbnailUrl,
          images: JSON.stringify([thumbnailUrl, ...additionalImages])
        }
      })
      
      console.log(`✅ Updated SFW item: ${item.title}`)
    }

    // Generate images for NSFW items
    for (let i = 0; i < nsfwItems.length; i++) {
      const item = nsfwItems[i]
      const prompt = nsfwImagePrompts[i]
      const filename = `nsfw-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}.jpg`
      
      console.log(`\n🎯 Processing NSFW item ${i + 1}/${nsfwItems.length}: ${item.title}`)
      
      // Generate thumbnail
      const thumbnailUrl = await generateImage(prompt, filename)
      
      // Generate additional images for the gallery
      const additionalImages = []
      for (let j = 1; j <= 2; j++) {
        const additionalFilename = `nsfw-${item.id.replace(/[^a-zA-Z0-9]/g, '-')}-${j}.jpg`
        const additionalPrompt = `${prompt}, variation ${j}, different pose and artistic composition`
        const additionalUrl = await generateImage(additionalPrompt, additionalFilename)
        additionalImages.push(additionalUrl)
      }
      
      // Update the item with new images
      await prisma.marketplaceItem.update({
        where: { id: item.id },
        data: {
          thumbnail: thumbnailUrl,
          images: JSON.stringify([thumbnailUrl, ...additionalImages])
        }
      })
      
      console.log(`✅ Updated NSFW item: ${item.title}`)
    }

    console.log('\n🎉 All marketplace images generated successfully!')

    // Verify the updates
    const updatedItems = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      take: 5
    })

    console.log('\n📝 Sample Updated Items:')
    updatedItems.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.title}`)
      console.log(`   Thumbnail: ${item.thumbnail}`)
      try {
        const images = JSON.parse(item.images || '[]')
        console.log(`   Images: ${images.length} images`)
        images.forEach((img: string, idx: number) => {
          console.log(`     ${idx + 1}. ${img}`)
        })
      } catch (e) {
        console.log(`   Images: Error parsing images`)
      }
    })

  } catch (error) {
    console.error('❌ Error generating marketplace images:', error)
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    throw error
  }
}

main()
  .catch((e) => {
<<<<<<< HEAD
    console.error('❌ Error generating images:', e)
=======
    console.error('❌ Error generating marketplace images:', e)
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })