import { db } from './src/lib/db'

async function checkOrCreateAILegendUser() {
  try {
    // Check if user "AI legend" exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { name: 'AI legend' },
          { email: 'ai.legend@example.com' }
        ]
      }
    })

    if (existingUser) {
      console.log('User "AI legend" already exists:', existingUser)
      return existingUser
    }

    // Create the user if they don't exist
    const newUser = await db.user.create({
      data: {
        name: 'AI legend',
        email: 'ai.legend@example.com',
        role: 'CREATOR',
        verified: true,
        isPaidMember: true,
        points: 10000,
        onboardingCompleted: true,
      }
    })

    console.log('Created user "AI legend":', newUser)
    return newUser
  } catch (error) {
    console.error('Error checking/creating AI legend user:', error)
    throw error
  }
}

// Run the function
checkOrCreateAILegendUser()
  .then(user => {
    console.log('AI legend user ID:', user.id)
    process.exit(0)
  })
  .catch(error => {
    console.error('Failed to check/create AI legend user:', error)
    process.exit(1)
  })