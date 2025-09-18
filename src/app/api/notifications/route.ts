import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const where = {
      userId: session.user.id,
      ...(unreadOnly ? { isRead: false } : {})
    }

    const notifications = await db.notification.findMany({
      where,
      include: {
        download: {
          select: {
            id: true,
            fileName: true,
            expiresAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // Calculate time-sensitive information
    const notificationsWithInfo = notifications.map(notification => {
      const now = new Date()
      let timeLeft = null
      
      if (notification.download?.expiresAt) {
        const expiresAt = new Date(notification.download.expiresAt)
        const timeLeftMs = expiresAt.getTime() - now.getTime()
        timeLeft = Math.max(0, Math.floor(timeLeftMs / (1000 * 60 * 60))) // hours
      } else {
        timeLeft = null
      }

      return {
        ...notification,
        timeLeft,
        isUrgent: timeLeft !== null && timeLeft <= 3
      }
    })

    return NextResponse.json({ notifications: notificationsWithInfo })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationIds, action } = await request.json()

    if (!notificationIds || !Array.isArray(notificationIds) || !action) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const updateData = {}
    switch (action) {
      case 'mark_read':
        Object.assign(updateData, { isRead: true })
        break
      case 'mark_unread':
        Object.assign(updateData, { isRead: false })
        break
      case 'dismiss':
        Object.assign(updateData, { isDismissed: true })
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await db.notification.updateMany({
      where: {
        id: {
          in: notificationIds
        },
        userId: session.user.id
      },
      data: updateData
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}