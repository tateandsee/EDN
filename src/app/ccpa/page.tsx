'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Shield, 
  CheckCircle, 
  FileText, 
  Users, 
  Eye, 
  Download, 
  Trash2, 
  Mail,
  Calendar,
  Database,
  Lock,
  Globe,
  AlertCircle,
  Settings,
  Search,
  Edit,
  Ban,
  Clock,
  MapPin,
  Gavel,
  Certificate,
  DollarSign,
  Target,
  Scale
} from 'lucide-react'

export default function CCPAPage() {
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

  const consumerRights = [
    {
      title: 'Right to Know',
      icon: Eye,
      description: 'Know what personal information is being collected about you',
      details: [
        'Categories of personal information collected',
        'Sources of personal information',
        'Business purposes for collection',
        'Third parties with whom information is shared',
        'Specific pieces of personal information collected'
      ],
      howToExercise: 'Submit a data access request through your account settings'
    },
    {
      title: 'Right to Delete',
      icon: Trash2,
      description: 'Request deletion of your personal information',
      details: [
        'Personal information collected from you',
        'Information obtained from third parties',
        'Data derived from your personal information',
        'Inferences drawn from your information',
        'Publicly available personal information'
      ],
      howToExercise: 'Submit a deletion request through privacy settings'
    },
    {
      title: 'Right to Opt-Out',
      icon: Ban,
      description: 'Opt-out of the sale or sharing of your personal information',
      details: [
        'Sale of personal information to third parties',
        'Sharing of personal information for cross-context behavioral advertising',
        'Targeted advertising based on your data',
        'Data brokering activities',
        'Marketing list sharing'
      ],
      howToExercise: 'Toggle "Do Not Sell" option in privacy settings'
    },
    {
      title: 'Right to Correct',
      icon: Edit,
      description: 'Correct inaccurate personal information',
      details: [
        'Inaccurate personal data in your profile',
        'Incorrect contact information',
        'Wrong demographic data',
        'Inaccurate preference settings',
        'Erroneous usage data'
      ],
      howToExercise: 'Update your profile or submit correction request'
    },
    {
      title: 'Right to Portability',
      icon: Download,
      description: 'Receive your personal information in a portable format',
      details: [
        'Machine-readable format',
        'Structured, commonly used format',
        'Transmittable to other entities',
        'Comprehensive data export',
        'Including all categories of personal information'
      ],
      howToExercise: 'Request data export from account settings'
    },
    {
      title: 'Right to Non-Discrimination',
      icon: Scale,
      description: 'Not be discriminated against for exercising CCPA rights',
      details: [
        'No denial of service',
        'No price discrimination',
        'No service quality reduction',
        'No penalty for exercising rights',
        'Equal treatment regardless of privacy choices'
      ],
      howToExercise: 'Report discrimination to our privacy team'
    }
  ]

  const privacyNoticeSections = [
    {
      title: 'Categories of Personal Information Collected',
      icon: Database,
      items: [
        'Identifiers: Name, email, IP address, device ID',
        'Commercial Information: Transaction history, payment details',
        'Internet Activity: Browsing history, interaction data',
        'Geolocation: Approximate location data',
        'Sensory Data: User-generated content, preferences',
        'Inferences: Usage patterns, behavior analysis'
      ]
    },
    {
      title: 'Sources of Personal Information',
      icon: Globe,
      items: [
        'Directly from you: Account creation, profile setup',
        'Automatically: Website usage, app interactions',
        'Third parties: Payment processors, analytics providers',
        'Publicly available: Social media profiles, public records',
        'Inferred: Usage patterns, behavior analysis',
        'Business partners: Marketing partners, service providers'
      ]
    },
    {
      title: 'Business Purposes for Collection',
      icon: Target,
      items: [
        'Service delivery: Providing AI generation services',
        'Account management: User authentication and preferences',
        'Communication: Customer support and notifications',
        'Analytics: Service improvement and optimization',
        'Security: Fraud prevention and platform protection',
        'Marketing: Promotional communications (with consent)'
      ]
    },
    {
      title: 'Third-Party Disclosures',
      icon: Users,
      items: [
        'Service providers: Cloud hosting, payment processing',
        'Analytics providers: Usage tracking and optimization',
        'Marketing partners: Promotional campaigns (with consent)',
        'Legal authorities: When required by law',
        'Business partners: Limited data sharing for services',
        'Data processors: As outlined in our privacy policy'
      ]
    }
  ]

  const implementationMeasures = [
    {
      category: 'Consumer Rights Implementation',
      measures: [
        'Accessible privacy controls in user dashboard',
        'Streamlined data request process',
        'Automated deletion mechanisms',
        'Clear opt-out mechanisms',
        'Data portability export functionality',
        'Non-discrimination policy enforcement'
      ]
    },
    {
      category: 'Data Security',
      measures: [
        'Encryption of personal information',
        'Access controls and authentication',
        'Regular security assessments',
        'Employee training programs',
        'Vendor risk management',
        'Incident response procedures'
      ]
    },
    {
      category: 'Transparency Measures',
      measures: [
        'Comprehensive privacy notice',
        'Clear data collection disclosures',
        'User-friendly privacy settings',
        'Regular privacy policy updates',
        'Consumer education resources',
        'Open communication channels'
      ]
    }
  ]

  const complianceFeatures = [
    {
      title: 'Do Not Sell or Share',
      description: 'Easy-to-use opt-out mechanism for data sales/sharing',
      icon: Ban,
      status: 'Implemented'
    },
    {
      title: 'Data Access Portal',
      description: 'Self-service portal for data access requests',
      icon: Search,
      status: 'Available'
    },
    {
      title: 'Deletion Requests',
      description: 'Automated system for data deletion requests',
      icon: Trash2,
      status: 'Active'
    },
    {
      title: 'Privacy Preferences',
      description: 'Granular controls for data usage preferences',
      icon: Settings,
      status: 'Configurable'
    },
    {
      title: 'Data Portability',
      description: 'Export functionality for personal data',
      icon: Download,
      status: 'Enabled'
    },
    {
      title: 'Non-Discrimination',
      description: 'Policy ensuring equal treatment regardless of privacy choices',
      icon: Scale,
      status: 'Enforced'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={isNSFW ? "/hero-ccpa-nsfw.jpg" : "/hero-ccpa-sfw.jpg"} 
          alt="CCPA Compliance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text ccpa ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive CCPA with EDN' : 'CCPA Compliance at EDN'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Protecting California residents\' privacy rights
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* CCPA Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <Shield className="h-6 w-6" />
                  CCPA Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={scheme.text}>
                  The California Consumer Privacy Act (CCPA) gives California residents the right to know what personal 
                  information is being collected about them and to control how that information is used. At EDN, we are 
                  fully committed to CCPA compliance and protecting your privacy rights.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Consumer Rights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Your Consumer Rights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {consumerRights.map((right, index) => (
                <motion.div
                  key={right.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <right.icon className="h-6 w-6 text-purple-400" />
                        <div>
                          <CardTitle className={scheme.text}>{right.title}</CardTitle>
                          <CardDescription className={scheme.textSecondary}>
                            {right.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className={`text-sm font-medium ${scheme.text}`}>Key Details</p>
                          <ul className="space-y-1 mt-1">
                            {right.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start gap-1">
                                <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className={`text-xs ${scheme.text}`}>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${scheme.text}`}>How to Exercise</p>
                          <p className={`text-sm ${scheme.textSecondary}`}>{right.howToExercise}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Privacy Notice Sections */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Privacy Notice Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {privacyNoticeSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                        <section.icon className="h-5 w-5" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className={`text-sm ${scheme.text}`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Implementation Measures */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Implementation Measures</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {implementationMeasures.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                    <CardHeader>
                      <CardTitle className={scheme.text}>{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.measures.map((measure, measureIndex) => (
                          <li key={measureIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className={`text-sm ${scheme.text}`}>{measure}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Compliance Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Compliance Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                    <CardHeader>
                      <feature.icon className="h-8 w-8 text-purple-400 mb-2" />
                      <CardTitle className={scheme.text}>{feature.title}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className={feature.status === 'Implemented' || feature.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'}>
                        {feature.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CCPA Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <Mail className="h-6 w-6" />
                  CCPA Inquiries
                </CardTitle>
                <CardDescription className={scheme.textSecondary}>
                  For CCPA-related questions or to exercise your rights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>CCPA Compliance Officer</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>ccpa@edn.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Response Time</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>Within 45 days as required by CCPA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>No Cost</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>All CCPA requests are free of charge</p>
                    </div>
                  </div>
                  <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                    Submit CCPA Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}