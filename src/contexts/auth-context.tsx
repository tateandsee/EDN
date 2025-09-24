'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role?: string
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

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const response = await fetch('/api/auth/user')
          if (response.ok) {
            const { user: dbUser } = await response.json()
            setUser(dbUser)
          }
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            const response = await fetch('/api/auth/user')
            if (response.ok) {
              const { user: dbUser } = await response.json()
              setUser(dbUser)
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
            router.push('/')
          }
        } catch (error) {
          console.error('Error in auth state change:', error)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/user')
      if (response.ok) {
        const { user: dbUser } = await response.json()
        setUser(dbUser)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}