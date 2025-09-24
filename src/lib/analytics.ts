'use client'

import { useEffect } from 'react'

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
  userId?: string
  sessionId?: string
}

interface PageViewEvent {
  page: string
  title: string
  referrer?: string
  search?: string
  hash?: string
}

interface UserProperties {
  userId?: string
  email?: string
  name?: string
  plan?: string
  isNsfwMode?: boolean
  isPaidMember?: boolean
  createdAt?: string
  lastActive?: string
}

// Analytics configuration
const analyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development',
  endpoint: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics',
  sampleRate: parseFloat(process.env.NEXT_PUBLIC_ANALYTICS_SAMPLE_RATE || '1.0'),
}

// Session management
let sessionId: string
let pageViewId: string

if (typeof window !== 'undefined') {
  sessionId = sessionStorage.getItem('analytics_session_id') || crypto.randomUUID()
  sessionStorage.setItem('analytics_session_id', sessionId)
  
  pageViewId = crypto.randomUUID()
}

// Analytics queue for batching
let analyticsQueue: AnalyticsEvent[] = []
let flushTimeout: NodeJS.Timeout | null = null

// Core analytics functions
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (!analyticsConfig.enabled) return

  const analyticsEvent: AnalyticsEvent = {
    event,
    properties,
    timestamp: Date.now(),
    sessionId,
  }

  // Add user info if available
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        analyticsEvent.userId = user.id
      } catch (error) {
        console.warn('Failed to parse user data for analytics:', error)
      }
    }
  }

  analyticsQueue.push(analyticsEvent)

  // Flush queue after a short delay for batching
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushAnalyticsQueue, 1000)
  }
}

export function trackPageView(page: string, title: string, options?: {
  referrer?: string
  search?: string
  hash?: string
}) {
  if (!analyticsConfig.enabled) return

  const pageViewEvent: PageViewEvent = {
    page,
    title,
    referrer: options?.referrer || (typeof document !== 'undefined' ? document.referrer : undefined),
    search: options?.search || (typeof window !== 'undefined' ? window.location.search : undefined),
    hash: options?.hash || (typeof window !== 'undefined' ? window.location.hash : undefined),
  }

  trackEvent('page_view', {
    ...pageViewEvent,
    pageViewId,
  })

  // Update page view ID for next page view
  pageViewId = crypto.randomUUID()
}

export function identifyUser(userId: string, properties?: UserProperties) {
  if (!analyticsConfig.enabled) return

  trackEvent('identify', {
    userId,
    ...properties,
  })

  // Store user info locally
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify({ id: userId, ...properties }))
  }
}

export function setUserProperties(properties: UserProperties) {
  if (!analyticsConfig.enabled) return

  trackEvent('user_properties_update', properties)
}

// E-commerce tracking
export function trackPurchase(properties: {
  orderId: string
  total: number
  currency: string
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    category?: string
  }>
}) {
  trackEvent('purchase', properties)
}

export function trackAddToCart(properties: {
  itemId: string
  itemName: string
  price: number
  category?: string
}) {
  trackEvent('add_to_cart', properties)
}

export function trackRemoveFromCart(properties: {
  itemId: string
  itemName: string
  price: number
}) {
  trackEvent('remove_from_cart', properties)
}

// Content tracking
export function trackContentInteraction(properties: {
  contentId: string
  contentType: 'image' | 'video' | 'text' | 'audio'
  action: 'view' | 'like' | 'share' | 'comment' | 'download'
  metadata?: Record<string, any>
}) {
  trackEvent('content_interaction', properties)
}

// Platform integration tracking
export function trackPlatformConnection(properties: {
  platform: string
  action: 'connect' | 'disconnect'
  success: boolean
}) {
  trackEvent('platform_connection', properties)
}

// AI generation tracking
export function trackAIGeneration(properties: {
  model: string
  type: 'image' | 'text' | 'video' | 'audio'
  prompt?: string
  success: boolean
  duration?: number
  tokensUsed?: number
}) {
  trackEvent('ai_generation', properties)
}

// Error tracking
export function trackError(properties: {
  error: string
  stack?: string
  component?: string
  action?: string
  userAction?: string
}) {
  trackEvent('error', properties)
}

// Performance tracking
export function trackPerformance(properties: {
  metric: string
  value: number
  unit: string
  page?: string
  component?: string
}) {
  trackEvent('performance', properties)
}

// Flush analytics queue
async function flushAnalyticsQueue() {
  if (analyticsQueue.length === 0) return

  const eventsToSend = [...analyticsQueue]
  analyticsQueue = []
  flushTimeout = null

  try {
    // Sample events based on sample rate
    const sampledEvents = eventsToSend.filter(() => Math.random() < analyticsConfig.sampleRate)

    if (sampledEvents.length === 0) return

    const response = await fetch(analyticsConfig.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: sampledEvents,
        timestamp: Date.now(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      }),
    })

    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.status}`)
    }

    if (analyticsConfig.debug) {
      console.log('Analytics events sent:', sampledEvents.length)
    }
  } catch (error) {
    console.error('Failed to send analytics events:', error)
    
    // Re-queue events on failure
    analyticsQueue.unshift(...eventsToSend)
  }
}

// React hook for analytics
export function useAnalytics() {
  useEffect(() => {
    // Track initial page view
    if (typeof window !== 'undefined') {
      trackPageView(
        window.location.pathname,
        document.title,
        {
          referrer: document.referrer,
          search: window.location.search,
          hash: window.location.hash,
        }
      )
    }

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackEvent('page_focus')
      } else {
        trackEvent('page_blur')
      }
    }

    // Handle before unload
    const handleBeforeUnload = () => {
      flushAnalyticsQueue()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return {
    trackEvent,
    trackPageView,
    identifyUser,
    setUserProperties,
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackContentInteraction,
    trackPlatformConnection,
    trackAIGeneration,
    trackError,
    trackPerformance,
  }
}

// Click tracking wrapper
export function trackClick(eventType: string, properties?: Record<string, any>) {
  return (e: React.MouseEvent) => {
    trackEvent(eventType, {
      ...properties,
      element: (e.target as HTMLElement).tagName,
      elementText: (e.target as HTMLElement).textContent,
    })
  }
}

// Form tracking
export function trackFormSubmission(formName: string, properties?: Record<string, any>) {
  return (formData: Record<string, any>) => {
    trackEvent('form_submission', {
      formName,
      ...properties,
      fieldCount: Object.keys(formData).length,
    })
  }
}

// Search tracking
export function trackSearch(query: string, resultsCount: number, category?: string) {
  trackEvent('search', {
    query,
    resultsCount,
    category,
  })
}

// Feature usage tracking
export function trackFeatureUsage(feature: string, action: string, properties?: Record<string, any>) {
  trackEvent('feature_usage', {
    feature,
    action,
    ...properties,
  })
}

// Export analytics for global access
if (typeof window !== 'undefined') {
  (window as any).analytics = {
    trackEvent,
    trackPageView,
    identifyUser,
    setUserProperties,
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackContentInteraction,
    trackPlatformConnection,
    trackAIGeneration,
    trackError,
    trackPerformance,
    trackClick,
    trackFormSubmission,
    trackSearch,
    trackFeatureUsage,
  }
}