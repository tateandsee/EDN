import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from '@/lib/db'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { getSupabaseConfig } from './config'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // For development, allow any email/password
        if (process.env.NODE_ENV === 'development') {
          if (credentials?.email && credentials?.password) {
            // Check if user exists in database
            let user = await db.user.findUnique({
              where: { email: credentials.email }
            })

            if (!user) {
              // Create user if doesn't exist
              user = await db.user.create({
                data: {
                  email: credentials.email,
                  name: credentials.email.split('@')[0],
                  role: 'CREATOR',
                  verified: false
                }
              })
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name
            }
          }
        }

        // In production, implement proper authentication
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error'
  },
  debug: process.env.NODE_ENV === 'development'
}