import { createClient } from '@/lib/supabase-client'
import { db } from '@/lib/db'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role?: string
  verified?: boolean
  subscriptions?: Array<{
    plan: string
    status: string
    expiresAt: string
  }>
  affiliate?: {
    code: string
    commission: number
    earnings: number
    referrals: number
  }
}

export class AuthService {
  private supabase = createClient()

  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Error signing in with email:', error)
      throw error
    }
  }

  async signUpWithEmail(email: string, password: string, name?: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0]
          }
        }
      })

      if (error) {
        throw error
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error('Error signing up with email:', error)
      throw error
    }
  }

  async signInWithGoogle() {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      // Check if database is available
      if (!process.env.DATABASE_URL) {
        // Return a basic user object without database
        return {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0],
          avatar: user.user_metadata?.avatar_url,
          role: 'CREATOR',
          verified: false,
          subscriptions: [],
          affiliate: null
        }
      }

      // Get user data from database
      const dbUser = await db.user.findUnique({
        where: { id: user.id },
        include: {
          subscriptions: {
            where: { status: 'ACTIVE' },
            orderBy: { expiresAt: 'desc' },
            take: 1
          },
          affiliate: true
        }
      })

      if (!dbUser) {
        // Create user in database if doesn't exist
        const newUser = await db.user.create({
          data: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email!.split('@')[0],
            avatar: user.user_metadata?.avatar_url,
            role: 'CREATOR',
            verified: user.email_confirmed_at !== null
          },
          include: {
            subscriptions: {
              where: { status: 'ACTIVE' },
              orderBy: { expiresAt: 'desc' },
              take: 1
            },
            affiliate: true
          }
        })

        return newUser
      }

      return dbUser
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession()
      if (error) {
        throw error
      }
      return session
    } catch (error) {
      console.error('Error getting session:', error)
      return null
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export authOptions for compatibility with existing API routes
export const authOptions = {
  providers: [],
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret',
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
