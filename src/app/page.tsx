'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star, Palette, Video, Users, Globe, Sparkles, Crown, Camera, Mic, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useNSFW } from "@/contexts/nsfw-context"

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const { isNSFW, setIsNSFW } = useNSFW()
  const [isMobile, setIsMobile] = useState(false)

  const handleModeChange = (newMode: 'nsfw' | 'sfw') => {
    setIsNSFW(newMode === 'nsfw')
  }

  const mode = isNSFW ? 'nsfw' : 'sfw'

  // Color schemes based on mode
  const colorSchemes = {
    sfw: {
      background: 'bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      accent: 'text-orange-500',
      accentBg: 'bg-orange-500',
      accentHover: 'hover:bg-orange-600',
      border: 'border-orange-500',
      cardBg: 'bg-white/50',
      button: 'bg-orange-500 hover:bg-orange-600',
      buttonOutline: 'border-orange-500 text-orange-500 hover:bg-orange-50',
      gradient: 'from-orange-500 to-cyan-500',
    },
    nsfw: {
      background: 'bg-gradient-to-br from-pink-900 via-purple-900 to-red-900',
      textPrimary: 'text-white',
      textSecondary: 'text-pink-200',
      accent: 'text-pink-400',
      accentBg: 'bg-pink-600',
      accentHover: 'hover:bg-pink-700',
      border: 'border-pink-500',
      cardBg: 'bg-black/30',
      button: 'bg-pink-600 hover:bg-pink-700',
      buttonOutline: 'border-pink-400 text-pink-400 hover:bg-pink-900',
      gradient: 'from-pink-500 to-purple-500',
    }
  }

  const colors = colorSchemes[mode]

  // Features data
  const features = [
    {
      icon: Camera,
      title: "4K Image Generation",
      description: "Create stunning photorealistic images at 4096x4096px resolution"
    },
    {
      icon: Video,
      title: "1080p Video Creation",
      description: "Generate dynamic videos with cinematic effects"
    },
    {
      icon: User,
      title: "Face Cloning",
      description: "Seamlessly clone faces with 95% accuracy"
    },
    {
      icon: Mic,
      title: "Voice Integration",
      description: "Add lifelike voices with multilingual support"
    },
    {
      icon: Palette,
      title: "Virtual Try-On",
      description: "Preview outfits in real-time with AR.js"
    },
    {
      icon: Globe,
      title: "Multi-Platform Distribution",
      description: "One-click publishing to all major platforms"
    }
  ]

  return (
    <div className={`flex flex-col min-h-screen ${colors.background}`}>
      {/* Navigation */}
      <nav className={`p-4 ${colors.cardBg} backdrop-blur-sm border-b ${colors.border}`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className={`h-6 w-6 ${colors.accent}`} />
            <h1 className={`text-xl font-bold ${colors.textPrimary}`}>EDN</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={mode === 'sfw' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleModeChange('sfw')}
                className={mode === 'sfw' ? colors.button : colors.buttonOutline}
              >
                SFW
              </Button>
              <Button
                variant={mode === 'nsfw' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleModeChange('nsfw')}
                className={mode === 'nsfw' ? colors.button : colors.buttonOutline}
              >
                NSFW
              </Button>
            </div>
            
            {/* User Actions */}
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : user ? (
              <div className="flex items-center gap-2">
                <span className={`text-sm ${colors.textSecondary}`}>
                  Welcome, {user.name || user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className={colors.buttonOutline}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/auth/signin'}
                  className={colors.buttonOutline}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="relative mb-8">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${colors.textPrimary}`}>
              {mode === 'sfw' ? 'Create, Distribute & Monetize' : 'Create, Distribute & Monetize'}
            </h1>
            <p className={`text-xl md:text-2xl ${colors.textSecondary} mb-8 max-w-4xl mx-auto`}>
              Erotic Digital Nexus: The most advanced AI-powered platform for photorealistic content creation.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className={`${colors.button} text-white shadow-xl hover:shadow-2xl font-semibold w-full md:w-auto`}
              onClick={() => window.location.href = '/create'}
            >
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className={`${colors.buttonOutline} shadow-xl hover:shadow-2xl font-semibold w-full md:w-auto`}
              onClick={() => window.location.href = '/marketplace'}
            >
              Explore Gallery
              <Crown className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className={`text-3xl font-bold ${colors.accent} mb-2`}>4K</div>
              <div className={`text-sm ${colors.textSecondary} font-medium`}>Ultra HD Resolution</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className={`text-3xl font-bold ${colors.accent} mb-2`}>14+</div>
              <div className={`text-sm ${colors.textSecondary} font-medium`}>Platform Integrations</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className={`text-3xl font-bold ${colors.accent} mb-2`}>AI</div>
              <div className={`text-sm ${colors.textSecondary} font-medium`}>Powered Creation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${colors.cardBg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Powerful Features</h2>
            <p className={`text-lg ${colors.textSecondary} max-w-3xl mx-auto`}>
              Everything you need to create stunning AI-generated content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`${colors.cardBg} backdrop-blur-sm border ${colors.border}`}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${colors.accentBg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 text-white`} />
                  </div>
                  <CardTitle className={`${colors.textPrimary}`}>{feature.title}</CardTitle>
                  <CardDescription className={`${colors.textSecondary}`}>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Platform Integrations</h2>
            <p className={`text-lg ${colors.textSecondary} max-w-3xl mx-auto`}>
              Publish your content to all major platforms with one click
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className={`${colors.cardBg} backdrop-blur-sm border ${colors.border}`}>
              <CardHeader>
                <CardTitle className={`${colors.textPrimary}`}>NSFW Platforms</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {['OnlyFans', 'Fansly', 'JustForFans', 'AdmireMe', 'FanCentro', 'ManyVids', 'Fanvue'].map((platform) => (
                    <Badge key={platform} variant="outline" className={`${colors.buttonOutline}`}>
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
            
            <Card className={`${colors.cardBg} backdrop-blur-sm border ${colors.border}`}>
              <CardHeader>
                <CardTitle className={`${colors.textPrimary}`}>SFW Platforms</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Patreon'].map((platform) => (
                    <Badge key={platform} variant="outline" className={`${colors.buttonOutline}`}>
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 ${colors.cardBg} border-t ${colors.border}`}>
        <div className="container mx-auto text-center">
          <p className={`${colors.textSecondary}`}>
            © 2024 Erotic Digital Nexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}