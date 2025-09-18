import { db } from '@/lib/db'

export interface GamificationProgress {
  userPoints: number
  currentLevel: {
    id: string
    name: string
    minPoints: number
    maxPoints?: number
  }
  nextLevel: {
    id: string
    name: string
    minPoints: number
    maxPoints?: number
  } | null
  progressToNextLevel: number
  badges: Array<{
    id: string
    name: string
    description: string
    iconUrl?: string
    awardedAt: string
  }>
  achievements: Array<{
    id: string
    name: string
    description: string
    category: string
    points: number
    tier: string
    unlocked: boolean
    unlockedAt?: string
  }>
  challenges: Array<{
    id: string
    name: string
    description: string
    progress: number
    maxProgress: number
    completed: boolean
    timeLeft?: string
    reward: number
  }>
  rewards: Array<{
    id: string
    name: string
    description: string
    pointsCost: number
    type: string
    stock?: number
    isNsfw: boolean
    redeemed: boolean
    redeemedAt?: string
  }>
  stats: {
    totalAchievements: number
    unlockedAchievements: number
    totalChallenges: number
    completedChallenges: number
    totalRewards: number
    redeemedRewards: number
  }
}

export class GamificationProgressService {
  static async getUserProgress(userId: string): Promise<GamificationProgress> {
    try {
      // Get user data with points and current level
      const user = await db.user.findUnique({
        where: { id: userId },
        include: {
          currentLevel: true,
          userBadges: {
            include: {
              badge: true
            }
          },
          userRewards: {
            include: {
              reward: true
            }
          }
        }
      })

      if (!user) {
        throw new Error('User not found')
      }

      // Get all levels for progression calculation
      const levels = await db.level.findMany({
        orderBy: { minPoints: 'asc' }
      })

      // Find current and next level
      const currentLevel = user.currentLevel || levels[0]
      const nextLevel = levels.find(level => level.minPoints > user.points) || null

      // Calculate progress to next level
      let progressToNextLevel = 100
      if (nextLevel && currentLevel) {
        const levelRange = nextLevel.minPoints - currentLevel.minPoints
        const userProgress = user.points - currentLevel.minPoints
        progressToNextLevel = Math.min((userProgress / levelRange) * 100, 100)
      }

      // Get user badges
      const badges = user.userBadges.map(userBadge => ({
        id: userBadge.badge.id,
        name: userBadge.badge.name,
        description: userBadge.badge.description,
        iconUrl: userBadge.badge.iconUrl,
        awardedAt: userBadge.awardedAt.toISOString()
      }))

      // Get all achievements and user's progress
      const achievements = await db.achievement.findMany({
        where: { isActive: true },
        orderBy: { points: 'asc' }
      })

      // For now, we'll simulate achievement progress
      // In a real implementation, you'd track user achievement progress in the database
      const userAchievements = achievements.map(achievement => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        points: achievement.points,
        tier: achievement.tier,
        unlocked: user.points >= achievement.points, // Simple unlock logic
        unlockedAt: user.points >= achievement.points ? new Date().toISOString() : undefined
      }))

      // Get active challenges (for now, we'll simulate this)
      // In a real implementation, you'd have user-specific challenge tracking
      const challenges = [
        {
          id: 'weekly-creator',
          name: 'Weekly Creator Challenge',
          description: 'Create 5 pieces of content this week',
          progress: Math.min(user.contents?.length || 0, 5),
          maxProgress: 5,
          completed: (user.contents?.length || 0) >= 5,
          timeLeft: '2 days',
          reward: 100
        },
        {
          id: 'community-engagement',
          name: 'Community Engagement',
          description: 'Interact with 20 community posts',
          progress: Math.floor(Math.random() * 20),
          maxProgress: 20,
          completed: false,
          timeLeft: '5 days',
          reward: 75
        },
        {
          id: 'marketplace-success',
          name: 'Marketplace Success',
          description: 'Make 3 sales in the marketplace',
          progress: Math.min(user.marketplaceItems?.length || 0, 3),
          maxProgress: 3,
          completed: (user.marketplaceItems?.length || 0) >= 3,
          timeLeft: '10 days',
          reward: 150
        }
      ]

      // Get available rewards
      const rewards = await db.reward.findMany({
        where: { isActive: true },
        orderBy: { pointsCost: 'asc' }
      })

      const userRewards = rewards.map(reward => {
        const userReward = user.userRewards.find(ur => ur.rewardId === reward.id)
        return {
          id: reward.id,
          name: reward.name,
          description: reward.description,
          pointsCost: reward.pointsCost,
          type: reward.type,
          stock: reward.stock,
          isNsfw: reward.isNsfw,
          redeemed: !!userReward,
          redeemedAt: userReward?.redeemedAt?.toISOString()
        }
      })

      // Calculate stats
      const stats = {
        totalAchievements: achievements.length,
        unlockedAchievements: userAchievements.filter(a => a.unlocked).length,
        totalChallenges: challenges.length,
        completedChallenges: challenges.filter(c => c.completed).length,
        totalRewards: rewards.length,
        redeemedRewards: user.userRewards.length
      }

      return {
        userPoints: user.points,
        currentLevel: {
          id: currentLevel.id,
          name: currentLevel.name,
          minPoints: currentLevel.minPoints,
          maxPoints: currentLevel.maxPoints
        },
        nextLevel: nextLevel ? {
          id: nextLevel.id,
          name: nextLevel.name,
          minPoints: nextLevel.minPoints,
          maxPoints: nextLevel.maxPoints
        } : null,
        progressToNextLevel,
        badges,
        achievements: userAchievements,
        challenges,
        rewards: userRewards,
        stats
      }
    } catch (error) {
      console.error('Error fetching gamification progress:', error)
      throw error
    }
  }

  static async awardPoints(userId: string, points: number, reason: string): Promise<void> {
    try {
      // Update user points
      const user = await db.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: points
          }
        }
      })

      // Check if user should level up
      const levels = await db.level.findMany({
        orderBy: { minPoints: 'asc' }
      })

      const newLevel = levels.find(level => level.minPoints <= user.points && (!level.maxPoints || level.maxPoints >= user.points))
      
      if (newLevel && newLevel.id !== user.currentLevelId) {
        await db.user.update({
          where: { id: userId },
          data: {
            currentLevelId: newLevel.id
          }
        })
      }

      // Log the points award (you might want to create a points transaction table)
      console.log(`Awarded ${points} points to user ${userId} for: ${reason}`)
    } catch (error) {
      console.error('Error awarding points:', error)
      throw error
    }
  }

  static async redeemReward(userId: string, rewardId: string): Promise<boolean> {
    try {
      // Get user and reward
      const [user, reward] = await Promise.all([
        db.user.findUnique({ where: { id: userId } }),
        db.reward.findUnique({ where: { id: rewardId } })
      ])

      if (!user || !reward) {
        throw new Error('User or reward not found')
      }

      // Check if user has enough points
      if (user.points < reward.pointsCost) {
        throw new Error('Insufficient points')
      }

      // Check if reward is in stock
      if (reward.stock !== null && reward.stock <= 0) {
        throw new Error('Reward out of stock')
      }

      // Check if user already redeemed this reward
      const existingRedemption = await db.userReward.findFirst({
        where: {
          userId,
          rewardId
        }
      })

      if (existingRedemption) {
        throw new Error('Reward already redeemed')
      }

      // Use transaction to ensure data consistency
      await db.$transaction(async (tx) => {
        // Deduct points from user
        await tx.user.update({
          where: { id: userId },
          data: {
            points: {
              decrement: reward.pointsCost
            }
          }
        })

        // Create user reward record
        await tx.userReward.create({
          data: {
            userId,
            rewardId,
            status: 'COMPLETED'
          }
        })

        // Update reward stock if applicable
        if (reward.stock !== null) {
          await tx.reward.update({
            where: { id: rewardId },
            data: {
              stock: {
                decrement: 1
              }
            }
          })
        }
      })

      return true
    } catch (error) {
      console.error('Error redeeming reward:', error)
      throw error
    }
  }

  static async updateChallengeProgress(userId: string, challengeId: string, progress: number): Promise<void> {
    try {
      // For now, we'll simulate challenge progress
      // In a real implementation, you'd have a user challenge progress table
      console.log(`Updated challenge ${challengeId} progress for user ${userId}: ${progress}`)
    } catch (error) {
      console.error('Error updating challenge progress:', error)
      throw error
    }
  }
}