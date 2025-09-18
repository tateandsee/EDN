import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're using Supabase/PostgreSQL or SQLite
const isProduction = process.env.NODE_ENV === 'production'
const useSupabase = process.env.DATABASE_URL?.startsWith('postgresql://')

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: useSupabase 
          ? process.env.DATABASE_URL!
          : 'file:/home/z/my-project/db/custom.db'
      }
    }
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db