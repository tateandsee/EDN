import { db } from '../src/lib/db'

async function checkDatabaseState() {
  try {
    console.log('Checking database state...')
    
    // Check if user "AI Goddess Empire" exists
    const aiGoddessUser = await db.user.findFirst({
      where: {
        OR: [
          { name: 'AI Goddess Empire' },
          { email: 'ai-goddess@empire.com' }
        ]
      }
    })
    
    if (aiGoddessUser) {
      console.log('✅ User "AI Goddess Empire" exists:', aiGoddessUser)
    } else {
      console.log('❌ User "AI Goddess Empire" does not exist')
    }
    
    // Check marketplace items count
    const marketplaceItemsCount = await db.marketplaceItem.count()
    console.log(`📦 Current marketplace items count: ${marketplaceItemsCount}`)
    
    // Check marketplace items by category
    const sfwItems = await db.marketplaceItem.count({ where: { isNsfw: false } })
    const nsfwItems = await db.marketplaceItem.count({ where: { isNsfw: true } })
    console.log(`📦 SFW items: ${sfwItems}, NSFW items: ${nsfwItems}`)
    
    // Check users count
    const usersCount = await db.user.count()
    console.log(`👥 Total users: ${usersCount}`)
    
    // Check if there are any marketplace items at all
    if (marketplaceItemsCount > 0) {
      const sampleItem = await db.marketplaceItem.findFirst()
      console.log('📄 Sample marketplace item:', sampleItem)
    }
    
  } catch (error) {
    console.error('Error checking database state:', error)
  } finally {
    await db.$disconnect()
  }
}

checkDatabaseState()