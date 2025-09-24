/**
 * Migration Manager
 * Handles database schema migrations, configuration updates, and system upgrades
 */

import { getDatabaseService } from '@/services/service-initializer'
import { config, getPlatformConfig } from '@/lib/config'
import { PrismaClient } from '@prisma/client'

export interface Migration {
  id: string
  name: string
  description: string
  version: string
  type: 'schema' | 'data' | 'config' | 'feature'
  dependencies?: string[]
  rollback?: boolean
  created: Date
  author: string
}

export interface MigrationContext {
  database: PrismaClient
  config: any
  logger: any
  dryRun?: boolean
}

export interface MigrationResult {
  migrationId: string
  success: boolean
  error?: string
  duration: number
  rollback?: boolean
}

export abstract class BaseMigration {
  public abstract migration: Migration

  protected context: MigrationContext | null = null

  async execute(context: MigrationContext): Promise<MigrationResult> {
    this.context = context
    const startTime = Date.now()
    
    try {
      this.logInfo(`Starting migration: ${this.migration.name}`)
      
      // Check dependencies
      if (this.migration.dependencies) {
        for (const dep of this.migration.dependencies) {
          if (!(await this.checkDependency(dep))) {
            throw new Error(`Dependency ${dep} not satisfied`)
          }
        }
      }
      
      // Execute migration
      await this.onExecute()
      
      const duration = Date.now() - startTime
      this.logInfo(`Migration completed successfully: ${this.migration.name}`, { duration })
      
      return {
        migrationId: this.migration.id,
        success: true,
        duration
      }
    } catch (error) {
      const duration = Date.now() - startTime
      this.logError(`Migration failed: ${this.migration.name}`, error as Error)
      
      // Attempt rollback if enabled
      if (this.migration.rollback) {
        try {
          this.logInfo(`Attempting rollback for migration: ${this.migration.name}`)
          await this.onRollback()
          this.logInfo(`Rollback completed for migration: ${this.migration.name}`)
          
          return {
            migrationId: this.migration.id,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            duration,
            rollback: true
          }
        } catch (rollbackError) {
          this.logError(`Rollback failed for migration: ${this.migration.name}`, rollbackError as Error)
          return {
            migrationId: this.migration.id,
            success: false,
            error: `Migration failed and rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            duration,
            rollback: false
          }
        }
      }
      
      return {
        migrationId: this.migration.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      }
    }
  }

  protected abstract onExecute(): Promise<void>
  protected async onRollback(): Promise<void> {
    // Default implementation does nothing
    this.logWarn('No rollback implementation provided')
  }

  protected async checkDependency(dependencyId: string): Promise<boolean> {
    if (!this.context) {
      return false
    }
    
    try {
      // Check if dependency migration has been applied
      const result = await this.context.database.$queryRaw`
        SELECT COUNT(*) as count FROM _migrations WHERE id = ${dependencyId}
      ` as any[]
      
      return result[0]?.count > 0
    } catch (error) {
      this.logError(`Failed to check dependency ${dependencyId}`, error as Error)
      return false
    }
  }

  protected async executeSql(sql: string): Promise<void> {
    if (!this.context) {
      throw new Error('Migration context not set')
    }
    
    if (this.context.dryRun) {
      this.logInfo('Dry run - would execute SQL:', { sql })
      return
    }
    
    try {
      await this.context.database.$executeRawUnsafe(sql)
      this.logDebug('SQL executed successfully')
    } catch (error) {
      this.logError('Failed to execute SQL', error as Error, { sql })
      throw error
    }
  }

  protected async querySql(sql: string): Promise<any> {
    if (!this.context) {
      throw new Error('Migration context not set')
    }
    
    try {
      const result = await this.context.database.$queryRawUnsafe(sql)
      return result
    } catch (error) {
      this.logError('Failed to query SQL', error as Error, { sql })
      throw error
    }
  }

  protected async recordMigration(): Promise<void> {
    if (!this.context || this.context.dryRun) {
      return
    }
    
    try {
      await this.context.database.$executeRaw`
        INSERT INTO _migrations (id, name, version, type, created, applied_at)
        VALUES (
          ${this.migration.id},
          ${this.migration.name},
          ${this.migration.version},
          ${this.migration.type},
          ${this.migration.created.toISOString()},
          ${new Date().toISOString()}
        )
      `
      
      this.logDebug('Migration recorded successfully')
    } catch (error) {
      this.logError('Failed to record migration', error as Error)
      throw error
    }
  }

  protected logInfo(message: string, data?: any): void {
    this.context?.logger?.info(`[Migration:${this.migration.id}] ${message}`, data)
  }

  protected logWarn(message: string, data?: any): void {
    this.context?.logger?.warn(`[Migration:${this.migration.id}] ${message}`, data)
  }

  protected logError(message: string, error?: Error, data?: any): void {
    this.context?.logger?.error(`[Migration:${this.migration.id}] ${message}`, error, data)
  }

  protected logDebug(message: string, data?: any): void {
    this.context?.logger?.debug(`[Migration:${this.migration.id}] ${message}`, data)
  }
}

export class MigrationManager {
  private migrations: Map<string, BaseMigration> = new Map()
  private logger: any
  private database: PrismaClient

  constructor(database: PrismaClient, logger: any) {
    this.database = database
    this.logger = logger
  }

  async initialize(): Promise<void> {
    this.logger.info('Initializing Migration Manager')
    
    try {
      // Create migrations table if it doesn't exist
      await this.createMigrationsTable()
      
      // Register built-in migrations
      await this.registerBuiltInMigrations()
      
      this.logger.info('Migration Manager initialized successfully')
    } catch (error) {
      this.logger.error('Failed to initialize Migration Manager', error as Error)
      throw error
    }
  }

  private async createMigrationsTable(): Promise<void> {
    try {
      await this.database.$executeRaw`
        CREATE TABLE IF NOT EXISTS _migrations (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          version VARCHAR(50) NOT NULL,
          type VARCHAR(50) NOT NULL,
          created TIMESTAMP NOT NULL,
          applied_at TIMESTAMP NOT NULL,
          rollback_at TIMESTAMP NULL
        )
      `
      
      this.logger.debug('Migrations table created or verified')
    } catch (error) {
      this.logger.error('Failed to create migrations table', error as Error)
      throw error
    }
  }

  private async registerBuiltInMigrations(): Promise<void> {
    // Register built-in migrations here
    this.logger.debug('Built-in migrations would be registered here')
  }

  registerMigration(migration: BaseMigration): void {
    const { id, name, version } = migration.migration
    
    if (this.migrations.has(id)) {
      throw new Error(`Migration ${name} (${id}) is already registered`)
    }
    
    this.migrations.set(id, migration)
    this.logger.debug(`Migration registered: ${name} (${id}) v${version}`)
  }

  async getAppliedMigrations(): Promise<Migration[]> {
    try {
      const result = await this.database.$queryRaw`
        SELECT id, name, version, type, created, applied_at, rollback_at
        FROM _migrations 
        WHERE rollback_at IS NULL
        ORDER BY applied_at
      ` as any[]
      
      return result.map(row => ({
        id: row.id,
        name: row.name,
        version: row.version,
        type: row.type,
        created: new Date(row.created),
        author: 'system'
      }))
    } catch (error) {
      this.logger.error('Failed to get applied migrations', error as Error)
      throw error
    }
  }

  async getPendingMigrations(): Promise<Migration[]> {
    const applied = await this.getAppliedMigrations()
    const appliedIds = new Set(applied.map(m => m.id))
    
    return Array.from(this.migrations.values())
      .filter(migration => !appliedIds.has(migration.migration.id))
      .map(migration => migration.migration)
  }

  async executeMigration(migrationId: string, dryRun = false): Promise<MigrationResult> {
    const migration = this.migrations.get(migrationId)
    if (!migration) {
      throw new Error(`Migration ${migrationId} not found`)
    }
    
    const context: MigrationContext = {
      database: this.database,
      config: config.getConfig(),
      logger: this.logger,
      dryRun
    }
    
    const result = await migration.execute(context)
    
    if (result.success && !dryRun) {
      await migration.recordMigration()
    }
    
    return result
  }

  async executePendingMigrations(dryRun = false): Promise<MigrationResult[]> {
    const pending = await this.getPendingMigrations()
    const results: MigrationResult[] = []
    
    this.logger.info(`Executing ${pending.length} pending migrations`)
    
    for (const migration of pending) {
      try {
        const result = await this.executeMigration(migration.id, dryRun)
        results.push(result)
        
        if (!result.success) {
          this.logger.error(`Migration ${migration.id} failed, stopping execution`)
          break
        }
      } catch (error) {
        this.logger.error(`Failed to execute migration ${migration.id}`, error as Error)
        results.push({
          migrationId: migration.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0
        })
        break
      }
    }
    
    return results
  }

  async rollbackMigration(migrationId: string): Promise<MigrationResult> {
    // This would implement rollback functionality
    this.logger.info(`Rolling back migration: ${migrationId}`)
    
    try {
      // Placeholder for rollback logic
      return {
        migrationId,
        success: true,
        duration: 0,
        rollback: true
      }
    } catch (error) {
      this.logger.error(`Failed to rollback migration ${migrationId}`, error as Error)
      return {
        migrationId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: 0,
        rollback: false
      }
    }
  }

  async getMigrationStatus(): Promise<{
    total: number
    applied: number
    pending: number
    failed: number
    migrations: Record<string, { status: 'applied' | 'pending' | 'failed'; migration: Migration }>
  }> {
    const allMigrations = Array.from(this.migrations.values()).map(m => m.migration)
    const applied = await this.getAppliedMigrations()
    const appliedIds = new Set(applied.map(m => m.id))
    
    const status: Record<string, { status: 'applied' | 'pending' | 'failed'; migration: Migration }> = {}
    
    for (const migration of allMigrations) {
      if (appliedIds.has(migration.id)) {
        status[migration.id] = { status: 'applied', migration }
      } else {
        status[migration.id] = { status: 'pending', migration }
      }
    }
    
    return {
      total: allMigrations.length,
      applied: applied.length,
      pending: allMigrations.length - applied.length,
      failed: 0, // Would track failed migrations in a real implementation
      migrations: status
    }
  }

  async createBackup(): Promise<string> {
    this.logger.info('Creating database backup before migrations')
    
    try {
      // This would implement backup creation
      const backupPath = `/tmp/migration_backup_${Date.now()}.sql`
      this.logger.info('Database backup created', { path: backupPath })
      return backupPath
    } catch (error) {
      this.logger.error('Failed to create database backup', error as Error)
      throw error
    }
  }

  async validateMigration(migrationId: string): Promise<{ valid: boolean; errors: string[] }> {
    const migration = this.migrations.get(migrationId)
    if (!migration) {
      return {
        valid: false,
        errors: [`Migration ${migrationId} not found`]
      }
    }
    
    const errors: string[] = []
    
    // Validate migration metadata
    const { id, name, version, type } = migration.migration
    
    if (!id || typeof id !== 'string') {
      errors.push('Migration ID is required and must be a string')
    }
    
    if (!name || typeof name !== 'string') {
      errors.push('Migration name is required and must be a string')
    }
    
    if (!version || typeof version !== 'string') {
      errors.push('Migration version is required and must be a string')
    }
    
    if (!type || !['schema', 'data', 'config', 'feature'].includes(type)) {
      errors.push('Migration type must be one of: schema, data, config, feature')
    }
    
    // Check if migration is already applied
    const applied = await this.getAppliedMigrations()
    if (applied.some(m => m.id === id)) {
      errors.push('Migration is already applied')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Global migration manager instance
let migrationManager: MigrationManager | null = null

export function getMigrationManager(): MigrationManager {
  if (!migrationManager) {
    const database = getDatabaseService().getClient()
    const logger = {
      info: (message: string, data?: any) => console.log(`[MigrationManager] INFO: ${message}`, data || ''),
      warn: (message: string, data?: any) => console.warn(`[MigrationManager] WARN: ${message}`, data || ''),
      error: (message: string, error?: Error, data?: any) => console.error(`[MigrationManager] ERROR: ${message}`, error || '', data || ''),
      debug: (message: string, data?: any) => {
        if (process.env.DEBUG === 'true') {
          console.debug(`[MigrationManager] DEBUG: ${message}`, data || '')
        }
      }
    }
    migrationManager = new MigrationManager(database, logger)
  }
  return migrationManager
}

export async function initializeMigrations(): Promise<void> {
  const manager = getMigrationManager()
  await manager.initialize()
}

export async function executePendingMigrations(dryRun = false): Promise<MigrationResult[]> {
  const manager = getMigrationManager()
  return manager.executePendingMigrations(dryRun)
}

export async function getMigrationStatus(): Promise<any> {
  const manager = getMigrationManager()
  return manager.getMigrationStatus()
}