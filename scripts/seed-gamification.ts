import { db } from '../src/lib/db'

async function seedGamification() {
  try {
    console.log('Seeding gamification data...')

    // Create levels (skip if already exist)
    try {
      const levels = await db.level.createMany({
        data: [
          { name: 'Beginner', minPoints: 0, maxPoints: 99, benefits: '{"features": ["Basic profile", "Standard support"]}' },
          { name: 'Bronze Creator', minPoints: 100, maxPoints: 499, benefits: '{"features": ["Enhanced profile", "Priority support", "Basic analytics"]}' },
          { name: 'Silver Creator', minPoints: 500, maxPoints: 1499, benefits: '{"features": ["Premium profile", "Advanced analytics", "Early access features"]}' },
          { name: 'Gold Creator', minPoints: 1500, maxPoints: 4999, benefits: '{"features": ["VIP profile", "Advanced analytics", "Priority features", "Exclusive content"]}' },
          { name: 'Platinum Creator', minPoints: 5000, maxPoints: 9999, benefits: '{"features": ["Elite profile", "Premium analytics", "All features", "Exclusive rewards"]}' },
          { name: 'Diamond Creator', minPoints: 10000, benefits: '{"features": ["Legendary profile", "Ultimate analytics", "All features", "Exclusive rewards", "Personal support"]}' },
        ],
      })
      console.log('Created levels:', levels.count)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('Levels already exist, skipping...')
      } else {
        throw error
      }
    }

    // Create achievements (skip if already exist)
    try {
      const achievements = await db.achievement.createMany({
        data: [
          { name: 'First Steps', description: 'Complete your profile setup', category: 'MILESTONES', points: 50, tier: 'BRONZE' },
          { name: 'Content Creator', description: 'Create your first piece of content', category: 'MILESTONES', points: 100, tier: 'BRONZE' },
          { name: 'Rising Star', description: 'Create 10 pieces of content', category: 'MILESTONES', points: 250, tier: 'SILVER' },
          { name: 'Content Master', description: 'Create 50 pieces of content', category: 'MILESTONES', points: 500, tier: 'GOLD' },
          { name: 'Social Butterfly', description: 'Connect 3 platforms', category: 'ENGAGEMENT', points: 150, tier: 'BRONZE' },
          { name: 'Network Builder', description: 'Connect 5 platforms', category: 'ENGAGEMENT', points: 300, tier: 'SILVER' },
          { name: 'Marketplace Debut', description: 'List your first marketplace item', category: 'SALES', points: 200, tier: 'BRONZE' },
          { name: 'Marketplace Success', description: 'Make 10 marketplace sales', category: 'SALES', points: 400, tier: 'SILVER' },
          { name: 'Community Hero', description: 'Help 5 other users', category: 'ENGAGEMENT', points: 175, tier: 'BRONZE' },
          { name: 'Engagement Champion', description: 'Reach 1000 total engagements', category: 'ENGAGEMENT', points: 350, tier: 'SILVER' },
        ],
      })
      console.log('Created achievements:', achievements.count)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('Achievements already exist, skipping...')
      } else {
        throw error
      }
    }

    // Create badges (skip if already exist)
    try {
      const badges = await db.badge.createMany({
        data: [
          { name: 'Welcome Badge', description: 'Welcome to EDN! Complete your profile.', iconUrl: '/badges/welcome.png', pointsRequired: 0, criteria: '{"type": "profile_completion", "required": 100}' },
          { name: 'Creator Badge', description: 'Created your first content piece', iconUrl: '/badges/creator.png', pointsRequired: 100, criteria: '{"type": "content_created", "required": 1}' },
          { name: 'Social Connector', description: 'Connected your first platform', iconUrl: '/badges/social.png', pointsRequired: 150, criteria: '{"type": "platforms_connected", "required": 1}' },
          { name: 'Marketplace Pioneer', description: 'Listed your first marketplace item', iconUrl: '/badges/marketplace.png', pointsRequired: 200, criteria: '{"type": "marketplace_items", "required": 1}' },
          { name: 'Community Star', description: 'Helped 5 community members', iconUrl: '/badges/community.png', pointsRequired: 175, criteria: '{"type": "community_help", "required": 5}' },
        ],
      })
      console.log('Created badges:', badges.count)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('Badges already exist, skipping...')
      } else {
        throw error
      }
    }

    // Create rewards (skip if already exist)
    try {
      const rewards = await db.reward.createMany({
        data: [
          { name: 'Profile Theme: Cosmic', description: 'Unlock a cosmic-themed profile', pointsCost: 500, type: 'CUSTOM', value: '{"theme": "cosmic", "colors": ["#6B46C1", "#EC4899"]}', stock: 100, isNsfw: false },
          { name: 'Profile Theme: Neon', description: 'Unlock a neon-themed profile', pointsCost: 750, type: 'CUSTOM', value: '{"theme": "neon", "colors": ["#10B981", "#3B82F6"]}', stock: 100, isNsfw: false },
          { name: 'Exclusive Avatar Frame', description: 'Get an exclusive avatar frame', pointsCost: 1000, type: 'CUSTOM', value: '{"frame": "exclusive", "duration": "permanent"}', stock: 50, isNsfw: false },
          { name: 'Premium Analytics Access', description: '1 month of premium analytics', pointsCost: 2000, type: 'CUSTOM', value: '{"feature": "premium_analytics", "duration": "30 days"}', stock: 25, isNsfw: false },
          { name: 'Content Creation Boost', description: '2x content generation for 1 week', pointsCost: 1500, type: 'AI_CREDITS', value: '{"boost": "2x_generation", "duration": "7 days"}', stock: 30, isNsfw: false },
          { name: 'Exclusive Content Pack', description: 'Premium adult content templates', pointsCost: 3000, type: 'CONTENT_UNLOCK', value: '{"pack": "adult_premium", "count": 10}', stock: 20, isNsfw: true },
          { name: 'VIP Support Token', description: 'Priority customer support for 1 month', pointsCost: 2500, type: 'CUSTOM', value: '{"support": "vip", "duration": "30 days"}', stock: 15, isNsfw: false },
        ],
      })
      console.log('Created rewards:', rewards.count)
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('Rewards already exist, skipping...')
      } else {
        throw error
      }
    }

    // Create gamification settings
    await db.gamificationSettings.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        gamificationEnabled: true,
        leaderboardEnabled: true,
        achievementsEnabled: true,
        challengesEnabled: true,
        pointsPerReferral: 100,
        pointsPerSale: 50,
        levelUpMultiplier: 1.5,
      },
    })

    console.log('Gamification data seeded successfully!')
  } catch (error) {
    console.error('Error seeding gamification data:', error)
  }
}

seedGamification()
  .then(() => {
    console.log('Seed script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Seed script failed:', error)
    process.exit(1)
  })