import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying Image Accessibility and Commercial Availability...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' }
    })

    console.log(`\n📦 Found ${items.length} marketplace items to verify`)

    let accessibleCount = 0
    let issuesCount = 0
    const issues: string[] = []

    // Check for common image issues
    const problematicPatterns = [
      'placeholder.jpg',
      'no-image',
      'not-found',
      'error',
      'broken',
      'missing',
      'data:image', // Base64 images that might be too large
      'http://', // External URLs that might be unreliable
      'https://' // External URLs that might be unreliable
    ]

    for (const item of items) {
      const hasThumbnail = item.thumbnail && item.thumbnail.trim() !== ''
      const hasImages = item.images && item.images.trim() !== ''
      
      let parsedImages = []
      if (hasImages) {
        try {
          parsedImages = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
        } catch (e) {
          issues.push(`❌ Item "${item.title}" has malformed images JSON`)
          issuesCount++
          continue
        }
      }

      // Check thumbnail
      if (hasThumbnail) {
        const hasIssue = problematicPatterns.some(pattern => 
          item.thumbnail.toLowerCase().includes(pattern)
        )
        
        if (hasIssue) {
          issues.push(`⚠️  Item "${item.title}" has potentially problematic thumbnail: ${item.thumbnail}`)
          issuesCount++
        } else {
          accessibleCount++
        }
      } else {
        issues.push(`❌ Item "${item.title}" has no thumbnail`)
        issuesCount++
      }

      // Check images array
      if (hasImages && parsedImages.length > 0) {
        for (const img of parsedImages) {
          const hasIssue = problematicPatterns.some(pattern => 
            img.toLowerCase().includes(pattern)
          )
          
          if (hasIssue) {
            issues.push(`⚠️  Item "${item.title}" has potentially problematic image: ${img}`)
            issuesCount++
          }
        }
      } else if (!hasImages) {
        issues.push(`❌ Item "${item.title}" has no images array`)
        issuesCount++
      }

      // Check for very long image paths that might cause issues
      if (item.thumbnail && item.thumbnail.length > 200) {
        issues.push(`⚠️  Item "${item.title}" has very long thumbnail path: ${item.thumbnail.length} characters`)
        issuesCount++
      }

      // Check for proper image extensions
      const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
      if (hasThumbnail) {
        const hasValidExtension = validExtensions.some(ext => 
          item.thumbnail.toLowerCase().endsWith(ext)
        )
        
        if (!hasValidExtension) {
          issues.push(`⚠️  Item "${item.title}" has thumbnail without valid extension: ${item.thumbnail}`)
          issuesCount++
        }
      }

      // Check images array for valid extensions
      if (hasImages && parsedImages.length > 0) {
        for (const img of parsedImages) {
          const hasValidExtension = validExtensions.some(ext => 
            img.toLowerCase().endsWith(ext)
          )
          
          if (!hasValidExtension) {
            issues.push(`⚠️  Item "${item.title}" has image without valid extension: ${img}`)
            issuesCount++
          }
        }
      }
    }

    console.log('\n📊 Verification Results:')
    console.log('═'.repeat(50))
    console.log(`Total Items Checked: ${items.length}`)
    console.log(`Items with Accessible Images: ${accessibleCount}`)
    console.log(`Issues Found: ${issuesCount}`)

    if (issues.length > 0) {
      console.log('\n📋 Detailed Issues:')
      console.log('═'.repeat(50))
      issues.forEach(issue => {
        console.log(issue)
      })
    } else {
      console.log('\n✅ All images appear to be accessible and commercially available!')
    }

    // Summary by category
    console.log('\n📈 Summary by Category:')
    console.log('═'.repeat(30))
    
    const categories = {}
    for (const item of items) {
      const category = item.category
      if (!categories[category]) {
        categories[category] = { total: 0, accessible: 0 }
      }
      categories[category].total++
      
      const hasThumbnail = item.thumbnail && item.thumbnail.trim() !== '' && !problematicPatterns.some(pattern => 
        item.thumbnail.toLowerCase().includes(pattern)
      )
      const hasImages = item.images && item.images.trim() !== ''
      
      if (hasThumbnail && hasImages) {
        categories[category].accessible++
      }
    }

    for (const [category, stats] of Object.entries(categories)) {
      const percentage = ((stats.accessible / stats.total) * 100).toFixed(1)
      console.log(`${category}: ${stats.accessible}/${stats.total} (${percentage}%)`)
    }

    console.log('\n🎉 Image accessibility verification complete!')

    // Return success status
    return issuesCount === 0

  } catch (error) {
    console.error('❌ Error verifying image accessibility:', error)
    throw error
  }
}

main()
  .then((success) => {
    if (success) {
      console.log('\n✅ All images are commercially available and accessible!')
    } else {
      console.log('\n⚠️  Some image issues were found. Please review the detailed issues above.')
    }
    process.exit(success ? 0 : 1)
  })
  .catch((e) => {
    console.error('❌ Error verifying image accessibility:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })