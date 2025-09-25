'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Unlock, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface BlurredPromptDisplayProps {
  itemId: string
  title: string
  positivePrompt?: string
  negativePrompt?: string
  promptConfig?: {
    archetype?: string
    hairColor?: string
    hairStyle?: string
    attire?: string
  }
  price: number
  isPurchased?: boolean
  onPurchase?: (itemId: string) => void
  className?: string
}

export function BlurredPromptDisplay({
  itemId,
  title,
  positivePrompt,
  negativePrompt,
  promptConfig,
  price,
  isPurchased = false,
  onPurchase,
  className = ""
}: BlurredPromptDisplayProps) {
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePurchase = async () => {
    if (!user) {
      alert('Please sign in to purchase this model')
      return
    }

    setIsProcessing(true)
    try {
      if (onPurchase) {
        await onPurchase(itemId)
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const canAccess = isPurchased
  const showBlurred = !canAccess

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {canAccess ? (
              <Unlock className="h-4 w-4 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 text-orange-500" />
            )}
            <span>EDN Advanced Prompt Configuration</span>
          </div>
          <div className="flex items-center gap-2">
            {canAccess ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Unlocked
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Premium Content
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Profile Information */}
        {promptConfig && (
          <div>
            <div className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
              Model Profile:
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {promptConfig.archetype} • {promptConfig.hairColor} {promptConfig.hairStyle} • {promptConfig.attire}
            </div>
          </div>
        )}

        {/* Positive Prompt */}
        {positivePrompt && (
          <div>
            <div className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
              Positive Prompt:
            </div>
            <div 
              className={`text-sm p-3 rounded-lg border transition-all duration-300 ${
                showBlurred 
                  ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 backdrop-blur-sm' 
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}
              style={showBlurred ? {
                filter: 'blur(8px)',
                userSelect: 'none',
                pointerEvents: 'none' as const
              } : {}}
            >
              <div className="font-mono text-xs leading-relaxed">
                {showBlurred 
                  ? '•'.repeat(Math.min(positivePrompt.length, 300))
                  : positivePrompt.substring(0, 300) + (positivePrompt.length > 300 ? '...' : '')
                }
              </div>
            </div>
            {showBlurred && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
<<<<<<< HEAD
                Purchase required to view this professional-grade prompt
=======
                Full prompt and config available after purchase
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
              </div>
            )}
          </div>
        )}

        {/* Negative Prompt */}
        {negativePrompt && (
          <div>
            <div className="text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
              Negative Prompt:
            </div>
            <div 
              className={`text-sm p-3 rounded-lg border transition-all duration-300 ${
                showBlurred 
                  ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 backdrop-blur-sm' 
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
              }`}
              style={showBlurred ? {
                filter: 'blur(8px)',
                userSelect: 'none',
                pointerEvents: 'none' as const
              } : {}}
            >
              <div className="font-mono text-xs leading-relaxed">
                {showBlurred 
                  ? '•'.repeat(Math.min(negativePrompt.length, 300))
                  : negativePrompt.substring(0, 300) + (negativePrompt.length > 300 ? '...' : '')
                }
              </div>
            </div>
            {showBlurred && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
<<<<<<< HEAD
                Purchase required to view this professional-grade prompt
=======
                Full prompt and config available after purchase
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
              </div>
            )}
          </div>
        )}

        {/* Purchase CTA */}
        {!canAccess && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Unlock Complete Prompts
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Get access to the full professional-grade prompt engineering
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${price}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  one-time purchase
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handlePurchase}
              disabled={isProcessing || !user}
              className="w-full"
              size="sm"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  {user ? 'Purchase to Unlock' : 'Sign In to Purchase'}
                </div>
              )}
            </Button>
            
            {!user && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Sign in to purchase and unlock premium prompt content
              </div>
            )}
          </div>
        )}

        {/* Success Message */}
        {canAccess && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
              <Unlock className="h-4 w-4" />
              <span className="font-medium">Full Access Unlocked!</span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              You now have complete access to this model's professional-grade prompt engineering. Use these prompts with your favorite AI image generation tools.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}