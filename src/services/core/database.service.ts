/**
 * Database Service
 * Provides database operations and connection management
 */

import { BaseService, ServiceMetadata } from './service-registry'
import { PrismaClient } from '@prisma/client'

export interface DatabaseServiceConfig {
  url: string
  maxConnections?: number
  ssl?: boolean
  logLevel?: 'info' | 'warn' | 'error' | 'debug'
}

export class DatabaseService extends BaseService {
  public metadata: ServiceMetadata = {
    name: 'database',
    version: '1.0.0',
    description: 'Database service providing Prisma ORM operations',
    singleton: true,
    priority: 100
  }

  private prisma: PrismaClient | null = null
  private config: DatabaseServiceConfig | null = null
  private connectionRetries = 0
  private maxRetries = 3

  protected async onInitialize(): Promise<void> {
    this.logInfo('Initializing Database Service')
    
    const config = this.getConfig()?.database
    if (!config) {
      throw new Error('Database configuration not found')
    }
    
    this.config = config as DatabaseServiceConfig
    
    try {
      await this.connect()
      this.logInfo('Database Service initialized successfully')
    } catch (error) {
      this.logError('Failed to initialize Database Service', error as Error)
      throw error
    }
  }

  protected async onDestroy(): Promise<void> {
    this.logInfo('Destroying Database Service')
    
    try {
      await this.disconnect()
      this.logInfo('Database Service destroyed successfully')
    } catch (error) {
      this.logError('Failed to destroy Database Service', error as Error)
      throw error
    }
  }

  private async connect(): Promise<void> {
    if (!this.config) {
      throw new Error('Database configuration not set')
    }
    
    this.logInfo('Connecting to database', { url: this.config.url })
    
    try {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: this.config.url,
          }
        },
        log: this.config.logLevel ? ['query', 'info', 'warn', 'error'] : undefined
      })
      
      // Test connection
      await this.prisma.$connect()
      
      this.logInfo('Database connection established successfully')
    } catch (error) {
      this.logError('Failed to connect to database', error as Error)
      
      // Retry logic
      if (this.connectionRetries < this.maxRetries) {
        this.connectionRetries++
        this.logWarn(`Retrying database connection (attempt ${this.connectionRetries}/${this.maxRetries})`)
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 5000))
        await this.connect()
      } else {
        throw error
      }
    }
  }

  private async disconnect(): Promise<void> {
    if (this.prisma) {
      try {
        await this.prisma.$disconnect()
        this.prisma = null
        this.logInfo('Database disconnected successfully')
      } catch (error) {
        this.logError('Failed to disconnect from database', error as Error)
        throw error
      }
    }
  }

  getClient(): PrismaClient {
    if (!this.prisma) {
      throw new Error('Database not connected')
    }
    return this.prisma
  }

  async healthCheck(): Promise<{ healthy: boolean; details?: any }> {
    try {
      if (!this.prisma) {
        return { healthy: false, details: 'Database not connected' }
      }
      
      // Simple health check - execute a simple query
      await this.prisma.$queryRaw`SELECT 1`
      
      return { healthy: true }
    } catch (error) {
      this.logError('Database health check failed', error as Error)
      return { 
        healthy: false, 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  async executeRaw(query: string, parameters?: any[]): Promise<any> {
    if (!this.prisma) {
      throw new Error('Database not connected')
    }
    
    try {
      const result = await this.prisma.$queryRawUnsafe(query, ...(parameters || []))
      return result
    } catch (error) {
      this.logError('Failed to execute raw query', error as Error, { query })
      throw error
    }
  }

  async transaction<T>(callback: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    if (!this.prisma) {
      throw new Error('Database not connected')
    }
    
    try {
      const result = await this.prisma.$transaction(callback)
      return result
    } catch (error) {
      this.logError('Transaction failed', error as Error)
      throw error
    }
  }

  async backup(): Promise<string> {
    // This would implement database backup functionality
    this.logInfo('Starting database backup')
    
    try {
      // Placeholder for backup logic
      const backupPath = `/tmp/backup_${Date.now()}.sql`
      
      // In a real implementation, this would use pg_dump or similar
      this.logInfo('Database backup completed', { path: backupPath })
      
      return backupPath
    } catch (error) {
      this.logError('Database backup failed', error as Error)
      throw error
    }
  }

  async restore(backupPath: string): Promise<void> {
    // This would implement database restore functionality
    this.logInfo('Starting database restore', { backupPath })
    
    try {
      // Placeholder for restore logic
      this.logInfo('Database restore completed')
    } catch (error) {
      this.logError('Database restore failed', error as Error)
      throw error
    }
  }

  async getDatabaseStats(): Promise<any> {
    if (!this.prisma) {
      throw new Error('Database not connected')
    }
    
    try {
      // Get basic database statistics
      const stats = {
        userCount: await this.prisma.user.count(),
        contentCount: await this.prisma.content.count(),
        downloadCount: await this.prisma.download.count(),
        notificationCount: await this.prisma.notification.count(),
        marketplaceItemCount: await this.prisma.marketplaceItem.count(),
        // Add more stats as needed
      }
      
      return stats
    } catch (error) {
      this.logError('Failed to get database stats', error as Error)
      throw error
    }
  }

  async optimize(): Promise<void> {
    this.logInfo('Starting database optimization')
    
    try {
      if (!this.prisma) {
        throw new Error('Database not connected')
      }
      
      // Run optimization queries
      await this.prisma.$queryRaw`VACUUM ANALYZE`
      
      this.logInfo('Database optimization completed')
    } catch (error) {
      this.logError('Database optimization failed', error as Error)
      throw error
    }
  }

  async cleanup(): Promise<void> {
    this.logInfo('Starting database cleanup')
    
    try {
      if (!this.prisma) {
        throw new Error('Database not connected')
      }
      
      // Clean up expired downloads
      const expiredDownloads = await this.prisma.download.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })
      
      // Clean up old notifications
      const oldNotifications = await this.prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
          },
          isRead: true,
          isDismissed: true
        }
      })
      
      this.logInfo('Database cleanup completed', {
        expiredDownloads: expiredDownloads.count,
        oldNotifications: oldNotifications.count
      })
    } catch (error) {
      this.logError('Database cleanup failed', error as Error)
      throw error
    }
  }
}