/**
 * Membership Service
 * Handles membership operations, usage tracking, and limit enforcement
 */

import { db } from '@/lib/db'
import { MembershipConfig, MembershipPlan, MembershipLimits } from './membership-config'
import { SubscriptionPlan } from '@prisma/client'

export interface MembershipUsage {
  aiGenerationsUsed: number
  distributionsUsed: number
  apiCallsUsed: number
  storageUsedMB: number
  socialPlatformsUsed: number
  maxContentSizeUsedMB: number
  concurrentGenerationsUsed: number
}

export interface MembershipStatus {
  plan: MembershipPlan | null
  usage: MembershipUsage
  limits: MembershipLimits | null
  remaining: {
    aiGenerations: number
    distributions: number
    apiCalls: number
    storageMB: number
    socialPlatforms: number
    maxContentSizeMB: number
    concurrentGenerations: number
  }
  hasReachedLimits: {
    aiGenerations: boolean
    distributions: boolean
    apiCalls: boolean
    storage: boolean
    socialPlatforms: boolean
    maxContentSizeMB: boolean
    concurrentGenerations: boolean
  }
  daysUntilReset: number
}

export class MembershipService {
  /**
   * Get or create membership usage record for the current month
   */
  static async getOrCreateUsageRecord(userId: string, plan: SubscriptionPlan) {
    const now = new Date()
    const currentMonth = now.toISOString().slice(0, 7) // YYYY-MM format
    const currentYear = now.getFullYear()

    let usageRecord = await db.membershipUsage.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: currentMonth,
          year: currentYear
        }
      }
    })

    if (!usageRecord) {
      usageRecord = await db.membershipUsage.create({
        data: {
          userId,
          month: currentMonth,
          year: currentYear,
          currentPlan: plan,
          aiGenerationsUsed: 0,
          distributionsUsed: 0,
          apiCallsUsed: 0,
          storageUsedMB: 0,
          socialPlatformsUsed: 0,
          maxContentSizeUsedMB: 0,
          concurrentGenerationsUsed: 0
        }
      })
    }

    return usageRecord
  }

  /**
   * Get user's current membership status
   */
  static async getMembershipStatus(userId: string): Promise<MembershipStatus> {
    // Get user's current subscription
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!subscription) {
      // Return free plan status
      const freePlan = MembershipConfig.getPlanById('FREE')
      const freeLimits = freePlan?.limits

      return {
        plan: freePlan || null,
        usage: {
          aiGenerationsUsed: 0,
          distributionsUsed: 0,
          apiCallsUsed: 0,
          storageUsedMB: 0,
          socialPlatformsUsed: 0,
          maxContentSizeUsedMB: 0,
          concurrentGenerationsUsed: 0
        },
        limits: freeLimits || null,
        remaining: {
          aiGenerations: freeLimits?.aiGenerationsPerMonth || 0,
          distributions: freeLimits?.distributionsPerMonth || 0,
          apiCalls: freeLimits?.apiCallsPerMonth || 0,
          storageMB: freeLimits?.storageMB || 0,
          socialPlatforms: freeLimits?.socialPlatforms || 0,
          maxContentSizeMB: freeLimits?.maxContentSizeMB || 0,
          concurrentGenerations: freeLimits?.concurrentGenerations || 0
        },
        hasReachedLimits: {
          aiGenerations: false,
          distributions: false,
          apiCalls: false,
          storage: false,
          socialPlatforms: false,
          maxContentSizeMB: false,
          concurrentGenerations: false
        },
        daysUntilReset: this.getDaysUntilMonthEnd()
      }
    }

    // Get usage record
    const usageRecord = await this.getOrCreateUsageRecord(userId, subscription.plan)
    const plan = MembershipConfig.getPlanById(subscription.plan)
    const limits = plan?.limits

    if (!plan || !limits) {
      throw new Error(`Invalid membership plan: ${subscription.plan}`)
    }

    const usage: MembershipUsage = {
      aiGenerationsUsed: usageRecord.aiGenerationsUsed,
      distributionsUsed: usageRecord.distributionsUsed,
      apiCallsUsed: usageRecord.apiCallsUsed,
      storageUsedMB: usageRecord.storageUsedMB,
      socialPlatformsUsed: usageRecord.socialPlatformsUsed,
      maxContentSizeUsedMB: usageRecord.maxContentSizeUsedMB,
      concurrentGenerationsUsed: usageRecord.concurrentGenerationsUsed
    }

    const remaining = {
      aiGenerations: MembershipConfig.getRemainingUsage(subscription.plan, 'aiGenerationsPerMonth', usage.aiGenerationsUsed),
      distributions: MembershipConfig.getRemainingUsage(subscription.plan, 'distributionsPerMonth', usage.distributionsUsed),
      apiCalls: MembershipConfig.getRemainingUsage(subscription.plan, 'apiCallsPerMonth', usage.apiCallsUsed),
      storageMB: MembershipConfig.getRemainingUsage(subscription.plan, 'storageMB', usage.storageUsedMB),
      socialPlatforms: MembershipConfig.getRemainingUsage(subscription.plan, 'socialPlatforms', usage.socialPlatformsUsed),
      maxContentSizeMB: MembershipConfig.getRemainingUsage(subscription.plan, 'maxContentSizeMB', usage.maxContentSizeUsedMB),
      concurrentGenerations: MembershipConfig.getRemainingUsage(subscription.plan, 'concurrentGenerations', usage.concurrentGenerationsUsed)
    }

    const hasReachedLimits = {
      aiGenerations: MembershipConfig.hasReachedLimit(subscription.plan, 'aiGenerationsPerMonth', usage.aiGenerationsUsed),
      distributions: MembershipConfig.hasReachedLimit(subscription.plan, 'distributionsPerMonth', usage.distributionsUsed),
      apiCalls: MembershipConfig.hasReachedLimit(subscription.plan, 'apiCallsPerMonth', usage.apiCallsUsed),
      storage: MembershipConfig.hasReachedLimit(subscription.plan, 'storageMB', usage.storageUsedMB),
      socialPlatforms: MembershipConfig.hasReachedLimit(subscription.plan, 'socialPlatforms', usage.socialPlatformsUsed),
      maxContentSizeMB: MembershipConfig.hasReachedLimit(subscription.plan, 'maxContentSizeMB', usage.maxContentSizeUsedMB),
      concurrentGenerations: MembershipConfig.hasReachedLimit(subscription.plan, 'concurrentGenerations', usage.concurrentGenerationsUsed)
    }

    return {
      plan,
      usage,
      limits,
      remaining,
      hasReachedLimits,
      daysUntilReset: this.getDaysUntilMonthEnd()
    }
  }

  /**
   * Check if user can perform an action based on their membership limits
   */
  static async canPerformAction(
    userId: string,
    action: keyof MembershipLimits,
    requiredAmount: number = 1
  ): Promise<{ canPerform: boolean; reason?: string; remaining?: number }> {
    const status = await this.getMembershipStatus(userId)
    
    if (!status.limits) {
      return { canPerform: false, reason: 'No membership plan found' }
    }

    const limitValue = status.limits[action]
    
    if (typeof limitValue !== 'number') {
      // For boolean features, check if enabled
      if (typeof limitValue === 'boolean') {
        return { canPerform: limitValue }
      }
      return { canPerform: false, reason: 'Invalid limit type' }
    }

    const currentUsage = status.usage[action as keyof MembershipUsage] as number
    const remaining = limitValue - currentUsage

    if (remaining >= requiredAmount) {
      return { canPerform: true, remaining }
    }

    return { 
      canPerform: false, 
      reason: `Monthly ${action} limit reached. Used: ${currentUsage}/${limitValue}` 
    }
  }

  /**
   * Record usage for a specific action
   */
  static async recordUsage(
    userId: string,
    action: keyof MembershipUsage,
    amount: number = 1
  ): Promise<{ success: boolean; newUsage?: number; message?: string }> {
    try {
      // Get user's current subscription
      const subscription = await db.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE'
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      const plan = subscription?.plan || 'FREE'

      // Check if user can perform this action
      const canPerform = await this.canPerformAction(userId, action as keyof MembershipLimits, amount)
      
      if (!canPerform.canPerform) {
        return { 
          success: false, 
          message: canPerform.reason || 'Usage limit exceeded' 
        }
      }

      // Get or create usage record
      const usageRecord = await this.getOrCreateUsageRecord(userId, plan)

      // Update usage
      const updateData: any = {}
      updateData[action] = { increment: amount }

      const updatedRecord = await db.membershipUsage.update({
        where: { id: usageRecord.id },
        data: updateData
      })

      return { 
        success: true, 
        newUsage: updatedRecord[action as keyof MembershipUsage] as number 
      }
    } catch (error) {
      console.error('Error recording usage:', error)
      return { 
        success: false, 
        message: 'Failed to record usage' 
      }
    }
  }

  /**
   * Reset monthly usage for all users (should be run at the beginning of each month)
   */
  static async resetMonthlyUsage(): Promise<{ success: boolean; resetCount: number }> {
    try {
      const now = new Date()
      const currentMonth = now.toISOString().slice(0, 7)
      const currentYear = now.getFullYear()

      // Reset all usage records for the current month
      const result = await db.membershipUsage.updateMany({
        where: {
          month: currentMonth,
          year: currentYear
        },
        data: {
          aiGenerationsUsed: 0,
          distributionsUsed: 0,
          apiCallsUsed: 0,
          storageUsedMB: 0,
          lastResetAt: now
        }
      })

      return { 
        success: true, 
        resetCount: result.count 
      }
    } catch (error) {
      console.error('Error resetting monthly usage:', error)
      return { success: false, resetCount: 0 }
    }
  }

  /**
   * Upgrade user's membership plan
   */
  static async upgradeMembership(
    userId: string,
    newPlan: SubscriptionPlan,
    amount: number,
    promotionalCodeId?: string
  ): Promise<{ success: boolean; subscriptionId?: string; message?: string }> {
    try {
      // Check if plan exists
      const plan = MembershipConfig.getPlanById(newPlan)
      if (!plan) {
        return { success: false, message: 'Invalid membership plan' }
      }

      // Cancel existing active subscriptions
      await db.subscription.updateMany({
        where: {
          userId,
          status: 'ACTIVE'
        },
        data: {
          status: 'CANCELLED',
          autoRenew: false
        }
      })

      // Calculate expiration date (1 month from now)
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + 1)

      // Create new subscription
      const subscription = await db.subscription.create({
        data: {
          userId,
          plan: newPlan,
          status: 'ACTIVE',
          startedAt: new Date(),
          expiresAt,
          autoRenew: true
        }
      })

      // Create order record
      await db.order.create({
        data: {
          userId,
          amount,
          currency: 'USD',
          status: 'COMPLETED',
          plan: newPlan,
          promotionalCodeId,
          finalAmount: amount
        }
      })

      // Update user as paid member
      await db.user.update({
        where: { id: userId },
        data: { isPaidMember: true }
      })

      // Process affiliate commission if applicable
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { referredBy: true }
      })

      if (user?.referredBy) {
        try {
          const { MembershipReferralService } = await import('./membership-referral')
          await MembershipReferralService.processMembershipPurchase(userId, newPlan, amount)
        } catch (error) {
          console.error('Error processing affiliate commission:', error)
        }
      }

      return { 
        success: true, 
        subscriptionId: subscription.id 
      }
    } catch (error) {
      console.error('Error upgrading membership:', error)
      return { 
        success: false, 
        message: 'Failed to upgrade membership' 
      }
    }
  }

  /**
   * Get days until end of month
   */
  private static getDaysUntilMonthEnd(): number {
    const now = new Date()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const diffTime = endOfMonth.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  /**
   * Get membership statistics for admin dashboard
   */
  static async getMembershipStats(): Promise<{
    totalUsers: number
    paidMembers: number
    planDistribution: Record<SubscriptionPlan, number>
    totalRevenue: number
    averageRevenuePerUser: number
  }> {
    try {
      const [
        totalUsers,
        paidMembers,
        planStats,
        revenueStats
      ] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { isPaidMember: true } }),
        db.subscription.groupBy({
          by: ['plan'],
          where: { status: 'ACTIVE' },
          _count: { plan: true }
        }),
        db.order.aggregate({
          where: { status: 'COMPLETED' },
          _sum: { finalAmount: true }
        })
      ])

      const planDistribution = planStats.reduce((acc, stat) => {
        acc[stat.plan] = stat._count.plan
        return acc
      }, {} as Record<SubscriptionPlan, number>)

      const totalRevenue = revenueStats._sum.finalAmount || 0
      const averageRevenuePerUser = paidMembers > 0 ? totalRevenue / paidMembers : 0

      return {
        totalUsers,
        paidMembers,
        planDistribution,
        totalRevenue,
        averageRevenuePerUser
      }
    } catch (error) {
      console.error('Error getting membership stats:', error)
      return {
        totalUsers: 0,
        paidMembers: 0,
        planDistribution: {} as Record<SubscriptionPlan, number>,
        totalRevenue: 0,
        averageRevenuePerUser: 0
      }
    }
  }

  /**
   * Check if user needs to upgrade their plan based on usage patterns
   */
  static async getUpgradeRecommendation(userId: string): Promise<{
    needsUpgrade: boolean
    recommendedPlan?: MembershipPlan
    reasons: string[]
  }> {
    try {
      const status = await this.getMembershipStatus(userId)
      
      if (!status.plan || !status.limits) {
        return {
          needsUpgrade: false,
          reasons: ['No active membership plan']
        }
      }

      const reasons: string[] = []
      let needsUpgrade = false

      // Check AI generations usage
      const aiUsagePercentage = status.usage.aiGenerationsUsed / status.limits.aiGenerationsPerMonth
      if (aiUsagePercentage > 0.8) {
        reasons.push(`AI generation usage at ${Math.round(aiUsagePercentage * 100)}%`)
        needsUpgrade = true
      }

      // Check distributions usage
      const distUsagePercentage = status.usage.distributionsUsed / status.limits.distributionsPerMonth
      if (distUsagePercentage > 0.8 && status.limits.distributionsPerMonth < 999999) {
        reasons.push(`Distribution usage at ${Math.round(distUsagePercentage * 100)}%`)
        needsUpgrade = true
      }

      // Check storage usage
      const storageUsagePercentage = status.usage.storageUsedMB / status.limits.storageMB
      if (storageUsagePercentage > 0.8) {
        reasons.push(`Storage usage at ${Math.round(storageUsagePercentage * 100)}%`)
        needsUpgrade = true
      }

      // Get recommended plan
      let recommendedPlan: MembershipPlan | undefined
      if (needsUpgrade) {
        const usagePattern = {
          aiGenerationsPerMonth: status.usage.aiGenerationsUsed,
          distributionsPerMonth: status.usage.distributionsUsed,
          storageMB: status.usage.storageUsedMB,
          apiCallsPerMonth: status.usage.apiCallsUsed
        }
        recommendedPlan = MembershipConfig.getRecommendedPlan(usagePattern)
      }

      return {
        needsUpgrade,
        recommendedPlan,
        reasons
      }
    } catch (error) {
      console.error('Error getting upgrade recommendation:', error)
      return {
        needsUpgrade: false,
        reasons: ['Error analyzing usage patterns']
      }
    }
  }
}