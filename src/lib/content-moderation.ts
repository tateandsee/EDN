/**
 * Enhanced Content Moderation System
<<<<<<< HEAD
 * Handles NSFW content detection with edge case support
=======
 * Handles NSFW content detection with support for semi-nude and nude content
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
 */

export interface ModerationResult {
  isNSFW: boolean
  confidence: number
<<<<<<< HEAD
  categories: {
    explicit: number
    suggestive: number
=======
  contentLevel: 'SAFE' | 'SUGGESTIVE' | 'SEMI_NUDE' | 'NUDE' | 'EXPLICIT'
  nudityLevel: 'NONE' | 'IMPLIED' | 'PARTIAL' | 'FULL' | 'SEXUAL'
  categories: {
    explicit: number
    suggestive: number
    semiNude: number
    nude: number
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    violent: number
    hate: number
    other: number
  }
  edgeCases: string[]
  recommendations: string[]
<<<<<<< HEAD
=======
  artisticNudity: boolean
  adultContent: boolean
  suggestiveContent: boolean
  moderationStatus: 'APPROVED' | 'PENDING' | 'FLAGGED' | 'REJECTED'
  // New gender and age restriction fields
  gender: 'MALE' | 'FEMALE' | 'MIXED' | 'UNKNOWN'
  ageAppropriate: boolean
  hasRestrictedContent: boolean
  restrictedContentTypes: string[]
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
}

export interface ModerationConfig {
  strictness: 'low' | 'medium' | 'high' | 'strict'
  enableEdgeCaseDetection: boolean
<<<<<<< HEAD
  customThresholds?: {
    explicit: number
    suggestive: number
=======
  allowSemiNude: boolean
  allowNude: boolean
  allowArtisticNudity: boolean
  allowAdultContent: boolean
  // New gender and content restrictions
  allowMaleContent: boolean
  allowFemaleContent: boolean
  allowChildContent: boolean
  allowAnimalContent: boolean
  minAge: number
  maxAge: number
  customThresholds?: {
    explicit: number
    suggestive: number
    semiNude: number
    nude: number
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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
<<<<<<< HEAD
   * Moderate text content for NSFW detection
=======
   * Moderate text content for NSFW detection with new content guidelines
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
   */
  async moderateText(text: string): Promise<ModerationResult> {
    // Simulate AI content analysis
    const analysis = await this.analyzeTextContent(text)
    
    return {
      isNSFW: this.determineNSFWStatus(analysis),
      confidence: analysis.confidence,
<<<<<<< HEAD
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis)
=======
      contentLevel: this.determineContentLevel(analysis),
      nudityLevel: this.determineNudityLevel(analysis),
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis),
      artisticNudity: analysis.artisticNudity,
      adultContent: analysis.adultContent,
      suggestiveContent: analysis.suggestiveContent,
      moderationStatus: this.determineModerationStatus(analysis),
      gender: analysis.gender,
      ageAppropriate: analysis.ageAppropriate,
      hasRestrictedContent: analysis.hasRestrictedContent,
      restrictedContentTypes: analysis.restrictedContentTypes
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    }
  }

  /**
<<<<<<< HEAD
   * Moderate image content for NSFW detection
=======
   * Moderate image content for NSFW detection with new content guidelines
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
   */
  async moderateImage(imageUrl: string): Promise<ModerationResult> {
    // Simulate image content analysis
    const analysis = await this.analyzeImageContent(imageUrl)
    
    return {
      isNSFW: this.determineNSFWStatus(analysis),
      confidence: analysis.confidence,
<<<<<<< HEAD
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis)
=======
      contentLevel: this.determineContentLevel(analysis),
      nudityLevel: this.determineNudityLevel(analysis),
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis),
      artisticNudity: analysis.artisticNudity,
      adultContent: analysis.adultContent,
      suggestiveContent: analysis.suggestiveContent,
      moderationStatus: this.determineModerationStatus(analysis),
      gender: analysis.gender,
      ageAppropriate: analysis.ageAppropriate,
      hasRestrictedContent: analysis.hasRestrictedContent,
      restrictedContentTypes: analysis.restrictedContentTypes
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    }
  }

  /**
<<<<<<< HEAD
   * Moderate video content for NSFW detection
=======
   * Moderate video content for NSFW detection with new content guidelines
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
   */
  async moderateVideo(videoUrl: string): Promise<ModerationResult> {
    // Simulate video content analysis (frame by frame)
    const analysis = await this.analyzeVideoContent(videoUrl)
    
    return {
      isNSFW: this.determineNSFWStatus(analysis),
      confidence: analysis.confidence,
<<<<<<< HEAD
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis)
=======
      contentLevel: this.determineContentLevel(analysis),
      nudityLevel: this.determineNudityLevel(analysis),
      categories: analysis.categories,
      edgeCases: analysis.edgeCases,
      recommendations: this.generateRecommendations(analysis),
      artisticNudity: analysis.artisticNudity,
      adultContent: analysis.adultContent,
      suggestiveContent: analysis.suggestiveContent,
      moderationStatus: this.determineModerationStatus(analysis),
      gender: analysis.gender,
      ageAppropriate: analysis.ageAppropriate,
      hasRestrictedContent: analysis.hasRestrictedContent,
      restrictedContentTypes: analysis.restrictedContentTypes
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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
<<<<<<< HEAD
   * Analyze text content for NSFW elements
=======
   * Analyze text content for NSFW elements with new content guidelines
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
   */
  private async analyzeTextContent(text: string): Promise<any> {
    const lowerText = text.toLowerCase()
    
    // Enhanced keyword detection with context awareness
    const explicitKeywords = [
<<<<<<< HEAD
      'explicit', 'nude', 'naked', 'sex', 'porn', 'xxx', 'adult', 'mature',
      'erotic', 'sensual', 'intimate', 'provocative', 'seductive', 'hardcore',
      'fetish', 'bdsm', 'kink', 'taboo', 'x-rated'
    ]
    
=======
      'explicit', 'hardcore', 'porn', 'xxx', 'adult', 'mature',
      'erotic', 'intimate', 'provocative', 'hardcore',
      'fetish', 'bdsm', 'kink', 'taboo', 'x-rated'
    ]
    
    const nudeKeywords = [
      'nude', 'naked', 'fully nude', 'completely naked', 'bare',
      'unclothed', 'undressed', 'stripped', 'exposed'
    ]
    
    const semiNudeKeywords = [
      'semi-nude', 'topless', 'bottomless', 'partially nude',
      'see-through', 'sheer', 'revealing', 'implied nudity'
    ]
    
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const suggestiveKeywords = [
      'sexy', 'hot', 'tempting', 'alluring', 'attractive', 'beautiful',
      'gorgeous', 'stunning', 'bikini', 'lingerie', 'underwear', 'swimwear',
      'curvy', 'voluptuous', 'seductive', 'teasing', 'flirtatious'
    ]
    
<<<<<<< HEAD
    // Enhanced edge case keywords that need context analysis
    const edgeCaseKeywords = [
      'artistic', 'medical', 'educational', 'fitness', 'yoga', 'dance',
=======
    // Artistic nudity keywords
    const artisticKeywords = [
      'artistic', 'fine art', 'sculpture', 'painting', 'classical',
      'renaissance', 'museum', 'gallery', 'art', 'aesthetic'
    ]
    
    // Enhanced edge case keywords that need context analysis
    const edgeCaseKeywords = [
      'medical', 'educational', 'fitness', 'yoga', 'dance',
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
      'modeling', 'fashion', 'beauty', 'health', 'wellness', 'therapy',
      'anatomy', 'clinical', 'research', 'academic', 'cultural', 'ceremony'
    ]

    let explicitScore = 0
<<<<<<< HEAD
    let suggestiveScore = 0
    let edgeCases: string[] = []
=======
    let nudeScore = 0
    let semiNudeScore = 0
    let suggestiveScore = 0
    let edgeCases: string[] = []
    let artisticNudity = false
    let adultContent = false
    let suggestiveContent = false
    
    // New gender and age detection variables
    let gender: 'MALE' | 'FEMALE' | 'MIXED' | 'UNKNOWN' = 'UNKNOWN'
    let ageAppropriate = true
    let hasRestrictedContent = false
    let restrictedContentTypes: string[] = []
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

    // Calculate scores based on keyword presence with enhanced context
    explicitKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        explicitScore += 0.25
<<<<<<< HEAD
=======
        adultContent = true
      }
    })

    nudeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        nudeScore += 0.3
        adultContent = true
      }
    })

    semiNudeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        semiNudeScore += 0.25
        suggestiveContent = true
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
      }
    })

    suggestiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        suggestiveScore += 0.15
<<<<<<< HEAD
      }
    })

=======
        suggestiveContent = true
      }
    })

    // Check for artistic context
    const artisticContext = artisticKeywords.some(keyword => lowerText.includes(keyword))
    if (artisticContext && (nudeScore > 0 || semiNudeScore > 0)) {
      artisticNudity = true
      edgeCases.push('Artistic context detected')
      // Reduce scores for artistic content
      nudeScore *= 0.5
      semiNudeScore *= 0.6
      explicitScore *= 0.3
    }

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    // Enhanced edge case detection with context analysis
    edgeCaseKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        edgeCases.push(`Contextual keyword detected: ${keyword}`)
        // Apply context-aware score reduction
        explicitScore *= this.getContextReductionFactor(keyword)
<<<<<<< HEAD
=======
        nudeScore *= this.getContextReductionFactor(keyword)
        semiNudeScore *= this.getContextReductionFactor(keyword)
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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
<<<<<<< HEAD
=======
        nudeScore *= phrase.reduction
        semiNudeScore *= phrase.reduction
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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
<<<<<<< HEAD
=======
        nudeScore *= modifier.reduction
        semiNudeScore *= modifier.reduction
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
        suggestiveScore *= modifier.reduction
      }
    })

<<<<<<< HEAD
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
=======
    // Normalize scores with enhanced bounds checking
    explicitScore = Math.min(explicitScore, 1.0)
    nudeScore = Math.min(nudeScore, 1.0)
    semiNudeScore = Math.min(semiNudeScore, 1.0)
    suggestiveScore = Math.min(suggestiveScore, 1.0)

    const confidence = Math.max(explicitScore, nudeScore, semiNudeScore, suggestiveScore)

    // Enhanced gender detection
    const maleKeywords = ['man', 'men', 'male', 'boy', 'boys', 'guy', 'guys', 'gentleman', 'gentlemen']
    const femaleKeywords = ['woman', 'women', 'female', 'girl', 'girls', 'lady', 'ladies']
    
    let maleScore = 0
    let femaleScore = 0
    
    maleKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        maleScore += 1
      }
    })
    
    femaleKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        femaleScore += 1
      }
    })
    
    // Determine gender based on keyword frequency
    if (maleScore > 0 && femaleScore > 0) {
      gender = 'MIXED'
    } else if (maleScore > 0) {
      gender = 'MALE'
    } else if (femaleScore > 0) {
      gender = 'FEMALE'
    } else {
      gender = 'UNKNOWN'
    }

    // Enhanced age detection and restrictions
    const ageKeywords = ['years', 'age', 'old', 'young']
    const childKeywords = ['child', 'children', 'kid', 'kids', 'baby', 'babies', 'infant', 'infants', 'teen', 'teens', 'teenager', 'teenagers']
    const animalKeywords = ['animal', 'animals', 'pet', 'pets', 'dog', 'dogs', 'cat', 'cats', 'horse', 'horses', 'bird', 'birds']
    
    // Check for restricted content
    childKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        hasRestrictedContent = true
        restrictedContentTypes.push('child_content')
        ageAppropriate = false
      }
    })
    
    animalKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        hasRestrictedContent = true
        restrictedContentTypes.push('animal_content')
      }
    })
    
    // Check age range compliance
    if (ageKeywords.some(keyword => lowerText.includes(keyword))) {
      const ageMatches = lowerText.match(/\b(1[8-9]|2[0-9]|3[0-9]|40)\b/g)
      if (ageMatches) {
        const ages = ageMatches.map(match => parseInt(match))
        const allAgesAppropriate = ages.every(age => age >= this.config.minAge && age <= this.config.maxAge)
        if (!allAgesAppropriate) {
          ageAppropriate = false
          restrictedContentTypes.push('age_restricted')
        }
      }
    }

    return {
      confidence,
      artisticNudity,
      adultContent,
      suggestiveContent,
      gender,
      ageAppropriate,
      hasRestrictedContent,
      restrictedContentTypes,
      categories: {
        explicit: explicitScore,
        suggestive: suggestiveScore,
        semiNude: semiNudeScore,
        nude: nudeScore,
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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
<<<<<<< HEAD
      edgeCases: [] as string[]
    }

=======
      edgeCases: [] as string[],
      // New gender and age detection fields
      gender: 'UNKNOWN' as 'MALE' | 'FEMALE' | 'MIXED' | 'UNKNOWN',
      ageAppropriate: true,
      hasRestrictedContent: false,
      restrictedContentTypes: [] as string[]
    }

    // Enhanced gender detection for images
    const maleKeywords = ['man', 'men', 'male', 'boy', 'boys', 'guy', 'guys']
    const femaleKeywords = ['woman', 'women', 'female', 'girl', 'girls', 'lady', 'ladies']
    const childKeywords = ['child', 'children', 'kid', 'kids', 'baby', 'babies', 'teen', 'teens']
    const animalKeywords = ['animal', 'animals', 'pet', 'pets', 'dog', 'dogs', 'cat', 'cats']
    
    let maleScore = 0
    let femaleScore = 0
    
    maleKeywords.forEach(keyword => {
      if (imageUrl.toLowerCase().includes(keyword)) {
        maleScore += 1
      }
    })
    
    femaleKeywords.forEach(keyword => {
      if (imageUrl.toLowerCase().includes(keyword)) {
        femaleScore += 1
      }
    })
    
    // Determine gender based on keyword frequency
    if (maleScore > 0 && femaleScore > 0) {
      analysis.gender = 'MIXED'
    } else if (maleScore > 0) {
      analysis.gender = 'MALE'
    } else if (femaleScore > 0) {
      analysis.gender = 'FEMALE'
    } else {
      analysis.gender = 'UNKNOWN'
    }

    // Check for restricted content
    childKeywords.forEach(keyword => {
      if (imageUrl.toLowerCase().includes(keyword)) {
        analysis.hasRestrictedContent = true
        analysis.restrictedContentTypes.push('child_content')
        analysis.ageAppropriate = false
      }
    })
    
    animalKeywords.forEach(keyword => {
      if (imageUrl.toLowerCase().includes(keyword)) {
        analysis.hasRestrictedContent = true
        analysis.restrictedContentTypes.push('animal_content')
      }
    })

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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
<<<<<<< HEAD
=======
    
    // New gender and age detection aggregation
    let genderScores: { [key: string]: number } = { MALE: 0, FEMALE: 0, MIXED: 0, UNKNOWN: 0 }
    let ageAppropriateCount = 0
    let hasRestrictedContentCount = 0
    let restrictedContentTypes: string[] = []
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

    for (let i = 0; i < frameCount; i++) {
      const frameAnalysis = await this.analyzeImageContent(`${videoUrl}-frame-${i}`)
      totalExplicit += frameAnalysis.categories.explicit
      totalSuggestive += frameAnalysis.categories.suggestive
      edgeCases.push(...frameAnalysis.edgeCases)
<<<<<<< HEAD
=======
      
      // Aggregate gender and age data
      if (frameAnalysis.gender) {
        genderScores[frameAnalysis.gender] += 1
      }
      
      if (frameAnalysis.ageAppropriate) {
        ageAppropriateCount += 1
      }
      
      if (frameAnalysis.hasRestrictedContent) {
        hasRestrictedContentCount += 1
        restrictedContentTypes.push(...frameAnalysis.restrictedContentTypes)
      }
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    }

    // Average scores across frames
    const avgExplicit = totalExplicit / frameCount
    const avgSuggestive = totalSuggestive / frameCount

<<<<<<< HEAD
    // Remove duplicate edge cases
    edgeCases = [...new Set(edgeCases)]
=======
    // Remove duplicate edge cases and restricted content types
    edgeCases = [...new Set(edgeCases)]
    restrictedContentTypes = [...new Set(restrictedContentTypes)]

    // Determine dominant gender
    const dominantGender = Object.entries(genderScores).reduce((a, b) => 
      genderScores[a[0]] > genderScores[b[0]] ? a : b
    )[0] as 'MALE' | 'FEMALE' | 'MIXED' | 'UNKNOWN'

    // Determine if content is age appropriate (majority of frames)
    const isAgeAppropriate = ageAppropriateCount > frameCount / 2
    
    // Determine if content has restricted elements (any frame)
    const hasRestrictedContent = hasRestrictedContentCount > 0
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

    return {
      confidence: Math.max(avgExplicit, avgSuggestive),
      categories: {
        explicit: avgExplicit,
        suggestive: avgSuggestive,
        violent: 0,
        hate: 0,
        other: 0
      },
<<<<<<< HEAD
      edgeCases
=======
      edgeCases,
      gender: dominantGender,
      ageAppropriate: isAgeAppropriate,
      hasRestrictedContent,
      restrictedContentTypes
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    }
  }

  /**
<<<<<<< HEAD
   * Determine NSFW status based on analysis and config
   */
  private determineNSFWStatus(analysis: any): boolean {
=======
   * Determine content level based on analysis
   */
  private determineContentLevel(analysis: any): 'SAFE' | 'SUGGESTIVE' | 'SEMI_NUDE' | 'NUDE' | 'EXPLICIT' {
    const { explicit, suggestive, semiNude, nude } = analysis.categories
    
    if (explicit > 0.7) return 'EXPLICIT'
    if (explicit > 0.4 || nude > 0.6) return 'NUDE'
    if (semiNude > 0.5 || nude > 0.3) return 'SEMI_NUDE'
    if (suggestive > 0.4 || semiNude > 0.2) return 'SUGGESTIVE'
    return 'SAFE'
  }

  /**
   * Determine nudity level based on analysis
   */
  private determineNudityLevel(analysis: any): 'NONE' | 'IMPLIED' | 'PARTIAL' | 'FULL' | 'SEXUAL' {
    const { explicit, suggestive, semiNude, nude } = analysis.categories
    
    if (explicit > 0.7) return 'SEXUAL'
    if (explicit > 0.4 || nude > 0.6) return 'FULL'
    if (semiNude > 0.5 || nude > 0.3) return 'PARTIAL'
    if (suggestive > 0.4 || semiNude > 0.2) return 'IMPLIED'
    return 'NONE'
  }

  /**
   * Determine moderation status based on analysis and config
   */
  private determineModerationStatus(analysis: any): 'APPROVED' | 'PENDING' | 'FLAGGED' | 'REJECTED' {
    const contentLevel = this.determineContentLevel(analysis)
    const { explicit } = analysis.categories
    
    // Check if content is allowed based on configuration
    if (contentLevel === 'EXPLICIT' && !this.config.allowAdultContent) {
      return 'REJECTED'
    }
    
    if (contentLevel === 'NUDE' && !this.config.allowNude && !analysis.artisticNudity) {
      return 'REJECTED'
    }
    
    if (contentLevel === 'SEMI_NUDE' && !this.config.allowSemiNude) {
      return 'REJECTED'
    }
    
    // New gender restrictions - reject male content if not allowed
    if (analysis.gender === 'MALE' && !this.config.allowMaleContent) {
      return 'REJECTED'
    }
    
    // New gender restrictions - reject mixed gender content if male is not allowed
    if (analysis.gender === 'MIXED' && !this.config.allowMaleContent) {
      return 'REJECTED'
    }
    
    // New content restrictions - reject child content
    if (analysis.hasRestrictedContent && analysis.restrictedContentTypes.includes('child_content') && !this.config.allowChildContent) {
      return 'REJECTED'
    }
    
    // New content restrictions - reject animal content
    if (analysis.hasRestrictedContent && analysis.restrictedContentTypes.includes('animal_content') && !this.config.allowAnimalContent) {
      return 'REJECTED'
    }
    
    // New age restrictions - reject if not age appropriate
    if (!analysis.ageAppropriate) {
      return 'REJECTED'
    }
    
    // Flag for review if high explicit content even if allowed
    if (explicit > 0.8) {
      return 'FLAGGED'
    }
    
    // Flag for review if edge cases detected
    if (analysis.edgeCases.length > 2) {
      return 'PENDING'
    }
    
    return 'APPROVED'
  }

  /**
   * Determine NSFW status based on analysis and config with new guidelines
   */
  private determineNSFWStatus(analysis: any): boolean {
    const contentLevel = this.determineContentLevel(analysis)
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const thresholds = this.config.customThresholds || {
      explicit: this.config.strictness === 'strict' ? 0.3 : 
                this.config.strictness === 'high' ? 0.5 : 
                this.config.strictness === 'medium' ? 0.7 : 0.8,
      suggestive: this.config.strictness === 'strict' ? 0.5 : 
                   this.config.strictness === 'high' ? 0.6 : 
<<<<<<< HEAD
                   this.config.strictness === 'medium' ? 0.7 : 0.8
=======
                   this.config.strictness === 'medium' ? 0.7 : 0.8,
      semiNude: this.config.strictness === 'strict' ? 0.4 : 
                this.config.strictness === 'high' ? 0.6 : 
                this.config.strictness === 'medium' ? 0.8 : 0.9,
      nude: this.config.strictness === 'strict' ? 0.3 : 
            this.config.strictness === 'high' ? 0.5 : 
            this.config.strictness === 'medium' ? 0.7 : 0.8,
      violent: 0.8,
      hate: 0.8
    }

    // Apply new content guidelines
    if (this.config.allowArtisticNudity && analysis.artisticNudity) {
      return analysis.categories.explicit > thresholds.explicit * 1.5
    }

    if (this.config.allowSemiNude && contentLevel === 'SEMI_NUDE') {
      return analysis.categories.explicit > thresholds.explicit * 1.3
    }

    if (this.config.allowNude && contentLevel === 'NUDE') {
      return analysis.categories.explicit > thresholds.explicit * 1.2
    }

    if (this.config.allowAdultContent && contentLevel === 'EXPLICIT') {
      return analysis.categories.explicit > thresholds.explicit * 1.1
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    }

    // If edge cases are detected and enabled, be more lenient
    if (this.config.enableEdgeCaseDetection && analysis.edgeCases.length > 0) {
      return analysis.categories.explicit > thresholds.explicit * 1.2 || 
<<<<<<< HEAD
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
=======
             analysis.categories.suggestive > thresholds.suggestive * 1.2 ||
             analysis.categories.semiNude > thresholds.semiNude * 1.2 ||
             analysis.categories.nude > thresholds.nude * 1.2
    }

    return analysis.categories.explicit > thresholds.explicit || 
           analysis.categories.suggestive > thresholds.suggestive ||
           analysis.categories.semiNude > thresholds.semiNude ||
           analysis.categories.nude > thresholds.nude
  }

  /**
   * Generate recommendations based on analysis with new content guidelines
   */
  private generateRecommendations(analysis: any): string[] {
    const recommendations: string[] = []
    const contentLevel = this.determineContentLevel(analysis)

    if (contentLevel === 'EXPLICIT') {
      if (this.config.allowAdultContent) {
        recommendations.push('Explicit content allowed - apply age restrictions')
      } else {
        recommendations.push('Explicit content not allowed - consider removal')
      }
    }

    if (contentLevel === 'NUDE') {
      if (this.config.allowNude) {
        recommendations.push('Nude content allowed - ensure proper labeling')
      } else if (analysis.artisticNudity && this.config.allowArtisticNudity) {
        recommendations.push('Artistic nude content allowed - ensure cultural sensitivity')
      } else {
        recommendations.push('Nude content not allowed - consider removal')
      }
    }

    if (contentLevel === 'SEMI_NUDE') {
      if (this.config.allowSemiNude) {
        recommendations.push('Semi-nude content allowed - generally acceptable')
      } else {
        recommendations.push('Semi-nude content not allowed - consider removal')
      }
    }

    if (contentLevel === 'SUGGESTIVE') {
      recommendations.push('Suggestive content - generally acceptable with proper context')
    }

    // New gender-based recommendations
    if (analysis.gender === 'MALE' && !this.config.allowMaleContent) {
      recommendations.push('Male content not allowed - female content only permitted')
    }
    
    if (analysis.gender === 'MIXED' && !this.config.allowMaleContent) {
      recommendations.push('Mixed gender content not allowed - female content only permitted')
    }

    // New content restriction recommendations
    if (analysis.hasRestrictedContent && analysis.restrictedContentTypes.includes('child_content')) {
      if (!this.config.allowChildContent) {
        recommendations.push('Child content not allowed - strictly prohibited')
      }
    }
    
    if (analysis.hasRestrictedContent && analysis.restrictedContentTypes.includes('animal_content')) {
      if (!this.config.allowAnimalContent) {
        recommendations.push('Animal content not allowed - strictly prohibited')
      }
    }

    // New age restriction recommendations
    if (!analysis.ageAppropriate) {
      recommendations.push('Age restrictions violated - subjects must be between 18-40 years old')
    }

    if (analysis.categories.explicit > 0.7) {
      recommendations.push('High explicit content - requires careful review')
    }

    if (analysis.artisticNudity) {
      recommendations.push('Artistic nudity detected - consider cultural and educational value')
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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

<<<<<<< HEAD
=======
    if (analysis.edgeCases.length > 2) {
      recommendations.push('Multiple contexts detected - enhanced review recommended')
    }

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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

<<<<<<< HEAD
// Export singleton instance
export const contentModeration = new ContentModerationService({
  strictness: 'medium',
  enableEdgeCaseDetection: true,
  customThresholds: {
    explicit: 0.6,
    suggestive: 0.7,
=======
// Export singleton instance with new content guidelines
export const contentModeration = new ContentModerationService({
  strictness: 'medium',
  enableEdgeCaseDetection: true,
  allowSemiNude: true,      // Allow semi-nude content
  allowNude: true,          // Allow nude content
  allowArtisticNudity: true, // Allow artistic nudity
  allowAdultContent: true,  // Allow explicit adult content
  // New gender and content restrictions (women only policy)
  allowMaleContent: false,  // Do NOT allow male content
  allowFemaleContent: true, // Allow female content
  allowChildContent: false, // Do NOT allow child content
  allowAnimalContent: false, // Do NOT allow animal content
  minAge: 18,              // Minimum age 18
  maxAge: 40,              // Maximum age 40
  customThresholds: {
    explicit: 0.6,
    suggestive: 0.7,
    semiNude: 0.8,
    nude: 0.7,
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    violent: 0.8,
    hate: 0.8
  }
})

// Export types and utilities
export { ContentModerationService }
export type { ModerationConfig, ModerationResult }