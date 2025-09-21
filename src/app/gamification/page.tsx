'use client'

import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { GamificationDashboard } from '@/components/gamification-dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LogIn, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function GamificationPage() {
  const { isNSFW } = useNSFW()
  const { user, loading } = useAuth()

  const colors = {
    sfw: {
      primary: '#FF6B35',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      bg: 'from-orange-100 via-cyan-100 to-yellow-100',
      cardBg: 'bg-white/80',
      text: 'text-gray-800',
      textSecondary: 'text-gray-600'
    },
    nsfw: {
      primary: '#FF1493',
      secondary: '#00CED1',
      accent: '#FF4500',
      bg: 'from-pink-900 via-purple-900 to-black',
      cardBg: 'bg-black/40',
      text: 'text-white',
      textSecondary: 'text-gray-300'
    }
  }

  const scheme = colors[isNSFW ? 'nsfw' : 'sfw']

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} flex items-center justify-center`}>
        <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              <span className={scheme.text}>Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden pt-16">
          <img 
            src={isNSFW ? "/hero-gamification-nsfw.jpg" : "/hero-gamification-sfw.jpg"} 
            alt="Gamification & Rewards" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-6">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text gamification ${isNSFW ? 'nsfw' : 'sfw'}`}>
                {isNSFW ? 'Seductive Rewards with EDN' : 'Level Up Your Creativity with EDN'}
              </h1>
              <p className="text-xl md:text-2xl drop-shadow-md">
                Earn points, unlock achievements, and claim exclusive rewards
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                <CardHeader>
                  <Trophy className={`h-16 w-16 mx-auto mb-4 ${isNSFW ? 'text-pink-400' : 'text-orange-400'}`} />
                  <CardTitle className={`text-2xl ${scheme.text}`}>Join the Gamification Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className={`text-lg ${scheme.textSecondary}`}>
                    Track your progress, earn achievements, and unlock exclusive rewards by participating in the EDN community. 
                    Sign in now to start your gamification journey!
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className={`text-3xl font-bold mb-2 ${scheme.text}`}>🏆</div>
                      <h3 className={`font-semibold mb-1 ${scheme.text}`}>Achievements</h3>
                      <p className={`text-sm ${scheme.textSecondary}`}>Unlock milestones and earn recognition</p>
                    </div>
                    <div>
                      <div className={`text-3xl font-bold mb-2 ${scheme.text}`}>⚡</div>
                      <h3 className={`font-semibold mb-1 ${scheme.text}`}>Challenges</h3>
                      <p className={`text-sm ${scheme.textSecondary}`}>Complete tasks and earn bonus points</p>
                    </div>
                    <div>
                      <div className={`text-3xl font-bold mb-2 ${scheme.text}`}>🎁</div>
                      <h3 className={`font-semibold mb-1 ${scheme.text}`}>Rewards</h3>
                      <p className={`text-sm ${scheme.textSecondary}`}>Redeem points for exclusive benefits</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/auth/signin">
                      <Button 
                        className="flex items-center gap-2"
                        style={{ backgroundColor: scheme.primary }}
                      >
                        <LogIn className="h-4 w-4" />
                        Sign In to View Progress
                      </Button>
                    </Link>
                    <Link href="/pricing">
                      <Button 
                        variant="outline"
                        className="flex items-center gap-2"
                        style={{ 
                          borderColor: scheme.primary,
                          color: scheme.text
                        }}
                      >
                        View Membership Plans
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return <GamificationDashboard />
}