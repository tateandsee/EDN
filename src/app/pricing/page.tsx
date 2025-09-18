'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { MembershipConfig, MembershipPlan } from '@/lib/membership-config'
import { CheckCircle, Star, Crown, Zap, Gift, Users, TrendingUp, Sparkles, Rocket, Shield, Target, Award, Tag, X } from 'lucide-react'
import { AIChatSuggestion } from '@/components/ai-chat-suggestion'

export default function PricingPage() {
  const { isNSFW } = useNSFW()
  const { user } = useAuth()
  const [isAnnual, setIsAnnual] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [promoDiscount, setPromoDiscount] = useState<{ amount: number; code: string } | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  
  const nsfwColors = {
    primary: '#FF69B4', // neon pink
    secondary: '#00FFFF', // cyan
    accent: '#FF4500', // burning red
    bg: 'from-pink-900 via-purple-900 to-black',
    cardBg: 'rgba(0, 0, 0, 0.7)',
    cardBorder: 'rgba(255, 255, 255, 0.3)',
    textPrimary: '#F7FAFC', // light gray
    textSecondary: '#E2E8F0', // medium light gray
    textLight: '#CBD5E0', // gray
    textOnWhite: '#1A202C' // text on white backgrounds
  }

  const sfwColors = {
    primary: '#FF6B35', // vibrant coral orange
    secondary: '#4ECDC4', // bright turquoise
    accent: '#FFE66D', // golden yellow
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    particle: '#FF6B35',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(0, 0, 0, 0.2)',
    textPrimary: '#1A202C', // dark gray
    textSecondary: '#2D3748', // medium gray
    textLight: '#4A5568', // light gray
    textOnWhite: '#2D3748' // text on white backgrounds
  }

  const colors = isNSFW ? nsfwColors : sfwColors

  // Get pricing plans from membership configuration
  const pricingPlans = MembershipConfig.getActivePlans()

  // Get feature comparison from membership configuration
  const featureComparison = MembershipConfig.getPlanComparison()

  const getDiscount = (planId: string) => {
    return MembershipConfig.getAnnualDiscount(planId)
  }

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return

    setIsValidating(true)
    setPromoError('')

    try {
      const response = await fetch('/api/promotional-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          planAmount: 50, // Use Pro plan as default for validation
          planName: 'PRO'
        })
      })

      const result = await response.json()

      if (result.isValid) {
        setPromoDiscount({
          amount: result.discountAmount || 0,
          code: promoCode.toUpperCase()
        })
        setPromoError('')
      } else {
        setPromoError(result.error || 'Invalid promotional code')
        setPromoDiscount(null)
      }
    } catch (error) {
      setPromoError('Failed to validate promotional code')
      setPromoDiscount(null)
    } finally {
      setIsValidating(false)
    }
  }

  const removePromoCode = () => {
    setPromoCode('')
    setPromoDiscount(null)
    setPromoError('')
  }

  const getFinalPrice = (originalPrice: number) => {
    if (!promoDiscount) return originalPrice
    return Math.max(0, originalPrice - promoDiscount.amount)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <img 
          src={isNSFW ? "/hero-pricing-nsfw.jpg" : "/hero-pricing-sfw.jpg"} 
          alt="Flexible Pricing Plans" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text pricing ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Value with EDN' : 'Premium Value with EDN'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Choose the perfect plan for your content creation needs
            </p>
          </div>
        </div>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden" style={{ top: '320px' }}>
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: colors.particle || colors.primary,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-8" style={{ paddingTop: '0' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ color: colors.primary }}>
              Flexible Pricing Plans
            </h1>
            <p className="text-xl font-bold" style={{ color: colors.textSecondary }}>
              Choose the perfect plan for your content creation needs
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 rounded-full p-1 flex items-center shadow-lg">
              <Button
                variant={!isAnnual ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsAnnual(false)}
                className={`rounded-full text-sm font-bold ${
                  !isAnnual 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                Monthly
              </Button>
              <Button
                variant={isAnnual ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsAnnual(true)}
                className={`rounded-full text-sm font-bold flex items-center gap-1 ${
                  isAnnual 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-800 hover:bg-gray-200'
                }`}
              >
                Annual
                <Badge className="bg-green-500 text-white text-xs ml-1 font-bold">
                  Save 20%
                </Badge>
              </Button>
            </div>
          </div>

          {/* Promotional Code Section */}
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-md" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4" style={{ color: colors.primary }} />
                  <Label className="text-sm font-medium" style={{ color: colors.primary }}>
                    Promotional Code
                  </Label>
                </div>
                
                {promoDiscount ? (
                  <div className="space-y-2">
                    <Alert className="border-green-500 bg-green-50">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-800">
                        Code "{promoDiscount.code}" applied! You saved ${promoDiscount.amount.toFixed(2)}
                      </AlertDescription>
                    </Alert>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removePromoCode}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Code
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promotional code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1"
                        style={{ 
                          backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white',
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary
                        }}
                      />
                      <Button
                        onClick={validatePromoCode}
                        disabled={isValidating || !promoCode.trim()}
                        size="sm"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {isValidating ? '...' : 'Apply'}
                      </Button>
                    </div>
                    {promoError && (
                      <Alert className="border-red-500 bg-red-50">
                        <AlertDescription className="text-red-800 text-sm">
                          {promoError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`relative ${plan.isHighlighted ? 'lg:scale-105' : ''}`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-yellow-500 text-black font-bold px-4 py-2 text-sm shadow-lg">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                {plan.id === 'ULTIMATE' && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 py-2 text-sm shadow-lg">
                      ULTIMATE EXPERIENCE
                    </Badge>
                  </div>
                )}

                <Card className={`backdrop-blur-sm border-2 h-full ${
                  plan.isHighlighted 
                    ? 'bg-white/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                    : plan.id === 'ULTIMATE'
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'transition-all duration-300 hover:shadow-xl hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: plan.isHighlighted || plan.id === 'ULTIMATE' ? undefined : colors.cardBg,
                  borderColor: plan.isHighlighted ? undefined : plan.id === 'ULTIMATE' ? undefined : colors.cardBorder
                }}>
                  <CardHeader className="text-center">
                    <CardTitle className={`text-2xl font-bold ${plan.id === 'ULTIMATE' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : ''}`} style={{ color: plan.id === 'ULTIMATE' ? undefined : colors.primary }}>
                      {plan.displayName}
                    </CardTitle>
                    <CardDescription className="font-bold" style={{ color: colors.textSecondary }}>
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      {plan.price.monthly === 0 ? (
                        <div className="text-4xl font-bold" style={{ color: colors.primary }}>
                          Free
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="flex items-baseline justify-center">
                            <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                              ${getFinalPrice(isAnnual ? plan.price.annual : plan.price.monthly).toFixed(2)}
                            </span>
                            <span className="ml-2 font-bold" style={{ color: colors.textLight }}>
                              /{isAnnual ? 'year' : 'month'}
                            </span>
                          </div>
                          {promoDiscount && getFinalPrice(isAnnual ? plan.price.annual : plan.price.monthly) < (isAnnual ? plan.price.annual : plan.price.monthly) && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm line-through" style={{ color: colors.textLight }}>
                                ${isAnnual ? plan.price.annual : plan.price.monthly}
                              </span>
                              <Badge className="bg-green-500 text-white text-xs font-bold">
                                Save ${(promoDiscount.amount).toFixed(2)}
                              </Badge>
                            </div>
                          )}
                          {isAnnual && plan.price.monthly > 0 && (
                            <div className="text-sm mt-1 font-bold" style={{ color: '#48BB78' }}>
                              Save {getDiscount(plan.id)}% annually
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className={`w-full ${
                        plan.isHighlighted 
                          ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                          : plan.id === 'ULTIMATE'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400'
                          : ''
                      }`}
                      style={plan.isHighlighted || plan.id === 'ULTIMATE' ? undefined : { backgroundColor: colors.primary }}
                    >
                      Get Started
                    </Button>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#48BB78' }} />
                          <span className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Add AI Chat Suggestions for Elite, Master, and VIP tiers */}
                {(plan.id === 'ELITE' || plan.id === 'MASTER' || plan.id === 'ULTIMATE') && (
                  <AIChatSuggestion 
                    membershipTier={plan.id === 'ULTIMATE' ? 'VIP' : plan.id as 'ELITE' | 'MASTER'}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison */}
          <Card className="backdrop-blur-sm mb-16 shadow-lg border-2" 
            style={{ 
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder
            }}>
            <CardHeader>
              <CardTitle className="text-center font-bold" style={{ color: colors.primary }}>
                Feature Comparison
              </CardTitle>
              <CardDescription className="text-center font-bold" style={{ color: colors.textSecondary }}>
                Compare all plans and choose the right one for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: colors.cardBorder }}>
                      <th className="text-left py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>Feature</th>
                      {pricingPlans.map(plan => (
                        <th key={plan.id} className="text-center py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>
                          {plan.displayName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b" style={{ borderColor: colors.cardBorder }}>
                      <td className="py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>
                        AI Models Access
                      </td>
                      {featureComparison.aiModels.map(item => (
                        <td key={item.planId} className="py-4 px-4 text-center font-semibold" style={{ color: colors.textSecondary }}>
                          {item.access}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: colors.cardBorder }}>
                      <td className="py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>
                        Monthly AI Generations
                      </td>
                      {featureComparison.monthlyGenerations.map(item => (
                        <td key={item.planId} className="py-4 px-4 text-center font-semibold" style={{ color: colors.textSecondary }}>
                          {item.count}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: colors.cardBorder }}>
                      <td className="py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>
                        Distributions
                      </td>
                      {featureComparison.distributions.map(item => (
                        <td key={item.planId} className="py-4 px-4 text-center font-semibold" style={{ color: colors.textSecondary }}>
                          {item.limit}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: colors.cardBorder }}>
                      <td className="py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>
                        Social Platforms
                      </td>
                      {featureComparison.socialPlatforms.map(item => (
                        <td key={item.planId} className="py-4 px-4 text-center font-semibold" style={{ color: colors.textSecondary }}>
                          {item.count}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b" style={{ borderColor: colors.cardBorder }}>
                      <td className="py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>
                        Support
                      </td>
                      {featureComparison.support.map(item => (
                        <td key={item.planId} className="py-4 px-4 text-center font-semibold" style={{ color: colors.textSecondary }}>
                          {item.level}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b last:border-0" style={{ borderColor: colors.cardBorder }}>
                      <td className="py-4 px-4 font-bold" style={{ color: colors.textPrimary }}>
                        Analytics
                      </td>
                      {featureComparison.analytics.map(item => (
                        <td key={item.planId} className="py-4 px-4 text-center font-semibold" style={{ color: colors.textSecondary }}>
                          {item.access}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="backdrop-blur-sm border-2"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}>
            <CardHeader>
              <CardTitle className="text-center font-bold" style={{ color: colors.primary }}>
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Can I change plans anytime?
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Do you offer refunds?
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    We offer a 30-day money-back guarantee for new subscriptions providing you have not downloaded any generated content.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    What payment methods do you accept?
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    We accept all major credit cards, PayPal, and cryptocurrency payments.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: colors.textPrimary }}>
                    Is there a contract?
                  </h3>
                  <p className="text-sm font-semibold" style={{ color: colors.textSecondary }}>
                    No, all plans are month-to-month with no long-term contracts required.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}