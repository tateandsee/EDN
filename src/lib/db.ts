import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

<<<<<<< HEAD
// Check if we're using Supabase/PostgreSQL or SQLite
const isProduction = process.env.NODE_ENV === 'production'
const useSupabase = process.env.DATABASE_URL?.startsWith('postgresql://')

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
<<<<<<< HEAD
    datasources: {
      db: {
        url: useSupabase 
          ? process.env.DATABASE_URL!
          : 'file:/home/z/my-project/db/custom.db'
      }
    }
=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db