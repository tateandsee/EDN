/**
 * Plugin Manager - Modular Plugin Architecture
 * Enables easy extension of platform functionality through plugins
 */

import { isFeatureEnabled } from '../config'

export interface PluginMetadata {
  id: string
  name: string
  version: string
  description: string
  author: string
  dependencies?: string[]
  permissions?: PluginPermission[]
  category: PluginCategory
  enabled: boolean
  priority: number
}

export type PluginCategory = 
  | 'ai-generation'
  | 'content-moderation'
  | 'analytics'
  | 'marketplace'
  | 'notifications'
  | 'compliance'
  | 'integration'
  | 'ui-enhancement'
  | 'security'
  | 'utility'

export type PluginPermission = 
  | 'read:users'
  | 'write:users'
  | 'read:content'
  | 'write:content'
  | 'read:analytics'
  | 'write:analytics'
  | 'read:marketplace'
  | 'write:marketplace'
  | 'admin:settings'
  | 'system:hooks'

export interface PluginContext {
  config: any
  services: PluginServices
  logger: PluginLogger
  hooks: IPluginHookSystem
}

export interface PluginServices {
  database: any
  auth: any
  storage: any
  email: any
  analytics: any
  ai: any
  marketplace: any
  notifications: any
}

export interface PluginLogger {
  info(message: string, data?: any): void
  warn(message: string, data?: any): void
  error(message: string, error?: Error, data?: any): void
  debug(message: string, data?: any): void
}

export interface IPluginHookSystem {
  register(hookName: string, callback: (...args: any[]) => any): void
  unregister(hookName: string, callback: (...args: any[]) => any): void
  execute(hookName: string, data?: any): Promise<any>
  executeSync(hookName: string, data?: any): any
}

export interface Plugin {
  metadata: PluginMetadata
  initialize(context: PluginContext): Promise<void>
  destroy(): Promise<void>
  getHooks(): Record<string, (...args: any[]) => any>
  getRoutes(): PluginRoute[]
  getComponents(): PluginComponent[]
  getSettings(): PluginSetting[]
}

export interface PluginRoute {
  path: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  handler: (...args: any[]) => any
  middleware?: ((...args: any[]) => any)[]
  permissions?: PluginPermission[]
}

export interface PluginComponent {
  name: string
  component: React.ComponentType<any>
  props?: Record<string, any>
  location: 'sidebar' | 'header' | 'content' | 'modal' | 'settings'
}

export interface PluginSetting {
  key: string
  label: string
  description: string
  type: 'boolean' | 'string' | 'number' | 'select' | 'textarea'
  default: any
  options?: { label: string; value: any }[]
  required?: boolean
  validation?: (value: any) => boolean | string
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map()
  private hooks: Map<string, ((...args: any[]) => any)[]> = new Map()
  private context: PluginContext
  private logger: PluginLogger

  constructor(context: PluginContext) {
    this.context = context
    this.logger = context.logger
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    const { id, name, version, dependencies, enabled } = plugin.metadata

    // Check if plugin already exists
    if (this.plugins.has(id)) {
      throw new Error(`Plugin ${name} (${id}) is already registered`)
    }

    // Check dependencies
    if (dependencies) {
      for (const dep of dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin ${name} requires dependency ${dep} which is not installed`)
        }
      }
    }

    // Check feature flag
    const featureMap: Record<PluginCategory, string> = {
      'ai-generation': 'aiGeneration',
      'content-moderation': 'contentModeration',
      'analytics': 'analytics',
      'marketplace': 'marketplace',
      'notifications': 'notifications',
      'compliance': 'compliance',
      'integration': 'aiGeneration', // Default to AI generation for integrations
      'ui-enhancement': 'aiGeneration', // Default to AI generation for UI enhancements
      'security': 'aiGeneration', // Default to AI generation for security
      'utility': 'aiGeneration', // Default to AI generation for utilities
    }

    const requiredFeature = featureMap[plugin.metadata.category]
    if (!isFeatureEnabled(requiredFeature as any)) {
      this.logger.warn(`Plugin ${name} requires feature ${requiredFeature} which is disabled`)
      return
    }

    // Initialize plugin
    try {
      await plugin.initialize(this.context)
      this.plugins.set(id, plugin)
      
      // Register hooks
      const hooks = plugin.getHooks()
      for (const [hookName, callback] of Object.entries(hooks)) {
        this.registerHook(hookName, callback)
      }

      this.logger.info(`Plugin ${name} (${id}) v${version} registered successfully`)
    } catch (error) {
      this.logger.error(`Failed to initialize plugin ${name}`, error as Error)
      throw error
    }
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    try {
      // Unregister hooks
      const hooks = plugin.getHooks()
      for (const [hookName, callback] of Object.entries(hooks)) {
        this.unregisterHook(hookName, callback)
      }

      // Destroy plugin
      await plugin.destroy()
      this.plugins.delete(pluginId)

      this.logger.info(`Plugin ${plugin.metadata.name} (${pluginId}) unregistered successfully`)
    } catch (error) {
      this.logger.error(`Failed to unregister plugin ${pluginId}`, error as Error)
      throw error
    }
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId)
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values())
  }

  getPluginsByCategory(category: PluginCategory): Plugin[] {
    return this.getAllPlugins().filter(plugin => plugin.metadata.category === category)
  }

  getEnabledPlugins(): Plugin[] {
    return this.getAllPlugins().filter(plugin => plugin.metadata.enabled)
  }

  async enablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    plugin.metadata.enabled = true
    this.logger.info(`Plugin ${plugin.metadata.name} (${pluginId}) enabled`)
  }

  async disablePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    plugin.metadata.enabled = false
    this.logger.info(`Plugin ${plugin.metadata.name} (${pluginId}) disabled`)
  }

  registerHook(hookName: string, callback: (...args: any[]) => any): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, [])
    }
    this.hooks.get(hookName)!.push(callback)
  }

  unregisterHook(hookName: string, callback: (...args: any[]) => any): void {
    const callbacks = this.hooks.get(hookName)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  async executeHook(hookName: string, data?: any): Promise<any> {
    const callbacks = this.hooks.get(hookName) || []
    let result = data

    for (const callback of callbacks) {
      try {
        result = await callback(result)
      } catch (error) {
        this.logger.error(`Error executing hook ${hookName}`, error as Error)
      }
    }

    return result
  }

  executeHookSync(hookName: string, data?: any): any {
    const callbacks = this.hooks.get(hookName) || []
    let result = data

    for (const callback of callbacks) {
      try {
        result = callback(result)
      } catch (error) {
        this.logger.error(`Error executing hook ${hookName}`, error as Error)
      }
    }

    return result
  }

  getPluginRoutes(): PluginRoute[] {
    const routes: PluginRoute[] = []
    
    for (const plugin of this.getEnabledPlugins()) {
      routes.push(...plugin.getRoutes())
    }

    return routes
  }

  getPluginComponents(): PluginComponent[] {
    const components: PluginComponent[] = []
    
    for (const plugin of this.getEnabledPlugins()) {
      components.push(...plugin.getComponents())
    }

    return components
  }

  getPluginSettings(): PluginSetting[] {
    const settings: PluginSetting[] = []
    
    for (const plugin of this.getEnabledPlugins()) {
      settings.push(...plugin.getSettings())
    }

    return settings
  }

  async executePluginMethod(pluginId: string, methodName: string, ...args: any[]): Promise<any> {
    const plugin = this.plugins.get(pluginId)
    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    if (typeof (plugin as any)[methodName] !== 'function') {
      throw new Error(`Method ${methodName} not found in plugin ${pluginId}`)
    }

    return (plugin as any)[methodName](...args)
  }

  getPluginInfo(): PluginMetadata[] {
    return this.getAllPlugins().map(plugin => plugin.metadata)
  }

  validatePlugin(plugin: Plugin): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate metadata
    const { id, name, version, author, category } = plugin.metadata
    
    if (!id || typeof id !== 'string') {
      errors.push('Plugin ID is required and must be a string')
    }
    
    if (!name || typeof name !== 'string') {
      errors.push('Plugin name is required and must be a string')
    }
    
    if (!version || typeof version !== 'string') {
      errors.push('Plugin version is required and must be a string')
    }
    
    if (!author || typeof author !== 'string') {
      errors.push('Plugin author is required and must be a string')
    }
    
    if (!category || !['ai-generation', 'content-moderation', 'analytics', 'marketplace', 'notifications', 'compliance', 'integration', 'ui-enhancement', 'security', 'utility'].includes(category)) {
      errors.push('Plugin category is required and must be valid')
    }

    // Validate required methods
    if (typeof plugin.initialize !== 'function') {
      errors.push('Plugin must have an initialize method')
    }
    
    if (typeof plugin.destroy !== 'function') {
      errors.push('Plugin must have a destroy method')
    }
    
    if (typeof plugin.getHooks !== 'function') {
      errors.push('Plugin must have a getHooks method')
    }
    
    if (typeof plugin.getRoutes !== 'function') {
      errors.push('Plugin must have a getRoutes method')
    }
    
    if (typeof plugin.getComponents !== 'function') {
      errors.push('Plugin must have a getComponents method')
    }
    
    if (typeof plugin.getSettings !== 'function') {
      errors.push('Plugin must have a getSettings method')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Default logger implementation
export class DefaultPluginLogger implements PluginLogger {
  private prefix: string

  constructor(prefix: string = 'Plugin') {
    this.prefix = prefix
  }

  info(message: string, data?: any): void {
    console.log(`[${this.prefix}] INFO: ${message}`, data || '')
  }

  warn(message: string, data?: any): void {
    console.warn(`[${this.prefix}] WARN: ${message}`, data || '')
  }

  error(message: string, error?: Error, data?: any): void {
    console.error(`[${this.prefix}] ERROR: ${message}`, error || '', data || '')
  }

  debug(message: string, data?: any): void {
    if (process.env.DEBUG === 'true') {
      console.debug(`[${this.prefix}] DEBUG: ${message}`, data || '')
    }
  }
}

// Hook system implementation
export class PluginHookSystem implements IPluginHookSystem {
  private hooks: Map<string, ((...args: any[]) => any)[]> = new Map()
  private logger: PluginLogger

  constructor(logger: PluginLogger) {
    this.logger = logger
  }

  register(hookName: string, callback: (...args: any[]) => any): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, [])
    }
    this.hooks.get(hookName)!.push(callback)
    this.logger.debug(`Hook registered: ${hookName}`)
  }

  unregister(hookName: string, callback: (...args: any[]) => any): void {
    const callbacks = this.hooks.get(hookName)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
        this.logger.debug(`Hook unregistered: ${hookName}`)
      }
    }
  }

  async execute(hookName: string, data?: any): Promise<any> {
    const callbacks = this.hooks.get(hookName) || []
    let result = data

    for (const callback of callbacks) {
      try {
        result = await callback(result)
      } catch (error) {
        this.logger.error(`Error executing hook ${hookName}`, error as Error)
      }
    }

    return result
  }

  executeSync(hookName: string, data?: any): any {
    const callbacks = this.hooks.get(hookName) || []
    let result = data

    for (const callback of callbacks) {
      try {
        result = callback(result)
      } catch (error) {
        this.logger.error(`Error executing hook ${hookName}`, error as Error)
      }
    }

    return result
  }

  getRegisteredHooks(): string[] {
    return Array.from(this.hooks.keys())
  }

  getHookCallbacks(hookName: string): ((...args: any[]) => any)[] {
    return this.hooks.get(hookName) || []
  }
}