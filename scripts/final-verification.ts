import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
<<<<<<< HEAD
  console.log('🔍 Final verification of marketplace images...')

  try {
    // Get all marketplace items
    const items = await prisma.marketplaceItem.findMany({
      where: { isNsfw: true },
      take: 5 // Just check first 5 NSFW items
    })

    console.log(`📦 Checking ${items.length} NSFW marketplace items...`)

    let allImagesValid = true
    let itemsWithImages = 0

    for (const item of items) {
      console.log(`\n🔍 Checking item: ${item.title}`)
      
      // Check thumbnail
      if (item.thumbnail) {
        console.log(`  ✅ Has thumbnail (${item.thumbnail.length} chars)`)
        
        // Validate thumbnail format
        if (item.thumbnail.startsWith('data:image/svg+xml;base64,')) {
          try {
            const base64Data = item.thumbnail.split(',')[1]
            const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8')
            
            const isValid = svgContent.includes('<svg') && svgContent.includes('</svg>')
            const hasProperStructure = svgContent.includes('xmlns=') && svgContent.includes('viewBox=')
            
            console.log(`  ✅ Valid SVG format: ${isValid ? 'YES' : 'NO'}`)
            console.log(`  ✅ Proper structure: ${hasProperStructure ? 'YES' : 'NO'}`)
            
            if (!isValid || !hasProperStructure) {
              allImagesValid = false
            } else {
              itemsWithImages++
            }
          } catch (error) {
            console.log(`  ❌ Error decoding thumbnail: ${error}`)
            allImagesValid = false
          }
        } else {
          console.log(`  ❌ Invalid thumbnail format`)
          allImagesValid = false
        }
      } else {
        console.log(`  ❌ No thumbnail`)
        allImagesValid = false
      }

      // Check images array
      if (item.images) {
        try {
          const images = JSON.parse(item.images)
          console.log(`  ✅ Has images array (${images.length} images)`)
          
          if (images.length > 0) {
            const firstImage = images[0]
            if (firstImage.startsWith('data:image/svg+xml;base64,')) {
              console.log(`  ✅ First image is valid base64 SVG`)
            } else {
              console.log(`  ❌ First image has invalid format`)
              allImagesValid = false
            }
          }
        } catch (error) {
          console.log(`  ❌ Error parsing images array: ${error}`)
          allImagesValid = false
        }
      } else {
        console.log(`  ❌ No images array`)
        allImagesValid = false
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`   - Total items checked: ${items.length}`)
    console.log(`   - Items with valid images: ${itemsWithImages}`)
    console.log(`   - All images valid: ${allImagesValid ? 'YES' : 'NO'}`)

    if (allImagesValid && itemsWithImages === items.length) {
      console.log(`\n🎉 SUCCESS: All marketplace images are properly configured!`)
      console.log(`\n📋 Test Instructions:`)
      console.log(`   1. Visit http://localhost:3000/marketplace`)
      console.log(`   2. Ensure NSFW mode is enabled (should be default)`)
      console.log(`   3. You should see actual AI-generated female model images, not placeholders`)
      console.log(`   4. Click on any item to view the detail page`)
      console.log(`   5. Images should display correctly on both listing and detail pages`)
      console.log(`\n🔗 Test URLs:`)
      console.log(`   - Marketplace: http://localhost:3000/marketplace`)
      console.log(`   - Image Test: http://localhost:3000/image-test.html`)
    } else {
      console.log(`\n❌ FAILURE: Some marketplace images have issues`)
      console.log(`   Please review the errors above and fix them.`)
    }

  } catch (error) {
    console.error('❌ Error during verification:', error)
=======
  console.log('🔍 Final Marketplace Verification...')

  try {
    // Get marketplace stats
    const stats = await prisma.marketplaceReview.aggregate({
      _avg: {
        rating: true
      },
      _count: {
        _all: true
      },
      _sum: {
        rating: true
      },
      where: {
        item: {
          status: 'ACTIVE'
        }
      }
    })

    // Get item counts
    const totalItems = await prisma.marketplaceItem.count({
      where: { status: 'ACTIVE' }
    })

    const sfwItems = await prisma.marketplaceItem.count({
      where: { 
        status: 'ACTIVE',
        isNsfw: false
      }
    })

    const nsfwItems = await prisma.marketplaceItem.count({
      where: { 
        status: 'ACTIVE',
        isNsfw: true
      }
    })

    // Get AI Model Goddess info
    const aiModelGoddess = await prisma.user.findFirst({
      where: { name: 'AI Model Goddess' }
    })

    const aiModelGoddessItems = aiModelGoddess ? await prisma.marketplaceItem.count({
      where: { 
        userId: aiModelGoddess.id,
        status: 'ACTIVE'
      }
    }) : 0

    // Get revenue
    const revenueResult = await prisma.marketplaceOrder.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })
    const totalRevenue = revenueResult._sum.amount || 0

    // Get sample items with their ratings
    const sampleItems = await prisma.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      include: {
        reviews: {
          select: {
            rating: true
          }
        }
      },
      take: 5,
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log('\n📊 MARKETPLACE VERIFICATION REPORT')
    console.log('═'.repeat(50))

    console.log('\n📦 Item Statistics:')
    console.log(`   • Total Items: ${totalItems}/60 ✅`)
    console.log(`   • SFW Items: ${sfwItems}/30 ✅`)
    console.log(`   • NSFW Items: ${nsfwItems}/30 ✅`)
    console.log(`   • AI Model Goddess Items: ${aiModelGoddessItems}/60 ✅`)

    console.log('\n⭐ Rating Statistics:')
    console.log(`   • Average Rating: ${stats._avg.rating?.toFixed(1) || 'N/A'}/4.9`)
    console.log(`   • Total Reviews: ${stats._count._all}`)
    console.log(`   • Rating Sum: ${stats._sum.rating || 0}`)

    console.log('\n💰 Revenue Statistics:')
    console.log(`   • Total Revenue: $${totalRevenue.toLocaleString()}/$9,747 ✅`)

    console.log('\n👑 Creator Information:')
    if (aiModelGoddess) {
      console.log(`   • AI Model Goddess: ✅ Found (${aiModelGoddess.name})`)
      console.log(`   • Creator ID: ${aiModelGoddess.id}`)
    } else {
      console.log(`   • AI Model Goddess: ❌ Not Found`)
    }

    console.log('\n📝 Sample Item Ratings:')
    sampleItems.forEach((item, index) => {
      const avgRating = item.reviews.length > 0 
        ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length 
        : 0
      console.log(`   ${index + 1}. ${item.title.substring(0, 30)}...: ${avgRating.toFixed(1)} (${item.reviews.length} reviews)`)
    })

    console.log('\n🎯 REQUIREMENTS CHECK:')
    const requirements = [
      { name: '60 Total Items', met: totalItems === 60, current: totalItems, target: 60 },
      { name: '30 SFW Items', met: sfwItems === 30, current: sfwItems, target: 30 },
      { name: '30 NSFW Items', met: nsfwItems === 30, current: nsfwItems, target: 30 },
      { name: 'AI Model Goddess Creator', met: aiModelGoddessItems === 60, current: aiModelGoddessItems, target: 60 },
      { name: 'Average Rating 4.9', met: stats._avg.rating ? Math.abs(stats._avg.rating - 4.9) <= 0.1 : false, current: stats._avg.rating?.toFixed(1) || 'N/A', target: 4.9 },
      { name: 'Revenue $9,747', met: totalRevenue >= 9747, current: `$${totalRevenue.toLocaleString()}`, target: '$9,747' }
    ]

    let allMet = true
    requirements.forEach(req => {
      const status = req.met ? '✅' : '❌'
      console.log(`   ${status} ${req.name}: ${req.current}/${req.target}`)
      if (!req.met) allMet = false
    })

    console.log('\n🎉 FINAL STATUS:')
    if (allMet) {
      console.log('   ✅ ALL REQUIREMENTS MET!')
    } else {
      console.log('   ⚠️  Some requirements need attention')
    }

    console.log('\n📈 ADDITIONAL STATS:')
    console.log(`   • Average Reviews per Item: ${(stats._count._all / totalItems).toFixed(1)}`)
    console.log(`   • Average Item Price: $${(totalRevenue / (totalRevenue > 0 ? totalItems : 1)).toFixed(2)}`)
    
    // Rating distribution
    const ratingDistribution = await prisma.marketplaceReview.groupBy({
      by: ['rating'],
      _count: {
        rating: true
      },
      where: {
        item: {
          status: 'ACTIVE'
        }
      },
      orderBy: {
        rating: 'asc'
      }
    })

    console.log('\n📊 Rating Distribution:')
    ratingDistribution.forEach(dist => {
      const percentage = (dist._count.rating / stats._count._all * 100).toFixed(1)
      console.log(`   • ${dist.rating} stars: ${dist._count.rating} reviews (${percentage}%)`)
    })

    console.log('\n✅ Verification complete!')

  } catch (error) {
    console.error('❌ Error during verification:', error)
    throw error
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  }
}

main()
  .catch((e) => {
<<<<<<< HEAD
    console.error('❌ Error:', e)
=======
    console.error('❌ Error during verification:', e)
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })