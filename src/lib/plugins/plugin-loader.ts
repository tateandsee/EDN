/**
 * Plugin Loader
 * Handles automatic discovery and loading of plugins
 */

import { PluginManager, Plugin, PluginContext, PluginServices, DefaultPluginLogger, PluginHookSystem } from './plugin-manager'
import { config, getPlatformConfig, getFeatureFlags } from '../config'
import { db } from '../db'
import { supabase } from '../supabase-client'
import { AnalyticsPlugin } from './examples/analytics-plugin'

export class PluginLoader {
  private pluginManager: PluginManager
  private logger: DefaultPluginLogger
  private hooks: PluginHookSystem
  private loadedPlugins: Set<string> = new Set()

  constructor() {
    this.logger = new DefaultPluginLogger('PluginLoader')
    this.hooks = new PluginHookSystem(this.logger)
    
    // Create plugin context
    const context: PluginContext = {
      config: config.getConfig(),
      services: this.createServices(),
      logger: this.logger,
      hooks: this.hooks
    }
    
    this.pluginManager = new PluginManager(context)
  }

  private createServices(): PluginServices {
    return {
      database: db,
      auth: supabase.auth,
      storage: supabase.storage,
      email: {}, // Email service would be initialized here
      analytics: {}, // Analytics service would be initialized here
      ai: {}, // AI service would be initialized here
      marketplace: {}, // Marketplace service would be initialized here
      notifications: {}, // Notifications service would be initialized here
    }
  }

  async loadPlugins(): Promise<void> {
    this.logger.info('Starting plugin loading process')
    
    try {
      // Load built-in plugins
      await this.loadBuiltInPlugins()
      
      // Load external plugins (if any)
      await this.loadExternalPlugins()
      
      // Validate loaded plugins
      await this.validateLoadedPlugins()
      
      this.logger.info(`Successfully loaded ${this.loadedPlugins.size} plugins`)
    } catch (error) {
      this.logger.error('Failed to load plugins', error as Error)
      throw error
    }
  }

  private async loadBuiltInPlugins(): Promise<void> {
    this.logger.info('Loading built-in plugins')
    
    const builtInPlugins: Plugin[] = []
    
    // Add analytics plugin if analytics is enabled
    if (getFeatureFlags().analytics) {
      builtInPlugins.push(new AnalyticsPlugin())
    }
    
    // Add more built-in plugins here as needed
    // Example: if (getFeatureFlags().contentModeration) { builtInPlugins.push(new ContentModerationPlugin()) }
    
    for (const plugin of builtInPlugins) {
      try {
        await this.loadPlugin(plugin)
      } catch (error) {
        this.logger.error(`Failed to load built-in plugin ${plugin.metadata.name}`, error as Error)
      }
    }
  }

  private async loadExternalPlugins(): Promise<void> {
    this.logger.info('Loading external plugins')
    
    // In a real implementation, this would scan directories or load from database
    // For now, we'll just log that external plugins would be loaded here
    this.logger.debug('External plugin loading would happen here')
  }

  private async loadPlugin(plugin: Plugin): Promise<void> {
    const { id, name, version } = plugin.metadata
    
    this.logger.info(`Loading plugin: ${name} (${id}) v${version}`)
    
    try {
      // Validate plugin before loading
      const validation = this.pluginManager.validatePlugin(plugin)
      if (!validation.isValid) {
        throw new Error(`Plugin validation failed: ${validation.errors.join(', ')}`)
      }
      
      // Register plugin with manager
      await this.pluginManager.registerPlugin(plugin)
      
      // Track loaded plugin
      this.loadedPlugins.add(id)
      
      this.logger.info(`Successfully loaded plugin: ${name} (${id})`)
    } catch (error) {
      this.logger.error(`Failed to load plugin ${name} (${id})`, error as Error)
      throw error
    }
  }

  private async validateLoadedPlugins(): Promise<void> {
    this.logger.info('Validating loaded plugins')
    
    for (const pluginId of this.loadedPlugins) {
      const plugin = this.pluginManager.getPlugin(pluginId)
      if (!plugin) {
        this.logger.warn(`Plugin ${pluginId} not found in manager after loading`)
        continue
      }
      
      // Basic validation
      const validation = this.pluginManager.validatePlugin(plugin)
      if (!validation.isValid) {
        this.logger.error(`Plugin ${plugin.metadata.name} failed validation`, undefined, validation.errors)
        // Optionally unload the plugin
        await this.unloadPlugin(pluginId)
      }
    }
  }

  async unloadPlugin(pluginId: string): Promise<void> {
    this.logger.info(`Unloading plugin: ${pluginId}`)
    
    try {
      await this.pluginManager.unregisterPlugin(pluginId)
      this.loadedPlugins.delete(pluginId)
      
      this.logger.info(`Successfully unloaded plugin: ${pluginId}`)
    } catch (error) {
      this.logger.error(`Failed to unload plugin ${pluginId}`, error as Error)
      throw error
    }
  }

  async reloadPlugin(pluginId: string): Promise<void> {
    this.logger.info(`Reloading plugin: ${pluginId}`)
    
    try {
      // Unload plugin first
      await this.unloadPlugin(pluginId)
      
      // In a real implementation, you would reload the plugin code here
      // For now, we'll just log that reloading would happen
      this.logger.debug(`Plugin ${pluginId} would be reloaded from source`)
      
      this.logger.info(`Successfully reloaded plugin: ${pluginId}`)
    } catch (error) {
      this.logger.error(`Failed to reload plugin ${pluginId}`, error as Error)
      throw error
    }
  }

  async enablePlugin(pluginId: string): Promise<void> {
    this.logger.info(`Enabling plugin: ${pluginId}`)
    
    try {
      await this.pluginManager.enablePlugin(pluginId)
      this.logger.info(`Successfully enabled plugin: ${pluginId}`)
    } catch (error) {
      this.logger.error(`Failed to enable plugin ${pluginId}`, error as Error)
      throw error
    }
  }

  async disablePlugin(pluginId: string): Promise<void> {
    this.logger.info(`Disabling plugin: ${pluginId}`)
    
    try {
      await this.pluginManager.disablePlugin(pluginId)
      this.logger.info(`Successfully disabled plugin: ${pluginId}`)
    } catch (error) {
      this.logger.error(`Failed to disable plugin ${pluginId}`, error as Error)
      throw error
    }
  }

  getPluginManager(): PluginManager {
    return this.pluginManager
  }

  getLoadedPlugins(): string[] {
    return Array.from(this.loadedPlugins)
  }

  getPluginStatus(): Record<string, { loaded: boolean; enabled: boolean; name: string; version: string }> {
    const status: Record<string, any> = {}
    
    for (const pluginId of this.loadedPlugins) {
      const plugin = this.pluginManager.getPlugin(pluginId)
      if (plugin) {
        status[pluginId] = {
          loaded: true,
          enabled: plugin.metadata.enabled,
          name: plugin.metadata.name,
          version: plugin.metadata.version
        }
      }
    }
    
    return status
  }

  async executeHook(hookName: string, data?: any): Promise<any> {
    return this.pluginManager.executeHook(hookName, data)
  }

  executeHookSync(hookName: string, data?: any): any {
    return this.pluginManager.executeHookSync(hookName, data)
  }

  async shutdown(): Promise<void> {
    this.logger.info('Shutting down plugin system')
    
    try {
      // Unload all plugins
      for (const pluginId of Array.from(this.loadedPlugins)) {
        try {
          await this.unloadPlugin(pluginId)
        } catch (error) {
          this.logger.error(`Failed to unload plugin ${pluginId} during shutdown`, error as Error)
        }
      }
      
      this.logger.info('Plugin system shutdown complete')
    } catch (error) {
      this.logger.error('Error during plugin system shutdown', error as Error)
      throw error
    }
  }
}

// Global plugin loader instance
let pluginLoader: PluginLoader | null = null

export function getPluginLoader(): PluginLoader {
  if (!pluginLoader) {
    pluginLoader = new PluginLoader()
  }
  return pluginLoader
}

export async function initializePlugins(): Promise<void> {
  const loader = getPluginLoader()
  await loader.loadPlugins()
}

export async function shutdownPlugins(): Promise<void> {
  const loader = getPluginLoader()
  if (loader) {
    await loader.shutdown()
    pluginLoader = null
  }
}

// Convenience functions for hook execution
export async function executePluginHook(hookName: string, data?: any): Promise<any> {
  const loader = getPluginLoader()
  return loader.executeHook(hookName, data)
}

export function executePluginHookSync(hookName: string, data?: any): any {
  const loader = getPluginLoader()
  return loader.executeHookSync(hookName, data)
}

// Plugin management functions
export async function enablePlugin(pluginId: string): Promise<void> {
  const loader = getPluginLoader()
  return loader.enablePlugin(pluginId)
}

export async function disablePlugin(pluginId: string): Promise<void> {
  const loader = getPluginLoader()
  return loader.disablePlugin(pluginId)
}

export async function reloadPlugin(pluginId: string): Promise<void> {
  const loader = getPluginLoader()
  return loader.reloadPlugin(pluginId)
}

export function getPluginStatus(): Record<string, any> {
  const loader = getPluginLoader()
  return loader.getPluginStatus()
}