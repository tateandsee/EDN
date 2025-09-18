export interface NotificationRequest {
  userId: string
  type: NotificationType
  title: string
  message: string
  metadata?: Record<string, any>
  expiresAt?: Date
}

export interface NotificationUpdateRequest {
  notificationIds: string[]
  action: 'mark_read' | 'mark_unread' | 'dismiss'
}

export interface NotificationFilter {
  unreadOnly?: boolean
  limit?: number
  type?: NotificationType
}

export interface NotificationResult {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  isDismissed: boolean
  createdAt: Date
  metadata?: Record<string, any>
  timeLeft?: number
  isUrgent?: boolean
}

export type NotificationType = 
  | 'DOWNLOAD_EXPIRING_24H'
  | 'DOWNLOAD_EXPIRING_12H'
  | 'DOWNLOAD_EXPIRING_3H'
  | 'DOWNLOAD_EXPIRED'
  | 'DOWNLOAD_DELETED'
  | 'SYSTEM_ALERT'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'AFFILIATE_COMMISSION'
  | 'ACHIEVEMENT_UNLOCKED'