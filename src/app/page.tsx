'use client'

import { useState, useEffect } from 'react'
import ErrorBoundary from '@/components/error-boundary'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Shield, Users, ArrowRight, Star, Palette, Video, Music, Globe, TrendingUp, Sparkles, Crown, Download, Camera, Mic, User, GamepadIcon, Trophy, Target, Users2, Zap as Lightning, Calendar, DollarSign, Gift } from "lucide-react"
import PlatformLogo from "@/components/platform-logo"
import { useNSFW } from "@/contexts/nsfw-context"
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText, ResponsiveButton, ResponsiveCard } from "@/components/ui/responsive"


export default function Home() {
  const { isNSFW, setIsNSFW } = useNSFW()
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

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
      platformBg: 'bg-cyan-100',
      platformBorder: 'border-cyan-200',
      platformText: 'text-cyan-700'
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
      platformBg: 'bg-pink-900',
      platformBorder: 'border-pink-700',
      platformText: 'text-pink-300'
    }
  }

  const colors = colorSchemes[mode]

  // Platform lists from original prompt
  const nsfwPlatforms = [
    'OnlyFans', 'Fansly', 'JustForFans', 'AdmireMe', 'FanCentro', 'ManyVids', 'Fanvue'
  ]

  const sfwPlatforms = [
    'Instagram', 'TikTok', 'YouTube', 'Twitter', 'Patreon'
  ]

  // Mobile-optimized features data
  const features = [
    {
      icon: Camera,
      title: "4K Image Generation",
      description: "Create stunning photorealistic images at 4096x4096px resolution",
      features: ["Hair: Neon pink ombre", "Skin: Tattooed", "Clothing: Latex"]
    },
    {
      icon: Video,
      title: "1080p Video Creation",
      description: "Generate dynamic videos with cinematic effects",
      features: ["60fps smooth motion", "MiniMax Speech-02 TTS", "Adjustable lighting"]
    },
    {
      icon: User,
      title: "Face Cloning",
      description: "Seamlessly clone faces with 95% accuracy",
      features: ["Real-time previews", "Up to 100MB uploads", "Fluid transitions"]
    },
    {
      icon: Mic,
      title: "Voice Integration",
      description: "Add lifelike voices with multilingual support",
      features: ["MiniMax Speech-02 HD", "5 languages supported", "Sultry, playful tones"]
    },
    {
      icon: Palette,
      title: "Virtual Try-On",
      description: "Preview outfits in real-time with AR.js",
      features: ["AR.js integration", "3D depth effects", "Marketplace linked"]
    },
    {
      icon: Globe,
      title: "Multi-Platform Distribution",
      description: "One-click publishing to all major platforms",
      features: ["14+ platforms", "Automated scheduling", "Cross-platform analytics"]
    }
  ]

  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen ${colors.background}`}>
        
        {/* Hero Section - Mobile Optimized */}
        <section className="relative pt-16 pb-12 md:pt-20 md:pb-16 overflow-hidden">
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={mode === 'nsfw' ? "/hero-homepage-nsfw.jpg" : "/hero-homepage-sfw.jpg"} 
              alt="EDN AI Content Creation Platform" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>
          </div>
          
          <ResponsiveContainer>
            <div className="text-center relative z-10">
              <div className="relative mb-6 md:mb-8">
                <h1 className={`text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 text-white ${mode === 'sfw' ? 'text-orange-500' : 'text-pink-400'}`}>
                  {mode === 'sfw' ? 'Create, Distribute & Monetize' : 'Create, Distribute & Monetize'}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-white mb-6 md:mb-8 max-w-4xl mx-auto font-bold leading-relaxed p-4 md:p-6 rounded-2xl backdrop-blur-sm bg-black/30">
                  <span className="text-white">Erotic Digital Nexus: The most advanced AI-powered platform for photorealistic content creation.</span>
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 md:mb-12">
                <ResponsiveButton 
                  variant="primary" 
                  size="lg" 
                  className={`${colors.button} text-white shadow-xl hover:shadow-2xl font-semibold w-full md:w-auto`}
                  onClick={() => window.location.href = '/create'}
                >
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </ResponsiveButton>
                <ResponsiveButton 
                  variant="outline" 
                  size="lg" 
                  className={`${colors.buttonOutline} shadow-xl hover:shadow-2xl font-semibold w-full md:w-auto`}
                  onClick={() => window.location.href = '/marketplace'}
                >
                  Explore Gallery
                  <Crown className="ml-2 h-5 w-5" />
                </ResponsiveButton>
              </div>
              
              {/* Key Stats - Mobile Optimized Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="text-center p-4 md:p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className={`text-2xl md:text-3xl lg:text-4xl font-bold ${colors.accent} mb-2`}>4K</div>
                  <div className={`text-xs md:text-sm ${colors.textSecondary} font-medium`}>Ultra HD Resolution</div>
                </div>
                <div className="text-center p-4 md:p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className={`text-2xl md:text-3xl lg:text-4xl font-bold ${colors.accent} mb-2`}>14+</div>
                  <div className={`text-xs md:text-sm ${colors.textSecondary} font-medium`}>Platform Integrations</div>
                </div>
                <div className="text-center p-4 md:p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className={`text-2xl md:text-3xl lg:text-4xl font-bold ${colors.accent} mb-2`}>AI</div>
                  <div className={`text-xs md:text-sm ${colors.textSecondary} font-medium`}>Powered Creation</div>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Trusted by Creators Section - Mobile Optimized */}
        <section className={`py-12 md:py-16 ${colors.cardBg}`}>
          <ResponsiveContainer>
            <div className="text-center mb-8 md:mb-12">
              <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Trusted by creators on:</h2>
            </div>
            
            {/* NSFW Platforms */}
            <div className="mb-10 md:mb-16">
              <h3 className={`text-xl md:text-2xl font-bold mb-6 text-center ${mode === 'nsfw' ? 'text-pink-400' : 'text-pink-600'}`}>NSFW Platforms</h3>
              <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                {nsfwPlatforms.map((platform) => (
                  <div key={platform} className="flex-shrink-0">
                    <PlatformLogo name={platform} isNSFW={true} mode={mode} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* SFW Platforms */}
            <div>
              <h3 className={`text-xl md:text-2xl font-bold mb-6 text-center ${mode === 'sfw' ? 'text-cyan-400' : 'text-cyan-600'}`}>SFW Platforms</h3>
              <div className="flex flex-wrap justify-center gap-3 md:gap-6">
                {sfwPlatforms.map((platform) => (
                  <div key={platform} className="flex-shrink-0">
                    <PlatformLogo name={platform} isNSFW={false} mode={mode} />
                  </div>
                ))}
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Content Showcase Section - Mobile Optimized */}
        <section className="py-16 md:py-20">
          <ResponsiveContainer>
            <div className="text-center mb-12 md:mb-16">
              <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Dual Content Ecosystem</h2>
              <p className={`text-lg md:text-xl ${colors.textSecondary} max-w-3xl mx-auto`}>
                Create and manage both SFW and NSFW content with our advanced AI platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* SFW Content Column */}
              <ResponsiveCard className={`${mode === 'sfw' ? colors.cardBg : 'bg-white/20'} backdrop-blur-sm border-2 ${mode === 'sfw' ? colors.border : 'border-cyan-300'}`}>
                <div className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full ${mode === 'sfw' ? 'bg-cyan-500' : 'bg-cyan-300'} mb-4`}>
                      <Star className={`h-6 w-6 md:h-8 md:w-8 ${mode === 'sfw' ? 'text-white' : 'text-cyan-700'}`} />
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold mb-2 ${mode === 'sfw' ? colors.textPrimary : 'text-cyan-700'}`}>SFW Content</h3>
                    <Badge variant="outline" className={`${mode === 'sfw' ? 'border-cyan-500 text-cyan-500' : 'border-cyan-300 text-cyan-600'}`}>
                      Safe For Work
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className={`font-semibold text-sm md:text-base ${colors.textPrimary}`}>Mainstream Platforms</h4>
                        <p className={`text-xs md:text-sm ${colors.textSecondary}`}>Instagram, TikTok, YouTube, Twitter</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className={`font-semibold text-sm md:text-base ${colors.textPrimary}`}>Broad Audience Reach</h4>
                        <p className={`text-xs md:text-sm ${colors.textSecondary}`}>Access millions of potential followers</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className={`font-semibold text-sm md:text-base ${colors.textPrimary}`}>Brand-Friendly Content</h4>
                        <p className={`text-xs md:text-sm ${colors.textSecondary}`}>Perfect for sponsorships</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ResponsiveCard>
              
              {/* NSFW Content Column */}
              <ResponsiveCard className={`${mode === 'nsfw' ? colors.cardBg : 'bg-white/20'} backdrop-blur-sm border-2 ${mode === 'nsfw' ? colors.border : 'border-pink-300'}`}>
                <div className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full ${mode === 'nsfw' ? 'bg-pink-500' : 'bg-pink-300'} mb-4`}>
                      <Crown className={`h-6 w-6 md:h-8 md:w-8 ${mode === 'nsfw' ? 'text-white' : 'text-pink-700'}`} />
                    </div>
                    <h3 className={`text-xl md:text-2xl font-bold mb-2 ${mode === 'nsfw' ? colors.textPrimary : 'text-pink-700'}`}>NSFW Content</h3>
                    <Badge variant="outline" className={`${mode === 'nsfw' ? 'border-pink-500 text-pink-500' : 'border-pink-300 text-pink-600'}`}>
                      Adult Content
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className={`font-semibold text-sm md:text-base ${colors.textPrimary}`}>Adult Platforms</h4>
                        <p className={`text-xs md:text-sm ${colors.textSecondary}`}>OnlyFans, Fansly, JustForFans</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className={`font-semibold text-sm md:text-base ${colors.textPrimary}`}>Premium Monetization</h4>
                        <p className={`text-xs md:text-sm ${colors.textSecondary}`}>Higher earning potential</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className={`font-semibold text-sm md:text-base ${colors.textPrimary}`}>Creative Freedom</h4>
                        <p className={`text-xs md:text-sm ${colors.textSecondary}`}>Express without restrictions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ResponsiveCard>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Revolutionary AI Creation Tools Section - Mobile Optimized */}
        <section className="py-16 md:py-20">
          <ResponsiveContainer>
            <div className="text-center mb-12 md:mb-16">
              <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Revolutionary AI Tools</h2>
              <p className={`text-lg md:text-xl ${colors.textSecondary} max-w-2xl mx-auto`}>
                Harness the power of our pretrained LoRA model
              </p>
            </div>
            
            <ResponsiveGrid mobileCols={1} tabletCols={2} desktopCols={3} gap="md">
              {features.map((feature, index) => (
                <ResponsiveCard key={index} className={`${colors.cardBg} border ${colors.border} hover:shadow-lg transition-shadow duration-300`}>
                  <CardHeader className="pb-4">
                    <feature.icon className={`h-10 w-10 md:h-12 md:w-12 ${colors.accent} mb-4`} />
                    <CardTitle className={`text-lg md:text-xl ${colors.textPrimary}`}>{feature.title}</CardTitle>
                    <CardDescription className={`text-sm ${colors.textSecondary}`}>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.features.map((feat, featIndex) => (
                        <div key={featIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                          <span className={`text-xs md:text-sm ${colors.textSecondary}`}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </ResponsiveCard>
              ))}
            </ResponsiveGrid>
          </ResponsiveContainer>
        </section>

        {/* Mobile-optimized spacing */}
        <div className="h-20 md:hidden" />
      </div>
    </ErrorBoundary>
  )
}