'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { GamificationProgress, GamificationProgressService } from '@/lib/gamification-progress'
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Gift, 
  Crown, 
  Award, 
  TrendingUp, 
  Users, 
  Rocket,
  Medal,
  Diamond,
  Sparkles,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface GamificationDashboardProps {
  className?: string
}

export function GamificationDashboard({ className }: GamificationDashboardProps) {
  const { isNSFW } = useNSFW()
  const { user, loading } = useAuth()
  const [progress, setProgress] = useState<GamificationProgress | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redeemingReward, setRedeemingReward] = useState<string | null>(null)

  const colors = {
    sfw: {
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      bg: 'from-orange-100 via-cyan-100 to-yellow-100',
      cardBg: 'bg-white/80',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600',
      border: 'border-gray-200'
    },
    nsfw: {
      primary: '#FF1493',
      secondary: '#00CED1',
      accent: '#FF4500',
      bg: 'from-pink-900 via-purple-900 to-black',
      cardBg: 'bg-black/40',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-pink-500/30'
    }
  }

  const scheme = colors[isNSFW ? 'nsfw' : 'sfw']

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return

      try {
        setLoadingProgress(true)
        const response = await fetch('/api/gamification/progress')
        
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
        } else {
          setError('Failed to load gamification progress')
        }
      } catch (error) {
        console.error('Error fetching gamification progress:', error)
        setError('Failed to load gamification progress')
      } finally {
        setLoadingProgress(false)
      }
    }

    fetchProgress()
  }, [user])

  const handleRedeemReward = async (rewardId: string) => {
    if (!user) return

    try {
      setRedeemingReward(rewardId)
      const response = await fetch(`/api/gamification/rewards/${rewardId}/redeem`, {
        method: 'POST'
      })

      if (response.ok) {
        // Refresh progress
        const progressResponse = await fetch('/api/gamification/progress')
        if (progressResponse.ok) {
          const data = await progressResponse.json()
          setProgress(data)
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to redeem reward')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      setError('Failed to redeem reward')
    } finally {
      setRedeemingReward(null)
    }
  }

  if (loading || !user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} flex items-center justify-center`}>
        <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <span className={scheme.text}>Loading gamification progress...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} flex items-center justify-center p-6`}>
        <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border} max-w-md w-full`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              <span className={scheme.text}>{error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} flex items-center justify-center p-6`}>
        <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border} max-w-md w-full`}>
          <CardContent className="p-6">
            <div className="text-center">
              <Trophy className={`h-12 w-12 mx-auto mb-4 ${isNSFW ? 'text-pink-400' : 'text-orange-400'}`} />
              <h3 className={`text-lg font-semibold mb-2 ${scheme.text}`}>No Progress Data</h3>
              <p className={scheme.textSecondary}>Start engaging with the platform to see your gamification progress!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden ${className}`}>
      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
              <Trophy className="h-6 w-6" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-lg font-semibold ${scheme.text}`}>{progress.currentLevel.name}</h3>
                  <p className={`text-sm ${scheme.textSecondary}`}>{progress.userPoints} points</p>
                </div>
                {progress.nextLevel && (
                  <div className="text-right">
                    <h3 className={`text-lg font-semibold ${scheme.text}`}>{progress.nextLevel.name}</h3>
                    <p className={`text-sm ${scheme.textSecondary}`}>{progress.nextLevel.minPoints} points</p>
                  </div>
                )}
              </div>
              <Progress value={progress.progressToNextLevel} className="h-3" />
              <p className={`text-sm ${scheme.textSecondary}`}>
                {progress.nextLevel ? `${Math.round(progress.progressToNextLevel)}% to next level` : 'Maximum level reached!'}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="px-6 pb-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
              <div className={`text-2xl font-bold ${scheme.text}`}>
                {progress.stats.unlockedAchievements}/{progress.stats.totalAchievements}
              </div>
              <p className={`text-sm ${scheme.textSecondary}`}>Achievements</p>
            </CardContent>
          </Card>
          
          <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-orange-400" />
              <div className={`text-2xl font-bold ${scheme.text}`}>
                {progress.stats.completedChallenges}/{progress.stats.totalChallenges}
              </div>
              <p className={`text-sm ${scheme.textSecondary}`}>Challenges</p>
            </CardContent>
          </Card>
          
          <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
            <CardContent className="p-4 text-center">
              <Gift className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <div className={`text-2xl font-bold ${scheme.text}`}>
                {progress.stats.redeemedRewards}/{progress.stats.totalRewards}
              </div>
              <p className={`text-sm ${scheme.textSecondary}`}>Rewards</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="px-6 pb-6"
      >
        <h2 className={`text-2xl font-bold mb-4 ${scheme.text}`}>Achievements</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border} h-full ${achievement.unlocked ? 'ring-2 ring-yellow-400' : 'opacity-60'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Sparkles className={`h-6 w-6 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`} />
                    <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                      {achievement.unlocked ? 'Unlocked' : 'Locked'}
                    </Badge>
                  </div>
                  <CardTitle className={`text-sm ${scheme.text}`}>{achievement.name}</CardTitle>
                  <CardDescription className={`text-xs ${scheme.textSecondary}`}>
                    {achievement.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className={`text-sm ${scheme.text}`}>{achievement.points} points</span>
                  </div>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className={`text-xs mt-2 ${scheme.textSecondary}`}>
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Active Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="px-6 pb-6"
      >
        <h2 className={`text-2xl font-bold mb-4 ${scheme.text}`}>Active Challenges</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.challenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Target className="h-6 w-6 text-orange-400" />
                    {challenge.timeLeft && (
                      <Badge variant="outline" className={scheme.textSecondary}>
                        <Clock className="h-3 w-3 mr-1" />
                        {challenge.timeLeft}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className={`text-sm ${scheme.text}`}>{challenge.name}</CardTitle>
                  <CardDescription className={`text-xs ${scheme.textSecondary}`}>
                    {challenge.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${scheme.textSecondary}`}>Progress</span>
                      <span className={`text-sm ${scheme.text}`}>{challenge.progress}/{challenge.maxProgress}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="h-2" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-400" />
                        <span className={`text-sm ${scheme.text}`}>{challenge.reward} points</span>
                      </div>
                      {challenge.completed && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Rewards Shop */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="px-6 pb-6"
      >
        <h2 className={`text-2xl font-bold mb-4 ${scheme.text}`}>Rewards Shop</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {progress.rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border} h-full ${reward.redeemed ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <Diamond className="h-8 w-8 text-purple-400 mb-2" />
                  <CardTitle className={`text-sm ${scheme.text}`}>{reward.name}</CardTitle>
                  <CardDescription className={`text-xs ${scheme.textSecondary}`}>
                    {reward.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${scheme.textSecondary}`}>Cost</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className={`text-sm ${scheme.text}`}>{reward.pointsCost}</span>
                      </div>
                    </div>
                    
                    {reward.stock !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${scheme.textSecondary}`}>Stock</span>
                        <span className={`text-sm ${scheme.text}`}>{reward.stock} left</span>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full" 
                      disabled={progress.userPoints < reward.pointsCost || reward.redeemed || redeemingReward === reward.id}
                      onClick={() => handleRedeemReward(reward.id)}
                      style={{ 
                        backgroundColor: progress.userPoints >= reward.pointsCost && !reward.redeemed ? scheme.primary : undefined,
                        opacity: progress.userPoints >= reward.pointsCost && !reward.redeemed ? 1 : 0.5
                      }}
                    >
                      {redeemingReward === reward.id ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Redeeming...
                        </div>
                      ) : reward.redeemed ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Redeemed
                        </div>
                      ) : progress.userPoints < reward.pointsCost ? (
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Not Enough Points
                        </div>
                      ) : (
                        'Claim Reward'
                      )}
                    </Button>
                    
                    {reward.redeemed && reward.redeemedAt && (
                      <p className={`text-xs text-center ${scheme.textSecondary}`}>
                        Redeemed {new Date(reward.redeemedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      {progress.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="px-6 pb-6"
        >
          <h2 className={`text-2xl font-bold mb-4 ${scheme.text}`}>Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {progress.badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
                  <CardContent className="p-4">
                    {badge.iconUrl ? (
                      <img 
                        src={badge.iconUrl} 
                        alt={badge.name}
                        className="w-12 h-12 mx-auto mb-2 rounded-full"
                      />
                    ) : (
                      <Medal className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
                    )}
                    <h3 className={`text-xs font-semibold ${scheme.text}`}>{badge.name}</h3>
                    <p className={`text-xs ${scheme.textSecondary}`}>{new Date(badge.awardedAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}