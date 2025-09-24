'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Building
} from 'lucide-react'

export default function WhiteLabelPage() {
  const [selectedPlan, setSelectedPlan] = useState('enterprise')

  const features = [
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Complete Brand Customization",
      description: "Fully customize colors, logos, fonts, and design elements to match your brand identity"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Custom Domain & Hosting",
      description: "Use your own domain and hosting infrastructure for complete brand ownership"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile-Responsive Design",
      description: "Seamless experience across all devices with responsive layouts and native mobile apps"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "User Management",
      description: "Complete control over user accounts, permissions, and access levels"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "Advanced security features including encryption, compliance, and data protection"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High Performance",
      description: "Optimized infrastructure for fast loading times and smooth user experience"
    }
  ]

  const plans = [
    {
      id: 'professional',
      name: 'Professional',
      price: '$499',
      period: '/month',
      description: 'Perfect for growing businesses',
      features: [
        'Custom branding and colors',
        'Custom domain support',
        'Basic analytics dashboard',
        'Email support',
        '10,000 monthly active users',
        'Standard security features'
      ],
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$1,299',
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
      popular: true
    }
  ]

  const useCases = [
    {
      title: 'Content Platforms',
      description: 'Launch your own branded content creation and distribution platform',
      icon: <Database className="h-8 w-8" />
    },
    {
      title: 'Creator Networks',
      description: 'Build a community platform for content creators with your brand',
      icon: <Users className="h-8 w-8" />
    },
    {
      title: 'Enterprise Solutions',
      description: 'Internal platforms for large organizations with custom branding',
      icon: <Building className="h-8 w-8" />
    },
    {
      title: 'SaaS Applications',
      description: 'Launch your own SaaS product powered by our infrastructure',
      icon: <Cloud className="h-8 w-8" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:60px_60px]" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              White Label Solution
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Launch Your Own Branded Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Transform our powerful platform into your own branded solution. Complete customization, 
              enterprise features, and seamless integration with your existing infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build Your Brand
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our white-label solution provides all the tools and features you need to launch 
              a successful branded platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect for Various Use Cases
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our white-label solution adapts to your specific business needs and industry requirements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {useCase.icon}
                  </div>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {useCase.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that best fits your business needs. Scale as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base mt-2">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full mt-6" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch Your Branded Platform?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have successfully launched their own branded platforms 
            using our white-label solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}