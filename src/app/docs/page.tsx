'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Sparkles, 
  BookOpen, 
  Code, 
  Video, 
  Users, 
  Download, 
  ExternalLink, 
  Search, 
  FileText, 
  Image, 
  Settings, 
  Zap, 
  Shield, 
  Database, 
  Server, 
  Cloud, 
  Key, 
  CheckCircle, 
  ArrowRight,
  Github,
  MessageSquare,
  HelpCircle,
  Book,
  DollarSign
} from 'lucide-react'

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('')
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

  const documentation = {
    gettingStarted: [
      {
        title: 'Quick Start Guide',
        description: 'Get up and running with EDN in minutes',
        icon: Zap,
        difficulty: 'Beginner',
        time: '5 min read',
        link: '/docs/quickstart'
      },
      {
        title: 'Account Setup',
        description: 'Configure your account and profile settings',
        icon: Users,
        difficulty: 'Beginner',
        time: '10 min read',
        link: '/docs/account-setup'
      },
      {
        title: 'Platform Integration',
        description: 'Connect your social media and content platforms',
        icon: Cloud,
        difficulty: 'Intermediate',
        time: '15 min read',
        link: '/docs/platform-integration'
      }
    ],
    guides: [
      {
        title: 'Creating Your First Content',
        description: 'Learn how to create stunning AI-generated images and videos',
        icon: Image,
        difficulty: 'Beginner',
        time: '20 min read',
        link: '/docs/creating-content'
      },
      {
        title: 'Advanced Prompt Engineering',
        description: 'Master the art of crafting effective AI prompts',
        icon: Code,
        difficulty: 'Advanced',
        time: '30 min read',
        link: '/docs/prompt-engineering'
      },
      {
        title: 'Content Distribution Strategies',
        description: 'Optimize your content distribution across platforms',
        icon: ExternalLink,
        difficulty: 'Intermediate',
        time: '25 min read',
        link: '/docs/distribution-strategies'
      },
      {
        title: 'Monetization Best Practices',
        description: 'Maximize your earnings with proven strategies',
        icon: DollarSign,
        difficulty: 'Intermediate',
        time: '35 min read',
        link: '/docs/monetization'
      }
    ],
    api: [
      {
        title: 'API Authentication',
        description: 'Learn how to authenticate with the EDN API',
        icon: Key,
        difficulty: 'Intermediate',
        time: '15 min read',
        link: '/docs/api-authentication'
      },
      {
        title: 'Content Creation API',
        description: 'Integrate content creation into your applications',
        icon: Code,
        difficulty: 'Advanced',
        time: '45 min read',
        link: '/docs/api-content-creation'
      },
      {
        title: 'Distribution API',
        description: 'Automate content distribution across platforms',
        icon: Server,
        difficulty: 'Advanced',
        time: '40 min read',
        link: '/docs/api-distribution'
      },
      {
        title: 'Webhook Integration',
        description: 'Set up webhooks for real-time notifications',
        icon: Database,
        difficulty: 'Advanced',
        time: '20 min read',
        link: '/docs/webhooks'
      }
    ],
    tutorials: [
      {
        title: 'Video Tutorials',
        description: 'Watch step-by-step video guides',
        icon: Video,
        difficulty: 'Beginner',
        time: 'Variable',
        link: '/docs/video-tutorials'
      },
      {
        title: 'Sample Projects',
        description: 'Explore complete project examples',
        icon: FileText,
        difficulty: 'Intermediate',
        time: '1-2 hours',
        link: '/docs/sample-projects'
      },
      {
        title: 'Community Examples',
        description: 'Learn from community-contributed examples',
        icon: Users,
        difficulty: 'Variable',
        time: 'Variable',
        link: '/docs/community-examples'
      }
    ]
  }

  const filteredDocs = (docs: any[]) => {
    return docs.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500'
      case 'Intermediate': return 'bg-yellow-500'
      case 'Advanced': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              Documentation
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md leading-relaxed">
              Everything you need to succeed with EDN
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search documentation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/60 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Getting Started</h3>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Quick start guides and setup</p>
                <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                  View Guides
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-6 text-center">
                <Code className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>API Reference</h3>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Complete API documentation</p>
                <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                  View API
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Video Tutorials</h3>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Step-by-step video guides</p>
                <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-6 text-center">
                <Github className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>GitHub</h3>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>View source code</p>
                <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                  View Repo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Tabs */}
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="getting-started" className="text-lg py-3">Getting Started</TabsTrigger>
              <TabsTrigger value="guides" className="text-lg py-3">Guides</TabsTrigger>
              <TabsTrigger value="api" className="text-lg py-3">API Reference</TabsTrigger>
              <TabsTrigger value="tutorials" className="text-lg py-3">Tutorials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs(documentation.gettingStarted).map((doc, index) => (
                  <Card key={index} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                          <doc.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={`${getDifficultyColor(doc.difficulty)} text-white text-xs`}>
                          {doc.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg" style={{ color: colors.primary }}>{doc.title}</CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: colors.textLight }}>{doc.time}</span>
                        <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {filteredDocs(documentation.guides).map((doc, index) => (
                  <Card key={index} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                          <doc.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={`${getDifficultyColor(doc.difficulty)} text-white text-xs`}>
                          {doc.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg" style={{ color: colors.primary }}>{doc.title}</CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: colors.textLight }}>{doc.time}</span>
                        <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                          Read Guide
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="api" className="mt-8">
              <div className="grid md:grid-cols-2 gap-6">
                {filteredDocs(documentation.api).map((doc, index) => (
                  <Card key={index} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                          <doc.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={`${getDifficultyColor(doc.difficulty)} text-white text-xs`}>
                          {doc.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg" style={{ color: colors.primary }}>{doc.title}</CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: colors.textLight }}>{doc.time}</span>
                        <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                          View API
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                {filteredDocs(documentation.tutorials).map((doc, index) => (
                  <Card key={index} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                          <doc.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={`${getDifficultyColor(doc.difficulty)} text-white text-xs`}>
                          {doc.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg" style={{ color: colors.primary }}>{doc.title}</CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>{doc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: colors.textLight }}>{doc.time}</span>
                        <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                          Start Learning
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Community Section */}
          <div className="mt-20">
            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                    Need Help?
                  </h2>
                  <p className="text-xl" style={{ color: colors.textSecondary }}>
                    Get support from our community and team
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="backdrop-blur-sm border-2 text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardContent className="p-6">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Community Forum</h3>
                      <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Ask questions and share knowledge</p>
                      <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                        Join Forum
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-sm border-2 text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardContent className="p-6">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Help Center</h3>
                      <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Browse FAQs and troubleshooting</p>
                      <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                        Get Help
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-sm border-2 text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardContent className="p-6">
                      <Users className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                      <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Discord Community</h3>
                      <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>Chat with other creators</p>
                      <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                        Join Discord
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}