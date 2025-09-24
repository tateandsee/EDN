'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Shield, 
  CheckCircle, 
  Award, 
  FileText, 
  Users, 
  Lock, 
  Eye, 
  Database,
  Globe,
  Scale,
  Gavel,
  Stamp,
  ClipboardCheck,
  Fingerprint,
  Key,
  AlertTriangle,
  ThumbsUp,
  Badge as BadgeIcon
} from 'lucide-react'

export default function CompliancePage() {
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

  const complianceStandards = [
    {
      name: 'GDPR',
      title: 'General Data Protection Regulation',
      description: 'Comprehensive EU data protection law',
      status: 'Compliant',
      icon: Shield,
      details: [
        'Lawful basis for all data processing',
        'Data subject rights implementation',
        'Data Protection Officer appointed',
        'Privacy by design principles',
        'Regular impact assessments',
        'Breach notification procedures'
      ]
    },
    {
      name: 'CCPA',
      title: 'California Consumer Privacy Act',
      description: 'California data privacy legislation',
      status: 'Compliant',
      icon: Scale,
      details: [
        'Consumer rights disclosure',
        'Data collection transparency',
        'Opt-out mechanisms implemented',
        'Data deletion procedures',
        'Non-discrimination practices',
        'Third-party disclosure controls'
      ]
    },
    {
      name: 'SOC 2',
      title: 'Service Organization Control 2',
      description: 'Security, availability, and confidentiality controls',
      status: 'Certified',
      icon: BadgeIcon,
      details: [
        'Annual independent audits',
        'Security controls validated',
        'Availability monitoring systems',
        'Confidentiality protections',
        'Processing integrity checks',
        'Continuous monitoring'
      ]
    },
    {
      name: 'ISO 27001',
      title: 'Information Security Management',
      description: 'International security standard',
      status: 'Certified',
      icon: Stamp,
      details: [
        'ISMS implementation',
        'Risk management framework',
        'Security policy documentation',
        'Regular security assessments',
        'Incident response procedures',
        'Continuous improvement'
      ]
    }
  ]

  const securityMeasures = [
    {
      title: 'Data Encryption',
      description: 'End-to-end encryption for all data transmission and storage',
      icon: Lock,
      level: 'Advanced'
    },
    {
      title: 'Access Controls',
      description: 'Multi-factor authentication and role-based access',
      icon: Key,
      level: 'Enterprise'
    },
    {
      title: 'Audit Trails',
      description: 'Comprehensive logging and monitoring of all activities',
      icon: ClipboardCheck,
      level: 'Comprehensive'
    },
    {
      title: 'Vulnerability Management',
      description: 'Regular security assessments and penetration testing',
      icon: AlertTriangle,
      level: 'Proactive'
    },
    {
      title: 'Data Backup',
      description: 'Secure, redundant backup systems with disaster recovery',
      icon: Database,
      level: 'Enterprise'
    },
    {
      title: 'Privacy Controls',
      description: 'Granular privacy settings and user consent management',
      icon: Eye,
      level: 'Advanced'
    }
  ]

  const complianceFeatures = [
    {
      title: 'Data Subject Rights',
      description: 'Full implementation of user data rights including access, correction, and deletion',
      icon: Users,
      category: 'Privacy'
    },
    {
      title: 'Consent Management',
      description: 'Transparent consent mechanisms with granular control options',
      icon: ThumbsUp,
      category: 'Privacy'
    },
    {
      title: 'Data Minimization',
      description: 'Collect and process only necessary data for service delivery',
      icon: Database,
      category: 'Privacy'
    },
    {
      title: 'Breach Notification',
      description: 'Timely notification procedures for security incidents',
      icon: AlertTriangle,
      category: 'Security'
    },
    {
      title: 'Third-party Risk Management',
      description: 'Comprehensive vendor assessment and monitoring',
      icon: Globe,
      category: 'Security'
    },
    {
      title: 'Compliance Documentation',
      description: 'Maintained records of compliance activities and assessments',
      icon: FileText,
      category: 'Governance'
    }
  ]

  const certifications = [
    {
      name: 'GDPR Compliance',
      issuer: 'EU Data Protection Authorities',
      date: 'Valid through 2025',
      status: 'Active'
    },
    {
      name: 'CCPA Compliance',
      issuer: 'California Attorney General',
      date: 'Valid through 2025',
      status: 'Active'
    },
    {
      name: 'SOC 2 Type II',
      issuer: 'Independent Auditors',
      date: 'Valid through 2024',
      status: 'Active'
    },
    {
      name: 'ISO 27001:2022',
      issuer: 'International Organization for Standardization',
      date: 'Valid through 2025',
      status: 'Active'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <img 
          src={isNSFW ? "/hero-compliance-nsfw.jpg" : "/hero-compliance-sfw.jpg"} 
          alt="Compliance & Security" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text compliance ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Compliance with EDN' : 'Compliance & Security You Can Trust'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Industry-leading compliance standards protecting your data and privacy
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Compliance Standards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Compliance Standards</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {complianceStandards.map((standard, index) => (
                <motion.div
                  key={standard.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <standard.icon className="h-8 w-8 text-purple-400" />
                          <div>
                            <CardTitle className={scheme.text}>{standard.name}</CardTitle>
                            <CardDescription className={scheme.textSecondary}>
                              {standard.title}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={standard.status === 'Compliant' ? 'bg-green-500' : 'bg-blue-500'}>
                          {standard.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={`mb-4 ${scheme.text}`}>{standard.description}</p>
                      <div className="space-y-2">
                        {standard.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className={`text-sm ${scheme.text}`}>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Security Measures */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Security Measures</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityMeasures.map((measure, index) => (
                <motion.div
                  key={measure.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                    <CardHeader>
                      <measure.icon className="h-8 w-8 text-purple-400 mb-2" />
                      <CardTitle className={scheme.text}>{measure.title}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {measure.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline" className="text-purple-400">
                        {measure.level}
                      </Badge>
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
            transition={{ duration: 0.5, delay: 0.2 }}
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
                      <Badge variant="outline">{feature.category}</Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Active Certifications</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className={scheme.text}>{cert.name}</CardTitle>
                          <CardDescription className={scheme.textSecondary}>
                            {cert.issuer}
                          </CardDescription>
                        </div>
                        <Badge className="bg-green-500">
                          {cert.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${scheme.textSecondary}`}>Valid through</span>
                        <span className={scheme.text}>{cert.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Compliance Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                  <Gavel className="h-6 w-6" />
                  Compliance Inquiries
                </CardTitle>
                <CardDescription className={scheme.textSecondary}>
                  For compliance-related questions or documentation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Fingerprint className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Compliance Officer</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>compliance@edn.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className={`font-medium ${scheme.text}`}>Documentation Requests</p>
                      <p className={`text-sm ${scheme.textSecondary}`}>Response within 5 business days</p>
                    </div>
                  </div>
                  <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                    Request Compliance Documentation
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