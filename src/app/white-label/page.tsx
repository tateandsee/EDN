'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Settings, 
  Globe, 
  Smartphone, 
  Users, 
  Shield, 
  Zap, 
  DollarSign,
  CheckCircle,
  Star,
  ArrowRight,
  BarChart3,
  Database,
  Cloud,
  Lock,
  Building,
  Crown,
  Sparkles
} from 'lucide-react'

export default function WhiteLabelPage() {
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

  const features = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Complete Brand Customization",
      description: "Fully customize colors, logos, fonts, and design elements to match your brand identity",
      features: ['Custom branding', 'Color schemes', 'Logo integration', 'Font customization'],
      color: colors.primary
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Custom Domain & Hosting",
      description: "Use your own domain and hosting infrastructure for complete brand ownership",
      features: ['Custom domain', 'SSL certificates', 'CDN integration', 'Hosting flexibility'],
      color: colors.secondary
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile-Responsive Design",
      description: "Seamless experience across all devices with responsive layouts and native mobile apps",
      features: ['Responsive design', 'Mobile apps', 'Tablet optimization', 'Cross-platform'],
      color: colors.accent
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Management",
      description: "Complete control over user accounts, permissions, and access levels",
      features: ['User roles', 'Permission systems', 'Access control', 'User analytics'],
      color: colors.primary
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Advanced security features including encryption, compliance, and data protection",
      features: ['Data encryption', 'Compliance ready', 'Security audits', 'Data protection'],
      color: colors.secondary
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High Performance",
      description: "Optimized infrastructure for fast loading times and smooth user experience",
      features: ['Fast loading', 'Scalable infrastructure', 'Optimized performance', 'Global CDN'],
      color: colors.accent
    }
  ]

  const plans = [
    {
      id: 'entry',
      name: 'Entry',
      price: '$499',
      period: '/month',
      description: 'Perfect for growing businesses',
      features: [
        'Custom branding and colors',
        'Custom domain support',
        'Basic analytics dashboard',
        'Email support',
        '1,000 monthly active users',
        'Standard security features'
      ],
      popular: false,
      highlighted: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$1,299',
      period: '/month',
      description: 'For established organizations',
      features: [
        'White-label solution',
        'Customization options',
        '24/7 support',
        'Analytics and reporting',
        '5,000 monthly active users',
        'Professional-grade security',
        'API access and integrations'
      ],
      popular: true,
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$2,999',
      period: '/month',
      description: 'For large organizations',
      features: [
        'Complete white-label solution',
        'Advanced customization options',
        'Priority support with SLA',
        'Advanced analytics and reporting',
        'Unlimited users',
        'Enterprise-grade security',
        'API access and integrations',
        'Custom development options'
      ],
      popular: false,
      highlighted: false
    }
  ]

  const useCases = [
    {
      title: 'Content Platforms',
      description: 'Launch your own branded content creation and distribution platform',
      icon: <Database className="h-8 w-8" />,
      color: colors.primary
    },
    {
      title: 'Creator Networks',
      description: 'Build a community platform for content creators with your brand',
      icon: <Users className="h-8 w-8" />,
      color: colors.secondary
    },
    {
      title: 'Enterprise Solutions',
      description: 'Internal platforms for large organizations with custom branding',
      icon: <Building className="h-8 w-8" />,
      color: colors.accent
    },
    {
      title: 'SaaS Applications',
      description: 'Launch your own SaaS product powered by our infrastructure',
      icon: <Cloud className="h-8 w-8" />,
      color: colors.primary
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Launch Your Own Branded Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md leading-relaxed">
              Transform our powerful platform into your own branded solution with complete customization 
              and enterprise features
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                Get Started Today
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white text-gray-900 hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold backdrop-blur-sm">
                Schedule Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                Everything You Need to Build Your Brand
              </h2>
              <p className="text-xl" style={{ color: colors.textSecondary }}>
                Our white-label solution provides all the tools and features you need to launch 
                a successful branded platform.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 h-full" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: feature.color }}>
                        {feature.icon}
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
                </motion.div>
              ))}
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                Perfect for Various Use Cases
              </h2>
              <p className="text-xl" style={{ color: colors.textSecondary }}>
                Our white-label solution adapts to your specific business needs and industry requirements.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="backdrop-blur-sm border-2 text-center hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: useCase.color }}>
                        {useCase.icon}
                      </div>
                      <CardTitle className="text-lg" style={{ color: colors.primary }}>{useCase.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription style={{ color: colors.textSecondary }}>
                        {useCase.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl" style={{ color: colors.textSecondary }}>
                Choose the plan that best fits your business needs. Scale as you grow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`relative ${plan.highlighted ? 'md:scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-yellow-500 text-black font-bold px-4 py-2 text-sm shadow-lg">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  {plan.id === 'enterprise' && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-4 py-2 text-sm shadow-lg">
                        ENTERPRISE
                      </Badge>
                    </div>
                  )}

                  <Card className={`backdrop-blur-sm border-2 h-full ${
                    plan.highlighted 
                      ? 'bg-white/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                      : plan.id === 'enterprise'
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                      : 'transition-all duration-300 hover:shadow-xl hover:scale-105'
                  }`}
                  style={{ 
                    backgroundColor: plan.highlighted || plan.id === 'enterprise' ? undefined : colors.cardBg,
                    borderColor: plan.highlighted ? undefined : plan.id === 'enterprise' ? undefined : colors.cardBorder
                  }}>
                    <CardHeader className="text-center">
                      <CardTitle className={`text-2xl font-bold ${plan.id === 'enterprise' ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' : ''}`} style={{ color: plan.id === 'enterprise' ? undefined : colors.primary }}>
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="font-bold" style={{ color: colors.textSecondary }}>
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4">
                        <div className="flex items-baseline justify-center">
                          <span className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                            {plan.price}
                          </span>
                          <span className="ml-2 font-bold" style={{ color: colors.textLight }}>
                            {plan.period}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        className={`w-full ${
                          plan.highlighted 
                            ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                            : plan.id === 'enterprise'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-400 hover:to-pink-400'
                            : ''
                        }`}
                        style={plan.highlighted || plan.id === 'enterprise' ? undefined : { backgroundColor: colors.primary }}
                      >
                        Get Started
                      </Button>
                      
                      <div className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm" style={{ color: colors.textPrimary }}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.primary }}>
                  Ready to Launch Your Branded Platform?
                </h2>
                <p className="text-xl mb-8" style={{ color: colors.textSecondary }}>
                  Join hundreds of businesses that have successfully launched their own branded platforms 
                  using our white-label solution.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                    Get Started Today
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="px-8 py-3 text-lg font-semibold" style={{ borderColor: colors.primary, color: colors.primary }}>
                    Contact Sales
                    <ArrowRight className="ml-2 h-4 w-4" />
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