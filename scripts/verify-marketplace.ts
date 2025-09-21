import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Verifying marketplace data...')

  try {
    // Check total marketplace items
    const totalItems = await prisma.marketplaceItem.count({
      where: { status: 'ACTIVE' }
    })
    console.log(`📦 Total marketplace items: ${totalItems}`)

    // Check SFW items
    const sfwItems = await prisma.marketplaceItem.count({
      where: { 
        status: 'ACTIVE',
        isNsfw: false
      }
    })
    console.log(`✅ SFW items: ${sfwItems}`)

    // Check NSFW items
    const nsfwItems = await prisma.marketplaceItem.count({
      where: { 
        status: 'ACTIVE',
        isNsfw: true
      }
    })
    console.log(`🔥 NSFW items: ${nsfwItems}`)

    // Check AI Model Goddess user
    const aiModelGoddess = await prisma.user.findFirst({
      where: { name: 'AI Model Goddess' }
    })
    if (aiModelGoddess) {
      console.log(`👑 AI Model Goddess user found: ${aiModelGoddess.name} (${aiModelGoddess.id})`)
    } else {
      console.log('❌ AI Model Goddess user not found')
    }

    // Check items by AI Model Goddess
    const aiModelGoddessItems = await prisma.marketplaceItem.count({
      where: { 
        userId: aiModelGoddess?.id,
        status: 'ACTIVE'
      }
    })
    console.log(`🎯 Items by AI Model Goddess: ${aiModelGoddessItems}`)

    // Check total revenue
    const revenueResult = await prisma.marketplaceOrder.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })
    const totalRevenue = revenueResult._sum.amount || 0
    console.log(`💰 Total revenue: $${totalRevenue.toLocaleString()}`)

    // Check if test user has any items
    const testUser = await prisma.user.findFirst({
      where: { name: 'test user' }
    })
    if (testUser) {
      const testUserItems = await prisma.marketplaceItem.count({
        where: { userId: testUser.id }
      })
      console.log(`🗑️  Test user items: ${testUserItems} (should be 0)`)
    }

    // Check item types
    const aiModelItems = await prisma.marketplaceItem.count({
      where: { 
        type: 'AI_MODEL',
        status: 'ACTIVE'
      }
    })
    console.log(`🤖 AI Model items: ${aiModelItems}`)

    // Summary
    console.log('\n📊 Summary:')
    console.log(`   - Total items: ${totalItems}/60`)
    console.log(`   - SFW items: ${sfwItems}/30`)
    console.log(`   - NSFW items: ${nsfwItems}/30`)
    console.log(`   - AI Model Goddess items: ${aiModelGoddessItems}/60`)
    console.log(`   - AI Model type items: ${aiModelItems}/60`)
    console.log(`   - Total revenue: $${totalRevenue.toLocaleString()}/$9,747`)

    // Check if all requirements are met
    const requirementsMet = 
      totalItems === 60 &&
      sfwItems === 30 &&
      nsfwItems === 30 &&
      aiModelGoddessItems === 60 &&
      aiModelItems === 60 &&
      totalRevenue >= 9747

    if (requirementsMet) {
      console.log('\n🎉 All marketplace requirements met successfully!')
    } else {
      console.log('\n❌ Some requirements are not met')
    }

  } catch (error) {
    console.error('❌ Error verifying marketplace:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error verifying marketplace:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })