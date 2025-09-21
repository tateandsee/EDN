import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { name: 'AI Goddess Empire' },
          { email: 'ai-goddess-empire@example.com' }
        ]
      }
    })
    
    if (user) {
      console.log('Found user:', user.name, user.email)
      return user
    } else {
      console.log('User "AI Goddess Empire" not found, creating...')
      const newUser = await prisma.user.create({
        data: {
          name: 'AI Goddess Empire',
          email: 'ai-goddess-empire@example.com',
          role: 'CREATOR',
          verified: true,
          isPaidMember: true
        }
      })
      console.log('Created user:', newUser.name, newUser.email)
      return newUser
    }
  } catch (error) {
    console.error('Error checking/creating user:', error)
    throw error
  }
}

checkUser().then((user) => {
  console.log('User ID:', user.id)
  process.exit(0)
}).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})