'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}