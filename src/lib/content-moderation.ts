/**
 * Enhanced Content Moderation System
 * Handles NSFW content detection with edge case support
 */

export interface ModerationResult {
  isNSFW: boolean
  confidence: number
  categories: {
    explicit: number
    suggestive: number
    violent: number
    hate: number
    other: number
  }
  edgeCases: string[]
  recommendations: string[]
}

export interface ModerationConfig {
  strictness: 'low' | 'medium' | 'high' | 'strict'
  enableEdgeCaseDetection: boolean
  customThresholds?: {
    explicit: number
    suggestive: number
    violent: number
    hate: number
  }
}

class ContentModerationService {
  private config: ModerationConfig

  constructor(config: ModerationConfig) {
    this.config = config
  }

  /**
   * Moderate text content for NSFW detection
   */
  async moderateText(text: string): Promise<ModerationResult> {
    // Simulate AI content analysis
    const analysis = await this.analyzeTextContent(text)
    
    return {
      isNSFW: this.determineNSFWStatus(analysis),
      confidence: analysis.confidence,
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis)
    }
  }

  /**
   * Moderate image content for NSFW detection
   */
  async moderateImage(imageUrl: string): Promise<ModerationResult> {
    // Simulate image content analysis
    const analysis = await this.analyzeImageContent(imageUrl)
    
    return {
      isNSFW: this.determineNSFWStatus(analysis),
      confidence: analysis.confidence,
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis)
    }
  }

  /**
   * Moderate video content for NSFW detection
   */
  async moderateVideo(videoUrl: string): Promise<ModerationResult> {
    // Simulate video content analysis (frame by frame)
    const analysis = await this.analyzeVideoContent(videoUrl)
    
    return {
      isNSFW: this.determineNSFWStatus(analysis),
      confidence: analysis.confidence,
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis)
    }
  }

  /**
   * Get context reduction factor for edge case keywords
   */
  private getContextReductionFactor(keyword: string): number {
    const reductionFactors: { [key: string]: number } = {
      'artistic': 0.4,
      'medical': 0.2,
      'educational': 0.3,
      'fitness': 0.6,
      'yoga': 0.7,
      'dance': 0.6,
      'modeling': 0.5,
      'fashion': 0.5,
      'beauty': 0.6,
      'health': 0.5,
      'wellness': 0.5,
      'therapy': 0.3,
      'anatomy': 0.25,
      'clinical': 0.2,
      'research': 0.3,
      'academic': 0.3,
      'cultural': 0.4,
      'ceremony': 0.4
    }
    
    return reductionFactors[keyword] || 0.7
  }

  /**
   * Analyze text content for NSFW elements
   */
  private async analyzeTextContent(text: string): Promise<any> {
    const lowerText = text.toLowerCase()
    
    // Enhanced keyword detection with context awareness
    const explicitKeywords = [
      'explicit', 'nude', 'naked', 'sex', 'porn', 'xxx', 'adult', 'mature',
      'erotic', 'sensual', 'intimate', 'provocative', 'seductive', 'hardcore',
      'fetish', 'bdsm', 'kink', 'taboo', 'x-rated'
    ]
    
    const suggestiveKeywords = [
      'sexy', 'hot', 'tempting', 'alluring', 'attractive', 'beautiful',
      'gorgeous', 'stunning', 'bikini', 'lingerie', 'underwear', 'swimwear',
      'curvy', 'voluptuous', 'seductive', 'teasing', 'flirtatious'
    ]
    
    // Enhanced edge case keywords that need context analysis
    const edgeCaseKeywords = [
      'artistic', 'medical', 'educational', 'fitness', 'yoga', 'dance',
      'modeling', 'fashion', 'beauty', 'health', 'wellness', 'therapy',
      'anatomy', 'clinical', 'research', 'academic', 'cultural', 'ceremony'
    ]

    let explicitScore = 0
    let suggestiveScore = 0
    let edgeCases: string[] = []

    // Calculate scores based on keyword presence with enhanced context
    explicitKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        explicitScore += 0.25
      }
    })

    suggestiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        suggestiveScore += 0.15
      }
    })

    // Enhanced edge case detection with context analysis
    edgeCaseKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        edgeCases.push(`Contextual keyword detected: ${keyword}`)
        // Apply context-aware score reduction
        explicitScore *= this.getContextReductionFactor(keyword)
        suggestiveScore *= this.getContextReductionFactor(keyword)
      }
    })

    // Advanced edge case detection based on phrase patterns
    const edgeCasePhrases = [
      { pattern: 'artistic nude', reduction: 0.3, context: 'Artistic expression' },
      { pattern: 'medical demonstration', reduction: 0.2, context: 'Medical education' },
      { pattern: 'fitness routine', reduction: 0.4, context: 'Health and fitness' },
      { pattern: 'fashion show', reduction: 0.5, context: 'Fashion industry' },
      { pattern: 'cultural ceremony', reduction: 0.4, context: 'Cultural heritage' },
      { pattern: 'educational content', reduction: 0.3, context: 'Educational purpose' }
    ]

    edgeCasePhrases.forEach(phrase => {
      if (lowerText.includes(phrase.pattern)) {
        edgeCases.push(`${phrase.context} detected: ${phrase.pattern}`)
        explicitScore *= phrase.reduction
        suggestiveScore *= phrase.reduction
      }
    })

    // Detect contextual modifiers
    const contextualModifiers = [
      { pattern: 'not sexual', reduction: 0.2 },
      { pattern: 'professional', reduction: 0.3 },
      { pattern: 'therapeutic', reduction: 0.25 },
      { pattern: 'scientific', reduction: 0.2 },
      { pattern: 'historical', reduction: 0.3 }
    ]

    contextualModifiers.forEach(modifier => {
      if (lowerText.includes(modifier.pattern)) {
        edgeCases.push(`Contextual modifier: ${modifier.pattern}`)
        explicitScore *= modifier.reduction
        suggestiveScore *= modifier.reduction
      }
    })

    // Detect negation patterns
    const negationPatterns = [
      { pattern: 'no nudity', reduction: 0.1 },
      { pattern: 'not explicit', reduction: 0.15 },
      { pattern: 'safe for work', reduction: 0.1 },
      { pattern: 'sfw only', reduction: 0.1 }
    ]

    negationPatterns.forEach(pattern => {
      if (lowerText.includes(pattern.pattern)) {
        edgeCases.push(`Negation pattern: ${pattern.pattern}`)
        explicitScore *= pattern.reduction
        suggestiveScore *= pattern.reduction
      }
    })

    // Normalize scores with enhanced bounds checking
    explicitScore = Math.min(explicitScore, 1.0)
    suggestiveScore = Math.min(suggestiveScore, 1.0)

    const confidence = Math.max(explicitScore, suggestiveScore)

    return {
      confidence,
      categories: {
        explicit: explicitScore,
        suggestive: suggestiveScore,
        violent: 0,
        hate: 0,
        other: 0
      },
      edgeCases
    }
  }

  /**
   * Analyze image content for NSFW elements
   */
  private async analyzeImageContent(imageUrl: string): Promise<any> {
    // Simulate image analysis with enhanced edge case detection
    const analysis = {
      confidence: 0.5,
      categories: {
        explicit: 0.2,
        suggestive: 0.3,
        violent: 0,
        hate: 0,
        other: 0
      },
      edgeCases: [] as string[]
    }

    // Enhanced context detection with more sophisticated patterns
    const contextPatterns = [
      {
        patterns: ['bikini', 'swimwear', 'beach', 'pool', 'vacation'],
        score: 0.6,
        context: 'Swimwear/Beach context detected',
        reduction: 0.7
      },
      {
        patterns: ['fitness', 'yoga', 'workout', 'gym', 'exercise'],
        score: 0.4,
        context: 'Fitness/Wellness context detected',
        reduction: 0.6
      },
      {
        patterns: ['fashion', 'modeling', 'runway', 'designer', 'couture'],
        score: 0.5,
        context: 'Fashion/Modeling context detected',
        reduction: 0.5
      },
      {
        patterns: ['artistic', 'sculpture', 'painting', 'gallery', 'museum'],
        score: 0.3,
        context: 'Artistic context detected',
        reduction: 0.3
      },
      {
        patterns: ['medical', 'educational', 'anatomy', 'clinical', 'textbook'],
        score: 0.2,
        context: 'Medical/Educational context detected',
        reduction: 0.2
      },
      {
        patterns: ['cultural', 'ceremony', 'traditional', 'heritage', 'ritual'],
        score: 0.4,
        context: 'Cultural context detected',
        reduction: 0.4
      },
      {
        patterns: ['professional', 'business', 'corporate', 'formal'],
        score: 0.3,
        context: 'Professional context detected',
        reduction: 0.5
      }
    ]

    // Check each context pattern
    contextPatterns.forEach(context => {
      const hasPattern = context.patterns.some(pattern => 
        imageUrl.toLowerCase().includes(pattern)
      )
      
      if (hasPattern) {
        analysis.categories.suggestive = context.score
        analysis.confidence = context.score
        analysis.edgeCases.push(context.context)
        
        // Apply context reduction
        analysis.categories.explicit *= context.reduction
        analysis.categories.suggestive *= context.reduction
      }
    })

    // Enhanced edge case detection for specific scenarios
    const edgeCaseScenarios = [
      {
        condition: () => imageUrl.toLowerCase().includes('artistic') && 
                     imageUrl.toLowerCase().includes('nude'),
        action: () => {
          analysis.categories.explicit *= 0.2
          analysis.categories.suggestive *= 0.3
          analysis.edgeCases.push('Artistic nudity context with enhanced sensitivity')
        }
      },
      {
        condition: () => imageUrl.toLowerCase().includes('medical') && 
                     imageUrl.toLowerCase().includes('demonstration'),
        action: () => {
          analysis.categories.explicit *= 0.1
          analysis.categories.suggestive *= 0.2
          analysis.edgeCases.push('Medical demonstration with high sensitivity')
        }
      },
      {
        condition: () => imageUrl.toLowerCase().includes('fitness') && 
                     imageUrl.toLowerCase().includes('competition'),
        action: () => {
          analysis.categories.suggestive *= 0.5
          analysis.edgeCases.push('Fitness competition context')
        }
      },
      {
        condition: () => imageUrl.toLowerCase().includes('fashion') && 
                     imageUrl.toLowerCase().includes('lingerie'),
        action: () => {
          analysis.categories.suggestive *= 0.6
          analysis.edgeCases.push('Fashion lingerie context')
        }
      }
    ]

    // Apply edge case scenarios
    edgeCaseScenarios.forEach(scenario => {
      if (scenario.condition()) {
        scenario.action()
      }
    })

    // Detect multiple overlapping contexts for enhanced accuracy
    const contextCount = contextPatterns.filter(context => 
      context.patterns.some(pattern => imageUrl.toLowerCase().includes(pattern))
    ).length

    if (contextCount > 1) {
      analysis.edgeCases.push(`Multiple contexts detected (${contextCount}) - enhanced analysis applied`)
      analysis.categories.explicit *= 0.8
      analysis.categories.suggestive *= 0.8
    }

    return analysis
  }

  /**
   * Analyze video content for NSFW elements
   */
  private async analyzeVideoContent(videoUrl: string): Promise<any> {
    // Simulate video analysis (sample frames)
    const frameCount = 10 // Sample 10 frames
    let totalExplicit = 0
    let totalSuggestive = 0
    let edgeCases: string[] = []

    for (let i = 0; i < frameCount; i++) {
      const frameAnalysis = await this.analyzeImageContent(`${videoUrl}-frame-${i}`)
      totalExplicit += frameAnalysis.categories.explicit
      totalSuggestive += frameAnalysis.categories.suggestive
      edgeCases.push(...frameAnalysis.edgeCases)
    }

    // Average scores across frames
    const avgExplicit = totalExplicit / frameCount
    const avgSuggestive = totalSuggestive / frameCount

    // Remove duplicate edge cases
    edgeCases = [...new Set(edgeCases)]

    return {
      confidence: Math.max(avgExplicit, avgSuggestive),
      categories: {
        explicit: avgExplicit,
        suggestive: avgSuggestive,
        violent: 0,
        hate: 0,
        other: 0
      },
      edgeCases
    }
  }

  /**
   * Determine NSFW status based on analysis and config
   */
  private determineNSFWStatus(analysis: any): boolean {
    const thresholds = this.config.customThresholds || {
      explicit: this.config.strictness === 'strict' ? 0.3 : 
                this.config.strictness === 'high' ? 0.5 : 
                this.config.strictness === 'medium' ? 0.7 : 0.8,
      suggestive: this.config.strictness === 'strict' ? 0.5 : 
                   this.config.strictness === 'high' ? 0.6 : 
                   this.config.strictness === 'medium' ? 0.7 : 0.8
    }

    // If edge cases are detected and enabled, be more lenient
    if (this.config.enableEdgeCaseDetection && analysis.edgeCases.length > 0) {
      return analysis.categories.explicit > thresholds.explicit * 1.2 || 
             analysis.categories.suggestive > thresholds.suggestive * 1.2
    }

    return analysis.categories.explicit > thresholds.explicit || 
           analysis.categories.suggestive > thresholds.suggestive
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = []

    if (analysis.categories.explicit > 0.7) {
      recommendations.push('Content is highly explicit - consider strict filtering')
    }

    if (analysis.categories.suggestive > 0.6) {
      recommendations.push('Content is suggestive - apply age restrictions')
    }

    if (analysis.edgeCases.includes('Artistic context detected')) {
      recommendations.push('Artistic context - consider cultural sensitivity')
    }

    if (analysis.edgeCases.includes('Medical/Educational context detected')) {
      recommendations.push('Educational content - ensure proper labeling')
    }

    if (analysis.edgeCases.includes('Fitness/Wellness context detected')) {
      recommendations.push('Fitness content - generally acceptable with proper context')
    }

    if (analysis.confidence > 0.8) {
      recommendations.push('High confidence detection - results are reliable')
    } else if (analysis.confidence < 0.5) {
      recommendations.push('Low confidence detection - consider manual review')
    }

    return recommendations
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

// Export singleton instance
export const contentModeration = new ContentModerationService({
  strictness: 'medium',
  enableEdgeCaseDetection: true,
  customThresholds: {
    explicit: 0.6,
    suggestive: 0.7,
    violent: 0.8,
    hate: 0.8
  }
})

// Export types and utilities
export { ContentModerationService }
export type { ModerationConfig, ModerationResult }