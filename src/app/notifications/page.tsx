'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from '@/contexts/notification-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, AlertCircle, Info, Trash2, Settings, ExternalLink, Clock } from 'lucide-react'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive'

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'success' | 'error' | 'warning' | 'info'>('all')

  const filteredNotifications = notifications.filter(notification => {
    const statusMatch = filter === 'all' || 
      (filter === 'unread' && !notification.read) || 
      (filter === 'read' && notification.read)
    
    const typeMatch = typeFilter === 'all' || notification.type === typeFilter
    
    return statusMatch && typeMatch
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <ResponsiveContainer>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">Stay updated with your activity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {unreadCount} unread
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {/* Status Filters */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({notifications.length})
                </Button>
                <Button
                  variant={filter === 'unread' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={filter === 'read' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('read')}
                >
                  Read ({notifications.length - unreadCount})
                </Button>
              </div>

              {/* Type Filters */}
              <div className="flex gap-2">
                <Button
                  variant={typeFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter('all')}
                >
                  All Types
                </Button>
                <Button
                  variant={typeFilter === 'success' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter('success')}
                >
                  Success
                </Button>
                <Button
                  variant={typeFilter === 'error' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter('error')}
                >
                  Error
                </Button>
                <Button
                  variant={typeFilter === 'warning' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter('warning')}
                >
                  Warning
                </Button>
                <Button
                  variant={typeFilter === 'info' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter('info')}
                >
                  Info
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <ResponsiveText variant="heading" className="text-muted-foreground mb-2">
                No notifications found
              </ResponsiveText>
              <ResponsiveText variant="body" className="text-muted-foreground">
                {filter === 'unread' ? 'You have no unread notifications.' : 
                 filter === 'read' ? 'You have no read notifications.' :
                 'You\'re all caught up!'}
              </ResponsiveText>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'border-primary/50 bg-primary/5' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {notification.title}
                            </h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getTypeColor(notification.type)}`}
                            >
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(notification.timestamp)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {notification.action && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={notification.action.onClick}
                          >
                            {notification.action.label}
                          </Button>
                        )}
                        
                        {notification.link && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = notification.link!.href}
                          >
                            {notification.link.text}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ResponsiveContainer>
  )
}