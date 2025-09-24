const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const adminUser = await prisma.user.upsert({
      where: { email: 'EDNTATEADMIN' },
      update: {},
      create: {
        email: 'EDNTATEADMIN',
        name: 'EDN Admin',
        role: 'admin',
      },
    });
    
    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
