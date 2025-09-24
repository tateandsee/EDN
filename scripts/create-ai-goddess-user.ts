import { db } from '../src/lib/db'
import { UserRole } from '@prisma/client'

async function createAIGoddessUser() {
  try {
    console.log('Creating user "AI Goddess Empire"...')
    
    const userData = {
      email: 'ai-goddess@empire.com',
      name: 'AI Goddess Empire',
      bio: 'Premium AI model creator specializing in flawless, commercially-ready female models with perfect anatomical details.',
      role: UserRole.CREATOR,
      verified: true,
      isPaidMember: true,
      points: 10000,
      onboardingCompleted: true,
    }
    
    const user = await db.user.create({
      data: userData
    })
    
    console.log('✅ Successfully created user "AI Goddess Empire":', user)
    return user
    
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  } finally {
    await db.$disconnect()
  }
}

createAIGoddessUser()