import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create platforms
  const platforms = [
    {
      name: 'OnlyFans',
      description: 'Premium content subscription platform',
      icon: 'onlyfans',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'Fansly',
      description: 'Adult content platform with live streaming',
      icon: 'fansly',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'JustForFans',
      description: 'Adult content creator platform',
      icon: 'jff',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'ManyVids',
      description: 'Video content marketplace',
      icon: 'manyvids',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'Fanvue',
      description: 'Creator-focused content platform',
      icon: 'fanvue',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'LoyalFans',
      description: 'Fan engagement platform',
      icon: 'loyalfans',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'My.Club',
      description: 'Subscription-based content platform',
      icon: 'myclub',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'iFans',
      description: 'Interactive fan platform',
      icon: 'ifans',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'FanTime',
      description: 'Premium content sharing platform',
      icon: 'fantime',
      category: 'ADULT_PLATFORM'
    },
    {
      name: 'Patreon',
      description: 'Membership platform for creators',
      icon: 'patreon',
      category: 'SOCIAL_MEDIA'
    },
    {
      name: 'Instagram',
      description: 'Photo and video sharing social network',
      icon: 'instagram',
      category: 'SOCIAL_MEDIA'
    },
    {
      name: 'TikTok',
      description: 'Short-form video platform',
      icon: 'tiktok',
      category: 'VIDEO_PLATFORM'
    },
    {
      name: 'Ko-fi',
      description: 'Creator support platform',
      icon: 'kofi',
      category: 'SOCIAL_MEDIA'
    },
    {
      name: 'AdmireMe.VIP',
      description: 'Premium content platform',
      icon: 'admireme',
      category: 'SOCIAL_MEDIA'
    }
  ]

  for (const platform of platforms) {
<<<<<<< HEAD
    await prisma.platform.create({
      data: platform
=======
    await prisma.platform.upsert({
      where: { name: platform.name },
      update: platform,
      create: platform
>>>>>>> cadd3e232a800360949ea9e6ac6d97516abdaa71
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })