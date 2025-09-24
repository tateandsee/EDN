import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Testing image rendering for marketplace items...')

  try {
    // Get first NSFW item with its image data
    const item = await prisma.marketplaceItem.findFirst({
      where: { 
        category: 'NSFW',
        isNsfw: true 
      }
    })

    if (!item) {
      console.log('❌ No NSFW items found')
      return
    }

    console.log('📦 Testing item:', {
      id: item.id,
      title: item.title,
      hasThumbnail: !!item.thumbnail,
      thumbnailLength: item.thumbnail?.length || 0
    })

    if (item.thumbnail) {
      // Test the SVG content
      const base64Data = item.thumbnail.split(',')[1]
      const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8')
      
      console.log('🔍 SVG Content Analysis:')
      console.log('   - Length:', svgContent.length)
      console.log('   - Starts with <svg:', svgContent.trim().startsWith('<svg'))
      console.log('   - Ends with </svg>:', svgContent.trim().endsWith('</svg>'))
      console.log('   - Contains xmlns:', svgContent.includes('xmlns='))
      console.log('   - Contains viewBox:', svgContent.includes('viewBox='))
      
      // Create a simple HTML test file
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Image Rendering Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .test-container { margin: 20px 0; }
        .test-image { width: 200px; height: 300px; border: 1px solid #ccc; }
        .original { background: #f0f0f0; }
    </style>
</head>
<body>
    <h1>Marketplace Image Rendering Test</h1>
    <div class="test-container">
        <h2>Item: ${item.title}</h2>
        <p>Thumbnail Length: ${item.thumbnail?.length || 0} characters</p>
        
        <h3>Direct Image Test:</h3>
        <img src="${item.thumbnail}" alt="Test Image" class="test-image" 
             onerror="console.error('Image failed to load'); this.style.border='2px solid red'" 
             onload="console.log('Image loaded successfully'); this.style.border='2px solid green'" />
        
        <h3>Base64 Validation:</h3>
        <p>Valid base64: ${/^data:image\/svg\+xml;base64,[A-Za-z0-9+/]+=*$/.test(item.thumbnail) ? '✅ Yes' : '❌ No'}</p>
        
        <h3>SVG Structure:</h3>
        <pre>${svgContent.substring(0, 200)}...</pre>
    </div>
</body>
</html>`

      // Write test file
      const fs = require('fs')
      const path = require('path')
      const testFilePath = path.join(__dirname, '..', 'public', 'image-test.html')
      
      fs.writeFileSync(testFilePath, htmlContent)
      console.log('✅ Test file created at: /image-test.html')
      console.log('🌐 Open http://localhost:3000/image-test.html to test image rendering')
    }

  } catch (error) {
    console.error('❌ Error testing image rendering:', error)
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })