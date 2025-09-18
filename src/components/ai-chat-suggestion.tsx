'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  MessageSquare, 
  Sparkles, 
  Zap, 
  Crown, 
  Image as ImageIcon, 
  Palette,
  Star,
  TrendingUp,
  Rocket,
  Diamond
} from 'lucide-react'

interface AIChatSuggestionProps {
  membershipTier: 'ELITE' | 'MASTER' | 'VIP'
  className?: string
}

interface ChatSuggestion {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  price: string
  features: string[]
  isPopular?: boolean
}

export function AIChatSuggestion({ membershipTier, className }: AIChatSuggestionProps) {
  const { isNSFW } = useNSFW()
  const { user } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

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

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case 'ELITE':
        return {
          title: 'Elite AI Image Generation',
          subtitle: 'Premium custom imagery at your fingertips',
          icon: <Crown className="h-6 w-6" />,
          accentColor: 'text-purple-400',
          badgeColor: 'bg-purple-500',
          suggestions: [
            {
              id: 'elite-1',
              title: 'Ultra-HD Portrait',
              description: 'Professional-grade portraits with perfect lighting and detail',
              icon: <ImageIcon className="h-5 w-5" />,
              price: '$25',
              features: ['8K Resolution', 'Advanced Lighting', 'Professional Retouching', 'Fast Delivery'],
              isPopular: true
            },
            {
              id: 'elite-2',
              title: 'Fantasy Art Creation',
              description: 'Bring your imagination to life with stunning fantasy artwork',
              icon: <Palette className="h-5 w-5" />,
              price: '$35',
              features: ['Custom Scenes', 'Multiple Characters', 'Detailed Backgrounds', 'Artistic Style']
            }
          ]
        }
      case 'MASTER':
        return {
          title: 'Master AI Image Generation',
          subtitle: 'Exclusive access to cutting-edge AI imagery',
          icon: <Diamond className="h-6 w-6" />,
          accentColor: 'text-blue-400',
          badgeColor: 'bg-blue-500',
          suggestions: [
            {
              id: 'master-1',
              title: 'Custom Model Training',
              description: 'Train AI on your unique style and preferences',
              icon: <Sparkles className="h-5 w-5" />,
              price: '$75',
              features: ['Personalized AI Model', 'Style Transfer', 'Unlimited Revisions', 'Priority Support'],
              isPopular: true
            },
            {
              id: 'master-2',
              title: 'Commercial Art Package',
              description: 'Ready-to-use commercial artwork for your business',
              icon: <TrendingUp className="h-5 w-5" />,
              price: '$100',
              features: ['Commercial License', 'Multiple Formats', 'Brand Consistency', 'Marketing Ready']
            }
          ]
        }
      case 'VIP':
        return {
          title: 'VIP AI Image Generation',
          subtitle: 'The ultimate AI imaging experience',
          icon: <Rocket className="h-6 w-6" />,
          accentColor: 'text-yellow-400',
          badgeColor: 'bg-yellow-500',
          suggestions: [
            {
              id: 'vip-1',
              title: 'Celebrity Style Transfer',
              description: 'Get images in the style of famous artists and celebrities',
              icon: <Star className="h-5 w-5" />,
              price: '$150',
              features: ['Celebrity Likeness', 'Artist Styles', 'Exclusive Access', 'Personal Concierge'],
              isPopular: true
            },
            {
              id: 'vip-2',
              title: 'Unlimited Creation Suite',
              description: 'Endless possibilities with unlimited AI generation',
              icon: <Zap className="h-5 w-5" />,
              price: '$250',
              features: ['Unlimited Generations', '24/7 Access', 'Custom AI Models', 'Personal Manager']
            }
          ]
        }
      default:
        return null
    }
  }

  const tierConfig = getTierConfig(membershipTier)
  if (!tierConfig) return null

  const handleGenerateSample = async (suggestionId: string) => {
    if (!user) return

    setIsGenerating(true)
    try {
      // Simulate image generation - in real implementation, this would call the AI API
      setTimeout(() => {
        setGeneratedImage(`data:image/svg+xml;base64,${btoa(`
          <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${scheme.primary};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${scheme.secondary};stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="200" height="200" fill="url(#grad1)" rx="10"/>
            <text x="100" y="100" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="14" font-weight="bold">
              AI Generated
            </text>
            <text x="100" y="120" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="12">
              ${membershipTier} Sample
            </text>
          </svg>
        `)}`)
        setIsGenerating(false)
      }, 2000)
    } catch (error) {
      console.error('Error generating image:', error)
      setIsGenerating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-6 ${className}`}
    >
      <Card className={`${scheme.cardBg} backdrop-blur-sm border ${scheme.border}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${tierConfig.badgeColor} bg-opacity-20`}>
              <div className={tierConfig.accentColor}>
                {tierConfig.icon}
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className={`text-lg ${scheme.text} flex items-center gap-2`}>
                {tierConfig.title}
                <Badge className={`${tierConfig.badgeColor} text-white text-xs`}>
                  EXCLUSIVE
                </Badge>
              </CardTitle>
              <CardDescription className={`text-sm ${scheme.textSecondary}`}>
                {tierConfig.subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tierConfig.suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  suggestion.isPopular 
                    ? 'border-yellow-400 bg-yellow-400 bg-opacity-10' 
                    : `${scheme.border} bg-opacity-5`
                }`}
              >
                {suggestion.isPopular && (
                  <Badge className="bg-yellow-500 text-black text-xs mb-2">
                    MOST POPULAR
                  </Badge>
                )}
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${tierConfig.badgeColor} bg-opacity-20`}>
                      <div className={tierConfig.accentColor}>
                        {suggestion.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${scheme.text}`}>{suggestion.title}</h4>
                      <p className={`text-sm ${scheme.textSecondary}`}>{suggestion.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${scheme.text}`}>{suggestion.price}</div>
                    <div className={`text-xs ${scheme.textSecondary}`}>per image</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {suggestion.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${tierConfig.accentColor}`} />
                      <span className={`text-xs ${scheme.textSecondary}`}>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    className={`flex-1 ${suggestion.isPopular ? 'bg-yellow-500 text-black' : ''}`}
                    style={suggestion.isPopular ? undefined : { backgroundColor: scheme.primary }}
                    onClick={() => handleGenerateSample(suggestion.id)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Generating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Chat to Create
                      </div>
                    )}
                  </Button>
                  
                  {generatedImage && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500 bg-opacity-20 border border-green-500">
                      <div className="w-8 h-8 rounded overflow-hidden">
                        <img 
                          src={generatedImage} 
                          alt="Generated sample"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`text-xs ${scheme.text}`}>Sample Ready</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-20 border border-purple-500">
            <div className="flex items-center gap-3">
              <MessageSquare className={`h-5 w-5 ${tierConfig.accentColor}`} />
              <div>
                <h4 className={`font-semibold ${scheme.text}`}>AI Chat Assistant Ready</h4>
                <p className={`text-sm ${scheme.textSecondary}`}>
                  Chat with our AI to create custom images tailored to your exact specifications
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}