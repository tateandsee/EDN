import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('👤 Creating admin account...')

  const adminEmail = 'mr.blackmore@outlook.com.au'
  const adminName = 'admintate'
  const adminPassword = 'Chelsea25$$EdN25'

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('✅ Admin account already exists')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      role: 'ADMIN',
      verified: true,
      isPaidMember: true,
      onboardingCompleted: true,
      // Note: In a real app, you'd handle password hashing through NextAuth
      // For now, we'll create the user and let NextAuth handle auth setup
    }
  })

  console.log('✅ Admin account created successfully!')
  console.log(`Email: ${adminEmail}`)
  console.log(`Name: ${adminName}`)
  console.log(`Role: ADMIN`)
  console.log(`User ID: ${admin.id}`)
}

main()
  .catch((e) => {
    console.error('❌ Error creating admin account:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })