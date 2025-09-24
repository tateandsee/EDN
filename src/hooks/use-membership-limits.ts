'use client'

import { useState, useEffect, useCallback } from 'react'
import { MembershipService } from '@/lib/membership-service'
import { MembershipConfig, MembershipPlan } from '@/lib/membership-config'
import { useAuth } from '@/contexts/auth-context'
import { useUpgradePopup } from '@/components/upgrade-popup'

export interface UseMembershipLimitsReturn {
  /**
   * Check if user can perform an action
   */
  canPerformAction: (action: keyof import('@/lib/membership-config').MembershipLimits, amount?: number) => Promise<{
    canPerform: boolean
    reason?: string
    remaining?: number
  }>
  
  /**
   * Record usage for an action (shows upgrade popup if limit reached)
   */
  recordUsage: (action: keyof import('@/lib/membership-config').MembershipLimits, amount?: number) => Promise<{
    success: boolean
    message?: string
    newUsage?: number
  }>
  
  /**
   * Get current membership status
   */
  getMembershipStatus: () => Promise<import('@/lib/membership-service').MembershipStatus>
  
  /**
   * Check if user needs upgrade based on usage patterns
   */
  checkUpgradeNeeded: () => Promise<{
    needsUpgrade: boolean
    recommendedPlan?: MembershipPlan
    reasons: string[]
  }>
  
  /**
   * Current membership status
   */
  membershipStatus: import('@/lib/membership-service').MembershipStatus | null
  
  /**
   * Loading state
   */
  isLoading: boolean
  
  /**
   * Error state
   */
  error: string | null
}

export function useMembershipLimits(): UseMembershipLimitsReturn {
  const { user } = useAuth()
  const { showUpgradePopup } = useUpgradePopup()
  const [membershipStatus, setMembershipStatus] = useState<import('@/lib/membership-service').MembershipStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load membership status on mount and when user changes
  useEffect(() => {
    if (user) {
      loadMembershipStatus()
    } else {
      setMembershipStatus(null)
      setError(null)
    }
  }, [user])

  const loadMembershipStatus = useCallback(async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const status = await MembershipService.getMembershipStatus(user.id)
      setMembershipStatus(status)
    } catch (err) {
      console.error('Error loading membership status:', err)
      setError('Failed to load membership status')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const canPerformAction = useCallback(async (
    action: keyof import('@/lib/membership-config').MembershipLimits,
    amount: number = 1
  ) => {
    if (!user) {
      return { canPerform: false, reason: 'User not authenticated' }
    }

    try {
      const result = await MembershipService.canPerformAction(user.id, action, amount)
      return result
    } catch (err) {
      console.error('Error checking action permission:', err)
      return { canPerform: false, reason: 'Failed to check permissions' }
    }
  }, [user])

  const recordUsage = useCallback(async (
    action: keyof import('@/lib/membership-config').MembershipLimits,
    amount: number = 1
  ) => {
    if (!user) {
      return { success: false, message: 'User not authenticated' }
    }

    try {
      // First check if user can perform the action
      const canPerform = await canPerformAction(action, amount)
      
      if (!canPerform.canPerform) {
        // Get current plan and recommended upgrade
        const currentPlan = membershipStatus?.plan?.id || 'FREE'
        const recommendation = await MembershipService.getUpgradeRecommendation(user.id)
        
        // Show upgrade popup
        showUpgradePopup(
          currentPlan,
          action,
          recommendation.recommendedPlan,
          membershipStatus ? 
            (membershipStatus.usage[action as keyof import('@/lib/membership-service').MembershipUsage] as number / 
             membershipStatus.limits![action as keyof import('@/lib/membership-config').MembershipLimits] as number) * 100 : 85
        )
        
        return { 
          success: false, 
          message: canPerform.reason || 'Usage limit exceeded' 
        }
      }

      // Record the usage
      const result = await MembershipService.recordUsage(user.id, action, amount)
      
      // Refresh membership status after recording usage
      await loadMembershipStatus()
      
      return result
    } catch (err) {
      console.error('Error recording usage:', err)
      return { success: false, message: 'Failed to record usage' }
    }
  }, [user, canPerformAction, loadMembershipStatus, membershipStatus, showUpgradePopup])

  const getMembershipStatus = useCallback(async () => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    return await MembershipService.getMembershipStatus(user.id)
  }, [user])

  const checkUpgradeNeeded = useCallback(async () => {
    if (!user) {
      return { needsUpgrade: false, reasons: ['User not authenticated'] }
    }

    try {
      return await MembershipService.getUpgradeRecommendation(user.id)
    } catch (err) {
      console.error('Error checking upgrade needed:', err)
      return { needsUpgrade: false, reasons: ['Error checking upgrade needs'] }
    }
  }, [user])

  return {
    canPerformAction,
    recordUsage,
    getMembershipStatus,
    checkUpgradeNeeded,
    membershipStatus,
    isLoading,
    error
  }
}

// Custom hook for specific limit types
export function useAILimit() {
  const { recordUsage, canPerformAction, membershipStatus } = useMembershipLimits()
  
  return {
    canGenerate: (amount?: number) => canPerformAction('aiGenerationsPerMonth', amount),
    recordGeneration: (amount?: number) => recordUsage('aiGenerationsPerMonth', amount),
    remainingGenerations: membershipStatus?.remaining.aiGenerations || 0,
    totalGenerations: membershipStatus?.limits?.aiGenerationsPerMonth || 0,
    usedGenerations: membershipStatus?.usage.aiGenerationsUsed || 0
  }
}

export function useDistributionLimit() {
  const { recordUsage, canPerformAction, membershipStatus } = useMembershipLimits()
  
  return {
    canDistribute: (amount?: number) => canPerformAction('distributionsPerMonth', amount),
    recordDistribution: (amount?: number) => recordUsage('distributionsPerMonth', amount),
    remainingDistributions: membershipStatus?.remaining.distributions || 0,
    totalDistributions: membershipStatus?.limits?.distributionsPerMonth || 0,
    usedDistributions: membershipStatus?.usage.distributionsUsed || 0
  }
}

export function useStorageLimit() {
  const { recordUsage, canPerformAction, membershipStatus } = useMembershipLimits()
  
  return {
    canUseStorage: (amount?: number) => canPerformAction('storageMB', amount),
    recordStorageUsage: (amount?: number) => recordUsage('storageMB', amount),
    remainingStorage: membershipStatus?.remaining.storageMB || 0,
    totalStorage: membershipStatus?.limits?.storageMB || 0,
    usedStorage: membershipStatus?.usage.storageUsedMB || 0
  }
}

export function useSocialPlatformLimit() {
  const { recordUsage, canPerformAction, membershipStatus } = useMembershipLimits()
  
  return {
    canAddPlatform: () => canPerformAction('socialPlatforms', 1),
    recordPlatformAdded: () => recordUsage('socialPlatforms', 1),
    remainingPlatforms: membershipStatus?.remaining.socialPlatforms || 0,
    totalPlatforms: membershipStatus?.limits?.socialPlatforms || 0,
    usedPlatforms: membershipStatus?.usage.socialPlatformsUsed || 0
  }
}