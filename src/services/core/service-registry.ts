/**
 * Service Registry
 * Centralized service management and dependency injection
 */

export interface ServiceMetadata {
  name: string
  version: string
  description: string
  dependencies?: string[]
  config?: any
  singleton?: boolean
  priority?: number
}

export interface ServiceContext {
  config: any
  logger: any
  services: ServiceRegistry
}

export abstract class BaseService {
  public abstract metadata: ServiceMetadata
  protected context: ServiceContext | null = null
  protected initialized = false

  async initialize(context: ServiceContext): Promise<void> {
    if (this.initialized) {
      return
    }
    
    this.context = context
    await this.onInitialize()
    this.initialized = true
  }

  async destroy(): Promise<void> {
    if (!this.initialized) {
      return
    }
    
    await this.onDestroy()
    this.context = null
    this.initialized = false
  }

  protected abstract onInitialize(): Promise<void>
  protected abstract onDestroy(): Promise<void>

  protected getService<T extends BaseService>(serviceName: string): T {
    if (!this.context) {
      throw new Error('Service not initialized')
    }
    return this.context.services.get<T>(serviceName)
  }

  protected getConfig(): any {
    return this.context?.config
  }

  protected getLogger(): any {
    return this.context?.logger
  }

  protected logInfo(message: string, data?: any): void {
    this.getLogger()?.info(`[${this.metadata.name}] ${message}`, data)
  }

  protected logWarn(message: string, data?: any): void {
    this.getLogger()?.warn(`[${this.metadata.name}] ${message}`, data)
  }

  protected logError(message: string, error?: Error, data?: any): void {
    this.getLogger()?.error(`[${this.metadata.name}] ${message}`, error, data)
  }

  protected logDebug(message: string, data?: any): void {
    this.getLogger()?.debug(`[${this.metadata.name}] ${message}`, data)
  }
}

export class ServiceRegistry {
  private services: Map<string, BaseService> = new Map()
  private serviceInstances: Map<string, BaseService> = new Map()
  private logger: any
  private config: any

  constructor(config: any, logger: any) {
    this.config = config
    this.logger = logger
  }

  async registerService(service: BaseService): Promise<void> {
    const { name, version, dependencies = [] } = service.metadata
    
    this.logInfo(`Registering service: ${name} v${version}`)
    
    // Check if service already exists
    if (this.services.has(name)) {
      throw new Error(`Service ${name} is already registered`)
    }
    
    // Check dependencies
    for (const dep of dependencies) {
      if (!this.services.has(dep)) {
        throw new Error(`Service ${name} requires dependency ${dep} which is not registered`)
      }
    }
    
    // Register service
    this.services.set(name, service)
    
    this.logInfo(`Service ${name} v${version} registered successfully`)
  }

  async initializeService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName)
    if (!service) {
      throw new Error(`Service ${serviceName} not found`)
    }
    
    if (this.serviceInstances.has(serviceName)) {
      return // Service already initialized
    }
    
    this.logInfo(`Initializing service: ${serviceName}`)
    
    try {
      const context: ServiceContext = {
        config: this.config,
        logger: this.logger,
        services: this
      }
      
      await service.initialize(context)
      
      if (service.metadata.singleton !== false) {
        this.serviceInstances.set(serviceName, service)
      }
      
      this.logInfo(`Service ${serviceName} initialized successfully`)
    } catch (error) {
      this.logError(`Failed to initialize service ${serviceName}`, error as Error)
      throw error
    }
  }

  async initializeAllServices(): Promise<void> {
    this.logInfo('Initializing all services')
    
    // Sort services by priority and dependencies
    const sortedServices = this.sortServicesByDependencies()
    
    for (const serviceName of sortedServices) {
      try {
        await this.initializeService(serviceName)
      } catch (error) {
        this.logError(`Failed to initialize service ${serviceName}`, error as Error)
        throw error
      }
    }
    
    this.logInfo('All services initialized successfully')
  }

  private sortServicesByDependencies(): string[] {
    const services = Array.from(this.services.keys())
    const sorted: string[] = []
    const visited = new Set<string>()
    const visiting = new Set<string>()

    const visit = (serviceName: string) => {
      if (visited.has(serviceName)) {
        return
      }
      
      if (visiting.has(serviceName)) {
        throw new Error(`Circular dependency detected involving service ${serviceName}`)
      }
      
      visiting.add(serviceName)
      
      const service = this.services.get(serviceName)
      if (service) {
        for (const dep of service.metadata.dependencies || []) {
          visit(dep)
        }
      }
      
      visiting.delete(serviceName)
      visited.add(serviceName)
      sorted.push(serviceName)
    }

    for (const serviceName of services) {
      visit(serviceName)
    }

    return sorted
  }

  get<T extends BaseService>(serviceName: string): T {
    const instance = this.serviceInstances.get(serviceName)
    if (!instance) {
      throw new Error(`Service ${serviceName} is not initialized`)
    }
    return instance as T
  }

  has(serviceName: string): boolean {
    return this.serviceInstances.has(serviceName)
  }

  getServiceNames(): string[] {
    return Array.from(this.services.keys())
  }

  getInitializedServiceNames(): string[] {
    return Array.from(this.serviceInstances.keys())
  }

  getServiceMetadata(serviceName: string): ServiceMetadata | undefined {
    const service = this.services.get(serviceName)
    return service?.metadata
  }

  getAllServiceMetadata(): ServiceMetadata[] {
    return Array.from(this.services.values()).map(service => service.metadata)
  }

  async destroyService(serviceName: string): Promise<void> {
    const service = this.serviceInstances.get(serviceName)
    if (!service) {
      return
    }
    
    this.logInfo(`Destroying service: ${serviceName}`)
    
    try {
      await service.destroy()
      this.serviceInstances.delete(serviceName)
      
      this.logInfo(`Service ${serviceName} destroyed successfully`)
    } catch (error) {
      this.logError(`Failed to destroy service ${serviceName}`, error as Error)
      throw error
    }
  }

  async destroyAllServices(): Promise<void> {
    this.logInfo('Destroying all services')
    
    // Destroy in reverse order of initialization
    const serviceNames = Array.from(this.serviceInstances.keys()).reverse()
    
    for (const serviceName of serviceNames) {
      try {
        await this.destroyService(serviceName)
      } catch (error) {
        this.logError(`Failed to destroy service ${serviceName}`, error as Error)
      }
    }
    
    this.logInfo('All services destroyed successfully')
  }

  async reloadService(serviceName: string): Promise<void> {
    this.logInfo(`Reloading service: ${serviceName}`)
    
    try {
      await this.destroyService(serviceName)
      await this.initializeService(serviceName)
      
      this.logInfo(`Service ${serviceName} reloaded successfully`)
    } catch (error) {
      this.logError(`Failed to reload service ${serviceName}`, error as Error)
      throw error
    }
  }

  validateService(service: BaseService): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    const { name, version, description } = service.metadata
    
    if (!name || typeof name !== 'string') {
      errors.push('Service name is required and must be a string')
    }
    
    if (!version || typeof version !== 'string') {
      errors.push('Service version is required and must be a string')
    }
    
    if (!description || typeof description !== 'string') {
      errors.push('Service description is required and must be a string')
    }
    
    if (typeof service.onInitialize !== 'function') {
      errors.push('Service must have an onInitialize method')
    }
    
    if (typeof service.onDestroy !== 'function') {
      errors.push('Service must have an onDestroy method')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  getServiceStatus(): Record<string, { registered: boolean; initialized: boolean; name: string; version: string }> {
    const status: Record<string, any> = {}
    
    for (const serviceName of this.services.keys()) {
      const service = this.services.get(serviceName)!
      status[serviceName] = {
        registered: true,
        initialized: this.serviceInstances.has(serviceName),
        name: service.metadata.name,
        version: service.metadata.version
      }
    }
    
    return status
  }

  private logInfo(message: string, data?: any): void {
    this.logger?.info(`[ServiceRegistry] ${message}`, data)
  }

  private logWarn(message: string, data?: any): void {
    this.logger?.warn(`[ServiceRegistry] ${message}`, data)
  }

  private logError(message: string, error?: Error, data?: any): void {
    this.logger?.error(`[ServiceRegistry] ${message}`, error, data)
  }

  private logDebug(message: string, data?: any): void {
    this.logger?.debug(`[ServiceRegistry] ${message}`, data)
  }
}

// Global service registry instance
let serviceRegistry: ServiceRegistry | null = null

export function getServiceRegistry(config?: any, logger?: any): ServiceRegistry {
  if (!serviceRegistry) {
    if (!config || !logger) {
      throw new Error('Service registry requires config and logger for first initialization')
    }
    serviceRegistry = new ServiceRegistry(config, logger)
  }
  return serviceRegistry
}

export function resetServiceRegistry(): void {
  serviceRegistry = null
}