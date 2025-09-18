'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import NotificationPopup from '@/components/notification-popup'
import { useNotifications } from '@/hooks/use-notifications'
import { useAuth } from './auth-context'

interface NotificationContextType {
  unreadCount: number
  urgentNotifications: any[]
  fetchNotifications: () => void
  markAsRead: (ids: string[]) => void
  dismissNotifications: (ids: string[]) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const {
    notifications,
    loading,
    error,
    unreadCount,
    urgentNotifications,
    fetchNotifications,
    markAsRead,
    dismissNotifications
  } = useNotifications()

  // Only fetch notifications if user is logged in
  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user, fetchNotifications])

  const handleDownload = (downloadId: string) => {
    // Open download link in new window
    window.open(`/api/ai-downloads/${downloadId}/download`, '_blank')
  }

  const value = {
    unreadCount,
    urgentNotifications,
    fetchNotifications,
    markAsRead,
    dismissNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Show notification popups only for logged-in users */}
      {user && !loading && (
        <NotificationPopup
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onDismiss={dismissNotifications}
          onDownload={handleDownload}
        />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}