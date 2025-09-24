/**
 * Service Initializer
 * Handles automatic registration and initialization of services
 */

import { getServiceRegistry, ServiceRegistry } from './core/service-registry'
import { DatabaseService } from './core/database.service'
import { AIService } from './core/ai.service'
import { config, getFeatureFlags } from '@/lib/config'

export class ServiceInitializer {
  private registry: ServiceRegistry
  private logger: any

  constructor() {
    this.logger = this.createLogger()
    this.registry = getServiceRegistry(config, this.logger)
  }

  private createLogger(): any {
    return {
      info: (message: string, data?: any) => console.log(`[ServiceInitializer] INFO: ${message}`, data || ''),
      warn: (message: string, data?: any) => console.warn(`[ServiceInitializer] WARN: ${message}`, data || ''),
      error: (message: string, error?: Error, data?: any) => console.error(`[ServiceInitializer] ERROR: ${message}`, error || '', data || ''),
      debug: (message: string, data?: any) => {
        if (process.env.DEBUG === 'true') {
          console.debug(`[ServiceInitializer] DEBUG: ${message}`, data || '')
        }
      }
    }
  }

  async initializeServices(): Promise<void> {
    this.logger.info('Starting service initialization')
    
    try {
      // Register core services
      await this.registerCoreServices()
      
      // Register feature-specific services
      await this.registerFeatureServices()
      
      // Initialize all services
      await this.registry.initializeAllServices()
      
      this.logger.info('All services initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize services', error as Error)
      throw error
    }
  }

  private async registerCoreServices(): Promise<void> {
    this.logger.info('Registering core services')
    
    try {
      // Database service (always required)
      const databaseService = new DatabaseService()
      await this.registry.registerService(databaseService)
      this.logger.info('Database service registered')
      
      // AI service (if enabled)
      if (getFeatureFlags().aiGeneration) {
        const aiService = new AIService()
        await this.registry.registerService(aiService)
        this.logger.info('AI service registered')
      }
      
    } catch (error) {
      this.logger.error('Failed to register core services', error as Error)
      throw error
    }
  }

  private async registerFeatureServices(): Promise<void> {
    this.logger.info('Registering feature-specific services')
    
    try {
      // Register additional services based on enabled features
      const features = getFeatureFlags()
      
      if (features.analytics) {
        // Analytics service would be registered here
        this.logger.debug('Analytics service would be registered here')
      }
      
      if (features.marketplace) {
        // Marketplace service would be registered here
        this.logger.debug('Marketplace service would be registered here')
      }
      
      if (features.notifications) {
        // Notifications service would be registered here
        this.logger.debug('Notifications service would be registered here')
      }
      
      if (features.contentModeration) {
        // Content moderation service would be registered here
        this.logger.debug('Content moderation service would be registered here')
      }
      
      if (features.compliance) {
        // Compliance service would be registered here
        this.logger.debug('Compliance service would be registered here')
      }
      
    } catch (error) {
      this.logger.error('Failed to register feature services', error as Error)
      throw error
    }
  }

  async shutdownServices(): Promise<void> {
    this.logger.info('Starting service shutdown')
    
    try {
      await this.registry.destroyAllServices()
      this.logger.info('All services shutdown successfully')
    } catch (error) {
      this.logger.error('Failed to shutdown services', error as Error)
      throw error
    }
  }

  getRegistry(): ServiceRegistry {
    return this.registry
  }

  getServiceStatus(): Record<string, any> {
    return this.registry.getServiceStatus()
  }

  async healthCheck(): Promise<{ healthy: boolean; services: Record<string, any> }> {
    const serviceStatus = this.registry.getServiceStatus()
    const services: Record<string, any> = {}
    let overallHealthy = true

    for (const [serviceName, status] of Object.entries(serviceStatus)) {
      try {
        if (status.initialized) {
          const service = this.registry.get<any>(serviceName)
          if (typeof service.healthCheck === 'function') {
            const health = await service.healthCheck()
            services[serviceName] = {
              ...status,
              health
            }
            if (!health.healthy) {
              overallHealthy = false
            }
          } else {
            services[serviceName] = {
              ...status,
              health: { healthy: true, details: 'No health check available' }
            }
          }
        } else {
          services[serviceName] = {
            ...status,
            health: { healthy: false, details: 'Service not initialized' }
          }
          overallHealthy = false
        }
      } catch (error) {
        services[serviceName] = {
          ...status,
          health: { healthy: false, details: error instanceof Error ? error.message : 'Unknown error' }
        }
        overallHealthy = false
      }
    }

    return {
      healthy: overallHealthy,
      services
    }
  }
}

// Global service initializer instance
let serviceInitializer: ServiceInitializer | null = null

export function getServiceInitializer(): ServiceInitializer {
  if (!serviceInitializer) {
    serviceInitializer = new ServiceInitializer()
  }
  return serviceInitializer
}

export async function initializeServices(): Promise<void> {
  const initializer = getServiceInitializer()
  await initializer.initializeServices()
}

export async function shutdownServices(): Promise<void> {
  const initializer = getServiceInitializer()
  if (initializer) {
    await initializer.shutdownServices()
    serviceInitializer = null
  }
}

export async function servicesHealthCheck(): Promise<{ healthy: boolean; services: Record<string, any> }> {
  const initializer = getServiceInitializer()
  return initializer.healthCheck()
}

// Convenience functions for getting services
export function getDatabaseService(): DatabaseService {
  const registry = getServiceRegistry()
  return registry.get<DatabaseService>('database')
}

export function getAIService(): AIService {
  const registry = getServiceRegistry()
  return registry.get<AIService>('ai')
}

export function getService<T>(serviceName: string): T {
  const registry = getServiceRegistry()
  return registry.get<T>(serviceName)
}