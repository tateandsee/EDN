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
  Badge as BadgeIcon,
  Target
} from 'lucide-react'

export default function GDPRPage() {
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

  const gdprPrinciples = [
    {
      title: 'Lawfulness, Fairness, and Transparency',
      icon: Gavel,
      description: 'Process data lawfully, fairly, and transparently',
      implementation: [
        'Clear privacy notices and consent mechanisms',
        'Documented lawful basis for all processing',
        'Transparent data collection and usage policies',
        'Regular compliance assessments'
      ]
    },
    {
      title: 'Purpose Limitation',
      icon: Target,
      description: 'Collect data only for specified, explicit purposes',
      implementation: [
        'Specific purpose identification at collection',
        'No repurposing without additional consent',
        'Clear communication of data usage',
        'Regular purpose reviews'
      ]
    },
    {
      title: 'Data Minimization',
      icon: Database,
      description: 'Collect only data that is necessary for purposes',
      implementation: [
        'Minimum data collection practices',
        'Regular data necessity assessments',
        'Automated data retention policies',
        'Data quality controls'
      ]
    },
    {
      title: 'Accuracy',
      icon: Edit,
      description: 'Ensure personal data is accurate and up-to-date',
      implementation: [
        'Data validation mechanisms',
        'User correction capabilities',
        'Regular data quality audits',
        'Automated accuracy checks'
      ]
    },
    {
      title: 'Storage Limitation',
      icon: Clock,
      description: 'Retain data only as long as necessary',
      implementation: [
        'Automated retention policies',
        'Regular data review cycles',
        'Secure deletion procedures',
        'Archive management systems'
      ]
    },
    {
      title: 'Integrity and Confidentiality',
      icon: Lock,
      description: 'Ensure security and confidentiality of data',
      implementation: [
        'Advanced encryption protocols',
        'Access control systems',
        'Regular security audits',
        'Breach detection procedures'
      ]
    },
    {
      title: 'Accountability',
      icon: BadgeIcon,
      description: 'Demonstrate compliance with GDPR principles',
      implementation: [
        'Comprehensive documentation',
        'Regular compliance reporting',
        'Data Protection Officer oversight',
        'Staff training programs'
      ]
    }
  ]

  const dataSubjectRights = [
    {
      title: 'Right to be Informed',
      icon: Eye,
      description: 'Know how your data is being used',
      howToExercise: 'Review our Privacy Policy and data collection notices',
      timeframe: 'Immediate access'
    },
    {
      title: 'Right of Access',
      icon: Search,
      description: 'Request a copy of your personal data',
      howToExercise: 'Submit a data access request through your account settings',
      timeframe: '30 days'
    },
    {
      title: 'Right to Rectification',
      icon: Edit,
      description: 'Correct inaccurate personal data',
      howToExercise: 'Update your profile or submit a correction request',
      timeframe: '30 days'
    },
    {
      title: 'Right to Erasure',
      icon: Trash2,
      description: 'Request deletion of your personal data',
      howToExercise: 'Submit a deletion request through account settings',
      timeframe: '30 days'
    },
    {
      title: 'Right to Restrict Processing',
      icon: Ban,
      description: 'Limit how your data is used',
      howToExercise: 'Contact our Data Protection Officer',
      timeframe: '30 days'
    },
    {
      title: 'Right to Data Portability',
      icon: Download,
      description: 'Receive your data in a portable format',
      howToExercise: 'Request data export from your account settings',
      timeframe: '30 days'
    },
    {
      title: 'Right to Object',
      icon: AlertCircle,
      description: 'Object to certain types of processing',
      howToExercise: 'Submit an objection through privacy settings',
      timeframe: 'Immediate effect'
    },
    {
      title: 'Rights Related to Automated Decision Making',
      icon: Settings,
      description: 'Human review of automated decisions',
      howToExercise: 'Request human review for account decisions',
      timeframe: '14 days'
    }
  ]

  const lawfulBases = [
    {
      basis: 'Consent',
      description: 'Explicit consent from the data subject',
      examples: [
        'Marketing communications',
        'Analytics cookies',
        'Profile personalization',
        'Newsletter subscriptions'
      ]
    },
    {
      basis: 'Contract',
      description: 'Necessary for contract performance',
      examples: [
        'Account creation and management',
        'Service delivery',
        'Payment processing',
        'Customer support'
      ]
    },
    {
      basis: 'Legal Obligation',
      description: 'Required by law or regulation',
      examples: [
        'Financial record keeping',
        'Anti-money laundering checks',
        'Tax compliance',
        'Regulatory reporting'
      ]
    },
    {
      basis: 'Legitimate Interests',
      description: 'Necessary for legitimate interests pursued by EDN',
      examples: [
        'Service improvement',
        'Fraud prevention',
        'Network security',
        'Direct marketing'
      ]
    }
  ]

  const dataProtectionMeasures = [
    {
      category: 'Technical Measures',
      items: [
        'End-to-end encryption for data transmission',
        'AES-256 encryption for data at rest',
        'Regular security penetration testing',
        'Intrusion detection and prevention systems',
        'Secure authentication mechanisms',
        'Data loss prevention systems'
      ]
    },
    {
      category: 'Organizational Measures',
      items: [
        'Data Protection Officer appointment',
        'Regular staff training programs',
        'Access control policies',
        'Incident response procedures',
        'Vendor risk management',
        'Compliance monitoring systems'
      ]
    },
    {
      category: 'Procedural Measures',
      items: [
        'Data protection impact assessments',
        'Breach notification procedures',
        'Data subject request handling',
        'Regular compliance audits',
        'Documentation maintenance',
        'Continuous improvement processes'
      ]
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <img 
          src={isNSFW ? "/hero-gdpr-nsfw.jpg" : "/hero-gdpr-sfw.jpg"} 
          alt="GDPR Compliance" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text gdpr ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive GDPR with EDN' : 'GDPR Compliance at EDN'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Protecting your data rights under EU regulation
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* GDPR Overview */}
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
                  GDPR Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={scheme.text}>
                  The General Data Protection Regulation (GDPR) is a comprehensive data protection law that applies to all 
                  organizations processing personal data of individuals in the European Union. At EDN, we are fully committed 
                  to GDPR compliance and protecting your data rights.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* GDPR Principles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>GDPR Principles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gdprPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                    <CardHeader>
                      <principle.icon className="h-8 w-8 text-purple-400 mb-2" />
                      <CardTitle className={scheme.text}>{principle.title}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {principle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {principle.implementation.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-1">
                            <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className={`text-xs ${scheme.text}`}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Data Subject Rights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Your Data Subject Rights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {dataSubjectRights.map((right, index) => (
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
                          <p className={`text-sm font-medium ${scheme.text}`}>How to Exercise</p>
                          <p className={`text-sm ${scheme.textSecondary}`}>{right.howToExercise}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${scheme.textSecondary}`}>Response Time</span>
                          <Badge variant="outline">{right.timeframe}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Lawful Bases for Processing */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Lawful Bases for Processing</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {lawfulBases.map((basis, index) => (
                <motion.div
                  key={basis.basis}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                    <CardHeader>
                      <CardTitle className={scheme.text}>{basis.basis}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {basis.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {basis.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className={`text-sm ${scheme.text}`}>{example}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Data Protection Measures */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Data Protection Measures</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {dataProtectionMeasures.map((category, index) => (
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
                        {category.items.map((item, itemIndex) => (
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

          {/* GDPR Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <Mail className="h-6 w-6" />
                  GDPR Inquiries
                </CardTitle>
                <CardDescription className={scheme.textSecondary}>
                  For GDPR-related questions or to exercise your rights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Data Protection Officer</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>dpo@edn.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>EU Representative</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>Available for EU data subjects</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Response Time</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>Within 30 days as required by GDPR</p>
                    </div>
                  </div>
                  <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                    Submit GDPR Request
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