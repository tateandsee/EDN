'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkles, 
  Camera, 
  Video, 
  Mic, 
  User, 
  Palette, 
  Globe, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  Crown, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Download,
  Upload,
  Settings,
  Target,
  Award,
  Layers,
  Wand2,
  Eye,
  Share2,
  Calendar
} from 'lucide-react'

export default function FeaturesPage() {
  const [isNSFW, setIsNSFW] = useState(false)
  
  const sfwColors = {
    primary: '#FF6B35', // vibrant coral orange
    secondary: '#4ECDC4', // bright turquoise
    accent: '#FFE66D', // golden yellow
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    particle: '#FF6B35',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(0, 0, 0, 0.1)',
    textPrimary: '#1A202C', // dark gray
    textSecondary: '#2D3748', // medium gray
    textLight: '#4A5568', // light gray
    textOnWhite: '#2D3748' // text on white backgrounds
  }

  const nsfwColors = {
    primary: '#FF1493', // deep hot pink
    secondary: '#00CED1', // dark turquoise
    accent: '#FF1744', // vibrant red
    bg: 'from-pink-900 via-purple-900 to-red-900',
    particle: '#FF69B4',
    cardBg: 'rgba(30, 0, 30, 0.85)',
    cardBorder: 'rgba(255, 20, 147, 0.5)',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textLight: '#B0B0B0',
    textOnWhite: '#FFFFFF'
  }

  const colors = isNSFW ? nsfwColors : sfwColors

  const features = {
    creation: [
      {
        icon: Camera,
        title: '4K Image Generation',
        description: 'Create stunning photorealistic images at 4096x4096px resolution with customizable attributes',
        features: ['Ultra HD resolution', 'Customizable attributes', 'Multiple styles', 'Batch processing'],
        color: colors.primary
      },
      {
        icon: Video,
        title: '1080p Video Creation',
        description: 'Generate dynamic videos (15-60s) with cinematic effects and voice integration',
        features: ['60fps smooth motion', 'Cinematic effects', 'Voice integration', 'Custom duration'],
        color: colors.secondary
      },
      {
        icon: User,
        title: 'Face Cloning',
        description: 'Seamlessly clone faces with 95% accuracy using uploaded images/videos',
        features: ['95% accuracy', 'Real-time previews', 'Multiple inputs', 'Smooth transitions'],
        color: colors.accent
      },
      {
        icon: Mic,
        title: 'Voice Integration',
        description: 'Add lifelike voices with multilingual support and adjustable pitch/tone',
        features: ['5 languages', 'Adjustable tone', 'Natural sound', 'Emotional range'],
        color: colors.primary
      },
      {
        icon: Palette,
        title: 'Virtual Try-On',
        description: 'Preview outfits/accessories in real-time with AR.js technology',
        features: ['AR integration', 'Real-time preview', '3D effects', 'Marketplace link'],
        color: colors.secondary
      },
      {
        icon: Wand2,
        title: 'AI-Powered Editing',
        description: 'Advanced AI tools for automatic enhancement and customization',
        features: ['Auto-enhance', 'Style transfer', 'Content aware fill', 'Smart cropping'],
        color: colors.accent
      }
    ],
    distribution: [
      {
        icon: Globe,
        title: 'Multi-Platform Distribution',
        description: 'Distribute to 14+ platforms with one click - API and manual options',
        features: ['14+ platforms', 'One-click distribution', 'API integration', 'Manual upload'],
        color: colors.primary
      },
      {
        icon: Share2,
        title: 'Smart Scheduling',
        description: 'Schedule content distribution across platforms for optimal engagement',
        features: ['Optimal timing', 'Cross-platform sync', 'Analytics integration', 'Bulk scheduling'],
        color: colors.secondary
      },
      {
        icon: Target,
        title: 'Audience Targeting',
        description: 'Advanced targeting options to reach the right audience on each platform',
        features: ['Demographic targeting', 'Interest-based', 'Behavioral targeting', 'Custom segments'],
        color: colors.accent
      },
      {
        icon: TrendingUp,
        title: 'Performance Analytics',
        description: 'Track performance across all platforms with comprehensive analytics',
        features: ['Real-time stats', 'Engagement metrics', 'Revenue tracking', 'Comparative analysis'],
        color: colors.primary
      }
    ],
    monetization: [
      {
        icon: Crown,
        title: 'Premium Subscriptions',
        description: 'Offer exclusive content through subscription tiers with flexible pricing',
        features: ['Multiple tiers', 'Custom pricing', 'Exclusive content', 'Member benefits'],
        color: colors.primary
      },
      {
        icon: Download,
        title: 'Digital Sales',
        description: 'Sell digital content directly through integrated e-commerce solutions',
        features: ['Instant delivery', 'Secure payments', 'DRM protection', 'Global reach'],
        color: colors.secondary
      },
      {
        icon: Users,
        title: 'Affiliate Program',
        description: 'Earn through membership referrals with our comprehensive affiliate system',
        features: ['10% commission on memberships', 'One-time per new user', 'Real-time tracking', 'Automated payouts'],
        color: colors.accent
      },
      {
        icon: Award,
        title: 'Creator Rewards',
        description: 'Get rewarded for quality content and community engagement',
        features: ['Quality bonuses', 'Engagement rewards', 'Community recognition', 'Exclusive perks'],
        color: colors.primary
      }
    ]
  }

  const stats = [
    { label: '4K Resolution', value: 'Ultra HD', icon: Camera },
    { label: 'Platform Support', value: '14+', icon: Globe },
    { label: 'Processing Speed', value: '60fps', icon: Zap },
    { label: 'Accuracy Rate', value: '95%', icon: Target }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Powerful Features for Modern Creators
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md leading-relaxed">
              Everything you need to create, distribute, and monetize exceptional content
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                Start Creating
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold backdrop-blur-sm">
                View Pricing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="backdrop-blur-sm border-2 text-center transform hover:scale-105 transition-all duration-300" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-4" style={{ color: colors.primary }} />
                  <div className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>{stat.value}</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Tabs */}
          <Tabs defaultValue="creation" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="creation" className="text-lg py-3">Creation Tools</TabsTrigger>
              <TabsTrigger value="distribution" className="text-lg py-3">Distribution</TabsTrigger>
              <TabsTrigger value="monetization" className="text-lg py-3">Monetization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="creation" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.creation.map((feature, index) => (
                  <Card key={index} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: feature.color }}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl" style={{ color: colors.primary }}>{feature.title}</CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {feature.features.map((feat, featIndex) => (
                          <div key={featIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm" style={{ color: colors.textPrimary }}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                {features.distribution.map((feature, index) => (
                  <Card key={index} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: feature.color }}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl" style={{ color: colors.primary }}>{feature.title}</CardTitle>
                          <CardDescription style={{ color: colors.textSecondary }}>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {feature.features.map((feat, featIndex) => (
                          <div key={featIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm" style={{ color: colors.textPrimary }}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="monetization" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                {features.monetization.map((feature, index) => (
                  <Card key={index} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: feature.color }}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl" style={{ color: colors.primary }}>{feature.title}</CardTitle>
                          <CardDescription style={{ color: colors.textSecondary }}>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {feature.features.map((feat, featIndex) => (
                          <div key={featIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm" style={{ color: colors.textPrimary }}>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.primary }}>
                  Ready to Transform Your Content Creation?
                </h2>
                <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
                  Join thousands of creators already using EDN to create exceptional content
                </p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                    Get Started Free
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
<<<<<<< HEAD
                  <Button variant="outline" className="px-8 py-3 text-lg font-semibold text-gray-900" style={{ borderColor: colors.primary }}>
=======
                  <Button variant="outline" className="px-8 py-3 text-lg font-semibold" style={{ borderColor: colors.primary, color: colors.primary }}>
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
                    Schedule Demo
                    <Calendar className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}