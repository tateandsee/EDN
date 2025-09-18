'use client'

import ErrorBoundary from '@/components/error-boundary'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Zap, Shield, Users, ArrowRight, Star, Palette, Video, Music, Globe, TrendingUp, Sparkles, Crown, Download, Camera, Mic, User, GamepadIcon, Trophy, Target, Users2, Zap as Lightning, Calendar, DollarSign, Gift } from "lucide-react"
import PlatformLogo from "@/components/platform-logo"
import { useNSFW } from "@/contexts/nsfw-context"

export default function Home() {
  const { isNSFW, setIsNSFW } = useNSFW()
  const mode = isNSFW ? 'nsfw' : 'sfw'

  const handleModeChange = (newMode: 'nsfw' | 'sfw') => {
    setIsNSFW(newMode === 'nsfw')
  }

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

  return (
    <ErrorBoundary>
      <div className={`flex flex-col min-h-screen ${colors.background}`}>
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={mode === 'nsfw' ? "/hero-homepage-nsfw.jpg" : "/hero-homepage-sfw.jpg"} 
            alt="EDN AI Content Creation Platform" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="relative mb-8">
            <h1 
              className={`text-4xl md:text-6xl font-bold mb-6 text-white ${mode === 'sfw' ? 'text-orange-500' : 'text-pink-400'}`}
            >
              {mode === 'sfw' ? 'Create, Distribute & Monetize' : 'Create, Distribute & Monetize'}
            </h1>
            <p 
              className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto font-bold leading-relaxed p-6 rounded-2xl backdrop-blur-sm bg-black/30"
            >
              <span className="text-white">Erotic Digital Nexus: The most advanced AI-powered platform for photorealistic content creation. Generate stunning 4K images and 1080p videos, then distribute seamlessly across multiple platforms with one click.</span>
            </p>
          </div>
          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <div>
              <Button size="lg" className={`text-lg px-8 py-4 ${colors.button} text-white shadow-xl hover:shadow-2xl font-semibold`} onClick={() => window.location.href = '/create'}>
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div>
              <Button variant="outline" size="lg" className={`text-lg px-8 py-4 ${colors.buttonOutline} shadow-xl hover:shadow-2xl font-semibold`} onClick={() => window.location.href = '/marketplace'}>
                Explore Gallery
                <Crown className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Key Stats */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className={`text-3xl md:text-4xl font-bold ${colors.accent} mb-2`}>4K</div>
              <div className={`text-sm ${colors.textSecondary} font-medium`}>Ultra HD Resolution</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className={`text-3xl md:text-4xl font-bold ${colors.accent} mb-2`}>14+</div>
              <div className={`text-sm ${colors.textSecondary} font-medium`}>Platform Integrations</div>
            </div>
            <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className={`text-3xl md:text-4xl font-bold ${colors.accent} mb-2`}>AI</div>
              <div className={`text-sm ${colors.textSecondary} font-medium`}>Powered Creation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Creators Section */}
      <section className={`py-16 px-4 ${colors.cardBg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Trusted by creators on:</h2>
          </div>
          
          {/* NSFW Platforms - Top Section */}
          <div className="mb-16">
            <h3 className={`text-2xl font-bold mb-8 text-center ${mode === 'nsfw' ? 'text-pink-400' : 'text-pink-600'}`}>NSFW Platforms</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {nsfwPlatforms.map((platform) => (
                <div key={platform} className="flex-shrink-0">
                  <PlatformLogo name={platform} isNSFW={true} mode={mode} />
                </div>
              ))}
            </div>
          </div>
          
          {/* SFW Platforms - Bottom Section */}
          <div>
            <h3 className={`text-2xl font-bold mb-8 text-center ${mode === 'sfw' ? 'text-cyan-400' : 'text-cyan-600'}`}>SFW Platforms</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {sfwPlatforms.map((platform) => (
                <div key={platform} className="flex-shrink-0">
                  <PlatformLogo name={platform} isNSFW={false} mode={mode} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Showcase Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Dual Content Ecosystem</h2>
            <p className={`text-xl ${colors.textSecondary} max-w-3xl mx-auto`}>
              Create and manage both SFW and NSFW content with our advanced AI platform. 
              Switch seamlessly between modes to cater to different audiences and platforms.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* SFW Content Column */}
            <div className={`p-8 rounded-2xl ${mode === 'sfw' ? colors.cardBg : 'bg-white/20'} backdrop-blur-sm border-2 ${mode === 'sfw' ? colors.border : 'border-cyan-300'}`}>
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${mode === 'sfw' ? 'bg-cyan-500' : 'bg-cyan-300'} mb-4`}>
                  <Star className={`h-8 w-8 ${mode === 'sfw' ? 'text-white' : 'text-cyan-700'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${mode === 'sfw' ? colors.textPrimary : 'text-cyan-700'}`}>SFW Content</h3>
                <Badge variant="outline" className={`${mode === 'sfw' ? 'border-cyan-500 text-cyan-500' : 'border-cyan-300 text-cyan-600'}`}>
                  Safe For Work
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Mainstream Platforms</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>Instagram, TikTok, YouTube, Twitter, Patreon</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Broad Audience Reach</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>Access millions of potential followers and customers</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Brand-Friendly Content</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>Perfect for sponsorships and brand partnerships</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Versatile Creation</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>Lifestyle, fashion, beauty, fitness, and more</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* NSFW Content Column */}
            <div className={`p-8 rounded-2xl ${mode === 'nsfw' ? colors.cardBg : 'bg-white/20'} backdrop-blur-sm border-2 ${mode === 'nsfw' ? colors.border : 'border-pink-300'}`}>
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${mode === 'nsfw' ? 'bg-pink-500' : 'bg-pink-300'} mb-4`}>
                  <Crown className={`h-8 w-8 ${mode === 'nsfw' ? 'text-white' : 'text-pink-700'}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${mode === 'nsfw' ? colors.textPrimary : 'text-pink-700'}`}>NSFW Content</h3>
                <Badge variant="outline" className={`${mode === 'nsfw' ? 'border-pink-500 text-pink-500' : 'border-pink-300 text-pink-600'}`}>
                  Adult Content
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Adult Platforms</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>OnlyFans, Fansly, JustForFans, AdmireMe, FanCentro, ManyVids</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Premium Monetization</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>Higher earning potential with subscription-based content</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Dedicated Audience</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>Build loyal fanbases with higher engagement rates</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className={`font-semibold ${colors.textPrimary}`}>Creative Freedom</h4>
                    <p className={`text-sm ${colors.textSecondary}`}>Express yourself without content restrictions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revolutionary AI Creation Tools Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Revolutionary AI Creation Tools</h2>
            <p className={`text-xl ${colors.textSecondary} max-w-2xl mx-auto`}>
              Harness the power of our pretrained LoRA model to create photorealistic content that stands out
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 4K Image Generation */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Camera className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>4K Image Generation</CardTitle>
                <CardDescription className={colors.textSecondary}>Create stunning photorealistic images at 4096x4096px resolution with customizable attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Hair: Neon pink ombre, silver bob</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Skin: Tattooed, freckled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Clothing: Latex, athleisure</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 1080p Video Creation */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Video className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>1080p Video Creation</CardTitle>
                <CardDescription className={colors.textSecondary}>Generate dynamic videos (15-60s) with cinematic effects and voice integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>60fps smooth motion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>MiniMax Speech-02 TTS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Adjustable lighting/textures</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Face Cloning */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <User className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Face Cloning</CardTitle>
                <CardDescription className={colors.textSecondary}>Seamlessly clone faces with 95% accuracy using uploaded images/videos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Real-time WebGL previews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Up to 100MB uploads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Fluid transitions</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice Integration */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Mic className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Voice Integration</CardTitle>
                <CardDescription className={colors.textSecondary}>Add lifelike voices with multilingual support and adjustable pitch/tone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>MiniMax Speech-02 HD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>5 languages supported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Sultry, playful tones</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Virtual Try-On */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Palette className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Virtual Try-On</CardTitle>
                <CardDescription className={colors.textSecondary}>Preview outfits/accessories in real-time with AR.js technology</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>AR.js integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>3D depth effects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Marketplace linked</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multi-Platform Distribution */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Globe className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Multi-Platform Distribution</CardTitle>
                <CardDescription className={colors.textSecondary}>Distribute to 14 platforms with one click - API and manual options</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>5 API-supported platforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>9 NSFW manual platforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>AI-optimized captions</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className={`py-20 px-4 ${colors.cardBg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Flexible Pricing Plans</h2>
            <p className={`text-xl ${colors.textSecondary} max-w-2xl mx-auto`}>
              Choose the plan that fits your creative needs. Save 20% with yearly subscriptions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {/* Starter Plan */}
            <Card className={`${colors.cardBg} border ${colors.border} h-full flex flex-col`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-lg ${colors.textPrimary}`}>Starter</CardTitle>
                <div className={`text-3xl font-bold ${colors.textPrimary}`}>$0<span className="text-sm font-normal"> /month</span></div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Limited AI model access (e.g., Basic models only)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Basic creation tools (e.g., Limited editing, no advanced controls)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>1 distribution per day</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}><strong>20 AI generations per month</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to 1 social media platforms</span>
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            {/* Basic Plan */}
            <Card className={`${colors.cardBg} border-2 ${colors.border} h-full flex flex-col`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-lg ${colors.textPrimary}`}>Basic</CardTitle>
                <div className={`text-3xl font-bold ${colors.textPrimary}`}>$10<span className="text-sm font-normal"> /month</span></div>
                <div className={`text-sm ${colors.textSecondary}`}>or $96/year (save 20%)</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to 10 AI models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Basic content creation tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>5 distributions per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Standard support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}><strong>50 AI generations per month</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to 2 social media platforms</span>
                  </li>
                </ul>
                <Button className={`w-full mt-4 ${colors.button} text-white`}>Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className={`${colors.cardBg} border-2 ${colors.border} h-full flex flex-col`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-lg ${colors.textPrimary}`}>Pro</CardTitle>
                <div className={`text-3xl font-bold ${colors.textPrimary}`}>$50<span className="text-sm font-normal"> /month</span></div>
                <div className={`text-sm ${colors.textSecondary}`}>or $480/year (save 20%)</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to all AI models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Advanced creation tools (e.g., Precise lighting, pose manipulation, custom image inputs)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Unlimited distributions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Revenue analytics (e.g., Track sales, monitor popular models)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}><strong>100 AI generations per month</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to 3 social media platforms</span>
                  </li>
                </ul>
                <Button className={`w-full mt-4 ${colors.button} text-white`}>Get Started</Button>
              </CardContent>
            </Card>

            {/* Elite Plan */}
            <Card className={`${colors.cardBg} border-2 ${colors.border} h-full flex flex-col`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-lg ${colors.textPrimary}`}>Elite</CardTitle>
                <div className={`text-3xl font-bold ${colors.textPrimary}`}>$100<span className="text-sm font-normal"> /month</span></div>
                <div className={`text-sm ${colors.textSecondary}`}>or $960/year (save 20%)</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Elite AI model access (e.g., Faster generation, higher resolution, more realistic outputs)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Premium creation tools (e.g., Layers, fine-tuning controls, advanced prompts)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Priority distributions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>24/7 dedicated support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Personalized AI assistant</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}><strong>200 AI generations per month</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to all social media platforms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>AI generated post's for your content</span>
                  </li>
                </ul>
                <Button className={`w-full mt-4 ${colors.button} text-white`}>Get Started</Button>
              </CardContent>
            </Card>

            {/* Master Plan */}
            <Card className={`${colors.cardBg} border-2 ${colors.border} h-full flex flex-col`}>
              <CardHeader className="text-center">
                <CardTitle className={`text-lg ${colors.textPrimary}`}>Master</CardTitle>
                <div className={`text-3xl font-bold ${colors.textPrimary}`}>$200<span className="text-sm font-normal"> /month</span></div>
                <div className={`text-sm ${colors.textSecondary}`}>or $1,920/year (save 20%)</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Master AI model access (e.g., Exclusive models, beta features)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Exclusive creation tools (e.g., Custom training, predictive analytics)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>VIP distributions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>24/7 VIP support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Advanced analytics & insights (e.g., Trend reports, A/B testing)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}><strong>500 AI generations per month</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to all social media platforms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>AI generated post's for your content</span>
                  </li>
                </ul>
                <Button className={`w-full mt-4 ${colors.button} text-white`}>Get Started</Button>
              </CardContent>
            </Card>

            {/* Ultimate VIP Plan */}
            <Card className={`${colors.cardBg} border-2 border-gradient-to-r ${colors.gradient} h-full flex flex-col relative`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className={`bg-gradient-to-r ${colors.gradient} text-white`}>ULTIMATE EXPERIENCE VIP</Badge>
              </div>
              <CardHeader className="text-center pt-6">
                <CardTitle className={`text-lg ${colors.textPrimary}`}>VIP</CardTitle>
                <div className={`text-3xl font-bold ${colors.textPrimary}`}>$500<span className="text-sm font-normal"> /month</span></div>
                <div className={`text-sm ${colors.textSecondary}`}>or $4,800/year (save 20%)</div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Unlimited VIP AI models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Custom AI model creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Unlimited priority distributions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Personal account manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Early access to new features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}><strong>Unlimited AI generations</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>Access to all social media platforms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={colors.textSecondary}>AI generated post's for your content</span>
                  </li>
                </ul>
                <Button className={`w-full mt-4 bg-gradient-to-r ${colors.gradient} hover:from-orange-600 hover:to-pink-600 text-white`}>Get Started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Immersive Gamification Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Immersive Gamification</h2>
            <p className={`text-xl ${colors.textSecondary} max-w-2xl mx-auto`}>
              Turn content creation into an addictive adventure with our gamified experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Gamification Features */}
            <div className="space-y-8">
              <Card className={`${colors.cardBg} border ${colors.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GamepadIcon className={`h-8 w-8 ${colors.accent}`} />
                    <CardTitle className={colors.textPrimary}>AR Quests</CardTitle>
                  </div>
                  <CardDescription className={colors.textSecondary}>Complete AR-based challenges like "Try on 3 $500+ models" for points and rewards</CardDescription>
                </CardHeader>
              </Card>

              <Card className={`${colors.cardBg} border ${colors.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Trophy className={`h-8 w-8 ${colors.accent}`} />
                    <CardTitle className={colors.textPrimary}>Meme Achievements</CardTitle>
                  </div>
                  <CardDescription className={colors.textSecondary}>Earn badges like "Doge Millionaire" or "YOLO Creator" with humorous animations</CardDescription>
                </CardHeader>
              </Card>

              <Card className={`${colors.cardBg} border ${colors.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Target className={`h-8 w-8 ${colors.accent}`} />
                    <CardTitle className={colors.textPrimary}>Scavenger Hunts</CardTitle>
                  </div>
                  <CardDescription className={colors.textSecondary}>Participate in community hunts with leaderboards and exclusive rewards</CardDescription>
                </CardHeader>
              </Card>

              <Card className={`${colors.cardBg} border ${colors.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users2 className={`h-8 w-8 ${colors.accent}`} />
                    <CardTitle className={colors.textPrimary}>Creator Guilds</CardTitle>
                  </div>
                  <CardDescription className={colors.textSecondary}>Join guilds like "Cyberpunk Creators" for collaborative challenges and points</CardDescription>
                </CardHeader>
              </Card>

              <Card className={`${colors.cardBg} border ${colors.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Crown className={`h-8 w-8 ${colors.accent}`} />
                    <CardTitle className={colors.textPrimary}>Affiliate Tiers</CardTitle>
                  </div>
                  <CardDescription className={colors.textSecondary}>Climb from Bronze to Diamond affiliate tiers with increasing commissions and exclusive perks</CardDescription>
                </CardHeader>
              </Card>

              <Card className={`${colors.cardBg} border ${colors.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Star className={`h-8 w-8 ${colors.accent}`} />
                    <CardTitle className={colors.textPrimary}>Referral Leaderboards</CardTitle>
                  </div>
                  <CardDescription className={colors.textSecondary}>Compete globally and locally for top referrer positions with cash prizes and bonuses</CardDescription>
                </CardHeader>
              </Card>

              <Card className={`${colors.cardBg} border ${colors.border}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Gift className={`h-8 w-8 ${colors.accent}`} />
                    <CardTitle className={colors.textPrimary}>Affiliate Achievements</CardTitle>
                  </div>
                  <CardDescription className={colors.textSecondary}>Unlock special badges like "Super Affiliate" or "Recruitment Master" with bonus rewards</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Progress Dashboard */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <CardTitle className={colors.textPrimary}>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${colors.accent} mb-2`}>Level 7</div>
                    <div className={`text-sm ${colors.textSecondary}`}>Current Level</div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium ${colors.textPrimary}`}>Experience Points</span>
                      <span className={`text-sm ${colors.textSecondary}`}>2,450 / 3,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${colors.accentBg} h-2 rounded-full`} style={{ width: '81.67%' }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-2xl font-bold ${colors.accent}`}>12</div>
                      <div className={`text-sm ${colors.textSecondary}`}>Challenges</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${colors.accent}`}>5</div>
                      <div className={`text-sm ${colors.textSecondary}`}>Achievements</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-bold ${colors.accent}`}>7</div>
                      <div className={`text-sm ${colors.textSecondary}`}>Day Streak</div>
                    </div>
                  </div>

                  <div className={`${mode === 'sfw' ? 'bg-orange-50' : 'bg-pink-900'} p-4 rounded-lg text-center`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Lightning className={`h-5 w-5 ${colors.accent}`} />
                      <span className={`font-semibold ${mode === 'sfw' ? 'text-orange-700' : 'text-pink-300'}`}>7-Day Fire Streak</span>
                    </div>
                    <p className={`text-sm ${colors.textSecondary}`}>Keep it going!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Distribution Power Section */}
      <section className={`py-20 px-4 ${colors.cardBg}`}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>Distribution Power</h2>
            <p className={`text-xl ${colors.textSecondary} max-w-2xl mx-auto`}>
              Maximize your reach with our intelligent distribution system across 14+ platforms
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* One-Click Distribution */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Globe className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>One-Click Distribution</CardTitle>
                <CardDescription className={colors.textSecondary}>Publish your content to multiple platforms simultaneously with a single click</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>5 API-integrated platforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>9 manual upload platforms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Smart content optimization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Automated Scheduling */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Calendar className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Automated Scheduling</CardTitle>
                <CardDescription className={colors.textSecondary}>Schedule your content for optimal posting times across all platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>AI-powered timing optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Platform-specific scheduling</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Bulk scheduling capabilities</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Analytics */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <TrendingUp className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Performance Analytics</CardTitle>
                <CardDescription className={colors.textSecondary}>Track your content performance across all platforms in one dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Real-time performance tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Cross-platform analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Revenue optimization insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Adaptation */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Sparkles className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Smart Content Adaptation</CardTitle>
                <CardDescription className={colors.textSecondary}>Automatically adapt your content for each platform's requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Format optimization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Platform-specific captions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Hashtag optimization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Integration */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <DollarSign className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Revenue Integration</CardTitle>
                <CardDescription className={colors.textSecondary}>Seamlessly integrate with your monetization strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Subscription tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Sales attribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Affiliate link integration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Management */}
            <Card className={`${colors.cardBg} border ${colors.border}`}>
              <CardHeader>
                <Users className={`h-12 w-12 ${colors.accent} mb-4`} />
                <CardTitle className={`text-xl ${colors.textPrimary}`}>Platform Management</CardTitle>
                <CardDescription className={colors.textSecondary}>Manage all your platform connections from one central hub</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Unified platform dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Connection health monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`text-sm ${colors.textSecondary}`}>Bulk account management</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className={`text-lg px-8 py-4 ${colors.button} text-white shadow-lg hover:shadow-xl font-semibold`} onClick={() => window.location.href = '/distribute'}>
              Explore Distribution Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* What Makes Us Different Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${colors.textPrimary}`}>What Makes Us Different</h2>
            <p className={`text-xl ${colors.textSecondary} max-w-3xl mx-auto`}>
              Discover the unique advantages that set our platform apart from conventional content creation tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* AI Personality Engine */}
            <div className={`p-8 rounded-2xl ${colors.cardBg} backdrop-blur-sm border ${colors.border}`}>
              <div className="flex items-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.accentBg} mb-0 mr-4`}>
                  <User className={`h-8 w-8 text-white`} />
                </div>
                <h3 className={`text-2xl font-bold ${colors.textPrimary}`}>AI Personality Engine</h3>
              </div>
              <p className={`text-lg ${colors.textSecondary} mb-4`}>
                Design custom models with unique styles, voices, and personalities — not just pretty faces.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Customizable personality traits and characteristics</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Unique voice patterns and speech styles</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Consistent character development across content</span>
                </div>
              </div>
            </div>

            {/* Social-First Workflow */}
            <div className={`p-8 rounded-2xl ${colors.cardBg} backdrop-blur-sm border ${colors.border}`}>
              <div className="flex items-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.accentBg} mb-0 mr-4`}>
                  <Users2 className={`h-8 w-8 text-white`} />
                </div>
                <h3 className={`text-2xl font-bold ${colors.textPrimary}`}>Social-First Workflow</h3>
              </div>
              <p className={`text-lg ${colors.textSecondary} mb-4`}>
                Generate engaging short-form content and distribute it to the right audiences — automatically.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Optimized for social media platforms</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>AI-powered audience targeting</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Automated content scheduling and posting</span>
                </div>
              </div>
            </div>

            {/* Custom Training & Looks */}
            <div className={`p-8 rounded-2xl ${colors.cardBg} backdrop-blur-sm border ${colors.border}`}>
              <div className="flex items-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.accentBg} mb-0 mr-4`}>
                  <Palette className={`h-8 w-8 text-white`} />
                </div>
                <h3 className={`text-2xl font-bold ${colors.textPrimary}`}>Custom Training & Looks</h3>
              </div>
              <p className={`text-lg ${colors.textSecondary} mb-4`}>
                Control training data, tone, speech, fashion, and more — all in one intuitive platform.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Upload 5-15 reference images for custom training</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Fine-tune tone, style, and appearance</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Complete creative control over output</span>
                </div>
              </div>
            </div>

            {/* Scalable for Everyone */}
            <div className={`p-8 rounded-2xl ${colors.cardBg} backdrop-blur-sm border ${colors.border}`}>
              <div className="flex items-center mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${colors.accentBg} mb-0 mr-4`}>
                  <TrendingUp className={`h-8 w-8 text-white`} />
                </div>
                <h3 className={`text-2xl font-bold ${colors.textPrimary}`}>Scalable for Everyone</h3>
              </div>
              <p className={`text-lg ${colors.textSecondary} mb-4`}>
                Start free and grow. Our flexible tools adapt to solo creators or full-blown agencies.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Free tier for getting started</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Scalable plans as you grow</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`text-sm ${colors.textSecondary}`}>Enterprise features for agencies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`py-20 px-4 ${colors.cardBg}`}>
        <div className="container mx-auto text-center">
          <div className={`max-w-4xl mx-auto p-12 rounded-3xl ${colors.cardBg} shadow-lg`}>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${colors.textPrimary}`}>
              Ready to Revolutionize Your Content Creation?
            </h2>
            <p className={`text-xl ${colors.textSecondary} mb-8`}>
              Join thousands of creators already monetizing with EDN. Start your journey today.
            </p>
            <Button size="lg" className={`text-xl px-12 py-6 ${colors.button} text-white`}>
              Start Creating
              <Sparkles className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>
      </div>
    </ErrorBoundary>
  )
}
