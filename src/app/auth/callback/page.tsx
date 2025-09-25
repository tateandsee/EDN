'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
<<<<<<< HEAD
import { authService } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      // Handle the OAuth callback
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setStatus('error')
        setMessage(error.message)
        return
      }

      if (data.session?.user) {
        // Check if user exists in database
        const dbUser = await authService.getCurrentUser()
        
        if (!dbUser) {
          // Create user in database if not exists
          const response = await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: data.session.user
            })
          })

          if (!response.ok) {
            setStatus('error')
            setMessage('Failed to create user account')
            return
          }
        }

        setUser(data.session.user)
        setStatus('success')
        setMessage('Authentication successful!')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setStatus('error')
        setMessage('No session found')
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      setStatus('error')
      setMessage('An unexpected error occurred')
    }
  }

  const handleResendVerification = async () => {
    if (!user?.email) return
    
    try {
      // For now, we'll use Supabase directly since authService doesn't have resend method yet
      const { supabase } = await import('@/lib/supabase-client')
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      
      if (error) {
        setMessage(error.message || 'Failed to resend verification email')
      } else {
        setMessage('Verification email resent successfully')
      }
    } catch (error) {
      setMessage('Failed to resend verification email')
    }
  }
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing your authentication...')
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }

        if (data.session) {
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          // Create user profile in database if it doesn't exist
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const response = await fetch('/api/auth/user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.user_metadata.full_name || user.email?.split('@')[0],
                avatar: user.user_metadata.avatar_url,
              }),
            })
            
            if (!response.ok) {
              console.error('Failed to create user profile')
            }
          }
          
          // Redirect after a short delay
          setTimeout(() => {
            const redirectTo = searchParams.get('redirectTo') || '/dashboard'
            router.push(redirectTo)
          }, 2000)
        } else {
          setStatus('error')
          setMessage('No session found. Please try again.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Authentication failed. Please try again.')
        console.error('Auth callback error:', error)
      }
    }

    handleCallback()
  }, [router, searchParams, supabase])
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
<<<<<<< HEAD
              Authentication Status
            </CardTitle>
            <CardDescription className="text-white/70">
              Processing your authentication...
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              {status === 'loading' && (
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-8 w-8 text-green-400" />
              )}
              {status === 'error' && (
                <XCircle className="h-8 w-8 text-red-400" />
              )}
            </div>
            
            <Alert className={status === 'error' ? 'border-red-400 bg-red-400/10' : 'border-green-400 bg-green-400/10'}>
              <AlertDescription className="text-white">
                {message}
              </AlertDescription>
            </Alert>
            
            {status === 'success' && user && !user.email_confirmed_at && (
              <div className="space-y-3">
                <p className="text-white/70 text-sm text-center">
                  Please verify your email address to access all features.
                </p>
                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
              </div>
            )}
            
            {status === 'error' && (
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/auth/signin')}
                  variant="outline"
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Back to Sign In
                </Button>
              </div>
=======
              Authentication
            </CardTitle>
            <CardDescription className="text-white/70">
              {message}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
              )}
              {status === 'success' && (
                <CheckCircle className="h-12 w-12 text-green-400" />
              )}
              {status === 'error' && (
                <XCircle className="h-12 w-12 text-red-400" />
              )}
            </div>
            
            {status === 'error' && (
              <button
                onClick={() => router.push('/auth/signin')}
                className="text-purple-400 hover:text-purple-300 underline"
              >
                Return to Sign In
              </button>
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}