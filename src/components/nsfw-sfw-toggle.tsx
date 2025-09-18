'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Crown, Eye, EyeOff } from 'lucide-react'

interface NSFWSFWToggleProps {
  onModeChange: (mode: 'nsfw' | 'sfw') => void
}

export default function NSFWSFWToggle({ onModeChange }: NSFWSFWToggleProps) {
  const [mode, setMode] = useState<'nsfw' | 'sfw'>('sfw')

  const handleModeChange = (newMode: 'nsfw' | 'sfw') => {
    setMode(newMode)
    onModeChange(newMode)
  }

  return (
    <Card className="w-fit mx-auto mb-8 shadow-lg border-2 overflow-hidden">
      <CardContent className="p-1">
        <div className="flex gap-1">
          <Button
            variant={mode === 'sfw' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('sfw')}
            className={`
              relative px-4 py-3 rounded-lg font-semibold transition-all duration-300
              ${mode === 'sfw' 
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg transform scale-105' 
                : 'text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>SFW Mode</span>
              {mode === 'sfw' && (
                <Badge variant="secondary" className="ml-1 bg-white/20 text-white text-xs">
                  Active
                </Badge>
              )}
            </div>
          </Button>
          <Button
            variant={mode === 'nsfw' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('nsfw')}
            className={`
              relative px-4 py-3 rounded-lg font-semibold transition-all duration-300
              ${mode === 'nsfw' 
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg transform scale-105' 
                : 'text-pink-600 hover:bg-pink-50 hover:text-pink-700'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <span>NSFW Mode</span>
              {mode === 'nsfw' && (
                <Badge variant="secondary" className="ml-1 bg-white/20 text-white text-xs">
                  18+
                </Badge>
              )}
            </div>
          </Button>
        </div>
        
        {/* Mode indicator */}
        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            {mode === 'sfw' ? (
              <>
                <Eye className="h-3 w-3" />
                <span>Safe for work content</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3" />
                <span>Adult content (18+)</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}