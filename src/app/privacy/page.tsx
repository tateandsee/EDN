'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Cookie, 
  Trash2, 
  Download, 
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Settings,
  Globe
} from 'lucide-react'

export default function PrivacyPage() {
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

  const privacySections = [
    {
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Personal Information: Name, email address, and payment details when you create an account',
        'Usage Data: Information about how you interact with our platform and features',
        'Generated Content: AI-generated images and content you create on our platform',
        'Device Information: IP address, browser type, and device characteristics',
        'Cookies: Small data files stored on your device for functionality and analytics'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        'To provide and maintain our AI generation services',
        'To process transactions and manage your account',
        'To improve our platform and develop new features',
        'To communicate with you about your account and our services',
        'To analyze usage patterns and optimize user experience',
        'To ensure platform security and prevent fraud'
      ]
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'Industry-standard encryption for data transmission and storage',
        'Regular security audits and vulnerability assessments',
        'Limited employee access to user data on a need-to-know basis',
        'Secure data centers with 24/7 monitoring',
        'Regular backups to prevent data loss',
        'Compliance with international security standards'
      ]
    },
    {
      title: 'Your Rights and Choices',
      icon: User,
      content: [
        'Access: Request a copy of your personal data',
        'Correction: Update or correct inaccurate information',
        'Deletion: Request deletion of your personal data',
        'Portability: Request transfer of your data to another service',
        'Opt-out: Withdraw consent for marketing communications',
        'Complaint: File complaints with relevant authorities'
      ]
    },
    {
      title: 'Data Sharing and Third Parties',
      icon: Globe,
      content: [
        'We do not sell your personal information to third parties',
        'Service providers who assist in operating our platform',
        'Payment processors for transaction processing',
        'Analytics providers for platform improvement',
        'Legal authorities when required by law',
        'Business partners only with your explicit consent'
      ]
    },
    {
      title: 'Cookies and Tracking',
      icon: Cookie,
      content: [
        'Essential cookies for platform functionality',
        'Analytics cookies to understand user behavior',
        'Marketing cookies for personalized advertising',
        'Preference cookies to remember your settings',
        'You can manage cookie preferences in your browser settings',
        'Cookie consent banner on your first visit'
      ]
    },
    {
      title: 'Data Retention',
      icon: Calendar,
      content: [
        'Account information: Retained while your account is active',
        'Generated content: Stored according to your subscription plan',
        'Usage data: Retained for 24 months for analytics',
        'Payment data: Retained as required for financial records',
        'Marketing data: Retained until you opt-out',
        'Deleted data: Securely erased within 30 days of deletion request'
      ]
    },
    {
      title: 'International Data Transfers',
      icon: Download,
      content: [
        'Data may be stored and processed in multiple countries',
        'Transfers comply with GDPR and other international regulations',
        'Standard contractual clauses for international data transfers',
        'Adequacy decisions for approved countries',
        'Data subject rights maintained regardless of location',
        'Regular compliance audits for international transfers'
      ]
    }
  ]

  const dataRights = [
    {
      title: 'Right to Access',
      description: 'Request a copy of all personal data we hold about you',
      icon: FileText
    },
    {
      title: 'Right to Rectification',
      description: 'Correct inaccurate or incomplete personal data',
      icon: Settings
    },
    {
      title: 'Right to Erasure',
      description: 'Request deletion of your personal data',
      icon: Trash2
    },
    {
      title: 'Right to Data Portability',
      description: 'Receive your data in a machine-readable format',
      icon: Download
    },
    {
      title: 'Right to Object',
      description: 'Object to processing of your personal data',
      icon: AlertCircle
    },
    {
      title: 'Right to Restrict Processing',
      description: 'Limit how we use your personal data',
      icon: Lock
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={isNSFW ? "/hero-privacy-nsfw.jpg" : "/hero-privacy-sfw.jpg"} 
          alt="Privacy Policy" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text privacy ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Privacy with EDN' : 'Your Privacy Matters to Us'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Comprehensive privacy protection for your peace of mind
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

          {/* Privacy Overview */}
          <div className="mb-12">
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <Shield className="h-6 w-6" />
                  Privacy Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={scheme.text}>
                  At Erotic Digital Nexus (EDN), we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy outlines how we collect, use, store, and protect your data when you use our AI-powered content creation platform.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8 mb-12">
            {privacySections.map((section, index) => (
              <div key={section.title}>
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

          {/* Your Data Rights */}
          <div className="mb-12">
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Your Data Rights</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataRights.map((right, index) => (
                <div key={right.title}>
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                    <CardHeader>
                      <right.icon className="h-8 w-8 text-purple-400 mb-2" />
                      <CardTitle className={scheme.text}>{right.title}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {right.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Contact for Privacy Concerns */}
          <div>
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <Mail className="h-6 w-6" />
                  Privacy Concerns?
                </CardTitle>
                <CardDescription className={scheme.textSecondary}>
                  If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Email</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>privacy@edn.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Data Protection Officer</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>Available Monday-Friday, 9AM-6PM EST</p>
                    </div>
                  </div>
                  <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                    Contact Privacy Team
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