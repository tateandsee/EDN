import { BaseService } from '../core/base-service'
import { DownloadRequest, DownloadResult, DownloadHistoryItem, DownloadStats } from './download-service.interface'
import { db } from '@/lib/db'

export class DownloadService extends BaseService {
  async createDownload(userId: string, request: DownloadRequest): Promise<DownloadResult> {
    return this.withErrorHandling(async () => {
      this.validateRequired(request, ['generationId', 'fileName', 'filePath', 'downloadUrl'], 'Create Download')

      // Verify the generation belongs to the user
      const generation = await db.aiGeneration.findUnique({
        where: {
          id: request.generationId,
          userId
        }
      })

      if (!generation) {
        throw new Error('Generation not found or access denied')
      }

      // Calculate expiration time (48 hours from now)
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 48)

      // Create the download record
      const download = await db.aiModelDownload.create({
        data: {
          generationId: request.generationId,
          userId,
          fileName: request.fileName,
          filePath: request.filePath,
          fileSize: request.fileSize,
          mimeType: request.mimeType,
          downloadUrl: request.downloadUrl,
          expiresAt
        }
      })

      // Schedule expiration notifications
      await this.scheduleExpirationNotifications(download.id, expiresAt)

      const hoursLeft = this.calculateHoursLeft(expiresAt)

      return {
        id: download.id,
        fileName: download.fileName,
        downloadUrl: download.downloadUrl,
        expiresAt: download.expiresAt,
        hoursLeft,
        isExpiringSoon: hoursLeft <= 24,
        maxDownloads: download.maxDownloads,
        downloadCount: download.downloadCount
      }
    }, 'Create Download')
  }

  async getUserDownloads(userId: string, page: number = 1, limit: number = 10): Promise<{
    downloads: DownloadHistoryItem[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }> {
    return this.withErrorHandling(async () => {
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

      const downloadsWithTimeLeft = downloads.map(download => {
        const hoursLeft = this.calculateHoursLeft(download.expiresAt)
        
        return {
          id: download.id,
          fileName: download.fileName,
          fileSize: download.fileSize,
          expiresAt: download.expiresAt,
          downloadCount: download.downloadCount,
          maxDownloads: download.maxDownloads,
          hoursLeft,
          isExpiringSoon: hoursLeft <= 24 && hoursLeft > 0,
          isExpired: hoursLeft <= 0,
          createdAt: download.createdAt,
          generation: {
            id: download.generation.id,
            type: this.mapGenerationType(download.generation.type),
            prompt: download.generation.prompt,
            createdAt: download.generation.createdAt
          }
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
    }, 'Get User Downloads')
  }

  async processDownload(downloadId: string, userId: string): Promise<string> {
    return this.withErrorHandling(async () => {
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
      if (new Date() > download.expiresAt) {
        await this.markDownloadAsExpired(downloadId)
        throw new Error('Download has expired')
      }

      // Check if max downloads reached
      if (download.downloadCount >= download.maxDownloads) {
        throw new Error('Maximum download attempts reached')
      }

      // Increment download count
      await db.aiModelDownload.update({
        where: { id: downloadId },
        data: {
          downloadCount: {
            increment: 1
          },
          lastDownloadedAt: new Date()
        }
      })

      return download.downloadUrl
    }, 'Process Download')
  }

  async getDownloadStats(userId: string): Promise<DownloadStats> {
    return this.withErrorHandling(async () => {
      const [total, active, expired, storageResult] = await Promise.all([
        db.aiModelDownload.count({
          where: { userId }
        }),
        db.aiModelDownload.count({
          where: { 
            userId,
            isDeleted: false,
            expiresAt: { gt: new Date() }
          }
        }),
        db.aiModelDownload.count({
          where: { 
            userId,
            isDeleted: true
          }
        }),
        db.aiModelDownload.aggregate({
          where: { userId },
          _sum: { fileSize: true }
        })
      ])

      return {
        totalDownloads: total,
        activeDownloads: active,
        expiredDownloads: expired,
        totalStorageUsed: storageResult._sum.fileSize || 0
      }
    }, 'Get Download Stats')
  }

  async cleanupExpiredDownloads(): Promise<{ cleaned: number }> {
    return this.withErrorHandling(async () => {
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

      return { cleaned: expiredDownloads.length }
    }, 'Cleanup Expired Downloads')
  }

  private calculateHoursLeft(expiresAt: Date): number {
    const now = new Date()
    const timeLeft = expiresAt.getTime() - now.getTime()
    return Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))
  }

  private mapGenerationType(type: string): string {
    const typeMap: Record<string, string> = {
      'CHAT_COMPLETION': 'text',
      'IMAGE_GENERATION': 'image',
      'CODE_GENERATION': 'code',
      'TEXT_GENERATION': 'text',
      'AUDIO_GENERATION': 'audio',
      'VIDEO_GENERATION': 'video'
    }
    return typeMap[type] || 'unknown'
  }

  private async scheduleExpirationNotifications(downloadId: string, expiresAt: Date) {
    const now = new Date()
    const timeUntilExpiration = expiresAt.getTime() - now.getTime()
    
    // In a real application, this would use a proper job queue
    // For demonstration, we'll use setTimeout (not ideal for production)
    
    const notificationTimes = [
      { hours: 24, type: 'DOWNLOAD_EXPIRING_24H' },
      { hours: 12, type: 'DOWNLOAD_EXPIRING_12H' },
      { hours: 3, type: 'DOWNLOAD_EXPIRING_3H' }
    ]

    for (const { hours, type } of notificationTimes) {
      const notificationTime = new Date(expiresAt.getTime() - hours * 60 * 60 * 1000)
      if (notificationTime > now) {
        setTimeout(() => {
          this.createExpirationNotification(downloadId, type)
        }, notificationTime.getTime() - now.getTime())
      }
    }

    // Schedule expiration notification
    setTimeout(() => {
      this.createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRED')
      this.markDownloadAsExpired(downloadId)
    }, timeUntilExpiration)
  }

  private async createExpirationNotification(downloadId: string, type: string) {
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

  private async markDownloadAsExpired(downloadId: string) {
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
}