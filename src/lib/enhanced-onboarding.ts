/**
 * Enhanced User Onboarding System
 * Complete user registration flow with guided onboarding and progress tracking
 */

import { db } from '@/lib/db'
import { enhancedAuth } from '@/lib/enhanced-auth'
import { GamificationProgressService } from '@/lib/gamification-progress'

export interface OnboardingStep {
  id: string
  name: string
  description: string
  order: number
  pointsReward: number
  isRequired: boolean
  isCompleted: boolean
  category: 'account' | 'profile' | 'preferences' | 'tutorial' | 'verification'
  icon: string
  estimatedTime: number // in minutes
}

export interface OnboardingProgress {
  userId: string
  completedSteps: string[]
  currentStep: string
  totalSteps: number
  completedStepsCount: number
  progressPercentage: number
  pointsEarned: number
  totalPossiblePoints: number
  startedAt: string
  lastActivityAt: string
  estimatedCompletionTime?: string
}

export interface UserProfileData {
  name: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    onlyfans?: string
    fansly?: string
    other?: string[]
  }
  interests?: string[]
  contentPreferences?: {
    nsfwPreference: 'sfw' | 'nsfw' | 'both'
    contentTypes: string[]
    categories: string[]
  }
  notificationPreferences?: {
    email: boolean
    push: boolean
    marketing: boolean
    updates: boolean
  }
}

export interface OnboardingPreferences {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  primaryUseCase: 'content_creation' | 'business' | 'personal' | 'education' | 'research'
  interests: string[]
  goals: string[]
  preferredPlatforms: string[]
  contentFrequency: 'daily' | 'weekly' | 'monthly' | 'occasionally'
  budgetRange: 'free' | 'low' | 'medium' | 'high' | 'enterprise'
}

class EnhancedOnboardingService {
  private onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      name: 'Welcome to EDN',
      description: 'Get started with your AI content creation journey',
      order: 1,
      pointsReward: 50,
      isRequired: true,
      isCompleted: false,
      category: 'account',
      icon: '🎉',
      estimatedTime: 2
    },
    {
      id: 'profile_setup',
      name: 'Complete Your Profile',
      description: 'Add your personal information and profile picture',
      order: 2,
      pointsReward: 100,
      isRequired: true,
      isCompleted: false,
      category: 'profile',
      icon: '👤',
      estimatedTime: 5
    },
    {
      id: 'preferences',
      name: 'Set Your Preferences',
      description: 'Configure your content preferences and notification settings',
      order: 3,
      pointsReward: 75,
      isRequired: true,
      isCompleted: false,
      category: 'preferences',
      icon: '⚙️',
      estimatedTime: 3
    },
    {
      id: 'content_tutorial',
      name: 'Content Creation Tutorial',
      description: 'Learn how to create AI-generated content',
      order: 4,
      pointsReward: 150,
      isRequired: true,
      isCompleted: false,
      category: 'tutorial',
      icon: '🎨',
      estimatedTime: 10
    },
    {
      id: 'platform_connection',
      name: 'Connect Your Platforms',
      description: 'Link your social media and content platforms',
      order: 5,
      pointsReward: 100,
      isRequired: false,
      isCompleted: false,
      category: 'tutorial',
      icon: '🔗',
      estimatedTime: 8
    },
    {
      id: 'first_creation',
      name: 'Create Your First Content',
      description: 'Generate your first AI-powered content',
      order: 6,
      pointsReward: 200,
      isRequired: true,
      isCompleted: false,
      category: 'tutorial',
      icon: '✨',
      estimatedTime: 15
    },
    {
      id: 'explore_features',
      name: 'Explore Features',
      description: 'Discover all the features EDN has to offer',
      order: 7,
      pointsReward: 75,
      isRequired: false,
      isCompleted: false,
      category: 'tutorial',
      icon: '🔍',
      estimatedTime: 5
    },
    {
      id: 'verification',
      name: 'Account Verification',
      description: 'Verify your email and complete identity verification',
      order: 8,
      pointsReward: 125,
      isRequired: true,
      isCompleted: false,
      category: 'verification',
      icon: '✅',
      estimatedTime: 3
    },
    {
      id: 'subscription_setup',
      name: 'Choose Your Plan',
      description: 'Select the subscription plan that fits your needs',
      order: 9,
      pointsReward: 100,
      isRequired: false,
      isCompleted: false,
      category: 'account',
      icon: '💎',
      estimatedTime: 5
    },
    {
      id: 'community_join',
      name: 'Join the Community',
      description: 'Connect with other creators and join discussions',
      order: 10,
      pointsReward: 50,
      isRequired: false,
      isCompleted: false,
      category: 'tutorial',
      icon: '👥',
      estimatedTime: 5
    }
  ]

  /**
   * Get onboarding steps for a user
   */
  async getOnboardingSteps(userId: string): Promise<OnboardingStep[]> {
    try {
      // Get user's onboarding progress
      const progress = await this.getOnboardingProgress(userId)
      
      // Map steps with completion status
      return this.onboardingSteps.map(step => ({
        ...step,
        isCompleted: progress.completedSteps.includes(step.id)
      }))
      
    } catch (error) {
      console.error('Get onboarding steps error:', error)
      return this.onboardingSteps
    }
  }

  /**
   * Get onboarding progress for a user
   */
  async getOnboardingProgress(userId: string): Promise<OnboardingProgress> {
    try {
      // Get user's progress from database
      const userProgress = await db.userOnboardingProgress.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })

      const completedSteps = userProgress.map(p => p.stepId)
      const currentStep = this.getCurrentStep(completedSteps)
      const totalSteps = this.onboardingSteps.length
      const completedStepsCount = completedSteps.length
      const progressPercentage = Math.round((completedStepsCount / totalSteps) * 100)
      
      // Calculate points
      const pointsEarned = this.onboardingSteps
        .filter(step => completedSteps.includes(step.id))
        .reduce((sum, step) => sum + step.pointsReward, 0)
      
      const totalPossiblePoints = this.onboardingSteps
        .reduce((sum, step) => sum + step.pointsReward, 0)

      // Estimate completion time
      const estimatedCompletionTime = this.estimateCompletionTime(completedSteps)

      return {
        userId,
        completedSteps,
        currentStep,
        totalSteps,
        completedStepsCount,
        progressPercentage,
        pointsEarned,
        totalPossiblePoints,
        startedAt: userProgress[0]?.createdAt || new Date().toISOString(),
        lastActivityAt: userProgress[0]?.updatedAt || new Date().toISOString(),
        estimatedCompletionTime
      }

    } catch (error) {
      console.error('Get onboarding progress error:', error)
      return {
        userId,
        completedSteps: [],
        currentStep: 'welcome',
        totalSteps: this.onboardingSteps.length,
        completedStepsCount: 0,
        progressPercentage: 0,
        pointsEarned: 0,
        totalPossiblePoints: this.onboardingSteps.reduce((sum, step) => sum + step.pointsReward, 0),
        startedAt: new Date().toISOString(),
        lastActivityAt: new Date().toISOString()
      }
    }
  }

  /**
   * Complete an onboarding step
   */
  async completeStep(userId: string, stepId: string, additionalData?: any): Promise<boolean> {
    try {
      const step = this.onboardingSteps.find(s => s.id === stepId)
      if (!step) {
        throw new Error('Invalid step ID')
      }

      // Check if step is already completed
      const existingProgress = await db.userOnboardingProgress.findUnique({
        where: {
          userId_stepId: {
            userId,
            stepId
          }
        }
      })

      if (existingProgress) {
        return true // Already completed
      }

      // Record step completion
      await db.userOnboardingProgress.create({
        data: {
          userId,
          stepId,
          completedAt: new Date(),
          additionalData: additionalData || {}
        }
      })

      // Award points for completing the step
      if (step.pointsReward > 0) {
        await GamificationProgressService.awardPoints(
          userId,
          step.pointsReward,
          `Completed onboarding step: ${step.name}`
        )
      }

      // Handle step-specific logic
      await this.handleStepCompletion(userId, stepId, additionalData)

      // Check if all required steps are completed
      const progress = await this.getOnboardingProgress(userId)
      const requiredSteps = this.onboardingSteps.filter(s => s.isRequired)
      const completedRequiredSteps = requiredSteps.filter(s => progress.completedSteps.includes(s.id))

      if (completedRequiredSteps.length === requiredSteps.length) {
        // Mark onboarding as completed
        await db.user.update({
          where: { id: userId },
          data: {
            onboardingCompleted: true
          }
        })

        // Award bonus points for completing onboarding
        await GamificationProgressService.awardPoints(
          userId,
          500,
          'Completed full onboarding process'
        )
      }

      return true

    } catch (error) {
      console.error('Complete step error:', error)
      return false
    }
  }

  /**
   * Handle step-specific completion logic
   */
  private async handleStepCompletion(userId: string, stepId: string, additionalData?: any): Promise<void> {
    switch (stepId) {
      case 'profile_setup':
        await this.handleProfileSetup(userId, additionalData)
        break
      
      case 'preferences':
        await this.handlePreferencesSetup(userId, additionalData)
        break
      
      case 'first_creation':
        await this.handleFirstCreation(userId, additionalData)
        break
      
      case 'platform_connection':
        await this.handlePlatformConnection(userId, additionalData)
        break
      
      case 'verification':
        await this.handleVerification(userId, additionalData)
        break
    }
  }

  /**
   * Handle profile setup step
   */
  private async handleProfileSetup(userId: string, profileData: UserProfileData): Promise<void> {
    try {
      await db.user.update({
        where: { id: userId },
        data: {
          name: profileData.name,
          avatar: profileData.avatar,
          bio: profileData.bio
        }
      })
    } catch (error) {
      console.error('Handle profile setup error:', error)
    }
  }

  /**
   * Handle preferences setup step
   */
  private async handlePreferencesSetup(userId: string, preferences: OnboardingPreferences): Promise<void> {
    try {
      // Store preferences in user metadata or separate preferences table
      // For now, we'll store it in the user's bio field as JSON (in production, use a separate table)
      await db.user.update({
        where: { id: userId },
        data: {
          bio: JSON.stringify({
            preferences,
            updatedAt: new Date().toISOString()
          })
        }
      })
    } catch (error) {
      console.error('Handle preferences setup error:', error)
    }
  }

  /**
   * Handle first creation step
   */
  private async handleFirstCreation(userId: string, creationData: any): Promise<void> {
    try {
      // Record the first content creation
      await db.content.create({
        data: {
          userId,
          title: creationData.title || 'First Creation',
          description: creationData.description || 'My first AI-generated content',
          type: creationData.type || 'IMAGE',
          status: 'PUBLISHED',
          url: creationData.url,
          thumbnail: creationData.thumbnail
        }
      })
    } catch (error) {
      console.error('Handle first creation error:', error)
    }
  }

  /**
   * Handle platform connection step
   */
  private async handlePlatformConnection(userId: string, platformData: any): Promise<void> {
    try {
      // Connect platforms (simplified version)
      if (platformData.platforms && Array.isArray(platformData.platforms)) {
        for (const platformId of platformData.platforms) {
          await db.platformConnection.create({
            data: {
              userId,
              platformId,
              isConnected: true,
              authData: platformData.authData || {}
            }
          })
        }
      }
    } catch (error) {
      console.error('Handle platform connection error:', error)
    }
  }

  /**
   * Handle verification step
   */
  private async handleVerification(userId: string, verificationData: any): Promise<void> {
    try {
      // Mark user as verified
      await db.user.update({
        where: { id: userId },
        data: {
          verified: true,
          emailVerified: verificationData.emailVerified || true
        }
      })
    } catch (error) {
      console.error('Handle verification error:', error)
    }
  }

  /**
   * Get current step based on completed steps
   */
  private getCurrentStep(completedSteps: string[]): string {
    for (const step of this.onboardingSteps) {
      if (!completedSteps.includes(step.id)) {
        return step.id
      }
    }
    return 'completed'
  }

  /**
   * Estimate completion time
   */
  private estimateCompletionTime(completedSteps: string[]): string {
    const remainingSteps = this.onboardingSteps.filter(step => !completedSteps.includes(step.id))
    const totalMinutes = remainingSteps.reduce((sum, step) => sum + step.estimatedTime, 0)
    
    if (totalMinutes === 0) return 'Completed'
    
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    
    if (hours > 0) {
      return `~${hours}h ${minutes}m remaining`
    }
    
    return `~${minutes}m remaining`
  }

  /**
   * Get step by ID
   */
  getStepById(stepId: string): OnboardingStep | undefined {
    return this.onboardingSteps.find(step => step.id === stepId)
  }

  /**
   * Get steps by category
   */
  getStepsByCategory(category: OnboardingStep['category']): OnboardingStep[] {
    return this.onboardingSteps.filter(step => step.category === category)
  }

  /**
   * Get next step for user
   */
  async getNextStep(userId: string): Promise<OnboardingStep | null> {
    try {
      const progress = await this.getOnboardingProgress(userId)
      const currentStep = this.getStepById(progress.currentStep)
      
      if (!currentStep || progress.currentStep === 'completed') {
        return null
      }
      
      return currentStep
    } catch (error) {
      console.error('Get next step error:', error)
      return null
    }
  }

  /**
   * Skip onboarding step (for optional steps)
   */
  async skipStep(userId: string, stepId: string): Promise<boolean> {
    try {
      const step = this.getStepById(stepId)
      if (!step || step.isRequired) {
        return false // Cannot skip required steps
      }

      // Mark as skipped (completed with skipped flag)
      await db.userOnboardingProgress.create({
        data: {
          userId,
          stepId,
          completedAt: new Date(),
          additionalData: { skipped: true }
        }
      })

      return true
    } catch (error) {
      console.error('Skip step error:', error)
      return false
    }
  }

  /**
   * Reset onboarding progress
   */
  async resetOnboarding(userId: string): Promise<boolean> {
    try {
      await db.userOnboardingProgress.deleteMany({
        where: { userId }
      })

      await db.user.update({
        where: { id: userId },
        data: {
          onboardingCompleted: false
        }
      })

      return true
    } catch (error) {
      console.error('Reset onboarding error:', error)
      return false
    }
  }

  /**
   * Get onboarding statistics
   */
  async getOnboardingStats(): Promise<{
    totalUsers: number
    completedOnboarding: number
    inProgress: number
    notStarted: number
    averageCompletionTime: number
    mostSkippedStep: string
  }> {
    try {
      const totalUsers = await db.user.count()
      const completedUsers = await db.user.count({
        where: { onboardingCompleted: true }
      })

      const usersWithProgress = await db.userOnboardingProgress.groupBy({
        by: ['userId'],
        _count: {
          userId: true
        }
      })

      const inProgress = usersWithProgress.filter(user => user._count.userId > 0 && user._count.userId < this.onboardingSteps.length).length
      const notStarted = totalUsers - completedUsers - inProgress

      // Calculate average completion time (simplified)
      const averageCompletionTime = 25 // minutes (placeholder)

      // Find most skipped step (simplified)
      const mostSkippedStep = 'platform_connection' // placeholder

      return {
        totalUsers,
        completedOnboarding: completedUsers,
        inProgress,
        notStarted,
        averageCompletionTime,
        mostSkippedStep
      }
    } catch (error) {
      console.error('Get onboarding stats error:', error)
      return {
        totalUsers: 0,
        completedOnboarding: 0,
        inProgress: 0,
        notStarted: 0,
        averageCompletionTime: 0,
        mostSkippedStep: ''
      }
    }
  }
}

// Export singleton instance
export const enhancedOnboarding = new EnhancedOnboardingService()

// Export types
export type { OnboardingStep, OnboardingProgress, UserProfileData, OnboardingPreferences }