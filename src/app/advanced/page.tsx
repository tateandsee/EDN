'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Cpu, 
  Zap, 
  Settings, 
  Database, 
  Network, 
  Shield, 
  BarChart3,
  ArrowRight,
  Sparkles,
  Target,
  Layers
} from 'lucide-react'
import Link from 'next/link'

export default function AdvancedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Features', icon: Layers },
    { id: 'ai', name: 'AI Tools', icon: Brain },
    { id: 'development', name: 'Development', icon: Cpu },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'integration', name: 'Integration', icon: Network },
  ]

  const features = [
    {
      id: 1,
      title: 'Advanced AI Generation',
      description: 'Access cutting-edge AI models for content creation with advanced parameters and customization.',
      icon: Brain,
      category: 'ai',
      href: '/advanced-ai',
      status: 'active',
      badge: 'New'
    },
    {
      id: 2,
      title: 'API Integration',
      description: 'Integrate EDN AI capabilities into your own applications with our comprehensive API.',
      icon: Network,
      category: 'integration',
      href: '/docs',
      status: 'active',
      badge: 'API'
    },
    {
      id: 3,
      title: 'Advanced Analytics',
      description: 'Deep dive into your content performance with advanced analytics and insights.',
      icon: BarChart3,
      category: 'analytics',
      href: '/analytics',
      status: 'active',
      badge: 'Pro'
    },
    {
      id: 4,
      title: 'Custom Models',
      description: 'Train and deploy custom AI models tailored to your specific needs and style.',
      icon: Cpu,
      category: 'ai',
      href: '/models',
      status: 'beta',
      badge: 'Beta'
    },
    {
      id: 5,
      title: 'Database Management',
      description: 'Advanced database tools for managing your content, users, and analytics data.',
      icon: Database,
      category: 'development',
      href: '/dashboard',
      status: 'active',
      badge: 'Admin'
    },
    {
      id: 6,
      title: 'Security & Compliance',
      description: 'Advanced security features and compliance tools for enterprise-grade protection.',
      icon: Shield,
      category: 'development',
      href: '/security',
      status: 'active',
      badge: 'Secure'
    },
    {
      id: 7,
      title: 'Automation Tools',
      description: 'Create powerful automation workflows for content creation and distribution.',
      icon: Zap,
      category: 'integration',
      href: '/marketing',
      status: 'active',
      badge: 'Auto'
    },
    {
      id: 8,
      title: 'Advanced Settings',
      description: 'Fine-tune every aspect of your EDN AI experience with advanced configuration options.',
      icon: Settings,
      category: 'development',
      href: '/profile',
      status: 'active',
      badge: 'Settings'
    }
  ]

  const filteredFeatures = selectedCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'beta': return 'bg-yellow-500'
      case 'coming': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'new': return 'default'
      case 'beta': return 'secondary'
      case 'pro': return 'destructive'
      case 'api': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Advanced Features
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Unlock the full potential of EDN AI with our advanced tools and features designed for power users and developers.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="text-sm">
                <Target className="h-3 w-3 mr-1" />
                Power Users
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Cpu className="h-3 w-3 mr-1" />
                Developers
              </Badge>
              <Badge variant="outline" className="text-sm">
                <BarChart3 className="h-3 w-3 mr-1" />
                Analytics
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(feature.status)}`} />
                          <span className="text-xs text-muted-foreground capitalize">{feature.status}</span>
                          {feature.badge && (
                            <Badge variant={getBadgeVariant(feature.badge)} className="text-xs">
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    asChild
                    className="w-full group-hover:bg-primary/90 transition-colors"
                  >
                    <Link href={feature.href}>
                      Explore Feature
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Advanced Features</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime SLA</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">Premium Support</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">API</div>
              <p className="text-sm text-muted-foreground">Full Integration</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}