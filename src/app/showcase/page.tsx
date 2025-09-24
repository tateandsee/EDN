'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { ImageProtection, ProtectedImage, AIModelProtection } from '@/components/image-protection'
import { 
  Sparkles, 
  Star, 
  Crown, 
  Heart,
  Upload,
  Edit,
  Play,
  CheckCircle,
  ArrowRight,
  Zap,
  Shield,
  Lock,
  CreditCard,
  HelpCircle,
  Users,
  TrendingUp,
  Clock,
  User,
  ShoppingCart
} from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export default function ShowcasePage() {
  const { isNSFW } = useNSFW()

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

  const processSteps = [
    {
      step: 1,
      title: "Describe Your Dream Influencer",
      description: "Start by describing your ideal influencer and uploading 6-15 reference images to train the AI model.",
      icon: Upload,
      image: "/hero-create-sfw.jpg",
      features: [
        "Detailed personality traits",
        "Physical characteristics",
        "Style preferences",
        "Reference image upload"
      ]
    },
    {
      step: 2,
      title: "Customize With Our Smart Editor",
      description: "Fine-tune age, body type, ethnicity, style, and more with our intuitive customization tools.",
      icon: Edit,
      image: "/hero-dashboard-sfw.jpg",
      features: [
        "Age and appearance adjustment",
        "Style and clothing options",
        "Background and setting selection",
        "Real-time preview"
      ]
    },
    {
      step: 3,
      title: "Generate Stunning Content",
      description: "Create high-quality photos and videos of your influencer in various scenarios and settings.",
      icon: Play,
      image: "/hero-distribute-sfw.jpg",
      features: [
        "High-resolution image generation",
        "Video content creation",
        "Multiple scenarios and poses",
        "Batch processing capabilities"
      ]
    }
  ]

  const faqItems: FAQItem[] = [
    {
      question: "Can I use this for SFW content only?",
      answer: "Yes, we offer both SFW and NSFW content creation options. You can choose your preferred mode and our AI will generate content accordingly while maintaining platform guidelines."
    },
    {
      question: "How does credit usage work?",
      answer: "Each plan includes a set number of monthly AI generations. Unused credits roll over to the next month, and you can purchase additional credits if needed."
    },
    {
      question: "What's the difference between plans?",
      answer: "Plans differ in the number of monthly generations, customization options, output quality, support level, and number of platform integrations. Higher tiers offer more features and commercial usage rights."
    },
    {
      question: "Can I upgrade anytime?",
      answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference for upgrades."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes, we take data security seriously. All your content and personal information are encrypted and stored securely. We never share your data with third parties without your consent."
    },
    {
      question: "Do I own the content I create?",
      answer: "Yes, you own full rights to all content created with our platform. Professional and Enterprise plans include commercial usage rights, allowing you to use content for business purposes."
    }
  ]

  const ProcessStepCard = ({ step }: { step: typeof processSteps[0] }) => (
    <Card className="h-full backdrop-blur-sm border-2 hover:shadow-lg" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: colors.primary }}>
            {step.step}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl" style={{ color: colors.primary }}>{step.title}</CardTitle>
          </div>
        </div>
        <CardDescription style={{ color: colors.textSecondary }} className="text-base">
          {step.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative h-48 rounded-lg overflow-hidden">
          <AIModelProtection watermarkText="EDN SHOWCASE">
            <img 
              src={step.image} 
              alt={step.title}
              className="w-full h-full object-cover"
            />
          </AIModelProtection>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-2">
              <step.icon className="h-5 w-5" />
              <span className="text-sm font-medium">EDN Creator Interface</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold" style={{ color: colors.textPrimary }}>Key Features:</h4>
          <ul className="space-y-1">
            {step.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                <CheckCircle className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )

  const FAQItem = ({ item }: { item: FAQItem }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
      <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
        <CardContent className="p-4">
          <button 
            className="w-full flex items-center justify-between text-left"
            onClick={() => setIsOpen(!isOpen)}
          >
            <h3 className="font-semibold text-lg" style={{ color: colors.primary }}>{item.question}</h3>
            <HelpCircle className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: colors.textSecondary }} />
          </button>
          
          {isOpen && (
            <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.cardBorder }}>
              <p style={{ color: colors.textSecondary }}>{item.answer}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <AIModelProtection watermarkText="EDN SHOWCASE">
          <img 
            src={isNSFW ? "/hero-create-nsfw.jpg" : "/hero-create-sfw.jpg"} 
            alt="EDN Influencer Showcase" 
            className="w-full h-full object-cover"
          />
        </AIModelProtection>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              EDN Influencer Showcase
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md leading-relaxed">
              Create Your Perfect EDN Influencer in Minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold">10K+ EDN Creators</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold">50K+ EDN Influencers Created</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Simple Process Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
              Create Your EDN Influencer in 3 Simple Steps
            </h2>
            <p className="text-xl" style={{ color: colors.textSecondary }}>
              Our intuitive platform makes it easy to generate custom influencers in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processSteps.map((step) => (
              <ProcessStepCard key={step.step} step={step} />
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 p-6 rounded-lg backdrop-blur-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <Clock className="h-8 w-8" style={{ color: colors.primary }} />
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.primary }}>Start Creating with EDN in Under 2 Minutes</h3>
                <p style={{ color: colors.textSecondary }}>Join thousands of EDN creators who are revolutionizing their content strategy with AI-generated influencers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Gallery Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
              EDN AI Model Showcase Gallery
            </h2>
            <p className="text-xl" style={{ color: colors.textSecondary }}>
              Explore our collection of stunning AI-generated female models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Showcase Images */}
            {Array.from({ length: 16 }, (_, index) => {
              const showcaseIndex = index + 1
              const isNsfwImage = showcaseIndex > 12 // Last 4 images are NSFW
              const shouldShow = isNSFW || !isNsfwImage
              
              if (!shouldShow) return null

              return (
                <div key={index} className="group relative overflow-hidden rounded-lg backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <div className="aspect-square relative">
                    <AIModelProtection watermarkText="EDN SHOWCASE">
                      <img 
                        src={`/showcase-${isNsfwImage ? 'nsfw' : 'sfw'}-${showcaseIndex}.jpg`}
                        alt={`EDN Showcase Model ${showcaseIndex}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </AIModelProtection>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-sm">EDN Model #{showcaseIndex}</h3>
                      <p className="text-xs opacity-90">
                        {isNsfwImage ? 'NSFW Content' : 'SFW Content'}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs" style={{ backgroundColor: colors.accent, color: colors.textOnWhite }}>
                        {isNsfwImage ? 'NSFW' : 'SFW'}
                      </Badge>
                      <Badge variant="outline" className="text-xs" style={{ borderColor: colors.primary, color: colors.primary }}>
                        AI Generated
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      EDN Showcase Model {showcaseIndex}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Ultra-realistic 8K quality with detailed features
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 p-6 rounded-lg backdrop-blur-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <Sparkles className="h-8 w-8" style={{ color: colors.primary }} />
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.primary }}>16 Unique EDN AI Models</h3>
                <p style={{ color: colors.textSecondary }}>Featuring diverse ethnicities, styles, and settings with photorealistic quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
              EDN Frequently Asked Questions
            </h2>
            <p className="text-xl" style={{ color: colors.textSecondary }}>
              Find answers to common questions about EDN Creator Core AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqItems.map((item, idx) => (
              <FAQItem key={idx} item={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 p-6 rounded-lg backdrop-blur-sm" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <Shield className="h-8 w-8" style={{ color: colors.primary }} />
              <div>
                <h3 className="text-xl font-bold" style={{ color: colors.primary }}>Still Have EDN Questions?</h3>
                <p style={{ color: colors.textSecondary }}>Our EDN support team is here to help you 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
