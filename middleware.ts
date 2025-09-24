import { NextRequest, NextResponse } from 'next/server'
import { 
  securityMiddleware, 
  apiRateLimit, 
  authRateLimit, 
  uploadRateLimit, 
  paymentRateLimit,
  detectBot,
  detectSuspiciousActivity 
} from '@/lib/rate-limit'
import { requireAuth } from '@/lib/auth-middleware'

export async function middleware(req: NextRequest) {
  // Apply security headers to all requests
  const response = await securityMiddleware(req)
  
  // Skip rate limiting for static files and in development
  if (
    process.env.NODE_ENV === 'development' ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/static') ||
    req.nextUrl.pathname.includes('.') // Static files
  ) {
    return response
  }

  // Protect gamification routes - require authentication
  if (req.nextUrl.pathname.startsWith('/gamification')) {
    const authResult = await requireAuth(req)
    if (authResult.status === 302) {
      return authResult
    }
  }

  // Bot detection - allow bots but log them
  if (detectBot(req)) {
    console.log(`Bot detected: ${req.headers.get('user-agent')} accessing ${req.nextUrl.pathname}`)
    // Allow bots to proceed but could implement different handling
  }

  // Suspicious activity detection
  const suspiciousActivity = detectSuspiciousActivity(req)
  if (suspiciousActivity.isSuspicious) {
    console.warn(`Suspicious activity detected:`, {
      url: req.url,
      ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      userAgent: req.headers.get('user-agent'),
      reasons: suspiciousActivity.reasons
    })
    
    // Could implement additional security measures here
    // For now, we'll allow the request but log it
  }

  // Apply rate limiting based on route patterns
  let rateLimitResponse: NextResponse | null = null
  
  // API routes rate limiting
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // Different rate limits for different API endpoints
    if (req.nextUrl.pathname.startsWith('/api/auth')) {
      rateLimitResponse = await authRateLimit(req)
    } else if (req.nextUrl.pathname.startsWith('/api/upload')) {
      rateLimitResponse = await uploadRateLimit(req)
    } else if (req.nextUrl.pathname.startsWith('/api/coinbase')) {
      rateLimitResponse = await paymentRateLimit(req)
    } else {
      rateLimitResponse = await apiRateLimit(req)
    }
  }

  // If rate limit was exceeded, return the rate limit response
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Special handling for sensitive routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Additional security checks for admin routes
    const adminKey = req.headers.get('x-admin-key')
    if (process.env.NODE_ENV === 'production' && adminKey !== process.env.ADMIN_SECRET_KEY) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized access to admin area' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }

  // Add security-specific headers to the response
  response.headers.set('X-Request-ID', crypto.randomUUID())
  response.headers.set('X-Response-Time', Date.now().toString())
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}