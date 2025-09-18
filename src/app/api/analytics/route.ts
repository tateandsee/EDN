import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { db } from '@/lib/db'
import { apiRateLimit } from '@/lib/rate-limit'
import { logError } from '@/lib/error-handling'

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp: number
  sessionId?: string
  userId?: string
}

interface AnalyticsPayload {
  events: AnalyticsEvent[]
  timestamp: number
  userAgent?: string
  url?: string
}

// POST /api/analytics - Process analytics events
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await apiRateLimit(request)
    if (rateLimitResult.status !== 200) {
      return rateLimitResult
    }

    const payload: AnalyticsPayload = await request.json()
    const { events, timestamp, userAgent, url } = payload

    // Validate payload
    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'Invalid events data' },
        { status: 400 }
      )
    }

    // Process events in batch
    const processedEvents = events.map(event => ({
      ...event,
      receivedAt: Date.now(),
      userAgent,
      url,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    }))

    // Store events in database (if configured)
    if (process.env.DATABASE_URL) {
      try {
        await Promise.all(processedEvents.map(async (event) => {
          await db.analyticsEvent.create({
            data: {
              event: event.event,
              properties: event.properties || {},
              timestamp: new Date(event.timestamp),
              sessionId: event.sessionId,
              userId: event.userId,
              userAgent: event.userAgent,
              url: event.url,
              ip: event.ip,
              receivedAt: new Date(event.receivedAt),
            }
          })
        }))
      } catch (dbError) {
        console.error('Failed to store analytics events in database:', dbError)
        // Continue processing even if database storage fails
      }
    }

    // Send to external analytics services (if configured)
    if (process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      try {
        await sendToGoogleAnalytics(processedEvents)
      } catch (error) {
        console.error('Failed to send events to Google Analytics:', error)
      }
    }

    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      try {
        await sendToMixpanel(processedEvents)
      } catch (error) {
        console.error('Failed to send events to Mixpanel:', error)
      }
    }

    // Log sample of events for debugging (in development)
    if (process.env.NODE_ENV === 'development' && events.length > 0) {
      console.log('Analytics events processed:', {
        count: events.length,
        sampleEvent: events[0],
        timestamp: new Date(timestamp).toISOString(),
      })
    }

    return NextResponse.json({ 
      success: true, 
      processed: events.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logError(error, { endpoint: '/api/analytics', method: 'POST' })
    return NextResponse.json(
      { error: 'Failed to process analytics events' },
      { status: 500 }
    )
  }
}

// Google Analytics integration
async function sendToGoogleAnalytics(events: AnalyticsEvent[]) {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
  const apiSecret = process.env.GOOGLE_ANALYTICS_API_SECRET

  if (!measurementId || !apiSecret) return

  const payload = {
    client_id: crypto.randomUUID(),
    events: events.map(event => ({
      name: event.event,
      params: {
        ...event.properties,
        session_id: event.sessionId,
        engagement_time_msec: event.timestamp ? Date.now() - event.timestamp : 0,
      }
    }))
  }

  const response = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    throw new Error(`Google Analytics request failed: ${response.status}`)
  }
}

// Mixpanel integration
async function sendToMixpanel(events: AnalyticsEvent[]) {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
  if (!token) return

  for (const event of events) {
    const payload = {
      event: event.event,
      properties: {
        ...event.properties,
        distinct_id: event.userId || event.sessionId,
        time: event.timestamp / 1000, // Convert to seconds
        $insert_id: crypto.randomUUID(),
      }
    }

    const response = await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Mixpanel request failed: ${response.status}`)
    }
  }
}

// GET /api/analytics - Retrieve analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await apiRateLimit(request)
    if (!rateLimitResult || rateLimitResult.status !== 200) {
      return rateLimitResult || NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const userProfile = await db.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    })

    if (!userProfile || userProfile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const event = searchParams.get('event')

    const whereClause: any = {}
    if (startDate) {
      whereClause.timestamp = { gte: new Date(startDate) }
    }
    if (endDate) {
      whereClause.timestamp = { ...whereClause.timestamp, lte: new Date(endDate) }
    }
    if (event) {
      whereClause.event = event
    }

    const analyticsData = await db.analyticsEvent.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 1000, // Limit results
    })

    // Aggregate data for dashboard
    const aggregatedData = {
      totalEvents: analyticsData.length,
      uniqueSessions: new Set(analyticsData.map(e => e.sessionId)).size,
      uniqueUsers: new Set(analyticsData.map(e => e.userId).filter(Boolean)).size,
      topEvents: getTopEvents(analyticsData),
      hourlyDistribution: getHourlyDistribution(analyticsData),
      dailyDistribution: getDailyDistribution(analyticsData),
    }

    return NextResponse.json({
      success: true,
      data: aggregatedData,
      events: analyticsData,
    })

  } catch (error) {
    logError(error, { endpoint: '/api/analytics', method: 'GET' })
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data' },
      { status: 500 }
    )
  }
}

// Helper functions for data aggregation
function getTopEvents(events: any[]) {
  const eventCounts = events.reduce((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(eventCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([event, count]) => ({ event, count }))
}

function getHourlyDistribution(events: any[]) {
  const hourlyCounts = new Array(24).fill(0)
  
  events.forEach(event => {
    const hour = new Date(event.timestamp).getHours()
    hourlyCounts[hour]++
  })

  return hourlyCounts.map((count, hour) => ({
    hour: `${hour}:00`,
    count,
  }))
}

function getDailyDistribution(events: any[]) {
  const dailyCounts: Record<string, number> = {}
  
  events.forEach(event => {
    const date = new Date(event.timestamp).toISOString().split('T')[0]
    dailyCounts[date] = (dailyCounts[date] || 0) + 1
  })

  return Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
}