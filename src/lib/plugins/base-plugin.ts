/**
 * Base Plugin Class
 * Provides a foundation for creating plugins with common functionality
 */

import { Plugin, PluginMetadata, PluginContext, PluginRoute, PluginComponent, PluginSetting } from './plugin-manager'

export abstract class BasePlugin implements Plugin {
  public abstract metadata: PluginMetadata
  protected context: PluginContext | null = null

  async initialize(context: PluginContext): Promise<void> {
    this.context = context
    await this.onInitialize()
  }

  async destroy(): Promise<void> {
    await this.onDestroy()
    this.context = null
  }

  getHooks(): Record<string, (...args: any[]) => any> {
    return this.registerHooks()
  }

  getRoutes(): PluginRoute[] {
    return this.registerRoutes()
  }

  getComponents(): PluginComponent[] {
    return this.registerComponents()
  }

  getSettings(): PluginSetting[] {
    return this.registerSettings()
  }

  // Abstract methods that subclasses should implement
  protected abstract onInitialize(): Promise<void>
  protected abstract onDestroy(): Promise<void>
  protected registerHooks(): Record<string, (...args: any[]) => any> {
    return {}
  }
  protected registerRoutes(): PluginRoute[] {
    return []
  }
  protected registerComponents(): PluginComponent[] {
    return []
  }
  protected registerSettings(): PluginSetting[] {
    return []
  }

  // Utility methods for plugins
  protected getLogger() {
    return this.context?.logger
  }

  protected getServices() {
    return this.context?.services
  }

  protected getConfig() {
    return this.context?.config
  }

  protected getHooks() {
    return this.context?.hooks
  }

  protected async executeHook(hookName: string, data?: any): Promise<any> {
    return this.context?.hooks.execute(hookName, data)
  }

  protected executeHookSync(hookName: string, data?: any): any {
    return this.context?.hooks.executeSync(hookName, data)
  }

  protected registerHook(hookName: string, callback: (...args: any[]) => any): void {
    this.context?.hooks.register(hookName, callback)
  }

  protected unregisterHook(hookName: string, callback: (...args: any[]) => any): void {
    this.context?.hooks.unregister(hookName, callback)
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

  // Common validation methods
  protected validateSettingValue(setting: PluginSetting, value: any): { isValid: boolean; error?: string } {
    // Check required
    if (setting.required && (value === undefined || value === null || value === '')) {
      return { isValid: false, error: `${setting.label} is required` }
    }

    // Type validation
    switch (setting.type) {
      case 'boolean':
        if (typeof value !== 'boolean') {
          return { isValid: false, error: `${setting.label} must be a boolean` }
        }
        break
      case 'string':
        if (typeof value !== 'string') {
          return { isValid: false, error: `${setting.label} must be a string` }
        }
        break
      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return { isValid: false, error: `${setting.label} must be a number` }
        }
        break
      case 'textarea':
        if (typeof value !== 'string') {
          return { isValid: false, error: `${setting.label} must be text` }
        }
        break
      case 'select':
        if (setting.options && !setting.options.some(opt => opt.value === value)) {
          return { isValid: false, error: `${setting.label} must be one of the allowed values` }
        }
        break
    }

    // Custom validation
    if (setting.validation) {
      const validationResult = setting.validation(value)
      if (typeof validationResult === 'string') {
        return { isValid: false, error: validationResult }
      } else if (!validationResult) {
        return { isValid: false, error: `${setting.label} is invalid` }
      }
    }

    return { isValid: true }
  }

  // Common utility methods
  protected formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  protected generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  protected debounce(func: (...args: any[]) => any, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  protected throttle(func: (...args: any[]) => any, limit: number): (...args: any[]) => void {
    let inThrottle: boolean
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}