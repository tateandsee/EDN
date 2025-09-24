'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Ban, 
  Shield, 
  CreditCard, 
  Users, 
  Crown,
  Zap,
  Target,
  Globe,
  Lock,
  Calendar,
  Gavel,
  Scale
} from 'lucide-react'

export default function TermsPage() {
  const { isNSFW } = useNSFW()
  
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
      secondary: '#00FFFF',
      accent: '#FF4500',
      bg: 'from-pink-900 via-purple-900 to-black',
      cardBg: 'bg-black/40',
      text: 'text-white',
      textSecondary: 'text-gray-300'
    }
  }

  const scheme = colors[isNSFW ? 'nsfw' : 'sfw']

  const termsSections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing and using Erotic Digital Nexus (EDN), you agree to be bound by these Terms of Service',
        'These terms constitute a legally binding agreement between you and EDN',
        'If you do not agree to these terms, you may not use our services',
        'We reserve the right to modify these terms at any time',
        'Continued use of the service constitutes acceptance of modified terms',
        'Users are responsible for reviewing terms regularly'
      ]
    },
    {
      title: 'Service Description',
      icon: Target,
      content: [
        'EDN provides AI-powered content generation and distribution services',
        'Services include image generation, video creation, and social media distribution',
        'Multiple subscription tiers with varying features and limits',
        'AI models trained for both SFW and NSFW content creation',
        'Real-time generation with customizable parameters',
        'Integration with multiple social media platforms'
      ]
    },
    {
      title: 'User Accounts',
      icon: Users,
      content: [
        'Users must create an account to access premium features',
        'Account information must be accurate and up-to-date',
        'Users are responsible for maintaining account security',
        'Sharing account credentials is strictly prohibited',
        'Users must be 18 years or older to use NSFW features',
        'One account per person or business entity'
      ]
    },
    {
      title: 'Subscription and Payment',
      icon: CreditCard,
      content: [
        'Subscription fees are billed monthly or annually',
        'Payments are processed through secure third-party processors',
        'All sales are final except as specified in our refund policy',
        'Subscription auto-renews unless cancelled before billing date',
        'Price changes require 30 days notice for existing subscribers',
        'Failure to pay may result in service suspension'
      ]
    },
    {
      title: 'Content Guidelines',
      icon: Ban,
      content: [
        'Users must comply with all applicable laws and regulations',
        'Prohibited content includes illegal activities, hate speech, and harassment',
        'Copyrighted material may only be used with proper authorization',
        'Deepfake content without consent is strictly prohibited',
        'Content must not violate the rights of third parties',
        'EDN reserves the right to remove violating content'
      ]
    },
    {
      title: 'Intellectual Property',
      icon: Crown,
      content: [
        'Users retain ownership of content they create using EDN',
        'EDN retains license to use content for service improvement',
        'AI models and platform technology remain EDN property',
        'Users grant EDN right to display content in portfolios and showcases',
        'Third-party intellectual property must be properly licensed',
        'Trademark and brand guidelines must be followed'
      ]
    },
    {
      title: 'Prohibited Activities',
      icon: AlertCircle,
      content: [
        'Reverse engineering or decompiling our AI models',
        'Automated access or scraping of the platform',
        'Interfering with service availability or performance',
        'Impersonating EDN employees or representatives',
        'Using the service for illegal or fraudulent purposes',
        'Circumventing paywalls or usage limits'
      ]
    },
    {
      title: 'Privacy and Data Protection',
      icon: Lock,
      content: [
        'User data is processed according to our Privacy Policy',
        'Personal information is protected with industry-standard security',
        'Users have rights regarding their personal data',
        'Data is retained according to legal requirements',
        'Third-party data sharing is limited and controlled',
        'Users can request data deletion or portability'
      ]
    },
    {
      title: 'Refund Policy',
      icon: CreditCard,
      content: [
        'All sales are final except as specified in this refund policy',
        'Refunds may be issued within 14 days of purchase for technical issues',
        'Refunds for subscription services are prorated based on unused time',
        'Refunds for AI model purchases require demonstration of technical failure',
        'Processing fees and payment processor charges are non-refundable',
        'Refund requests must be submitted through the official support channel'
      ]
    }
  ]

  const userResponsibilities = [
    {
      title: 'Content Responsibility',
      description: 'You are solely responsible for all content created using our platform',
      icon: FileText
    },
    {
      title: 'Legal Compliance',
      description: 'Ensure all content complies with applicable laws and regulations',
      icon: Gavel
    },
    {
      title: 'Account Security',
      description: 'Protect your account credentials and report unauthorized access',
      icon: Shield
    },
    {
      title: 'Payment Obligations',
      description: 'Pay all subscription fees and applicable taxes on time',
      icon: CreditCard
    },
    {
      title: 'Respectful Conduct',
      description: 'Interact respectfully with other users and EDN staff',
      icon: Users
    },
    {
      title: 'Terms Compliance',
      description: 'Follow all terms and conditions outlined in this agreement',
      icon: Scale
    }
  ]

  const limitations = [
    {
      title: 'Service Availability',
      description: 'EDN does not guarantee uninterrupted service availability'
    },
    {
      title: 'Content Accuracy',
      description: 'AI-generated content may contain inaccuracies or errors'
    },
    {
      title: 'Liability Cap',
      description: 'EDN liability is limited to subscription fees paid'
    },
    {
      title: 'No Warranties',
      description: 'Service is provided "as is" without warranties of any kind'
    },
    {
      title: 'Indemnification',
      description: 'Users agree to indemnify EDN against certain claims'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={isNSFW ? "/hero-terms-nsfw.jpg" : "/hero-terms-sfw.jpg"} 
          alt="Terms of Service" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text terms ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Terms with EDN' : 'Terms of Service'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Your agreement for using EDN's AI-powered platform
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Last Updated */}
          <div className="mb-8 text-center">
            <p className={scheme.textSecondary}>
              Last Updated: January 15, 2024
            </p>
          </div>

          {/* Terms Overview */}
          <div className="mb-12">
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <FileText className="h-6 w-6" />
                  Terms Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={scheme.text}>
                  Welcome to Erotic Digital Nexus (EDN). These Terms of Service govern your use of our AI-powered content creation 
                  and distribution platform. By using our services, you agree to abide by these terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8 mb-12">
            {termsSections.map((section, index) => (
              <div
                key={section.title}
              >
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={`flex items-center gap-3 ${scheme.text}`}>
                      <section.icon className="h-6 w-6 text-purple-400" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className={scheme.text}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* User Responsibilities */}
          <div className="mb-12">
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Your Responsibilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userResponsibilities.map((responsibility, index) => (
                <div
                  key={responsibility.title}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                    <CardHeader>
                      <responsibility.icon className="h-8 w-8 text-purple-400 mb-2" />
                      <CardTitle className={scheme.text}>{responsibility.title}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {responsibility.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations and Disclaimers */}
          <div className="mb-12">
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Limitations and Disclaimers</h2>
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <AlertCircle className="h-6 w-6" />
                  Important Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {limitations.map((limitation, index) => (
                    <div key={limitation.title} className="p-4 rounded-lg bg-white/5">
                      <h4 className={`font-semibold mb-2 ${scheme.text}`}>{limitation.title}</h4>
                      <p className={scheme.text}>{limitation.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div>
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <Globe className="h-6 w-6" />
                  Questions About These Terms?
                </CardTitle>
                <CardDescription className={scheme.textSecondary}>
                  If you have any questions about these Terms of Service, please contact our legal team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Legal Department</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>legal@edn.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Response Time</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>Within 3-5 business days</p>
                    </div>
                  </div>
                  <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                    Contact Legal Team
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