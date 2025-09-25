import { NextRequest, NextResponse } from 'next/server'
<<<<<<< HEAD
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock notification data - in a real app, this would come from a database
const mockNotifications = [
  {
    id: '1',
    type: 'success' as const,
    title: 'Content Published Successfully',
    message: 'Your AI-generated content has been published to all connected platforms.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    link: {
      text: 'View Content',
      href: '/content/1'
    }
  },
  {
    id: '2',
    type: 'info' as const,
    title: 'New Feature Available',
    message: 'Try our new face cloning feature with 95% accuracy!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    action: {
      label: 'Try Now',
      onClick: () => console.log('Navigate to face cloning')
    }
  },
  {
    id: '3',
    type: 'warning' as const,
    title: 'Subscription Expiring Soon',
    message: 'Your premium subscription will expire in 3 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    link: {
      text: 'Renew Now',
      href: '/subscription'
    }
  }
]

=======
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
<<<<<<< HEAD
    if (!session) {
=======
    if (!session?.user?.id) {
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
<<<<<<< HEAD
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredNotifications = mockNotifications
    
    if (unreadOnly) {
      filteredNotifications = mockNotifications.filter(n => !n.read)
    }

    const paginatedNotifications = filteredNotifications
      .slice(offset, offset + limit)
      .map(n => ({
        ...n,
        timestamp: n.timestamp.toISOString()
      }))

    return NextResponse.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unread: mockNotifications.filter(n => !n.read).length
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, action, link } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new notification
    const newNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      action,
      link
    }

    // In a real app, this would be saved to a database
    mockNotifications.unshift(newNotification)

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
=======

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
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
<<<<<<< HEAD
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationIds, action } = body

    if (!notificationIds || !Array.isArray(notificationIds) || !action) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    let updatedCount = 0

    if (action === 'markAsRead') {
      notificationIds.forEach(id => {
        const notification = mockNotifications.find(n => n.id === id)
        if (notification && !notification.read) {
          notification.read = true
          updatedCount++
        }
      })
    } else if (action === 'markAsUnread') {
      notificationIds.forEach(id => {
        const notification = mockNotifications.find(n => n.id === id)
        if (notification && notification.read) {
          notification.read = false
          updatedCount++
        }
      })
    } else if (action === 'delete') {
      for (let i = mockNotifications.length - 1; i >= 0; i--) {
        if (notificationIds.includes(mockNotifications[i].id)) {
          mockNotifications.splice(i, 1)
          updatedCount++
        }
      }
    }

    return NextResponse.json({
      message: `${updatedCount} notifications ${action}d`,
      updatedCount
    })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'clearAll') {
      mockNotifications.length = 0
      return NextResponse.json({ message: 'All notifications cleared' })
    }

    if (action === 'clearRead') {
      const initialLength = mockNotifications.length
      for (let i = mockNotifications.length - 1; i >= 0; i--) {
        if (mockNotifications[i].read) {
          mockNotifications.splice(i, 1)
        }
      }
      const removedCount = initialLength - mockNotifications.length
      return NextResponse.json({ 
        message: `${removedCount} read notifications cleared` 
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error clearing notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
=======
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
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  }
}