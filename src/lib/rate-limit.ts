import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum number of requests
  keyGenerator?: (req: NextRequest) => string // Custom key generator
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
  onLimitReached?: (req: NextRequest) => void // Callback when limit is reached
}

interface RateLimitStore {
  requests: Array<{ timestamp: number; success?: boolean }>
  resetTime: number
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, RateLimitStore>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, store] of rateLimitStore.entries()) {
    if (now > store.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export function createRateLimit(config: RateLimitConfig) {
  return async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
    const {
      windowMs,
      maxRequests,
      keyGenerator = defaultKeyGenerator,
      skipSuccessfulRequests = false,
      skipFailedRequests = false,
      onLimitReached
    } = config

    const key = keyGenerator(req)
    const now = Date.now()
    const windowStart = now - windowMs

    // Get or create store for this key
    let store = rateLimitStore.get(key)
    if (!store || now > store.resetTime) {
      store = {
        requests: [],
        resetTime: now + windowMs
      }
      rateLimitStore.set(key, store)
    }

    // Clean old requests
    store.requests = store.requests.filter(req => req.timestamp > windowStart)

    // Check if limit is exceeded
    if (store.requests.length >= maxRequests) {
      if (onLimitReached) {
        onLimitReached(req)
      }
      
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000} seconds.`,
          retryAfter: Math.ceil((store.resetTime - now) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': store.resetTime.toString(),
            'Retry-After': Math.ceil((store.resetTime - now) / 1000).toString()
          }
        }
      )
    }

    return null // Request is allowed
  }

  function defaultKeyGenerator(req: NextRequest): string {
    // Use IP address as the default key
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown'
    
    // Add path to make rate limits path-specific
    const path = new URL(req.url).pathname
    
    // Add user agent to prevent bypassing with different browsers
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    // Create a hash of the combination to avoid long keys
    const hashInput = `${ip}:${path}:${userAgent}`
    return createHash('md5').update(hashInput).digest('hex')
  }
}

// Pre-configured rate limiters
export const apiRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  skipSuccessfulRequests: false
})

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 auth attempts per 15 minutes
  skipFailedRequests: false
})

export const uploadRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 uploads per hour
  skipSuccessfulRequests: false
})

export const paymentRateLimit = createRateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3, // 3 payment attempts per minute
  skipFailedRequests: false
})

// Security headers middleware
export function securityHeaders(req: NextRequest): NextResponse {
  const response = NextResponse.next()

  // Remove headers that expose information
  response.headers.delete('x-powered-by')
  response.headers.delete('server')

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Content Security Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.coinbase.com",
      "frame-src 'self' https://commerce.coinbase.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "block-all-mixed-content",
      "upgrade-insecure-requests"
    ].join('; ')
  )

  // HSTS (only in production)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  return response
}

// CORS middleware
export function corsHeaders(req: NextRequest): NextResponse {
  const response = NextResponse.next()

  // Get origin from request
  const origin = req.headers.get('origin') || ''
  
  // Allow specific origins in production, all in development
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
        'https://ednplatform.com',
        'https://www.ednplatform.com'
      ]
    : ['http://localhost:3000', 'http://localhost:3001']

  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
  }

  return response
}

// Combined security middleware
export async function securityMiddleware(req: NextRequest): Promise<NextResponse> {
  // Apply security headers
  let response = securityHeaders(req)
  
  // Apply CORS headers
  response = corsHeaders(req)
  
  return response
}

// Bot detection middleware
export function detectBot(req: NextRequest): boolean {
  const userAgent = req.headers.get('user-agent') || ''
  
  // List of known bot user agents
  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegram/i,
    /crawler/i,
    /spider/i,
    /bot/i,
    /curl/i,
    /wget/i,
    /postman/i,
    /insomnia/i
  ]
  
  return botPatterns.some(pattern => pattern.test(userAgent))
}

// Suspicious activity detection
export function detectSuspiciousActivity(req: NextRequest): {
  isSuspicious: boolean
  reasons: string[]
} {
  const reasons: string[] = []
  
  // Check for missing headers
  if (!req.headers.get('user-agent')) {
    reasons.push('Missing user-agent')
  }
  
  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-proxy-user-agent'
  ]
  
  suspiciousHeaders.forEach(header => {
    if (req.headers.get(header)) {
      reasons.push(`Suspicious header: ${header}`)
    }
  })
  
  // Check for rapid successive requests (this would need to be implemented with store)
  
  return {
    isSuspicious: reasons.length > 0,
    reasons
  }
}