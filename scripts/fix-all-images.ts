import { PrismaClient } from '@prisma/client'
import ZAI from 'z-ai-web-dev-sdk'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Fixing All Marketplace Images...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`\n📦 Found ${items.length} marketplace items to process`)

    let fixedCount = 0
    let generatedCount = 0
    let placeholderCount = 0

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    for (const item of items) {
      console.log(`\nProcessing: ${item.title}`)
      
      const hasThumbnail = item.thumbnail && item.thumbnail.trim() !== '' && item.thumbnail !== 'placeholder.jpg'
      const hasImages = item.images && item.images.trim() !== ''
      
      let parsedImages = []
      if (hasImages) {
        try {
          parsedImages = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
        } catch (e) {
          console.log(`❌ Error parsing images for item ${item.id}: ${e}`)
          parsedImages = []
        }
      }

      // Issue 1: Items with thumbnail but no images array
      if (hasThumbnail && (!hasImages || parsedImages.length === 0)) {
        console.log(`🔧 Fixing: Adding thumbnail to images array`)
        
        const imagesArray = [item.thumbnail]
        
        await prisma.marketplaceItem.update({
          where: { id: item.id },
          data: {
            images: JSON.stringify(imagesArray)
          }
        })
        
        fixedCount++
        console.log(`✅ Fixed: Added thumbnail to images array`)
      }

      // Issue 2: Items with placeholder.jpg as thumbnail
      if (item.thumbnail === 'placeholder.jpg' || !hasThumbnail) {
        console.log(`🖼️  Generating new image for placeholder item`)
        
        try {
          // Generate a prompt based on the item's title and tags
          let prompt = `Professional photorealistic portrait of a beautiful woman`
          
          if (item.tags) {
            try {
              const tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags
              if (Array.isArray(tags) && tags.length > 0) {
                prompt += `, ${tags.join(', ')}`
              }
            } catch (e) {
              // Ignore tag parsing errors
            }
          }
          
          prompt += `, high quality, detailed, professional photography, 8k, sharp focus`
          
          if (item.isNsfw) {
            prompt += `, artistic nude, tasteful, elegant`
          } else {
            prompt += `, modest, professional`
          }

          console.log(`🎨 Generating image with prompt: ${prompt}`)
          
          const response = await zai.images.generations.create({
            prompt: prompt,
            size: '1024x1024'
          })

          if (response.data && response.data[0]) {
            const base64Image = response.data[0].base64
            const imageUrl = `data:image/jpeg;base64,${base64Image}`
            
            // Generate filename
            const timestamp = Date.now()
            const randomId = Math.random().toString(36).substring(2, 8)
            const filename = `generated-${timestamp}-${randomId}.jpg`
            const imagePath = `marketplace-images/generated/${filename}`
            
            // Update the item with new image
            await prisma.marketplaceItem.update({
              where: { id: item.id },
              data: {
                thumbnail: imagePath,
                images: JSON.stringify([imagePath])
              }
            })
            
            generatedCount++
            console.log(`✅ Generated new image: ${imagePath}`)
          }
        } catch (error) {
          console.error(`❌ Failed to generate image for item ${item.id}:`, error)
          
          // Fallback: use a default image based on category
          const defaultImage = item.isNsfw 
            ? 'marketplace-images/ai-legend-nsfw-models/full-nude-1.jpg'
            : 'marketplace-images/unique-models/sfw-01-aurora-cmfque12-fixed.jpg'
          
          await prisma.marketplaceItem.update({
            where: { id: item.id },
            data: {
              thumbnail: defaultImage,
              images: JSON.stringify([defaultImage])
            }
          })
          
          placeholderCount++
          console.log(`📋 Used fallback image: ${defaultImage}`)
        }
      }

      // Issue 3: AI Legend NSFW models with thumbnails but no additional images
      if (item.title.includes('AI Legend') && item.isNsfw && parsedImages.length === 0) {
        console.log(`🎭 AI Legend NSFW model detected, ensuring proper images`)
        
        // For AI Legend models, we want to ensure they have the thumbnail in the images array
        if (hasThumbnail) {
          await prisma.marketplaceItem.update({
            where: { id: item.id },
            data: {
              images: JSON.stringify([item.thumbnail])
            }
          })
          
          fixedCount++
          console.log(`✅ Fixed AI Legend model images array`)
        }
      }
    }

    console.log('\n📊 Final Results:')
    console.log('═'.repeat(40))
    console.log(`Total Items Processed: ${items.length}`)
    console.log(`Fixed Images Arrays: ${fixedCount}`)
    console.log(`Generated New Images: ${generatedCount}`)
    console.log(`Used Fallback Images: ${placeholderCount}`)

    // Verify the fixes
    console.log('\n🔍 Verifying fixes...')
    const remainingIssues = await prisma.marketplaceItem.findMany({
      where: {
        OR: [
          { thumbnail: 'placeholder.jpg' },
          { thumbnail: '' },
          { images: '' },
          { images: null }
        ]
      }
    })

    if (remainingIssues.length > 0) {
      console.log(`⚠️  ${remainingIssues.length} items still have issues:`)
      remainingIssues.forEach(item => {
        console.log(`   - ${item.title} (ID: ${item.id})`)
      })
    } else {
      console.log('✅ All items have been successfully fixed!')
    }

    console.log('\n🎉 Image fixing complete!')

  } catch (error) {
    console.error('❌ Error fixing marketplace images:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fixing marketplace images:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })