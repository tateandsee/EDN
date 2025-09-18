import { db } from '@/lib/db'

export interface AiDownloadData {
  generationId: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  downloadUrl: string
}

export interface AiDownloadWithTimeLeft {
  id: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  downloadUrl: string
  expiresAt: Date
  isExpired: boolean
  isDeleted: boolean
  downloadCount: number
  maxDownloads: number
  hoursLeft: number
  isExpiringSoon: boolean
  createdAt: Date
  generation: {
    id: string
    type: string
    prompt: string
    createdAt: Date
    status: string
  }
}

export class AiDownloadManager {
  /**
   * Create a new AI model download record
   */
  static async createDownload(userId: string, data: AiDownloadData) {
    try {
      // Calculate expiration time (48 hours from now)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 48)

      // Create the download record
      const download = await db.aiModelDownload.create({
        data: {
          userId,
          generationId: data.generationId,
          fileName: data.fileName,
          filePath: data.filePath,
          fileSize: data.fileSize,
          mimeType: data.mimeType,
          downloadUrl: data.downloadUrl,
          expiresAt
        },
        include: {
          generation: {
            select: {
              id: true,
              type: true,
              prompt: true,
              createdAt: true,
              status: true
            }
          }
        }
      })

      // Schedule expiration notifications
      await this.scheduleExpirationNotifications(download.id, expiresAt)

      return {
        ...download,
        hoursLeft: 48,
        isExpiringSoon: false,
        isExpired: false
      }
    } catch (error) {
      console.error('Error creating AI download:', error)
      throw error
    }
  }

  /**
   * Get user's downloads with time remaining information
   */
  static async getUserDownloads(userId: string, page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit

      const [downloads, total] = await Promise.all([
        db.aiModelDownload.findMany({
          where: {
            userId,
            isDeleted: false
          },
          include: {
            generation: {
              select: {
                id: true,
                type: true,
                prompt: true,
                createdAt: true,
                status: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit
        }),
        db.aiModelDownload.count({
          where: {
            userId,
            isDeleted: false
          }
        })
      ])

      // Calculate time remaining for each download
      const downloadsWithTimeLeft = downloads.map(download => {
        const now = new Date()
        const expiresAt = new Date(download.expiresAt)
        const timeLeft = expiresAt.getTime() - now.getTime()
        const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))
        
        return {
          ...download,
          hoursLeft,
          isExpiringSoon: hoursLeft <= 24 && hoursLeft > 0,
          isExpired: hoursLeft <= 0
        }
      })

      return {
        downloads: downloadsWithTimeLeft,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Error fetching user downloads:', error)
      throw error
    }
  }

  /**
   * Get a specific download by ID
   */
  static async getDownloadById(downloadId: string, userId: string) {
    try {
      const download = await db.aiModelDownload.findUnique({
        where: {
          id: downloadId,
          userId,
          isDeleted: false
        },
        include: {
          generation: {
            select: {
              id: true,
              type: true,
              prompt: true,
              createdAt: true,
              status: true
            }
          }
        }
      })

      if (!download) {
        return null
      }

      // Calculate time remaining
      const now = new Date()
      const expiresAt = new Date(download.expiresAt)
      const timeLeft = expiresAt.getTime() - now.getTime()
      const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))

      return {
        ...download,
        hoursLeft,
        isExpiringSoon: hoursLeft <= 24 && hoursLeft > 0,
        isExpired: hoursLeft <= 0
      }
    } catch (error) {
      console.error('Error fetching download:', error)
      throw error
    }
  }

  /**
   * Process a download request
   */
  static async processDownload(downloadId: string, userId: string) {
    try {
      const download = await db.aiModelDownload.findUnique({
        where: {
          id: downloadId,
          userId,
          isDeleted: false
        }
      })

      if (!download) {
        throw new Error('Download not found or access denied')
      }

      // Check if download is expired
      const now = new Date()
      if (now > download.expiresAt) {
        await this.markDownloadAsExpired(downloadId)
        throw new Error('Download has expired')
      }

      // Check if max downloads reached
      if (download.downloadCount >= download.maxDownloads) {
        throw new Error('Maximum download attempts reached')
      }

      // Increment download count and update last downloaded time
      const updatedDownload = await db.aiModelDownload.update({
        where: { id: downloadId },
        data: {
          downloadCount: {
            increment: 1
          },
          lastDownloadedAt: now
        }
      })

      return updatedDownload
    } catch (error) {
      console.error('Error processing download:', error)
      throw error
    }
  }

  /**
   * Schedule expiration notifications for a download
   */
  private static async scheduleExpirationNotifications(downloadId: string, expiresAt: Date) {
    const now = new Date()
    const timeUntilExpiration = expiresAt.getTime() - now.getTime()
    
    // In a real application, this would use a proper job queue like Bull or Agenda
    // For now, we'll use setTimeout for demonstration
    
    // Schedule 24-hour warning
    const twentyFourHoursBefore = new Date(expiresAt.getTime() - 24 * 60 * 60 * 1000)
    if (twentyFourHoursBefore > now) {
      setTimeout(() => {
        this.createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRING_24H')
      }, twentyFourHoursBefore.getTime() - now.getTime())
    }
    
    // Schedule 12-hour warning
    const twelveHoursBefore = new Date(expiresAt.getTime() - 12 * 60 * 60 * 1000)
    if (twelveHoursBefore > now) {
      setTimeout(() => {
        this.createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRING_12H')
      }, twelveHoursBefore.getTime() - now.getTime())
    }
    
    // Schedule 3-hour warning
    const threeHoursBefore = new Date(expiresAt.getTime() - 3 * 60 * 60 * 1000)
    if (threeHoursBefore > now) {
      setTimeout(() => {
        this.createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRING_3H')
      }, threeHoursBefore.getTime() - now.getTime())
    }
    
    // Schedule expiration notification
    setTimeout(() => {
      this.createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRED')
      this.markDownloadAsExpired(downloadId)
    }, timeUntilExpiration)
  }

  /**
   * Create an expiration notification
   */
  private static async createExpirationNotification(downloadId: string, type: string) {
    try {
      const download = await db.aiModelDownload.findUnique({
        where: { id: downloadId },
        include: { user: true }
      })

      if (!download) return

      const messages = {
        DOWNLOAD_EXPIRING_24H: 'Your AI model download will expire in 24 hours. Download now before it\'s too late!',
        DOWNLOAD_EXPIRING_12H: 'Your AI model download will expire in 12 hours. Don\'t forget to download it!',
        DOWNLOAD_EXPIRING_3H: 'Your AI model download will expire in 3 hours. This is your final reminder!',
        DOWNLOAD_EXPIRED: 'Your AI model download has expired and the file has been deleted.'
      }

      await db.notification.create({
        data: {
          userId: download.userId,
          type: type as any,
          title: 'AI Model Download Expiration',
          message: messages[type as keyof typeof messages] || 'Your download is expiring soon.',
          metadata: {
            downloadId,
            fileName: download.fileName,
            expiresAt: download.expiresAt
          },
          expiresAt: type === 'DOWNLOAD_EXPIRED' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined
        }
      })
    } catch (error) {
      console.error('Error creating expiration notification:', error)
    }
  }

  /**
   * Mark a download as expired
   */
  private static async markDownloadAsExpired(downloadId: string) {
    try {
      await db.aiModelDownload.update({
        where: { id: downloadId },
        data: {
          isExpired: true,
          isDeleted: true
        }
      })
    } catch (error) {
      console.error('Error marking download as expired:', error)
    }
  }

  /**
   * Clean up expired downloads (should be run as a scheduled job)
   */
  static async cleanupExpiredDownloads() {
    try {
      const now = new Date()
      
      // Find all expired downloads that haven't been marked as deleted
      const expiredDownloads = await db.aiModelDownload.findMany({
        where: {
          expiresAt: {
            lt: now
          },
          isDeleted: false
        }
      })

      // Mark them as deleted and create notifications
      for (const download of expiredDownloads) {
        await this.markDownloadAsExpired(download.id)
        await this.createExpirationNotification(download.id, 'DOWNLOAD_EXPIRED')
      }

      // Also clean up old notifications (older than 30 days)
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      await db.notification.deleteMany({
        where: {
          createdAt: {
            lt: thirtyDaysAgo
          },
          isDismissed: true
        }
      })

      return { cleaned: expiredDownloads.length }
    } catch (error) {
      console.error('Error cleaning up expired downloads:', error)
      throw error
    }
  }
}