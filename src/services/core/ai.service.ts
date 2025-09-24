/**
 * AI Service
 * Provides AI-powered content generation and processing capabilities
 */

import { BaseService, ServiceMetadata } from './service-registry'
import { getFeatureFlags } from '@/lib/config'
import ZAI from 'z-ai-web-dev-sdk'

export interface AIServiceConfig {
  apiKey: string
  baseUrl: string
  model: string
  maxTokens: number
  temperature: number
  timeout: number
  retries: number
}

export interface GenerationRequest {
  prompt: string
  type: 'image' | 'text' | 'video'
  parameters?: Record<string, any>
  userId?: string
}

export interface GenerationResult {
  success: boolean
  data?: any
  error?: string
  metadata?: {
    model: string
    tokensUsed: number
    processingTime: number
    cost?: number
  }
}

export class AIService extends BaseService {
  public metadata: ServiceMetadata = {
    name: 'ai',
    version: '1.0.0',
    description: 'AI service for content generation and processing',
    dependencies: ['database'],
    singleton: true,
    priority: 90
  }

  private zai: any = null
  private config: AIServiceConfig | null = null
  private rateLimiter: Map<string, number> = new Map()
  private usageStats: Map<string, { count: number; lastReset: number }> = new Map()

  protected async onInitialize(): Promise<void> {
    if (!getFeatureFlags().aiGeneration) {
      this.logInfo('AI generation is disabled, skipping initialization')
      return
    }

    this.logInfo('Initializing AI Service')
    
    const config = this.getConfig()?.ai
    if (!config) {
      throw new Error('AI configuration not found')
    }
    
    this.config = config as AIServiceConfig
    
    try {
      await this.initializeAI()
      this.startCleanupTask()
      this.logInfo('AI Service initialized successfully')
    } catch (error) {
      this.logError('Failed to initialize AI Service', error as Error)
      throw error
    }
  }

  protected async onDestroy(): Promise<void> {
    this.logInfo('Destroying AI Service')
    
    try {
      this.zai = null
      this.rateLimiter.clear()
      this.usageStats.clear()
      this.logInfo('AI Service destroyed successfully')
    } catch (error) {
      this.logError('Failed to destroy AI Service', error as Error)
      throw error
    }
  }

  private async initializeAI(): Promise<void> {
    if (!this.config) {
      throw new Error('AI configuration not set')
    }
    
    this.logInfo('Initializing AI client', { baseUrl: this.config.baseUrl })
    
    try {
      this.zai = await ZAI.create()
      this.logInfo('AI client initialized successfully')
    } catch (error) {
      this.logError('Failed to initialize AI client', error as Error)
      throw error
    }
  }

  async generateContent(request: GenerationRequest): Promise<GenerationResult> {
    if (!getFeatureFlags().aiGeneration) {
      return {
        success: false,
        error: 'AI generation is disabled'
      }
    }

    if (!this.zai) {
      return {
        success: false,
        error: 'AI service not initialized'
      }
    }

    // Rate limiting
    if (!this.checkRateLimit(request.userId || 'anonymous')) {
      return {
        success: false,
        error: 'Rate limit exceeded'
      }
    }

    const startTime = Date.now()
    
    try {
      let result: any
      
      switch (request.type) {
        case 'image':
          result = await this.generateImage(request)
          break
        case 'text':
          result = await this.generateText(request)
          break
        case 'video':
          result = await this.generateVideo(request)
          break
        default:
          throw new Error(`Unsupported generation type: ${request.type}`)
      }
      
      const processingTime = Date.now() - startTime
      
      // Update usage stats
      this.updateUsageStats(request.userId || 'anonymous')
      
      return {
        success: true,
        data: result,
        metadata: {
          model: this.config?.model || 'default',
          tokensUsed: this.estimateTokens(request.prompt),
          processingTime,
          cost: this.calculateCost(request.type, this.estimateTokens(request.prompt))
        }
      }
    } catch (error) {
      this.logError('Content generation failed', error as Error, { type: request.type })
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private async generateImage(request: GenerationRequest): Promise<any> {
    if (!this.config) {
      throw new Error('AI configuration not set')
    }
    
    const { prompt, parameters = {} } = request
    
    const imageParams = {
      prompt,
      size: parameters.size || '1024x1024',
      quality: parameters.quality || 'standard',
      ...parameters
    }
    
    const response = await this.zai.images.generations.create(imageParams)
    
    return {
      images: response.data.map((item: any) => ({
        url: item.url,
        base64: item.base64,
        metadata: {
          size: imageParams.size,
          quality: imageParams.quality
        }
      }))
    }
  }

  private async generateText(request: GenerationRequest): Promise<any> {
    if (!this.config) {
      throw new Error('AI configuration not set')
    }
    
    const { prompt, parameters = {} } = request
    
    const completionParams = {
      messages: [
        {
          role: 'system',
          content: parameters.systemPrompt || 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parameters.maxTokens || this.config.maxTokens,
      temperature: parameters.temperature || this.config.temperature,
      ...parameters
    }
    
    const completion = await this.zai.chat.completions.create(completionParams)
    
    return {
      content: completion.choices[0]?.message?.content,
      usage: completion.usage,
      metadata: {
        model: completion.model,
        finishReason: completion.choices[0]?.finish_reason
      }
    }
  }

  private async generateVideo(request: GenerationRequest): Promise<any> {
    if (!this.config) {
      throw new Error('AI configuration not set')
    }
    
    const { prompt, parameters = {} } = request
    
    // Video generation would be implemented here
    // For now, return a placeholder
    return {
      message: 'Video generation not yet implemented',
      prompt,
      parameters
    }
  }

  async moderateContent(content: string): Promise<{
    isAppropriate: boolean
    categories: string[]
    confidence: number
  }> {
    if (!this.zai) {
      throw new Error('AI service not initialized')
    }
    
    try {
      const moderationPrompt = `
        Analyze the following content for appropriateness. Check for:
        - NSFW content
        - Hate speech
        - Violence
        - Harassment
        - Spam
        
        Content: "${content}"
        
        Respond with JSON format:
        {
          "isAppropriate": boolean,
          "categories": ["category1", "category2"],
          "confidence": number between 0 and 1
        }
      `
      
      const result = await this.generateText({
        prompt: moderationPrompt,
        type: 'text',
        parameters: {
          temperature: 0.1,
          maxTokens: 100
        }
      })
      
      try {
        const moderation = JSON.parse(result.content)
        return {
          isAppropriate: moderation.isAppropriate,
          categories: moderation.categories || [],
          confidence: moderation.confidence || 0
        }
      } catch (parseError) {
        this.logError('Failed to parse moderation response', parseError as Error)
        return {
          isAppropriate: true,
          categories: [],
          confidence: 0
        }
      }
    } catch (error) {
      this.logError('Content moderation failed', error as Error)
      return {
        isAppropriate: true,
        categories: [],
        confidence: 0
      }
    }
  }

  async enhancePrompt(prompt: string, type: 'image' | 'text' | 'video' = 'image'): Promise<string> {
    if (!this.zai) {
      throw new Error('AI service not initialized')
    }
    
    try {
      const enhancementPrompt = `
        Enhance the following prompt for better ${type} generation. 
        Make it more descriptive, detailed, and likely to produce high-quality results.
        
        Original prompt: "${prompt}"
        
        Return only the enhanced prompt without any additional text.
      `
      
      const result = await this.generateText({
        prompt: enhancementPrompt,
        type: 'text',
        parameters: {
          temperature: 0.7,
          maxTokens: 200
        }
      })
      
      return result.content || prompt
    } catch (error) {
      this.logError('Prompt enhancement failed', error as Error)
      return prompt
    }
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute window
    const maxRequests = 10 // Max requests per minute
    
    const lastRequest = this.rateLimiter.get(userId) || 0
    
    if (now - lastRequest < windowMs) {
      const currentCount = this.usageStats.get(userId)?.count || 0
      return currentCount < maxRequests
    }
    
    this.rateLimiter.set(userId, now)
    return true
  }

  private updateUsageStats(userId: string): void {
    const now = Date.now()
    const stats = this.usageStats.get(userId) || { count: 0, lastReset: now }
    
    // Reset count if window has passed
    if (now - stats.lastReset > 60 * 1000) {
      stats.count = 1
      stats.lastReset = now
    } else {
      stats.count++
    }
    
    this.usageStats.set(userId, stats)
  }

  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4)
  }

  private calculateCost(type: string, tokens: number): number {
    // Simple cost calculation (would be more sophisticated in production)
    const rates = {
      image: 0.02,
      text: 0.001,
      video: 0.05
    }
    
    return (rates[type as keyof typeof rates] || 0.001) * (tokens / 1000)
  }

  private startCleanupTask(): void {
    // Clean up old rate limiter and usage stats data
    setInterval(() => {
      const now = Date.now()
      const hourAgo = now - 60 * 60 * 1000
      
      // Clean old rate limiter entries
      for (const [userId, timestamp] of this.rateLimiter.entries()) {
        if (now - timestamp > hourAgo) {
          this.rateLimiter.delete(userId)
        }
      }
      
      // Clean old usage stats
      for (const [userId, stats] of this.usageStats.entries()) {
        if (now - stats.lastReset > hourAgo) {
          this.usageStats.delete(userId)
        }
      }
    }, 60 * 60 * 1000) // Run every hour
  }

  async getUsageStats(userId?: string): Promise<any> {
    if (userId) {
      return this.usageStats.get(userId) || { count: 0, lastReset: Date.now() }
    }
    
    // Return aggregated stats
    const totalRequests = Array.from(this.usageStats.values())
      .reduce((sum, stats) => sum + stats.count, 0)
    
    return {
      totalRequests,
      activeUsers: this.usageStats.size,
      averageRequestsPerUser: this.usageStats.size > 0 ? totalRequests / this.usageStats.size : 0
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; details?: any }> {
    try {
      if (!getFeatureFlags().aiGeneration) {
        return { healthy: true, details: 'AI generation disabled' }
      }
      
      if (!this.zai) {
        return { healthy: false, details: 'AI client not initialized' }
      }
      
      // Simple health check - try to generate a small test
      const testResult = await this.generateText({
        prompt: 'Test',
        type: 'text',
        parameters: { maxTokens: 10 }
      })
      
      return { 
        healthy: testResult.success,
        details: testResult.success ? 'AI service operational' : testResult.error
      }
    } catch (error) {
      this.logError('AI service health check failed', error as Error)
      return { 
        healthy: false, 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}