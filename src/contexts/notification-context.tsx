'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Bell, CheckCircle, AlertCircle, Info, X, ExternalLink } from 'lucide-react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  link?: {
    text: string
    href: string
  }
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    }

    setNotifications(prev => [newNotification, ...prev])

    // Auto-remove success notifications after 5 seconds
    if (notification.type === 'success') {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Notification Components
export function NotificationToast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className={`p-4 rounded-lg border shadow-lg ${getBgColor()} animate-slide-in-right`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
          {notification.action && (
            <button
              onClick={() => {
                notification.action?.onClick()
                onClose()
              }}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {notification.action.label}
            </button>
          )}
          {notification.link && (
            <a
              href={notification.link.href}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {notification.link.text}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}

export function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } = useNotifications()

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
        <p className="text-gray-500">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear all
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              notification.read ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {notification.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                {notification.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                {notification.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900">
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    
                    {notification.action && (
                      <button
                        onClick={notification.action.onClick}
                        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {notification.action.label}
                      </button>
                    )}
                    
                    {notification.link && (
                      <a
                        href={notification.link.href}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {notification.link.text}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-gray-500">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </button>
                  </div>
                </div>
                
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function NotificationBell() {
  const { notifications, unreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
            <NotificationCenter />
          </div>
        </>
      )}
    </div>
  )
}

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([])

  useEffect(() => {
    const newNotifications = notifications.filter(n => !n.read && n.type === 'success')
    setVisibleNotifications(newNotifications.map(n => n.id))
  }, [notifications])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications
        .filter(n => visibleNotifications.includes(n.id) && !n.read)
        .map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onClose={() => {
              removeNotification(notification.id)
              setVisibleNotifications(prev => prev.filter(id => id !== notification.id))
            }}
          />
        ))}
    </div>
  )
}