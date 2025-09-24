'use client'

import { useState, useEffect, useCallback } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  isRead: boolean
  isDismissed: boolean
  createdAt: string
  metadata?: {
    downloadId?: string
    fileName?: string
    expiresAt?: string
  }
  timeLeft?: number
  isUrgent?: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Fetch notifications
  const fetchNotifications = useCallback(async (unreadOnly = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/notifications?unreadOnly=${unreadOnly}&limit=50`)
      
      // Handle 401 (Unauthorized) gracefully - user is not logged in
      if (response.status === 401) {
        setIsAuthenticated(false)
        setNotifications([])
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      
      setIsAuthenticated(true)
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (err) {
      // Only set error if it's not a 401
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message)
      }
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Mark notifications as read
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
          action: 'mark_read'
        })
      })

      if (response.status === 401) {
        setIsAuthenticated(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read')
      }

      setIsAuthenticated(true)
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, isRead: true }
            : notification
        )
      )
    } catch (err) {
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message)
      }
    }
  }, [])

  // Mark notifications as unread
  const markAsUnread = useCallback(async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
          action: 'mark_unread'
        })
      })

      if (response.status === 401) {
        setIsAuthenticated(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to mark notifications as unread')
      }

      setIsAuthenticated(true)
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, isRead: false }
            : notification
        )
      )
    } catch (err) {
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message)
      }
    }
  }, [])

  // Dismiss notifications
  const dismissNotifications = useCallback(async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
          action: 'dismiss'
        })
      })

      if (response.status === 401) {
        setIsAuthenticated(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to dismiss notifications')
      }

      setIsAuthenticated(true)
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, isDismissed: true }
            : notification
        )
      )
    } catch (err) {
      if (err instanceof Error && !err.message.includes('401')) {
        setError(err.message)
      }
    }
  }, [])

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead && !n.isDismissed).length

  // Get urgent notifications
  const urgentNotifications = notifications.filter(n => n.isUrgent && !n.isRead && !n.isDismissed)

  // Auto-refresh notifications every 30 seconds, but only if authenticated
  useEffect(() => {
    fetchNotifications()
    
    const interval = setInterval(() => {
      if (isAuthenticated) {
        fetchNotifications(true) // Only fetch unread notifications for auto-refresh
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchNotifications, isAuthenticated])

  return {
    notifications,
    loading,
    error,
    unreadCount,
    urgentNotifications,
    isAuthenticated,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    dismissNotifications
  }
}