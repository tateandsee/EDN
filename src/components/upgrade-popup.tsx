'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { MembershipConfig, MembershipPlan } from '@/lib/membership-config'
import { 
  X, 
  Crown, 
  Diamond, 
  Rocket, 
  Star, 
  Zap, 
  ArrowUp, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Gift
} from 'lucide-react'

interface UpgradePopupProps {
  isOpen: boolean
  onClose: () => void
  currentPlan: string
  hitLimit: string
  recommendedPlan?: MembershipPlan
  usagePercentage?: number
}

interface UpgradeOption {
  plan: MembershipPlan
  benefits: string[]
  upgradeReason: string
}

export function UpgradePopup({ 
  isOpen, 
  onClose, 
  currentPlan, 
  hitLimit, 
  recommendedPlan, 
  usagePercentage = 85 
}: UpgradePopupProps) {
  const { isNSFW } = useNSFW()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(recommendedPlan || null)

  const colors = {
    sfw: {
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      bg: 'from-orange-100 via-cyan-100 to-yellow-100',
      cardBg: 'bg-white/90',
      border: 'border-gray-200',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600'
    },
    nsfw: {
      primary: '#FF1493',
      secondary: '#00CED1',
      accent: '#FF4500',
      bg: 'from-pink-900 via-purple-900 to-black',
      cardBg: 'bg-black/80',
      border: 'border-pink-500/30',
      text: 'text-white',
      textSecondary: 'text-gray-300'
    }
  }

  const scheme = colors[isNSFW ? 'nsfw' : 'sfw']

  const getUpgradeOptions = (): UpgradeOption[] => {
    const allPlans = MembershipConfig.getActivePlans()
    const currentPlanIndex = allPlans.findIndex(p => p.id === currentPlan)
    
    if (currentPlanIndex === -1) return []

    const upgradeOptions: UpgradeOption[] = []
    
    // Get next 2-3 higher tiers
    for (let i = currentPlanIndex + 1; i < Math.min(currentPlanIndex + 4, allPlans.length); i++) {
      const plan = allPlans[i]
      const currentPlanLimits = allPlans[currentPlanIndex].limits
      
      const benefits: string[] = []
      
      // Compare limits and highlight improvements
      if (plan.limits.aiGenerationsPerMonth > currentPlanLimits.aiGenerationsPerMonth) {
        const increase = plan.limits.aiGenerationsPerMonth === 999999 ? 'Unlimited' : plan.limits.aiGenerationsPerMonth
        benefits.push(`${increase} AI generations (${currentPlanLimits.aiGenerationsPerMonth} → ${increase})`)
      }
      
      if (plan.limits.distributionsPerMonth > currentPlanLimits.distributionsPerMonth) {
        const increase = plan.limits.distributionsPerMonth === 999999 ? 'Unlimited' : plan.limits.distributionsPerMonth
        benefits.push(`${increase} distributions (${currentPlanLimits.distributionsPerMonth} → ${increase})`)
      }
      
      if (plan.limits.socialPlatforms > currentPlanLimits.socialPlatforms) {
        benefits.push(`${plan.limits.socialPlatforms === 999 ? 'All' : plan.limits.socialPlatforms} social platforms`)
      }
      
      if (plan.limits.storageMB > currentPlanLimits.storageMB) {
        benefits.push(`${plan.limits.storageMB}MB storage (${currentPlanLimits.storageMB}MB → ${plan.limits.storageMB}MB)`)
      }
      
      if (plan.limits.concurrentGenerations > currentPlanLimits.concurrentGenerations) {
        benefits.push(`${plan.limits.concurrentGenerations} concurrent generations`)
      }
      
      // Add unique features
      const uniqueFeatures = plan.features.filter(feature => 
        !allPlans[currentPlanIndex].features.includes(feature)
      )
      benefits.push(...uniqueFeatures.slice(0, 2)) // Add top 2 unique features

      upgradeOptions.push({
        plan,
        benefits,
        upgradeReason: getUpgradeReason(plan, hitLimit)
      })
    }
    
    return upgradeOptions
  }

  const getUpgradeReason = (plan: MembershipPlan, limit: string): string => {
    const reasons = {
      'aiGenerationsPerMonth': `Unlock ${plan.limits.aiGenerationsPerMonth === 999999 ? 'unlimited' : plan.limits.aiGenerationsPerMonth} AI generations per month`,
      'distributionsPerMonth': `Get ${plan.limits.distributionsPerMonth === 999999 ? 'unlimited' : plan.limits.distributionsPerMonth} monthly distributions`,
      'socialPlatforms': `Access ${plan.limits.socialPlatforms === 999 ? 'all' : plan.limits.socialPlatforms} social media platforms`,
      'storageMB': `Expand storage to ${plan.limits.storageMB}MB`,
      'apiCallsPerMonth': `Increase API calls to ${plan.limits.apiCallsPerMonth}`,
      'concurrentGenerations': `Process ${plan.limits.concurrentGenerations} generations simultaneously`
    }
    
    return reasons[limit as keyof typeof reasons] || 'Unlock premium features'
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'ELITE': return <Crown className="h-6 w-6" />
      case 'MASTER': return <Diamond className="h-6 w-6" />
      case 'ULTIMATE': return <Rocket className="h-6 w-6" />
      default: return <Star className="h-6 w-6" />
    }
  }

  const handleUpgrade = async (plan: MembershipPlan) => {
    if (!user) return
    
    setIsProcessing(true)
    try {
      // Simulate upgrade process - in real implementation, this would call payment API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, show success
      alert(`Upgrade to ${plan.displayName} successful! (Demo)`)
      onClose()
    } catch (error) {
      console.error('Upgrade failed:', error)
      alert('Upgrade failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const upgradeOptions = getUpgradeOptions()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <Card className={`${scheme.cardBg} backdrop-blur-sm border-2 ${scheme.border} shadow-2xl`}>
              {/* Header */}
              <CardHeader className="relative pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors"
                >
                  <X className={`h-5 w-5 ${scheme.text}`} />
                </button>
                
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <CardTitle className={`text-2xl font-bold mb-2 ${scheme.text}`}>
                    Upgrade Required
                  </CardTitle>
                  
                  <CardDescription className={`text-lg ${scheme.textSecondary}`}>
                    You've reached your {hitLimit.replace(/([A-Z])/g, ' $1').toLowerCase()} limit ({usagePercentage}% used)
                  </CardDescription>
                  
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/50">
                    <TrendingUp className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-300">
                      Unlock more features and higher limits
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              {/* Content */}
              <CardContent className="px-6 pb-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upgradeOptions.map((option, index) => (
                    <motion.div
                      key={option.plan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                        selectedPlan?.id === option.plan.id
                          ? 'border-yellow-400 bg-yellow-400/10'
                          : scheme.border
                      }`}
                      onClick={() => setSelectedPlan(option.plan)}
                    >
                      {/* Recommended Badge */}
                      {option.plan.id === recommendedPlan?.id && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-yellow-500 text-black text-xs font-semibold px-3 py-1">
                            RECOMMENDED
                          </Badge>
                        </div>
                      )}
                      
                      {/* Plan Header */}
                      <div className="text-center mb-4">
                        <div className={`p-3 rounded-lg inline-block mb-2 ${
                          option.plan.id === 'ELITE' ? 'bg-purple-500/20' :
                          option.plan.id === 'MASTER' ? 'bg-blue-500/20' :
                          'bg-yellow-500/20'
                        }`}>
                          <div className={
                            option.plan.id === 'ELITE' ? 'text-purple-400' :
                            option.plan.id === 'MASTER' ? 'text-blue-400' :
                            'text-yellow-400'
                          }>
                            {getPlanIcon(option.plan.id)}
                          </div>
                        </div>
                        
                        <h3 className={`text-xl font-bold ${scheme.text}`}>
                          {option.plan.displayName}
                        </h3>
                        
                        <div className={`text-2xl font-bold mt-2 ${scheme.text}`}>
                          ${option.plan.price.monthly}
                          <span className={`text-sm font-normal ${scheme.textSecondary}`}>/month</span>
                        </div>
                        
                        {option.plan.price.annual < option.plan.price.monthly * 12 && (
                          <div className={`text-xs ${scheme.textSecondary} mt-1`}>
                            Save ${(option.plan.price.monthly * 12 - option.plan.price.annual)} annually
                          </div>
                        )}
                      </div>
                      
                      {/* Benefits */}
                      <div className="space-y-3 mb-6">
                        <h4 className={`font-semibold text-sm ${scheme.text} mb-3`}>
                          Key Benefits:
                        </h4>
                        {option.benefits.slice(0, 4).map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className={`text-sm ${scheme.textSecondary}`}>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* Upgrade Button */}
                      <Button
                        className={`w-full ${
                          selectedPlan?.id === option.plan.id
                            ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                            : ''
                        }`}
                        style={selectedPlan?.id !== option.plan.id ? { backgroundColor: scheme.primary } : undefined}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpgrade(option.plan)
                        }}
                        disabled={isProcessing}
                      >
                        {isProcessing && selectedPlan?.id === option.plan.id ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <ArrowUp className="h-4 w-4" />
                            Upgrade Now
                          </div>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                
                {/* Current Plan Info */}
                <div className="mt-8 p-4 rounded-lg bg-black/20 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${scheme.text}`}>Your Current Plan</h4>
                      <p className={`text-sm ${scheme.textSecondary}`}>
                        {MembershipConfig.getPlanById(currentPlan)?.displayName || 'Free Plan'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${scheme.text}`}>
                        {usagePercentage}% Used
                      </div>
                      <div className={`text-xs ${scheme.textSecondary}`}>
                        {usagePercentage >= 100 ? 'Limit reached' : 'Approaching limit'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing upgrade popups
export function useUpgradePopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string>('FREE')
  const [hitLimit, setHitLimit] = useState<string>('')
  const [recommendedPlan, setRecommendedPlan] = useState<MembershipPlan>()
  const [usagePercentage, setUsagePercentage] = useState<number>(85)

  const showUpgradePopup = (
    plan: string,
    limit: string,
    recommended?: MembershipPlan,
    usagePercent?: number
  ) => {
    setCurrentPlan(plan)
    setHitLimit(limit)
    setRecommendedPlan(recommended)
    setUsagePercentage(usagePercent || 85)
    setIsOpen(true)
  }

  const hideUpgradePopup = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    showUpgradePopup,
    hideUpgradePopup,
    currentPlan,
    hitLimit,
    recommendedPlan,
    usagePercentage
  }
}