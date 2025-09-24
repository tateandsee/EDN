/**
 * AI-Powered Content Moderation Integration
 * Advanced content analysis with multi-modal support and real-time processing
 */

import { aiModelIntegration, ContentModerationRequest } from './ai-models'
import { contentModeration } from './content-moderation'

export interface AIModerationConfig {
  models: string[]
  enableRealTime: boolean
  processingMode: 'fast' | 'balanced' | 'thorough'
  confidenceThreshold: number
  enableContextAnalysis: boolean
  enableMultiModal: boolean
  enableEdgeCaseDetection: boolean
  enableAutoModeration: boolean
  reportGeneration: boolean
  languageSupport: string[]
}

export interface ModerationResult {
  id: string
  timestamp: Date
  contentType: 'text' | 'image' | 'video' | 'audio'
  content: string
  isNSFW: boolean
  confidence: number
  categories: {
    explicit: number
    suggestive: number
    violent: number
    hate: number
    other: number
  }
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  edgeCases: string[]
  recommendations: string[]
  modelUsed: string
  processingTime: number
  metadata?: {
    context?: string
    source?: string
    userId?: string
    sessionId?: string
  }
}

export interface BatchModerationRequest {
  items: Array<{
    id: string
    content: string
    type: 'text' | 'image' | 'video' | 'audio'
    metadata?: Record<string, any>
  }>
  priority: 'low' | 'medium' | 'high' | 'urgent'
  callback?: (results: ModerationResult[]) => void
}

export interface ModerationStats {
  totalProcessed: number
  averageProcessingTime: number
  accuracy: number
  falsePositiveRate: number
  falseNegativeRate: number
  modelPerformance: Record<string, {
    usage: number
    accuracy: number
    averageTime: number
  }>
  categoryDistribution: Record<string, number>
}

class AIContentModeration {
  private config: AIModerationConfig
  private processingQueue: Array<{
    id: string
    request: ContentModerationRequest
    resolve: (result: ModerationResult) => void
    reject: (error: Error) => void
  }> = []
  private isProcessing = false
  private stats: ModerationStats
  private resultCache: Map<string, ModerationResult> = new Map()
  private modelPerformance: Map<string, any> = new Map()

  constructor(config: Partial<AIModerationConfig> = {}) {
    this.config = {
      models: ['EDN_Content_Moderator_Pro', 'OpenAI_Moderation'],
      enableRealTime: true,
      processingMode: 'balanced',
      confidenceThreshold: 0.75,
      enableContextAnalysis: true,
      enableMultiModal: true,
      enableEdgeCaseDetection: true,
      enableAutoModeration: true,
      reportGeneration: true,
      languageSupport: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
      ...config
    }

    this.stats = {
      totalProcessed: 0,
      averageProcessingTime: 0,
      accuracy: 0.95,
      falsePositiveRate: 0.02,
      falseNegativeRate: 0.03,
      modelPerformance: {},
      categoryDistribution: {
        explicit: 0,
        suggestive: 0,
        violent: 0,
        hate: 0,
        other: 0
      }
    }

    this.initializeModelPerformance()
    this.startProcessingQueue()
  }

  /**
   * Initialize model performance tracking
   */
  private initializeModelPerformance(): void {
    this.config.models.forEach(model => {
      this.modelPerformance.set(model, {
        usage: 0,
        accuracy: 0.95,
        averageTime: 1000,
        lastUsed: null,
        successRate: 1.0
      })
    })
  }

  /**
   * Start processing queue
   */
  private startProcessingQueue(): void {
    setInterval(() => {
      if (!this.isProcessing && this.processingQueue.length > 0) {
        this.processNextRequest()
      }
    }, 50) // High frequency for real-time processing
  }

  /**
   * Process next moderation request
   */
  private async processNextRequest(): Promise<void> {
    if (this.processingQueue.length === 0) return

    this.isProcessing = true
    const request = this.processingQueue.shift()!

    try {
      const result = await this.moderateContent(request.request)
      request.resolve(result)
    } catch (error) {
      request.reject(error instanceof Error ? error : new Error(String(error)))
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Moderate content using AI models
   */
  private async moderateContent(request: ContentModerationRequest): Promise<ModerationResult> {
    const startTime = Date.now()
    const resultId = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request)
      const cached = this.resultCache.get(cacheKey)
      if (cached) {
        return {
          ...cached,
          id: resultId,
          timestamp: new Date()
        }
      }

      // Select the best model for the request
      const selectedModel = this.selectBestModel(request)

      // Prepare moderation request with enhanced context
      const enhancedRequest = this.enhanceModerationRequest(request)

      // Use AI model integration for moderation
      const aiResult = await aiModelIntegration.queueRequest('content_moderation', enhancedRequest)

      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI moderation failed')
      }

      // Also use the existing content moderation system for comparison
      const legacyResult = await this.getLegacyModeration(request)

      // Combine and analyze results
      const finalResult = this.combineResults(
        resultId,
        request,
        aiResult.data,
        legacyResult,
        selectedModel,
        Date.now() - startTime
      )

      // Update statistics
      this.updateStatistics(finalResult, selectedModel)

      // Cache the result
      this.resultCache.set(cacheKey, finalResult)

      // Generate reports if enabled
      if (this.config.reportGeneration && finalResult.riskLevel !== 'low') {
        await this.generateModerationReport(finalResult)
      }

      return finalResult

    } catch (error) {
      console.error('AI content moderation failed:', error)
      
      // Fallback to legacy system
      try {
        const fallbackResult = await this.getLegacyModeration(request)
        return {
          id: resultId,
          timestamp: new Date(),
          contentType: request.type,
          content: request.content,
          isNSFW: fallbackResult.isNSFW,
          confidence: fallbackResult.confidence,
          categories: fallbackResult.categories,
          riskLevel: this.calculateRiskLevel(fallbackResult),
          edgeCases: fallbackResult.edgeCases,
          recommendations: fallbackResult.recommendations,
          modelUsed: 'legacy_fallback',
          processingTime: Date.now() - startTime
        }
      } catch (fallbackError) {
        return {
          id: resultId,
          timestamp: new Date(),
          contentType: request.type,
          content: request.content,
          isNSFW: false,
          confidence: 0,
          categories: {
            explicit: 0,
            suggestive: 0,
            violent: 0,
            hate: 0,
            other: 0
          },
          riskLevel: 'low',
          edgeCases: ['moderation_failed'],
          recommendations: ['Manual review required'],
          modelUsed: 'error_fallback',
          processingTime: Date.now() - startTime
        }
      }
    }
  }

  /**
   * Select the best model for the moderation request
   */
  private selectBestModel(request: ContentModerationRequest): string {
    const availableModels = this.config.models.filter(model => {
      const perf = this.modelPerformance.get(model)
      return perf && perf.successRate > 0.8
    })

    if (availableModels.length === 0) {
      return this.config.models[0]
    }

    // Select based on content type and processing mode
    if (request.type === 'video' && this.config.processingMode === 'fast') {
      return availableModels.find(m => m.includes('Pro')) || availableModels[0]
    }

    // Select model with best performance
    return availableModels.reduce((best, current) => {
      const bestPerf = this.modelPerformance.get(best)!
      const currentPerf = this.modelPerformance.get(current)!
      
      if (currentPerf.accuracy > bestPerf.accuracy) return current
      if (currentPerf.averageTime < bestPerf.averageTime) return current
      return best
    })
  }

  /**
   * Enhance moderation request with additional context
   */
  private enhanceModerationRequest(request: ContentModerationRequest): ContentModerationRequest {
    const enhanced = { ...request }

    // Add context analysis if enabled
    if (this.config.enableContextAnalysis) {
      // In real implementation, this would analyze surrounding content
      enhanced.content = this.addContextMarkers(request.content)
    }

    // Add language detection
    const detectedLanguage = this.detectLanguage(request.content)
    if (detectedLanguage && this.config.languageSupport.includes(detectedLanguage)) {
      // In real implementation, this would set the language parameter
    }

    return enhanced
  }

  /**
   * Add context markers to content
   */
  private addContextMarkers(content: string): string {
    // Add contextual analysis markers
    const markers = [
      '[CONTEXT_ANALYSIS]',
      '[MULTI_MODAL_SUPPORT]',
      '[EDGE_CASE_DETECTION]'
    ]

    return `${markers.join(' ')} ${content} ${markers.reverse().join(' ')}`
  }

  /**
   * Detect language of content
   */
  private detectLanguage(content: string): string | null {
    // Simple language detection (in real implementation, use proper language detection library)
    const patterns = {
      'en': /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/i,
      'es': /\b(el|la|de|que|y|o|en|con|por|para|sin)\b/i,
      'fr': /\b(le|la|de|et|ou|à|en|avec|pour|sans)\b/i,
      'de': /\b(der|die|das|und|oder|in|mit|für|ohne)\b/i,
    }

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(content)) {
        return lang
      }
    }

    return null
  }

  /**
   * Get moderation from legacy system
   */
  private async getLegacyModeration(request: ContentModerationRequest): Promise<any> {
    switch (request.type) {
      case 'text':
        return await contentModeration.moderateText(request.content)
      case 'image':
        return await contentModeration.moderateImage(request.content)
      case 'video':
        return await contentModeration.moderateVideo(request.content)
      default:
        throw new Error(`Unsupported content type: ${request.type}`)
    }
  }

  /**
   * Combine AI and legacy moderation results
   */
  private combineResults(
    resultId: string,
    request: ContentModerationRequest,
    aiResult: any,
    legacyResult: any,
    modelUsed: string,
    processingTime: number
  ): ModerationResult {
    // Combine confidence scores
    const combinedConfidence = (aiResult.confidence + legacyResult.confidence) / 2

    // Combine category scores
    const categories = {
      explicit: (aiResult.categories?.explicit || 0 + legacyResult.categories?.explicit || 0) / 2,
      suggestive: (aiResult.categories?.suggestive || 0 + legacyResult.categories?.suggestive || 0) / 2,
      violent: (aiResult.categories?.violent || 0 + legacyResult.categories?.violent || 0) / 2,
      hate: (aiResult.categories?.hate || 0 + legacyResult.categories?.hate || 0) / 2,
      other: (aiResult.categories?.other || 0 + legacyResult.categories?.other || 0) / 2
    }

    // Combine edge cases
    const edgeCases = [
      ...(aiResult.edgeCases || []),
      ...(legacyResult.edgeCases || [])
    ].filter((value, index, self) => self.indexOf(value) === index)

    // Determine NSFW status
    const isNSFW = combinedConfidence > this.config.confidenceThreshold && 
                   (categories.explicit > 0.5 || categories.suggestive > 0.6)

    // Calculate risk level
    const riskLevel = this.calculateRiskLevel({ categories, confidence: combinedConfidence })

    // Generate recommendations
    const recommendations = this.generateRecommendations(isNSFW, riskLevel, categories)

    return {
      id: resultId,
      timestamp: new Date(),
      contentType: request.type,
      content: request.content,
      isNSFW,
      confidence: combinedConfidence,
      categories,
      riskLevel,
      edgeCases,
      recommendations,
      modelUsed,
      processingTime
    }
  }

  /**
   * Calculate risk level
   */
  private calculateRiskLevel(result: { categories: any; confidence: number }): 'low' | 'medium' | 'high' | 'critical' {
    const { categories, confidence } = result
    
    if (categories.explicit > 0.8 || categories.violent > 0.7 || categories.hate > 0.7) {
      return 'critical'
    }
    
    if (categories.explicit > 0.6 || categories.suggestive > 0.7 || categories.violent > 0.5) {
      return 'high'
    }
    
    if (categories.explicit > 0.3 || categories.suggestive > 0.5 || confidence > 0.8) {
      return 'medium'
    }
    
    return 'low'
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(isNSFW: boolean, riskLevel: string, categories: any): string[] {
    const recommendations: string[] = []

    if (isNSFW) {
      recommendations.push('Content flagged as NSFW - apply age restrictions')
      
      if (riskLevel === 'critical') {
        recommendations.push('Immediate action required - content violates policies')
        recommendations.push('Consider account suspension for repeated violations')
      } else if (riskLevel === 'high') {
        recommendations.push('Review content for policy compliance')
        recommendations.push('Apply strict filtering')
      }
    }

    if (categories.explicit > 0.5) {
      recommendations.push('Explicit content detected - enable content warnings')
    }

    if (categories.suggestive > 0.6) {
      recommendations.push('Suggestive content - apply appropriate filtering')
    }

    if (categories.violent > 0.4) {
      recommendations.push('Violent content detected - review for policy compliance')
    }

    if (categories.hate > 0.4) {
      recommendations.push('Hate speech detected - consider content removal')
    }

    return recommendations
  }

  /**
   * Update statistics
   */
  private updateStatistics(result: ModerationResult, modelUsed: string): void {
    this.stats.totalProcessed++
    
    // Update average processing time
    this.stats.averageProcessingTime = 
      (this.stats.averageProcessingTime * (this.stats.totalProcessed - 1) + result.processingTime) / 
      this.stats.totalProcessed

    // Update category distribution
    Object.entries(result.categories).forEach(([category, score]) => {
      if (score > 0.5) {
        this.stats.categoryDistribution[category]++
      }
    })

    // Update model performance
    const modelPerf = this.modelPerformance.get(modelUsed)
    if (modelPerf) {
      modelPerf.usage++
      modelPerf.lastUsed = new Date()
      
      // Update accuracy based on confidence
      modelPerf.accuracy = (modelPerf.accuracy + result.confidence) / 2
      modelPerf.averageTime = (modelPerf.averageTime + result.processingTime) / 2
    }

    // Update model performance in stats
    this.stats.modelPerformance[modelUsed] = {
      usage: modelPerf?.usage || 0,
      accuracy: modelPerf?.accuracy || 0,
      averageTime: modelPerf?.averageTime || 0
    }
  }

  /**
   * Generate moderation report
   */
  private async generateModerationReport(result: ModerationResult): Promise<void> {
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    console.log(`Moderation report generated for ${result.id} - Risk Level: ${result.riskLevel}`)
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(request: ContentModerationRequest): string {
    return `${request.type}_${request.content}_${request.strictness}_${request.enableEdgeCaseDetection}`
  }

  /**
   * Moderate content
   */
  async moderate(request: ContentModerationRequest): Promise<ModerationResult> {
    return new Promise((resolve, reject) => {
      const id = `mod_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      this.processingQueue.push({
        id,
        request,
        resolve,
        reject
      })
    })
  }

  /**
   * Moderate batch of content
   */
  async moderateBatch(batchRequest: BatchModerationRequest): Promise<ModerationResult[]> {
    const results: ModerationResult[] = []

    for (const item of batchRequest.items) {
      try {
        const request: ContentModerationRequest = {
          content: item.content,
          type: item.type,
          strictness: 'medium',
          enableEdgeCaseDetection: true
        }

        const result = await this.moderate(request)
        results.push({
          ...result,
          metadata: {
            ...result.metadata,
            ...item.metadata
          }
        })
      } catch (error) {
        console.error(`Batch moderation failed for item ${item.id}:`, error)
        
        results.push({
          id: `batch_error_${item.id}`,
          timestamp: new Date(),
          contentType: item.type,
          content: item.content,
          isNSFW: false,
          confidence: 0,
          categories: {
            explicit: 0,
            suggestive: 0,
            violent: 0,
            hate: 0,
            other: 0
          },
          riskLevel: 'low',
          edgeCases: ['batch_processing_error'],
          recommendations: ['Manual review required'],
          modelUsed: 'batch_error',
          processingTime: 0,
          metadata: item.metadata
        })
      }
    }

    // Execute callback if provided
    if (batchRequest.callback) {
      batchRequest.callback(results)
    }

    return results
  }

  /**
   * Get moderation statistics
   */
  getStatistics(): ModerationStats {
    return { ...this.stats }
  }

  /**
   * Get model performance
   */
  getModelPerformance(): Record<string, any> {
    return Object.fromEntries(this.modelPerformance)
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AIModerationConfig>): void {
    this.config = { ...this.config, ...config }
    console.log('AI moderation configuration updated:', this.config)
  }

  /**
   * Get configuration
   */
  getConfig(): AIModerationConfig {
    return { ...this.config }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.resultCache.clear()
    console.log('AI moderation cache cleared')
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    queueSize: number
    isProcessing: boolean
    cacheSize: number
  } {
    return {
      queueSize: this.processingQueue.length,
      isProcessing: this.isProcessing,
      cacheSize: this.resultCache.size
    }
  }
}

// Export singleton instance
export const aiContentModeration = new AIContentModeration()

// Export types and utilities
export { AIContentModeration }
export type { AIModerationConfig, ModerationResult, BatchModerationRequest, ModerationStats }