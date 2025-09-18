'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Bell, 
  Download, 
  Clock, 
  AlertTriangle, 
  X, 
  CheckCircle,
  ExternalLink,
  Hourglass
} from 'lucide-react'

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

interface NotificationPopupProps {
  notifications: Notification[]
  onMarkAsRead: (notificationIds: string[]) => void
  onDismiss: (notificationIds: string[]) => void
  onDownload?: (downloadId: string) => void
}

export default function NotificationPopup({ 
  notifications, 
  onMarkAsRead, 
  onDismiss, 
  onDownload 
}: NotificationPopupProps) {
  const { isNSFW } = useNSFW()
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    // Filter for unread, non-dismissed notifications
    const unreadNotifications = notifications.filter(n => !n.isRead && !n.isDismissed)
    
    // Sort by urgency and creation time
    const sortedNotifications = unreadNotifications.sort((a, b) => {
      // Urgent notifications first
      if (a.isUrgent && !b.isUrgent) return -1
      if (!a.isUrgent && b.isUrgent) return 1
      
      // Then by creation time (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    setVisibleNotifications(sortedNotifications.slice(0, 5)) // Show max 5 at once
  }, [notifications])

  const getNotificationIcon = (type: string, isUrgent: boolean) => {
    if (isUrgent) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    }
    
    switch (type) {
      case 'DOWNLOAD_EXPIRING_24H':
      case 'DOWNLOAD_EXPIRING_12H':
      case 'DOWNLOAD_EXPIRING_3H':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'DOWNLOAD_EXPIRED':
      case 'DOWNLOAD_DELETED':
        return <X className="h-5 w-5 text-red-500" />
      case 'PAYMENT_SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'PAYMENT_FAILED':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'AFFILIATE_COMMISSION':
        return <Download className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationColor = (type: string, isUrgent: boolean) => {
    if (isUrgent) {
      return isNSFW ? 'border-red-400 bg-red-900/20' : 'border-red-400 bg-red-100'
    }
    
    switch (type) {
      case 'DOWNLOAD_EXPIRING_3H':
        return isNSFW ? 'border-orange-400 bg-orange-900/20' : 'border-orange-400 bg-orange-100'
      case 'DOWNLOAD_EXPIRING_12H':
      case 'DOWNLOAD_EXPIRING_24H':
        return isNSFW ? 'border-yellow-400 bg-yellow-900/20' : 'border-yellow-400 bg-yellow-100'
      case 'DOWNLOAD_EXPIRED':
      case 'DOWNLOAD_DELETED':
        return isNSFW ? 'border-red-400 bg-red-900/20' : 'border-red-400 bg-red-100'
      case 'PAYMENT_SUCCESS':
      case 'AFFILIATE_COMMISSION':
        return isNSFW ? 'border-green-400 bg-green-900/20' : 'border-green-400 bg-green-100'
      case 'PAYMENT_FAILED':
        return isNSFW ? 'border-red-400 bg-red-900/20' : 'border-red-400 bg-red-100'
      default:
        return isNSFW ? 'border-blue-400 bg-blue-900/20' : 'border-blue-400 bg-blue-100'
    }
  }

  const formatTimeLeft = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  }

  const handleDownload = (downloadId: string) => {
    if (onDownload) {
      onDownload(downloadId)
    }
  }

  const handleDismiss = (notificationId: string) => {
    onDismiss([notificationId])
  }

  const handleMarkAsRead = (notificationId: string) => {
    onMarkAsRead([notificationId])
  }

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => (
        <Card 
          key={notification.id}
          className={`backdrop-blur-sm border-2 shadow-lg transition-all duration-300 hover:shadow-xl ${getNotificationColor(notification.type, notification.isUrgent || false)}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getNotificationIcon(notification.type, notification.isUrgent || false)}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-semibold truncate">
                    {notification.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => handleDismiss(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm mb-3">{notification.message}</p>
            
            {notification.metadata?.downloadId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    {notification.metadata.fileName}
                  </Badge>
                  {notification.timeLeft !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      <Hourglass className="w-3 h-3 mr-1" />
                      {formatTimeLeft(notification.timeLeft)} left
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(notification.metadata.downloadId!)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download Now
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedId(expandedId === notification.id ? null : notification.id)}
                  >
                    {expandedId === notification.id ? 'Less' : 'More'}
                  </Button>
                </div>
                
                {expandedId === notification.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      This download will expire in {formatTimeLeft(notification.timeLeft || 0)}. 
                      Make sure to download it before it's automatically deleted.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}