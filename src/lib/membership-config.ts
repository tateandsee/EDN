/**
 * Membership Configuration System
 * Defines membership plans, limits, and capabilities for the EDN platform
 * Aligns database schema with pricing page display
 */

export interface MembershipLimits {
  aiGenerationsPerMonth: number
  distributionsPerMonth: number
  socialPlatforms: number
  storageMB: number
  maxContentSizeMB: number
  apiCallsPerMonth: number
  concurrentGenerations: number
  priorityQueue: boolean
  customModels: boolean
  advancedFeatures: boolean
  analyticsAccess: boolean
  supportLevel: 'basic' | 'standard' | 'priority' | 'dedicated' | 'vip' | 'manager'
}

export interface MembershipPlan {
  id: string
  name: string
  displayName: string
  description: string
  price: {
    monthly: number
    annual: number
  }
  limits: MembershipLimits
  features: string[]
  isPopular: boolean
  isHighlighted: boolean
  sortOrder: number
  isActive: boolean
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'FREE',
    name: 'FREE',
    displayName: 'Starter',
    description: 'Perfect for trying out EDN',
    price: {
      monthly: 0,
      annual: 0
    },
    limits: {
      aiGenerationsPerMonth: 20,
      distributionsPerMonth: 30, // 1 per day ≈ 30 per month
      socialPlatforms: 1,
      storageMB: 100,
      maxContentSizeMB: 10,
      apiCallsPerMonth: 100,
      concurrentGenerations: 1,
      priorityQueue: false,
      customModels: false,
      advancedFeatures: false,
      analyticsAccess: false,
      supportLevel: 'basic'
    },
    features: [
      'Limited AI model access (Basic models only)',
      'Basic creation tools (Limited editing, no advanced controls)',
      '1 distribution per day',
      '20 AI generations per month',
      'Access to 1 social media platforms',
      'Basic support'
    ],
    isPopular: false,
    isHighlighted: false,
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'BASIC',
    name: 'BASIC',
    displayName: 'Basic',
    description: 'Great for casual creators',
    price: {
      monthly: 10,
      annual: 96
    },
    limits: {
      aiGenerationsPerMonth: 50,
      distributionsPerMonth: 5,
      socialPlatforms: 2,
      storageMB: 500,
      maxContentSizeMB: 25,
      apiCallsPerMonth: 500,
      concurrentGenerations: 2,
      priorityQueue: false,
      customModels: false,
      advancedFeatures: false,
      analyticsAccess: false,
      supportLevel: 'standard'
    },
    features: [
      'Access to 10 AI models',
      'Basic content creation tools',
      '5 distributions per month',
      '50 AI generations per month',
      'Access to 2 social media platforms',
      'Standard support'
    ],
    isPopular: false,
    isHighlighted: false,
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'PRO',
    name: 'PRO',
    displayName: 'Pro',
    description: 'Most popular choice',
    price: {
      monthly: 50,
      annual: 480
    },
    limits: {
      aiGenerationsPerMonth: 100,
      distributionsPerMonth: 999999, // Unlimited
      socialPlatforms: 3,
      storageMB: 2000,
      maxContentSizeMB: 50,
      apiCallsPerMonth: 2000,
      concurrentGenerations: 3,
      priorityQueue: true,
      customModels: false,
      advancedFeatures: true,
      analyticsAccess: true,
      supportLevel: 'priority'
    },
    features: [
      'Access to all AI models',
      'Advanced creation tools (Precise lighting, pose manipulation, custom image inputs)',
      'Unlimited distributions',
      'Priority support',
      'Revenue analytics (Track sales, monitor popular models)',
      '100 AI generations per month',
      'Access to 3 social media platforms'
    ],
    isPopular: true,
    isHighlighted: true,
    sortOrder: 3,
    isActive: true
  },
  {
    id: 'ELITE',
    name: 'ELITE',
    displayName: 'Elite',
    description: 'For serious creators',
    price: {
      monthly: 100,
      annual: 960
    },
    limits: {
      aiGenerationsPerMonth: 200,
      distributionsPerMonth: 999999, // Unlimited (priority)
      socialPlatforms: 999, // All platforms
      storageMB: 5000,
      maxContentSizeMB: 100,
      apiCallsPerMonth: 5000,
      concurrentGenerations: 5,
      priorityQueue: true,
      customModels: true,
      advancedFeatures: true,
      analyticsAccess: true,
      supportLevel: 'dedicated'
    },
    features: [
      'Elite AI model access (Faster generation, higher resolution, more realistic outputs)',
      'Premium creation tools (Layers, fine-tuning controls, advanced prompts)',
      'Priority distributions',
      '24/7 dedicated support',
      'Personalized AI assistant',
      '200 AI generations per month',
      'Access to all social media platforms',
      'AI generated post\'s for your content'
    ],
    isPopular: false,
    isHighlighted: false,
    sortOrder: 4,
    isActive: true
  },
  {
    id: 'MASTER',
    name: 'MASTER',
    displayName: 'Master',
    description: 'Professional grade features',
    price: {
      monthly: 200,
      annual: 1920
    },
    limits: {
      aiGenerationsPerMonth: 500,
      distributionsPerMonth: 999999, // Unlimited (VIP)
      socialPlatforms: 999, // All platforms
      storageMB: 10000,
      maxContentSizeMB: 200,
      apiCallsPerMonth: 10000,
      concurrentGenerations: 8,
      priorityQueue: true,
      customModels: true,
      advancedFeatures: true,
      analyticsAccess: true,
      supportLevel: 'vip'
    },
    features: [
      'Master AI model access (Exclusive models, beta features)',
      'Exclusive creation tools (Custom training, predictive analytics)',
      'VIP distributions',
      '24/7 VIP support',
      'Advanced analytics & insights (Trend reports, A/B testing)',
      '500 AI generations per month',
      'Access to all social media platforms',
      'AI generated post\'s for your content'
    ],
    isPopular: false,
    isHighlighted: false,
    sortOrder: 5,
    isActive: true
  },
  {
    id: 'ULTIMATE',
    name: 'ULTIMATE',
    displayName: 'ULTIMATE EXPERIENCE VIP',
    description: 'Ultimate experience',
    price: {
      monthly: 500,
      annual: 4800
    },
    limits: {
      aiGenerationsPerMonth: 999999, // Unlimited
      distributionsPerMonth: 999999, // Unlimited (priority)
      socialPlatforms: 999, // All platforms
      storageMB: 50000,
      maxContentSizeMB: 500,
      apiCallsPerMonth: 999999, // Unlimited
      concurrentGenerations: 15,
      priorityQueue: true,
      customModels: true,
      advancedFeatures: true,
      analyticsAccess: true,
      supportLevel: 'manager'
    },
    features: [
      'Unlimited VIP AI models',
      'Custom AI model creation',
      'Unlimited priority distributions',
      'Personal account manager',
      'Early access to new features',
      'Unlimited AI generations',
      'Access to all social media platforms',
      'AI generated post\'s for your content'
    ],
    isPopular: false,
    isHighlighted: false,
    sortOrder: 6,
    isActive: true
  }
]

export class MembershipConfig {
  /**
   * Get all active membership plans
   */
  static getActivePlans(): MembershipPlan[] {
    return MEMBERSHIP_PLANS.filter(plan => plan.isActive)
  }

  /**
   * Get a specific membership plan by ID
   */
  static getPlanById(id: string): MembershipPlan | undefined {
    return MEMBERSHIP_PLANS.find(plan => plan.id === id)
  }

  /**
   * Get a specific membership plan by name
   */
  static getPlanByName(name: string): MembershipPlan | undefined {
    return MEMBERSHIP_PLANS.find(plan => 
      plan.name === name || plan.displayName === name
    )
  }

  /**
   * Get membership limits for a specific plan
   */
  static getPlanLimits(planId: string): MembershipLimits | undefined {
    const plan = this.getPlanById(planId)
    return plan?.limits
  }

  /**
   * Check if a user has reached their limit for a specific feature
   */
  static hasReachedLimit(
    planId: string,
    feature: keyof MembershipLimits,
    currentUsage: number
  ): boolean {
    const limits = this.getPlanLimits(planId)
    if (!limits) return true

    const limit = limits[feature]
    if (typeof limit !== 'number') return false

    return currentUsage >= limit
  }

  /**
   * Get remaining usage for a specific feature
   */
  static getRemainingUsage(
    planId: string,
    feature: keyof MembershipLimits,
    currentUsage: number
  ): number {
    const limits = this.getPlanLimits(planId)
    if (!limits) return 0

    const limit = limits[feature]
    if (typeof limit !== 'number') return 999999

    return Math.max(0, limit - currentUsage)
  }

  /**
   * Check if a plan has access to a specific feature
   */
  static hasFeatureAccess(planId: string, feature: keyof MembershipLimits): boolean {
    const limits = this.getPlanLimits(planId)
    if (!limits) return false

    const value = limits[feature]
    if (typeof value === 'boolean') return value
    if (typeof value === 'number') return value > 0

    return false
  }

  /**
   * Get the annual discount percentage for a plan
   */
  static getAnnualDiscount(planId: string): number {
    const plan = this.getPlanById(planId)
    if (!plan || plan.price.monthly === 0) return 0

    const monthlyTotal = plan.price.monthly * 12
    const savings = monthlyTotal - plan.price.annual
    return Math.round((savings / monthlyTotal) * 100)
  }

  /**
   * Get plan comparison data for feature matrix
   */
  static getPlanComparison() {
    const activePlans = this.getActivePlans()
    
    return {
      aiModels: activePlans.map(plan => ({
        planId: plan.id,
        planName: plan.displayName,
        access: plan.limits.aiGenerationsPerMonth === 20 ? 'Limited' :
                plan.limits.aiGenerationsPerMonth === 50 ? '10 Models' :
                plan.limits.aiGenerationsPerMonth === 100 ? 'All Models' :
                plan.limits.aiGenerationsPerMonth === 200 ? 'Elite Models' :
                plan.limits.aiGenerationsPerMonth === 500 ? 'Master Models' :
                'Unlimited VIP'
      })),
      monthlyGenerations: activePlans.map(plan => ({
        planId: plan.id,
        planName: plan.displayName,
        count: plan.limits.aiGenerationsPerMonth === 999999 ? 'Unlimited' : 
                plan.limits.aiGenerationsPerMonth.toString()
      })),
      distributions: activePlans.map(plan => ({
        planId: plan.id,
        planName: plan.displayName,
        limit: plan.limits.distributionsPerMonth === 999999 ? 
                (plan.supportLevel === 'manager' ? 'Unlimited Priority' :
                 plan.supportLevel === 'vip' ? 'VIP' :
                 plan.supportLevel === 'dedicated' ? 'Priority' : 'Unlimited') :
                plan.id === 'FREE' ? '1/day' :
                `${plan.limits.distributionsPerMonth}/month`
      })),
      socialPlatforms: activePlans.map(plan => ({
        planId: plan.id,
        planName: plan.displayName,
        count: plan.limits.socialPlatforms === 999 ? 'All' : 
                plan.limits.socialPlatforms.toString()
      })),
      support: activePlans.map(plan => ({
        planId: plan.id,
        planName: plan.displayName,
        level: plan.supportLevel === 'basic' ? 'Basic' :
                plan.supportLevel === 'standard' ? 'Standard' :
                plan.supportLevel === 'priority' ? 'Priority' :
                plan.supportLevel === 'dedicated' ? '24/7 Dedicated' :
                plan.supportLevel === 'vip' ? '24/7 VIP' :
                'Personal Manager'
      })),
      analytics: activePlans.map(plan => ({
        planId: plan.id,
        planName: plan.displayName,
        access: plan.limits.analyticsAccess ? 
                (plan.supportLevel === 'dedicated' ? 'Personalized AI' :
                 plan.supportLevel === 'vip' ? 'Advanced Insights' :
                 plan.supportLevel === 'manager' ? 'Custom Reports' :
                 'Revenue Analytics') : 'Basic'
      }))
    }
  }

  /**
   * Validate plan limits against user usage
   */
  static validatePlanUsage(
    planId: string,
    usage: Record<keyof MembershipLimits, number>
  ): { isValid: boolean; violations: Array<{ feature: keyof MembershipLimits; used: number; limit: number }> } {
    const limits = this.getPlanLimits(planId)
    if (!limits) {
      return {
        isValid: false,
        violations: []
      }
    }

    const violations: Array<{ feature: keyof MembershipLimits; used: number; limit: number }> = []

    Object.entries(limits).forEach(([feature, limit]) => {
      if (typeof limit === 'number' && limit < 999999) {
        const used = usage[feature as keyof MembershipLimits] || 0
        if (used > limit) {
          violations.push({
            feature: feature as keyof MembershipLimits,
            used,
            limit
          })
        }
      }
    })

    return {
      isValid: violations.length === 0,
      violations
    }
  }

  /**
   * Get recommended plan based on usage patterns
   */
  static getRecommendedPlan(usage: Partial<MembershipLimits>): MembershipPlan | null {
    const activePlans = this.getActivePlans()
    
    // Sort plans by price (ascending)
    const sortedPlans = activePlans.sort((a, b) => a.price.monthly - b.price.monthly)
    
    // Find the first plan that can accommodate the usage
    for (const plan of sortedPlans) {
      const validation = this.validatePlanUsage(plan.id, usage as Record<keyof MembershipLimits, number>)
      if (validation.isValid) {
        return plan
      }
    }
    
    // If no plan can accommodate usage, return the highest tier
    return sortedPlans[sortedPlans.length - 1] || null
  }
}