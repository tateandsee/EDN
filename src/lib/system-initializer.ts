/**
 * System Initializer
 * Coordinates the initialization of all system components
 */

import { initializeServices, shutdownServices, servicesHealthCheck } from '@/services/service-initializer'
import { initializePlugins, shutdownPlugins, executePluginHook } from '@/lib/plugins/plugin-loader'
import { initializeMigrations, executePendingMigrations, getMigrationStatus } from '@/lib/migrations/migration-manager'
import { config, getPlatformConfig, isDevelopment } from '@/lib/config'

export interface SystemStatus {
  healthy: boolean
  components: {
    services: { healthy: boolean; details: any }
    plugins: { healthy: boolean; loaded: number; total: number }
    migrations: { healthy: boolean; status: any }
  }
  uptime: number
  version: string
  environment: string
}

export class SystemInitializer {
  private initialized = false
  private startTime = Date.now()
  private logger: any

  constructor() {
    this.logger = this.createLogger()
  }

  private createLogger(): any {
    return {
      info: (message: string, data?: any) => console.log(`[SystemInitializer] INFO: ${message}`, data || ''),
      warn: (message: string, data?: any) => console.warn(`[SystemInitializer] WARN: ${message}`, data || ''),
      error: (message: string, error?: Error, data?: any) => console.error(`[SystemInitializer] ERROR: ${message}`, error || '', data || ''),
      debug: (message: string, data?: any) => {
        if (process.env.DEBUG === 'true') {
          console.debug(`[SystemInitializer] DEBUG: ${message}`, data || '')
        }
      }
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      this.logger.warn('System already initialized')
      return
    }

    this.logger.info('Starting system initialization')
    
    try {
      // Step 1: Validate configuration
      await this.validateConfiguration()
      
      // Step 2: Initialize migrations
      await this.initializeMigrations()
      
      // Step 3: Initialize services
      await this.initializeServices()
      
      // Step 4: Initialize plugins
      await this.initializePlugins()
      
      // Step 5: Execute startup hooks
      await this.executeStartupHooks()
      
      this.initialized = true
      this.logger.info('System initialization completed successfully')
      
    } catch (error) {
      this.logger.error('System initialization failed', error as Error)
      await this.emergencyShutdown()
      throw error
    }
  }

  private async validateConfiguration(): Promise<void> {
    this.logger.info('Validating system configuration')
    
    try {
      const validation = config.validateConfig()
      
      if (!validation.isValid) {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`)
      }
      
      this.logger.info('Configuration validation passed')
      
    } catch (error) {
      this.logger.error('Configuration validation failed', error as Error)
      throw error
    }
  }

  private async initializeMigrations(): Promise<void> {
    this.logger.info('Initializing migrations')
    
    try {
      await initializeMigrations()
      
      // Execute pending migrations if not in dry run mode
      if (!isDevelopment() || process.env.EXECUTE_MIGRATIONS === 'true') {
        const results = await executePendingMigrations()
        
        const failed = results.filter(r => !r.success)
        if (failed.length > 0) {
          throw new Error(`${failed.length} migrations failed to execute`)
        }
        
        this.logger.info(`Successfully executed ${results.length} migrations`)
      } else {
        this.logger.info('Skipping migrations in development mode')
      }
      
    } catch (error) {
      this.logger.error('Migration initialization failed', error as Error)
      throw error
    }
  }

  private async initializeServices(): Promise<void> {
    this.logger.info('Initializing services')
    
    try {
      await initializeServices()
      this.logger.info('Services initialized successfully')
      
    } catch (error) {
      this.logger.error('Service initialization failed', error as Error)
      throw error
    }
  }

  private async initializePlugins(): Promise<void> {
    this.logger.info('Initializing plugins')
    
    try {
      await initializePlugins()
      this.logger.info('Plugins initialized successfully')
      
    } catch (error) {
      this.logger.error('Plugin initialization failed', error as Error)
      throw error
    }
  }

  private async executeStartupHooks(): Promise<void> {
    this.logger.info('Executing startup hooks')
    
    try {
      // Execute system startup hooks
      await executePluginHook('system:startup', {
        timestamp: new Date().toISOString(),
        version: getPlatformConfig().version,
        environment: getPlatformConfig().env
      })
      
      this.logger.info('Startup hooks executed successfully')
      
    } catch (error) {
      this.logger.error('Startup hooks execution failed', error as Error)
      // Don't throw error for hook failures, just log them
    }
  }

  async shutdown(): Promise<void> {
    this.logger.info('Starting system shutdown')
    
    try {
      // Execute shutdown hooks
      await this.executeShutdownHooks()
      
      // Shutdown plugins
      await shutdownPlugins()
      
      // Shutdown services
      await shutdownServices()
      
      this.initialized = false
      this.logger.info('System shutdown completed successfully')
      
    } catch (error) {
      this.logger.error('System shutdown failed', error as Error)
      throw error
    }
  }

  private async executeShutdownHooks(): Promise<void> {
    this.logger.info('Executing shutdown hooks')
    
    try {
      await executePluginHook('system:shutdown', {
        timestamp: new Date().toISOString(),
        uptime: Date.now() - this.startTime
      })
      
      this.logger.info('Shutdown hooks executed successfully')
      
    } catch (error) {
      this.logger.error('Shutdown hooks execution failed', error as Error)
      // Don't throw error for hook failures, just log them
    }
  }

  private async emergencyShutdown(): Promise<void> {
    this.logger.error('Starting emergency shutdown')
    
    try {
      // Try to shutdown gracefully, but don't throw if it fails
      await Promise.allSettled([
        shutdownPlugins(),
        shutdownServices()
      ])
      
      this.logger.info('Emergency shutdown completed')
      
    } catch (error) {
      this.logger.error('Emergency shutdown failed', error as Error)
      // Last resort, can't do much here
    }
  }

  async getStatus(): Promise<SystemStatus> {
    try {
      const [servicesHealth, migrationStatus] = await Promise.all([
        servicesHealthCheck(),
        getMigrationStatus()
      ])
      
      const pluginStatus = this.getPluginStatus()
      
      return {
        healthy: servicesHealth.healthy && pluginStatus.healthy && migrationStatus.healthy,
        components: {
          services: {
            healthy: servicesHealth.healthy,
            details: servicesHealth.services
          },
          plugins: pluginStatus,
          migrations: {
            healthy: migrationStatus.healthy,
            status: migrationStatus
          }
        },
        uptime: Date.now() - this.startTime,
        version: getPlatformConfig().version,
        environment: getPlatformConfig().env
      }
      
    } catch (error) {
      this.logger.error('Failed to get system status', error as Error)
      return {
        healthy: false,
        components: {
          services: { healthy: false, details: 'Status check failed' },
          plugins: { healthy: false, loaded: 0, total: 0 },
          migrations: { healthy: false, status: 'Status check failed' }
        },
        uptime: Date.now() - this.startTime,
        version: getPlatformConfig().version,
        environment: getPlatformConfig().env
      }
    }
  }

  private getPluginStatus(): { healthy: boolean; loaded: number; total: number } {
    // This would get actual plugin status from the plugin loader
    // For now, return a placeholder
    return {
      healthy: true,
      loaded: 1, // Would be actual count
      total: 1   // Would be actual count
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; details: SystemStatus }> {
    const status = await this.getStatus()
    
    return {
      healthy: status.healthy,
      details: status
    }
  }

  isInitialized(): boolean {
    return this.initialized
  }

  getUptime(): number {
    return Date.now() - this.startTime
  }
}

// Global system initializer instance
let systemInitializer: SystemInitializer | null = null

export function getSystemInitializer(): SystemInitializer {
  if (!systemInitializer) {
    systemInitializer = new SystemInitializer()
  }
  return systemInitializer
}

export async function initializeSystem(): Promise<void> {
  const initializer = getSystemInitializer()
  await initializer.initialize()
}

export async function shutdownSystem(): Promise<void> {
  const initializer = getSystemInitializer()
  if (initializer) {
    await initializer.shutdown()
    systemInitializer = null
  }
}

export async function systemHealthCheck(): Promise<{ healthy: boolean; details: SystemStatus }> {
  const initializer = getSystemInitializer()
  return initializer.healthCheck()
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const initializer = getSystemInitializer()
  return initializer.getStatus()
}

export function isSystemInitialized(): boolean {
  const initializer = getSystemInitializer()
  return initializer ? initializer.isInitialized() : false
}

export function getSystemUptime(): number {
  const initializer = getSystemInitializer()
  return initializer ? initializer.getUptime() : 0
}