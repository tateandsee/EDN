'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Headphones, 
  MessageCircle, 
  BookOpen, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Plus,
  FileText,
  Video,
  Users,
  Zap,
  Star,
  ArrowRight,
  Eye
} from 'lucide-react'

export default function SupportPage() {
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

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageCircle,
      responseTime: 'Average wait: 2 minutes',
      availability: '24/7',
      action: 'Start Chat'
    },
    {
      title: 'Email Support',
      description: 'Send us detailed inquiries via email',
      icon: Mail,
      responseTime: 'Response within 24 hours',
      availability: '24/7',
      action: 'Send Email'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      icon: Phone,
      responseTime: 'Available during business hours',
      availability: 'Mon-Fri 9AM-6PM EST',
      action: 'Call Now'
    },
    {
      title: 'Video Call',
      description: 'Screen sharing and visual support',
      icon: Video,
      responseTime: 'By appointment',
      availability: 'Mon-Fri 10AM-4PM EST',
      action: 'Schedule'
    }
  ]

  const faqCategories = [
    {
      name: 'Getting Started',
      icon: Star,
      questions: [
        {
          question: 'How do I create my first AI-generated content?',
          answer: 'Simply navigate to the Create page, select your preferred AI model, input your prompt, and click generate. Our intuitive interface will guide you through the process.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and cryptocurrency payments for your convenience.'
        },
        {
          question: 'How do I upgrade my plan?',
          answer: 'Go to your account settings, select "Billing", and choose your desired plan. The upgrade takes effect immediately.'
        }
      ]
    },
    {
      name: 'Technical Issues',
      icon: Zap,
      questions: [
        {
          question: 'Why is my generation taking so long?',
          answer: 'Generation times vary based on complexity and server load. During peak hours, it may take longer. Consider upgrading to a higher tier for priority processing.'
        },
        {
          question: 'I can\'t access my generated images',
          answer: 'Check your internet connection and ensure you\'re logged in. If the issue persists, clear your browser cache or contact support.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'Use the "Report Issue" button in the app or email us at support@edn.com with detailed steps to reproduce the problem.'
        }
      ]
    },
    {
      name: 'Billing & Plans',
      icon: FileText,
      questions: [
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for new subscriptions providing you have not downloaded any generated content. Contact our support team to initiate a refund.'
        },
        {
          question: 'What happens if I exceed my generation limit?',
          answer: 'You can purchase additional generation credits or upgrade to a higher plan with more generous limits.'
        }
      ]
    }
  ]

  const helpArticles = [
    {
      title: 'Complete Guide to AI Art Generation',
      category: 'Tutorials',
      readTime: '15 min',
      views: 12450,
      featured: true
    },
    {
      title: 'Understanding Prompt Engineering',
      category: 'Tips & Tricks',
      readTime: '10 min',
      views: 8920,
      featured: false
    },
    {
      title: 'Troubleshooting Common Issues',
      category: 'Technical',
      readTime: '8 min',
      views: 6540,
      featured: false
    },
    {
      title: 'Maximizing Your Plan Benefits',
      category: 'Account Management',
      readTime: '12 min',
      views: 4320,
      featured: false
    }
  ]

  const communityForums = [
    {
      name: 'General Discussion',
      description: 'General questions and discussions about EDN',
      topics: 1247,
      posts: 8934,
      latest: '2 hours ago'
    },
    {
      name: 'Technical Support',
      description: 'Get help with technical issues and bugs',
      topics: 567,
      posts: 2341,
      latest: '1 hour ago'
    },
    {
      name: 'Feature Requests',
      description: 'Suggest and vote on new features',
      topics: 234,
      posts: 892,
      latest: '4 hours ago'
    },
    {
      name: 'Tips & Tutorials',
      description: 'Share your knowledge and learn from others',
      topics: 892,
      posts: 5678,
      latest: '30 minutes ago'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <img 
          src={isNSFW ? "/hero-support-nsfw.jpg" : "/hero-support-sfw.jpg"} 
          alt="Support Center" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text support ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Support with EDN' : 'We\'re Here to Help You Succeed'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              24/7 support from our expert team
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Support Options */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>How Can We Help You?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {supportOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full hover:shadow-lg transition-shadow cursor-pointer`}>
                    <CardHeader className="text-center">
                      <option.icon className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                      <CardTitle className={scheme.text}>{option.title}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className={`text-sm ${scheme.textSecondary}`}>{option.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className={`text-sm ${scheme.textSecondary}`}>{option.availability}</span>
                        </div>
                        <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                          {option.action}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Tabs defaultValue="faq" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="articles">Help Articles</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {faqCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <category.icon className="h-8 w-8 text-purple-400" />
                            <CardTitle className={scheme.text}>{category.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {category.questions.map((qa, qaIndex) => (
                              <div key={qaIndex} className="p-3 rounded-lg bg-white/5">
                                <h4 className={`font-semibold mb-2 ${scheme.text}`}>{qa.question}</h4>
                                <p className={`text-sm ${scheme.textSecondary}`}>{qa.answer}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="articles">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {helpArticles.map((article, index) => (
                    <motion.div
                      key={article.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full ${article.featured ? 'ring-2 ring-yellow-400' : ''}`}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className={scheme.text}>{article.title}</CardTitle>
                              <CardDescription className={scheme.textSecondary}>
                                {article.category}
                              </CardDescription>
                            </div>
                            {article.featured && (
                              <Badge className="bg-yellow-500 text-black">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-blue-400" />
                                <span className={`text-sm ${scheme.textSecondary}`}>{article.readTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-green-400" />
                                <span className={`text-sm ${scheme.textSecondary}`}>{article.views.toLocaleString()}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="community">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {communityForums.map((forum, index) => (
                    <motion.div
                      key={forum.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Users className="h-8 w-8 text-purple-400" />
                            <div>
                              <CardTitle className={scheme.text}>{forum.name}</CardTitle>
                              <CardDescription className={scheme.textSecondary}>
                                {forum.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className={`text-sm ${scheme.textSecondary}`}>Topics</p>
                                <p className={`font-semibold ${scheme.text}`}>{forum.topics.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className={`text-sm ${scheme.textSecondary}`}>Posts</p>
                                <p className={`font-semibold ${scheme.text}`}>{forum.posts.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${scheme.textSecondary}`}>Latest activity</span>
                              <span className={`text-sm ${scheme.text}`}>{forum.latest}</span>
                            </div>
                            <Button className="w-full" variant="outline">
                              Visit Forum
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="contact">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Form */}
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                    <CardHeader>
                      <CardTitle className={scheme.text}>Send us a Message</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        Fill out the form below and we'll get back to you as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Email</label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white"
                            placeholder="your@email.com"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Subject</label>
                          <select className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white">
                            <option>Technical Support</option>
                            <option>Billing Question</option>
                            <option>Feature Request</option>
                            <option>General Inquiry</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${scheme.text}`}>Message</label>
                          <textarea
                            rows={4}
                            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white"
                            placeholder="Describe your issue or question..."
                          ></textarea>
                        </div>
                        <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                          Send Message
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <div className="space-y-6">
                    <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                      <CardHeader>
                        <CardTitle className={scheme.text}>Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-purple-400" />
                            <div>
                              <p className={`font-medium ${scheme.text}`}>Email</p>
                              <p className={`text-sm ${scheme.textSecondary}`}>support@edn.com</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-purple-400" />
                            <div>
                              <p className={`font-medium ${scheme.text}`}>Phone</p>
                              <p className={`text-sm ${scheme.textSecondary}`}>+1 (555) 123-4567</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-purple-400" />
                            <div>
                              <p className={`font-medium ${scheme.text}`}>Business Hours</p>
                              <p className={`text-sm ${scheme.textSecondary}`}>Mon-Fri 9AM-6PM EST</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                      <CardHeader>
                        <CardTitle className={scheme.text}>Emergency Support</CardTitle>
                        <CardDescription className={scheme.textSecondary}>
                          For urgent issues, use our emergency support channels
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Button className="w-full" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Live Chat (24/7)
                          </Button>
                          <Button className="w-full" variant="outline">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Report Critical Issue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}