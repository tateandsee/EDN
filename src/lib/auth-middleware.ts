import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export async function requireAuth(request: NextRequest) {
  const supabase = createClient()
  
  // Get the current user from Supabase
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    // Redirect to sign in page
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('redirectTo', request.url)
    return NextResponse.redirect(signInUrl)
  }
  
  // If user is authenticated, continue with the request
  return NextResponse.next()
}

export async function withAuth(handler: (request: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context?: any) => {
    const authResult = await requireAuth(request)
    
    // If the response is a redirect, return it
    if (authResult.status === 302) {
      return authResult
    }
    
    // Otherwise, proceed with the original handler
    return handler(request, context)
  }
}