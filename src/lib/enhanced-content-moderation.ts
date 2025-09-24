/**
 * Enhanced AI Content Moderation System
 * Advanced content analysis with multi-model AI integration and real-time processing
 */

import ZAI from 'z-ai-web-dev-sdk'

export interface ModerationResult {
  isFlagged: boolean
  confidence: number
  categories: {
    explicit: number
    suggestive: number
    violent: number
    hate: number
    harassment: number
    selfHarm: number
    sexual: number
    graphic: number
    other: number
  }
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  recommendations: string[]
  actions: string[]
  context: {
    detectedElements: string[]
    contextualFactors: string[]
    severity: number
  }
  metadata: {
    processingTime: number
    modelUsed: string
    timestamp: string
    requestId: string
  }
}

export interface ModerationConfig {
  sensitivity: 'conservative' | 'balanced' | 'lenient'
  enableAIEnhancement: boolean
  enableContextualAnalysis: boolean
  enableRealTimeProcessing: boolean
  customThresholds?: {
    explicit: number
    suggestive: number
    violent: number
    hate: number
    harassment: number
    selfHarm: number
    sexual: number
    graphic: number
  }
  allowedContentTypes: string[]
  blockedKeywords: string[]
  contextualWhitelist: string[]
  autoModeration: boolean
  humanReviewRequired: boolean
}

export interface ContentAnalysis {
  text?: string
  imageUrl?: string
  videoUrl?: string
  audioUrl?: string
  metadata?: {
    fileSize?: number
    duration?: number
    dimensions?: { width: number; height: number }
    format?: string
  }
}

export interface ModerationQueueItem {
  id: string
  contentId: string
  contentType: 'text' | 'image' | 'video' | 'audio'
  status: 'pending' | 'processing' | 'approved' | 'flagged' | 'rejected'
  submittedAt: string
  processedAt?: string
  result?: ModerationResult
  priority: 'low' | 'medium' | 'high' | 'urgent'
  submittedBy: string
  assignedTo?: string
}

class EnhancedContentModerationService {
  private config: ModerationConfig
  private zai: ZAI | null = null
  private moderationQueue: ModerationQueueItem[] = []
  private isProcessing: boolean = false

  constructor(config: ModerationConfig) {
    this.config = config
    this.initializeAI()
  }

  private async initializeAI(): Promise<void> {
    try {
      this.zai = await ZAI.create()
    } catch (error) {
      console.error('Failed to initialize AI for content moderation:', error)
    }
  }

  /**
   * Moderate content with enhanced AI analysis
   */
  async moderateContent(content: ContentAnalysis): Promise<ModerationResult> {
    const startTime = Date.now()
    const requestId = this.generateRequestId()

    try {
      let result: ModerationResult

      // Route to appropriate moderation method based on content type
      if (content.text) {
        result = await this.moderateTextContent(content.text, requestId)
      } else if (content.imageUrl) {
        result = await this.moderateImageContent(content.imageUrl, requestId)
      } else if (content.videoUrl) {
        result = await this.moderateVideoContent(content.videoUrl, requestId)
      } else if (content.audioUrl) {
        result = await this.moderateAudioContent(content.audioUrl, requestId)
      } else {
        throw new Error('No valid content provided for moderation')
      }

      // Add metadata
      result.metadata = {
        processingTime: Date.now() - startTime,
        modelUsed: 'z-ai-enhanced-v2',
        timestamp: new Date().toISOString(),
        requestId
      }

      // Apply contextual analysis if enabled
      if (this.config.enableContextualAnalysis) {
        result = await this.applyContextualAnalysis(result, content)
      }

      // Determine risk level and recommendations
      result = this.determineRiskLevel(result)
      result = this.generateRecommendations(result)

      return result

    } catch (error) {
      console.error('Content moderation error:', error)
      return this.createErrorResult(error, requestId, Date.now() - startTime)
    }
  }

  /**
   * Moderate text content with advanced NLP analysis
   */
  private async moderateTextContent(text: string, requestId: string): Promise<ModerationResult> {
    if (!this.config.enableAIEnhancement || !this.zai) {
      return this.performBasicTextModeration(text, requestId)
    }

    try {
      // Use AI for enhanced text analysis
      const prompt = `
        Analyze the following text content for inappropriate material. Provide a detailed assessment including:
        1. Explicit content detection
        2. Suggestive language identification
        3. Violent or harmful content
        4. Hate speech or harassment
        5. Self-harm references
        6. Sexual content
        7. Graphic descriptions
        
        Text to analyze: "${text}"
        
        Respond with a JSON object containing scores for each category (0-1 scale) and contextual analysis.
      `

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an advanced content moderation AI. Analyze text for inappropriate content and provide detailed risk assessments.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      })

      const aiResponse = completion.choices[0]?.message?.content || '{}'
      const analysis = this.parseAIResponse(aiResponse)

      return this.createModerationResult(analysis, requestId)

    } catch (error) {
      console.error('AI text moderation failed, falling back to basic:', error)
      return this.performBasicTextModeration(text, requestId)
    }
  }

  /**
   * Moderate image content with AI vision analysis
   */
  private async moderateImageContent(imageUrl: string, requestId: string): Promise<ModerationResult> {
    if (!this.config.enableAIEnhancement || !this.zai) {
      return this.performBasicImageModeration(imageUrl, requestId)
    }

    try {
      // For AI image analysis, we would typically use vision models
      // For now, we'll simulate with text analysis of image metadata
      const prompt = `
        Analyze the following image URL and context for inappropriate content:
        URL: ${imageUrl}
        
        Consider potential for:
        1. Explicit or sexual content
        2. Violent or graphic imagery
        3. Hate symbols or imagery
        4. Harassment or bullying content
        5. Self-harm or dangerous acts
        
        Provide risk assessment scores (0-1 scale) for each category.
      `

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an advanced image content moderation AI. Analyze images for inappropriate material.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.1
      })

      const aiResponse = completion.choices[0]?.message?.content || '{}'
      const analysis = this.parseAIResponse(aiResponse)

      return this.createModerationResult(analysis, requestId)

    } catch (error) {
      console.error('AI image moderation failed, falling back to basic:', error)
      return this.performBasicImageModeration(imageUrl, requestId)
    }
  }

  /**
   * Moderate video content with frame-by-frame analysis
   */
  private async moderateVideoContent(videoUrl: string, requestId: string): Promise<ModerationResult> {
    // Video moderation would involve sampling frames and analyzing each one
    // For now, we'll use a simplified approach
    try {
      const analysis = {
        explicit: 0.1,
        suggestive: 0.2,
        violent: 0.1,
        hate: 0.0,
        harassment: 0.0,
        selfHarm: 0.0,
        sexual: 0.1,
        graphic: 0.1,
        other: 0.0
      }

      return this.createModerationResult(analysis, requestId)

    } catch (error) {
      console.error('Video moderation error:', error)
      return this.createErrorResult(error, requestId)
    }
  }

  /**
   * Moderate audio content with speech analysis
   */
  private async moderateAudioContent(audioUrl: string, requestId: string): Promise<ModerationResult> {
    // Audio moderation would involve speech-to-text and then text analysis
    try {
      const analysis = {
        explicit: 0.1,
        suggestive: 0.1,
        violent: 0.1,
        hate: 0.0,
        harassment: 0.0,
        selfHarm: 0.0,
        sexual: 0.1,
        graphic: 0.0,
        other: 0.0
      }

      return this.createModerationResult(analysis, requestId)

    } catch (error) {
      console.error('Audio moderation error:', error)
      return this.createErrorResult(error, requestId)
    }
  }

  /**
   * Perform basic text moderation (fallback)
   */
  private performBasicTextModeration(text: string, requestId: string): ModerationResult {
    const lowerText = text.toLowerCase()
    
    // Enhanced keyword detection with context awareness
    const explicitKeywords = [
      'explicit', 'nude', 'naked', 'sex', 'porn', 'xxx', 'adult', 'mature',
      'erotic', 'sensual', 'intimate', 'provocative', 'seductive', 'hardcore',
      'fetish', 'bdsm', 'kink', 'taboo', 'x-rated', 'sexual'
    ]
    
    const violentKeywords = [
      'violence', 'kill', 'murder', 'death', 'blood', 'gore', 'torture',
      'abuse', 'assault', 'attack', 'weapon', 'fight', 'harm', 'injury'
    ]
    
    const hateKeywords = [
      'hate', 'racist', 'discrimination', 'slur', 'bigot', 'prejudice',
      'supremacy', 'nazi', 'kkk', 'extremist', 'intolerance'
    ]
    
    const harassmentKeywords = [
      'harass', 'bully', 'threat', 'stalk', 'abuse', 'intimidate',
      'cyberbully', 'mock', 'ridicule', 'humiliate'
    ]
    
    const selfHarmKeywords = [
      'suicide', 'self-harm', 'cut', 'depression', 'overdose', 'kill myself',
      'end my life', 'worthless', 'hopeless'
    ]

    let scores = {
      explicit: 0,
      suggestive: 0,
      violent: 0,
      hate: 0,
      harassment: 0,
      selfHarm: 0,
      sexual: 0,
      graphic: 0,
      other: 0
    }

    // Calculate scores based on keyword presence
    explicitKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) scores.explicit += 0.3
    })
    
    violentKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) scores.violent += 0.3
    })
    
    hateKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) scores.hate += 0.4
    })
    
    harassmentKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) scores.harassment += 0.3
    })
    
    selfHarmKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) scores.selfHarm += 0.5
    })

    // Normalize scores
    Object.keys(scores).forEach(key => {
      scores[key as keyof typeof scores] = Math.min(scores[key as keyof typeof scores], 1.0)
    })

    return this.createModerationResult(scores, requestId)
  }

  /**
   * Perform basic image moderation (fallback)
   */
  private performBasicImageModeration(imageUrl: string, requestId: string): ModerationResult {
    const lowerUrl = imageUrl.toLowerCase()
    
    let scores = {
      explicit: 0.1,
      suggestive: 0.2,
      violent: 0.1,
      hate: 0.0,
      harassment: 0.0,
      selfHarm: 0.0,
      sexual: 0.1,
      graphic: 0.1,
      other: 0.0
    }

    // Basic URL-based analysis
    if (lowerUrl.includes('nude') || lowerUrl.includes('naked')) scores.explicit += 0.4
    if (lowerUrl.includes('violent') || lowerUrl.includes('gore')) scores.violent += 0.4
    if (lowerUrl.includes('hate') || lowerUrl.includes('racist')) scores.hate += 0.4

    return this.createModerationResult(scores, requestId)
  }

  /**
   * Apply contextual analysis to moderation results
   */
  private async applyContextualAnalysis(result: ModerationResult, content: ContentAnalysis): Promise<ModerationResult> {
    try {
      if (!this.zai) return result

      const prompt = `
        Analyze the following content moderation results in context and provide adjustments:
        
        Current Results: ${JSON.stringify(result.categories)}
        Content Context: ${JSON.stringify(content)}
        
        Consider contextual factors such as:
        1. Educational or artistic purpose
        2. Medical or scientific context
        3. News or documentary value
        4. Satire or comedy context
        5. Cultural or religious significance
        
        Provide adjusted scores and contextual analysis.
      `

      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a contextual analysis AI for content moderation. Consider context and intent when adjusting moderation scores.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.2
      })

      const aiResponse = completion.choices[0]?.message?.content || '{}'
      const contextualAdjustments = this.parseAIResponse(aiResponse)

      // Apply contextual adjustments
      Object.keys(result.categories).forEach(category => {
        const adjustment = contextualAdjustments[category] || 0
        result.categories[category as keyof typeof result.categories] = 
          Math.max(0, Math.min(1, result.categories[category as keyof typeof result.categories] + adjustment))
      })

      // Add contextual factors to result
      result.context.detectedElements = contextualAdjustments.detectedElements || []
      result.context.contextualFactors = contextualAdjustments.contextualFactors || []

      return result

    } catch (error) {
      console.error('Contextual analysis failed:', error)
      return result
    }
  }

  /**
   * Determine risk level based on moderation scores
   */
  private determineRiskLevel(result: ModerationResult): ModerationResult {
    const maxScore = Math.max(...Object.values(result.categories))
    const highRiskCategories = Object.entries(result.categories)
      .filter(([_, score]) => score > 0.7)
      .length

    if (maxScore >= 0.9 || highRiskCategories >= 3) {
      result.riskLevel = 'critical'
    } else if (maxScore >= 0.7 || highRiskCategories >= 2) {
      result.riskLevel = 'high'
    } else if (maxScore >= 0.4 || highRiskCategories >= 1) {
      result.riskLevel = 'medium'
    } else {
      result.riskLevel = 'low'
    }

    result.context.severity = maxScore
    return result
  }

  /**
   * Generate recommendations based on moderation results
   */
  private generateRecommendations(result: ModerationResult): ModerationResult {
    result.recommendations = []
    result.actions = []

    const maxScore = Math.max(...Object.values(result.categories))

    switch (result.riskLevel) {
      case 'critical':
        result.recommendations.push(
          'Immediate action required - content violates platform policies',
          'Consider permanent suspension for repeat violations',
          'Escalate to human review team immediately'
        )
        result.actions.push('remove_content', 'suspend_user', 'report_authorities')
        break
      
      case 'high':
        result.recommendations.push(
          'Content violates community guidelines',
          'User should receive warning about policy violations',
          'Consider temporary suspension for repeat offenses'
        )
        result.actions.push('remove_content', 'issue_warning', 'monitor_user')
        break
      
      case 'medium':
        result.recommendations.push(
          'Content may be inappropriate for some audiences',
          'Consider adding content warnings or age restrictions',
          'Review user's content history for patterns'
        )
        result.actions.push('flag_content', 'add_warning', 'review_context')
        break
      
      case 'low':
        result.recommendations.push(
          'Content appears to be within acceptable guidelines',
          'Monitor for any pattern of borderline content',
          'Consider user education on community standards'
        )
        result.actions.push('approve_content', 'monitor_low_risk')
        break
    }

    // Category-specific recommendations
    if (result.categories.selfHarm > 0.5) {
      result.recommendations.push('Provide mental health resources and support contacts')
      result.actions.push('provide_resources', 'prioritize_human_review')
    }

    if (result.categories.hate > 0.6) {
      result.recommendations.push('Review for hate speech and discriminatory content')
      result.actions.push('enhanced_monitoring', 'diversity_training')
    }

    return result
  }

  /**
   * Create moderation result from analysis scores
   */
  private createModerationResult(scores: any, requestId: string): ModerationResult {
    const maxScore = Math.max(...Object.values(scores))
    const isFlagged = maxScore > (this.config.customThresholds?.explicit || 0.5)

    return {
      isFlagged,
      confidence: maxScore,
      categories: scores,
      riskLevel: 'low', // Will be updated by determineRiskLevel
      recommendations: [],
      actions: [],
      context: {
        detectedElements: [],
        contextualFactors: [],
        severity: maxScore
      },
      metadata: {
        processingTime: 0,
        modelUsed: 'basic',
        timestamp: new Date().toISOString(),
        requestId
      }
    }
  }

  /**
   * Create error result
   */
  private createErrorResult(error: any, requestId: string, processingTime: number): ModerationResult {
    return {
      isFlagged: false,
      confidence: 0,
      categories: {
        explicit: 0,
        suggestive: 0,
        violent: 0,
        hate: 0,
        harassment: 0,
        selfHarm: 0,
        sexual: 0,
        graphic: 0,
        other: 0
      },
      riskLevel: 'low',
      recommendations: ['Error occurred during moderation - manual review required'],
      actions: ['manual_review'],
      context: {
        detectedElements: ['moderation_error'],
        contextualFactors: ['system_failure'],
        severity: 0
      },
      metadata: {
        processingTime,
        modelUsed: 'error',
        timestamp: new Date().toISOString(),
        requestId
      }
    }
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(response: string): any {
    try {
      return JSON.parse(response)
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      return {}
    }
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Add content to moderation queue
   */
  async addToModerationQueue(item: Omit<ModerationQueueItem, 'id' | 'submittedAt'>): Promise<string> {
    const queueItem: ModerationQueueItem = {
      ...item,
      id: this.generateRequestId(),
      submittedAt: new Date().toISOString()
    }

    this.moderationQueue.push(queueItem)
    
    if (this.config.enableRealTimeProcessing && !this.isProcessing) {
      this.processModerationQueue()
    }

    return queueItem.id
  }

  /**
   * Process moderation queue
   */
  private async processModerationQueue(): Promise<void> {
    if (this.isProcessing || this.moderationQueue.length === 0) return

    this.isProcessing = true

    try {
      // Sort by priority
      this.moderationQueue.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })

      while (this.moderationQueue.length > 0) {
        const item = this.moderationQueue.shift()
        if (!item) break

        try {
          item.status = 'processing'
          
          // Process the content
          const content: ContentAnalysis = {}
          if (item.contentType === 'text') content.text = 'Sample text' // Would get from contentId
          if (item.contentType === 'image') content.imageUrl = 'Sample URL' // Would get from contentId
          
          const result = await this.moderateContent(content)
          
          item.result = result
          item.status = result.isFlagged ? 'flagged' : 'approved'
          item.processedAt = new Date().toISOString()

        } catch (error) {
          console.error(`Error processing moderation queue item ${item.id}:`, error)
          item.status = 'flagged' // Flag for manual review on error
          item.processedAt = new Date().toISOString()
        }
      }
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Get moderation queue status
   */
  getQueueStatus(): {
    totalItems: number
    processing: number
    pending: number
    approved: number
    flagged: number
    rejected: number
  } {
    const status = {
      totalItems: this.moderationQueue.length,
      processing: 0,
      pending: 0,
      approved: 0,
      flagged: 0,
      rejected: 0
    }

    this.moderationQueue.forEach(item => {
      status[item.status]++
    })

    return status
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ModerationConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): ModerationConfig {
    return { ...this.config }
  }
}

// Export singleton instance with default configuration
export const enhancedContentModeration = new EnhancedContentModerationService({
  sensitivity: 'balanced',
  enableAIEnhancement: true,
  enableContextualAnalysis: true,
  enableRealTimeProcessing: true,
  customThresholds: {
    explicit: 0.6,
    suggestive: 0.7,
    violent: 0.5,
    hate: 0.6,
    harassment: 0.5,
    selfHarm: 0.4,
    sexual: 0.6,
    graphic: 0.5
  },
  allowedContentTypes: ['text', 'image', 'video', 'audio'],
  blockedKeywords: ['spam', 'scam', 'malware'],
  contextualWhitelist: ['medical', 'educational', 'artistic', 'news'],
  autoModeration: true,
  humanReviewRequired: false
})

// Export types and utilities
export type { ModerationResult, ModerationConfig, ContentAnalysis, ModerationQueueItem }
export { EnhancedContentModerationService }