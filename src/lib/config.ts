/**
 * Configuration Management System
 * Provides centralized access to environment variables and platform settings
 * with validation and default values for better modularity
 */

export interface DatabaseConfig {
  url: string
  maxConnections?: number
  ssl?: boolean
}

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey: string
}

export interface AuthConfig {
  secret: string
  url: string
  providers: string[]
}

export interface AIConfig {
  apiKey: string
  baseUrl: string
  model: string
  maxTokens: number
  temperature: number
}

export interface FeatureFlags {
  aiGeneration: boolean
  marketplace: boolean
  analytics: boolean
  notifications: boolean
  websocket: boolean
  voiceCommands: boolean
  contentModeration: boolean
  compliance: boolean
}

export interface SecurityConfig {
  corsOrigin: string
  rateLimitWindowMs: number
  rateLimitMaxRequests: number
  bcryptRounds: number
  sessionMaxAge: number
}

export interface UploadConfig {
  maxFileSize: number
  allowedFileTypes: string[]
  uploadPath: string
  cdnUrl?: string
}

export interface EmailConfig {
  host: string
  port: number
  user: string
  pass: string
  from: string
}

export interface PlatformConfig {
  env: 'development' | 'production' | 'test'
  port: number
  baseUrl: string
  apiUrl: string
  debug: boolean
  version: string
}

export interface AppConfig {
  database: DatabaseConfig
  supabase: SupabaseConfig
  auth: AuthConfig
  ai: AIConfig
  features: FeatureFlags
  security: SecurityConfig
  upload: UploadConfig
  email: EmailConfig
  platform: PlatformConfig
}

class ConfigManager {
  private config: AppConfig
  private static instance: ConfigManager

  private constructor() {
    this.config = this.loadConfig()
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  private loadConfig(): AppConfig {
    return {
      database: {
        url: this.getEnv('DATABASE_URL', 'file:./dev.db'),
        maxConnections: this.getEnvInt('DATABASE_MAX_CONNECTIONS', 10),
        ssl: this.getEnvBool('DATABASE_SSL', false),
      },
      supabase: {
        url: this.getEnv('NEXT_PUBLIC_SUPABASE_URL', ''),
        anonKey: this.getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', ''),
        serviceRoleKey: this.getEnv('SUPABASE_SERVICE_ROLE_KEY', ''),
      },
      auth: {
        secret: this.getEnv('NEXTAUTH_SECRET', 'your-secret-key'),
        url: this.getEnv('NEXTAUTH_URL', 'http://localhost:3000'),
        providers: this.getEnv('AUTH_PROVIDERS', 'credentials').split(','),
      },
      ai: {
        apiKey: this.getEnv('ZAI_API_KEY', ''),
        baseUrl: this.getEnv('ZAI_BASE_URL', 'https://api.z-ai.com'),
        model: this.getEnv('ZAI_MODEL', 'gpt-4'),
        maxTokens: this.getEnvInt('ZAI_MAX_TOKENS', 4000),
        temperature: this.getEnvFloat('ZAI_TEMPERATURE', 0.7),
      },
      features: {
        aiGeneration: this.getEnvBool('ENABLE_AI_GENERATION', true),
        marketplace: this.getEnvBool('ENABLE_MARKETPLACE', true),
        analytics: this.getEnvBool('ENABLE_ANALYTICS', true),
        notifications: this.getEnvBool('ENABLE_NOTIFICATIONS', true),
        websocket: this.getEnvBool('ENABLE_WEBSOCKET', true),
        voiceCommands: this.getEnvBool('ENABLE_VOICE_COMMANDS', true),
        contentModeration: this.getEnvBool('ENABLE_CONTENT_MODERATION', true),
        compliance: this.getEnvBool('ENABLE_COMPLIANCE', true),
      },
      security: {
        corsOrigin: this.getEnv('CORS_ORIGIN', 'http://localhost:3000'),
        rateLimitWindowMs: this.getEnvInt('RATE_LIMIT_WINDOW_MS', 900000),
        rateLimitMaxRequests: this.getEnvInt('RATE_LIMIT_MAX_REQUESTS', 100),
        bcryptRounds: this.getEnvInt('BCRYPT_ROUNDS', 12),
        sessionMaxAge: this.getEnvInt('SESSION_MAX_AGE', 30 * 24 * 60 * 60), // 30 days
      },
      upload: {
        maxFileSize: this.getEnvInt('MAX_FILE_SIZE', 100 * 1024 * 1024), // 100MB
        allowedFileTypes: this.getEnv('ALLOWED_FILE_TYPES', 'jpg,jpeg,png,gif,webp,mp4,mov,avi').split(','),
        uploadPath: this.getEnv('UPLOAD_PATH', './uploads'),
        cdnUrl: this.getEnv('CDN_URL', ''),
      },
      email: {
        host: this.getEnv('SMTP_HOST', 'smtp.gmail.com'),
        port: this.getEnvInt('SMTP_PORT', 587),
        user: this.getEnv('SMTP_USER', ''),
        pass: this.getEnv('SMTP_PASS', ''),
        from: this.getEnv('EMAIL_FROM', 'noreply@example.com'),
      },
      platform: {
        env: this.getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test',
        port: this.getEnvInt('PORT', 3000),
        baseUrl: this.getEnv('BASE_URL', 'http://localhost:3000'),
        apiUrl: this.getEnv('API_URL', 'http://localhost:3000/api'),
        debug: this.getEnvBool('DEBUG', false),
        version: this.getEnv('APP_VERSION', '1.0.0'),
      },
    }
  }

  private getEnv(key: string, defaultValue: string): string {
    const value = process.env[key]
    if (value === undefined) {
      if (defaultValue === undefined) {
        throw new Error(`Environment variable ${key} is required but not set`)
      }
      return defaultValue
    }
    return value
  }

  private getEnvInt(key: string, defaultValue: number): number {
    const value = process.env[key]
    if (value === undefined) {
      return defaultValue
    }
    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) {
      throw new Error(`Environment variable ${key} must be an integer`)
    }
    return parsed
  }

  private getEnvBool(key: string, defaultValue: boolean): boolean {
    const value = process.env[key]
    if (value === undefined) {
      return defaultValue
    }
    return value.toLowerCase() === 'true' || value === '1'
  }

  private getEnvFloat(key: string, defaultValue: number): number {
    const value = process.env[key]
    if (value === undefined) {
      return defaultValue
    }
    const parsed = parseFloat(value)
    if (isNaN(parsed)) {
      throw new Error(`Environment variable ${key} must be a float`)
    }
    return parsed
  }

  public getConfig(): AppConfig {
    return { ...this.config }
  }

  public getDatabaseConfig(): DatabaseConfig {
    return { ...this.config.database }
  }

  public getSupabaseConfig(): SupabaseConfig {
    return { ...this.config.supabase }
  }

  public getAuthConfig(): AuthConfig {
    return { ...this.config.auth }
  }

  public getAIConfig(): AIConfig {
    return { ...this.config.ai }
  }

  public getFeatureFlags(): FeatureFlags {
    return { ...this.config.features }
  }

  public getSecurityConfig(): SecurityConfig {
    return { ...this.config.security }
  }

  public getUploadConfig(): UploadConfig {
    return { ...this.config.upload }
  }

  public getEmailConfig(): EmailConfig {
    return { ...this.config.email }
  }

  public getPlatformConfig(): PlatformConfig {
    return { ...this.config.platform }
  }

  public isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    return this.config.features[feature]
  }

  public isDevelopment(): boolean {
    return this.config.platform.env === 'development'
  }

  public isProduction(): boolean {
    return this.config.platform.env === 'production'
  }

  public isTest(): boolean {
    return this.config.platform.env === 'test'
  }

  public validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Validate required configurations
    if (!this.config.supabase.url) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is required')
    }
    if (!this.config.supabase.anonKey) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
    }
    if (!this.config.auth.secret) {
      errors.push('NEXTAUTH_SECRET is required')
    }
    if (!this.config.ai.apiKey && this.config.features.aiGeneration) {
      errors.push('ZAI_API_KEY is required when AI generation is enabled')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  public reloadConfig(): void {
    this.config = this.loadConfig()
  }
}

// Export singleton instance
export const config = ConfigManager.getInstance()

// Export convenience functions
export const getDatabaseConfig = () => config.getDatabaseConfig()
export const getSupabaseConfig = () => config.getSupabaseConfig()
export const getAuthConfig = () => config.getAuthConfig()
export const getAIConfig = () => config.getAIConfig()
export const getFeatureFlags = () => config.getFeatureFlags()
export const getSecurityConfig = () => config.getSecurityConfig()
export const getUploadConfig = () => config.getUploadConfig()
export const getEmailConfig = () => config.getEmailConfig()
export const getPlatformConfig = () => config.getPlatformConfig()
export const isFeatureEnabled = (feature: keyof FeatureFlags) => config.isFeatureEnabled(feature)
export const isDevelopment = () => config.isDevelopment()
export const isProduction = () => config.isProduction()
export const isTest = () => config.isTest()

// Export types
export type {
  DatabaseConfig,
  SupabaseConfig,
  AuthConfig,
  AIConfig,
  FeatureFlags,
  SecurityConfig,
  UploadConfig,
  EmailConfig,
  PlatformConfig,
  AppConfig,
}