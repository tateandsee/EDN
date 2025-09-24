'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Sparkles, 
  Download, 
  Upload, 
  Share2, 
  Link, 
  Unlink,
  BarChart3,
  FileText,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Users,
  Heart,
  MessageSquare,
  Eye,
  Settings
} from 'lucide-react'

export default function DistributePage() {
  const { isNSFW } = useNSFW()
  const [activeTab, setActiveTab] = useState('connected')
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  
  const nsfwColors = {
    primary: '#FF69B4', // neon pink
    secondary: '#00FFFF', // cyan
    accent: '#FF4500', // burning red
    bg: 'from-pink-900 via-purple-900 to-black'
  }

  const sfwColors = {
    primary: '#FF6B35', // vibrant coral orange
    secondary: '#4ECDC4', // bright turquoise
    accent: '#FFE66D', // golden yellow
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    particle: '#FF6B35',
    cardBg: 'rgba(255, 255, 255, 0.8)',
    cardBorder: 'rgba(0, 0, 0, 0.2)',
    textPrimary: '#1A202C', // dark gray
    textSecondary: '#2D3748', // medium gray
    textLight: '#4A5568', // light gray
    textOnWhite: '#2D3748' // text on white backgrounds
  }

  const colors = isNSFW ? nsfwColors : sfwColors

  const platforms = [
    // NSFW Platforms (Manual Download)
    { 
      name: 'OnlyFans', 
      type: 'NSFW', 
      connected: true,
      lastPosted: '2 hours ago',
      stats: { views: 15420, likes: 3420, comments: 156 }
    },
    { 
      name: 'Fansly', 
      type: 'NSFW', 
      connected: true,
      lastPosted: '5 hours ago',
      stats: { views: 8930, likes: 2100, comments: 89 }
    },
    { 
      name: 'JustForFans', 
      type: 'NSFW', 
      connected: false,
      lastPosted: null,
      stats: null
    },
    { 
      name: 'ManyVids', 
      type: 'NSFW', 
      connected: true,
      lastPosted: '1 day ago',
      stats: { views: 22100, likes: 5400, comments: 234 }
    },
    { 
      name: 'Fanvue', 
      type: 'NSFW', 
      connected: false,
      lastPosted: null,
      stats: null
    },
    { 
      name: 'LoyalFans', 
      type: 'NSFW', 
      connected: true,
      lastPosted: '3 hours ago',
      stats: { views: 6780, likes: 1800, comments: 67 }
    },
    { 
      name: 'My.Club', 
      type: 'NSFW', 
      connected: false,
      lastPosted: null,
      stats: null
    },
    { 
      name: 'iFans', 
      type: 'NSFW', 
      connected: true,
      lastPosted: '6 hours ago',
      stats: { views: 12340, likes: 2890, comments: 123 }
    },
    { 
      name: 'FanTime', 
      type: 'NSFW', 
      connected: false,
      lastPosted: null,
      stats: null
    },
    
    // SFW Platforms (API Integration)
    { 
      name: 'Patreon', 
      type: 'SFW', 
      connected: true,
      lastPosted: '1 hour ago',
      stats: { views: 8900, likes: 1200, comments: 45 }
    },
    { 
      name: 'Instagram', 
      type: 'SFW', 
      connected: true,
      lastPosted: '30 minutes ago',
      stats: { views: 45600, likes: 8900, comments: 567 }
    },
    { 
      name: 'TikTok', 
      type: 'SFW', 
      connected: true,
      lastPosted: '45 minutes ago',
      stats: { views: 128900, likes: 25600, comments: 1234 }
    },
    { 
      name: 'Ko-fi', 
      type: 'SFW', 
      connected: false,
      lastPosted: null,
      stats: null
    },
    { 
      name: 'AdmireMe.VIP', 
      type: 'SFW', 
      connected: true,
      lastPosted: '2 hours ago',
      stats: { views: 15600, likes: 3400, comments: 189 }
    }
  ]

  const contentItems = [
    {
      id: '1',
      title: 'Neon Bikini Beach Shoot',
      type: 'image',
      resolution: '4K',
      size: '8.2MB',
      created: '2 hours ago',
      platforms: ['OnlyFans', 'Fansly', 'Instagram'],
      aiCaption: 'Glowing under the neon lights ✨ #BeachVibes #NeonAesthetic #SummerGlow'
    },
    {
      id: '2',
      title: 'Cyberpunk Fashion Video',
      type: 'video',
      resolution: '1080p',
      size: '95.4MB',
      created: '5 hours ago',
      platforms: ['ManyVids', 'TikTok', 'Patreon'],
      aiCaption: 'Future is now 🚀 Step into the cyberpunk revolution #Cyberpunk #Fashion #TechWear'
    },
    {
      id: '3',
      title: 'Elegant Evening Look',
      type: 'image',
      resolution: '4K',
      size: '7.8MB',
      created: '1 day ago',
      platforms: ['LoyalFans', 'Instagram', 'AdmireMe.VIP'],
      aiCaption: 'Elegance never goes out of style 💫 #EveningWear #Classy #Fashion'
    }
  ]

  const analyticsData = {
    totalViews: 284730,
    totalLikes: 58710,
    totalComments: 2894,
    topPlatform: 'TikTok',
    engagementRate: 4.2
  }

  const handleConnect = (platformName: string) => {
    console.log(`Connecting to ${platformName}`)
  }

  const handleDisconnect = (platformName: string) => {
    console.log(`Disconnecting from ${platformName}`)
  }

  const handleDownload = (platformName: string, contentId: string) => {
    console.log(`Downloading content ${contentId} for ${platformName}`)
  }

  const handlePost = (platformName: string, contentId: string) => {
    console.log(`Posting content ${contentId} to ${platformName}`)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <img 
          src={isNSFW ? "/hero-distribute-nsfw.jpg" : "/hero-distribute-sfw.jpg"} 
          alt="Multi-Platform Distribution" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text distribute ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Distribution with EDN' : 'Distribute Everywhere with EDN'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Seamlessly distribute your content across 14 platforms
            </p>
          </div>
        </div>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden" style={{ top: '320px' }}>
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: colors.particle || colors.primary,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 py-8" style={{ paddingTop: '0' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.primary }}>
              Multi-Platform Distribution
            </h1>
            <p className="text-xl" style={{ color: colors.secondary }}>
              Seamlessly distribute your content across 14 platforms
            </p>
          </motion.div>

          {/* Analytics Overview */}
          <Card className="backdrop-blur-sm border-2 mb-8" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
            <CardHeader>
              <CardTitle style={{ color: colors.primary }}>
                <BarChart3 className="inline mr-2 h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {analyticsData.totalViews.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: colors.textLight }}>Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {analyticsData.totalLikes.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: colors.textLight }}>Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {analyticsData.totalComments.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: colors.textLight }}>Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {analyticsData.engagementRate}%
                  </div>
                  <div className="text-sm" style={{ color: colors.textLight }}>Engagement</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {analyticsData.topPlatform}
                  </div>
                  <div className="text-sm" style={{ color: colors.textLight }}>Top Platform</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="connected">Connected Platforms</TabsTrigger>
              <TabsTrigger value="content">Content Library</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connected" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card className="backdrop-blur-sm border-2 hover:bg-white/20 transition-all duration-300" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg" style={{ color: colors.primary }}>
                            {platform.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={platform.type === 'NSFW' ? 'destructive' : 'default'}
                              className="text-xs"
                            >
                              {platform.type}
                            </Badge>
                            {platform.connected ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {platform.connected && platform.lastPosted && (
                            <div className="flex items-center text-sm" style={{ color: colors.textLight }}>
                              <Clock className="h-3 w-3 mr-1" />
                              Last posted: {platform.lastPosted}
                            </div>
                          )}
                          
                          {platform.connected && platform.stats && (
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-semibold" style={{ color: colors.primary }}>
                                  {platform.stats.views.toLocaleString()}
                                </div>
                                <div style={{ color: colors.textLight }}>Views</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold" style={{ color: colors.primary }}>
                                  {platform.stats.likes.toLocaleString()}
                                </div>
                                <div style={{ color: colors.textLight }}>Likes</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold" style={{ color: colors.primary }}>
                                  {platform.stats.comments}
                                </div>
                                <div style={{ color: colors.textLight }}>Comments</div>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            {platform.connected ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs"
                                  onClick={() => handleDisconnect(platform.name)}
                                  style={{ 
                                    borderColor: colors.accent,
                                    color: colors.accent
                                  }}
                                >
                                  <Unlink className="mr-1 h-3 w-3" />
                                  Disconnect
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() => console.log(`Manage ${platform.name}`)}
                                  style={{ backgroundColor: colors.primary }}
                                >
                                  <Settings className="mr-1 h-3 w-3" />
                                  Manage
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full text-xs"
                                onClick={() => handleConnect(platform.name)}
                                style={{ backgroundColor: colors.secondary, color: '#000' }}
                              >
                                <Link className="mr-1 h-3 w-3" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Content Library */}
                <div className="lg:col-span-2">
                  <Card className="backdrop-blur-sm border-2"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}>
                    <CardHeader>
                      <CardTitle style={{ color: colors.primary }}>
                        Content Library
                      </CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>
                        Your AI-generated content ready for distribution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {contentItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedContent === item.id 
                                ? 'border-white/50 g"style={{ backgroundColor: colors.cardBg }}' 
                                : 'g"style={{ borderColor: colors.cardBorder }} hover:border-white/40'
                            }`}
                            onClick={() => setSelectedContent(item.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1" style={{ color: colors.primary }}>
                                  {item.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm" style={{ color: colors.textLight }}>
                                  <span className="flex items-center gap-1">
                                    {item.type === 'image' ? (
                                      <Eye className="h-3 w-3" />
                                    ) : (
                                      <MessageSquare className="h-3 w-3" />
                                    )}
                                    {item.type === 'image' ? 'Image' : 'Video'}
                                  </span>
                                  <span>{item.resolution}</span>
                                  <span>{item.size}</span>
                                  <span>{item.created}</span>
                                </div>
                                <div className="mt-2 text-xs" style={{ color: colors.textLight }}>
                                  <span className="font-medium">AI Caption:</span> {item.aiCaption}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {item.platforms.length} platforms
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Distribution Panel */}
                <div className="lg:col-span-1">
                  <Card className="backdrop-blur-sm border-2"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}>
                    <CardHeader>
                      <CardTitle style={{ color: colors.primary }}>
                        Distribute Content
                      </CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>
                        {selectedContent ? 'Select platforms to distribute to' : 'Select content to distribute'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedContent ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Custom Caption (Optional)
                            </label>
                            <Textarea
                              placeholder="AI will optimize if left empty..."
                              className="text-white/90 placeholder-white/50"
                              style={{ 
                                backgroundColor: colors.cardBg,
                                borderColor: colors.cardBorder
                              }}
                              rows={3}
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium mb-2 block" style={{ color: colors.primary }}>
                              Select Platforms
                            </label>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {platforms.filter(p => p.connected).map(platform => (
                                <div key={platform.name} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{platform.name}</span>
                                    <Badge 
                                      variant={platform.type === 'NSFW' ? 'destructive' : 'default'}
                                      className="text-xs"
                                    >
                                      {platform.type}
                                    </Badge>
                                  </div>
                                  <Button
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                      if (platform.type === 'NSFW') {
                                        handleDownload(platform.name, selectedContent)
                                      } else {
                                        handlePost(platform.name, selectedContent)
                                      }
                                    }}
                                    style={{ 
                                      backgroundColor: platform.type === 'NSFW' ? colors.primary : colors.secondary,
                                      color: platform.type === 'NSFW' ? 'white' : 'black'
                                    }}
                                  >
                                    {platform.type === 'NSFW' ? (
                                      <>
                                        <Download className="mr-1 h-3 w-3" />
                                        Download
                                      </>
                                    ) : (
                                      <>
                                        <Share2 className="mr-1 h-3 w-3" />
                                        Post
                                      </>
                                    )}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8" style={{ color: colors.textLight }}>
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Select content to distribute</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="backdrop-blur-sm border-2"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      Platform Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {platforms.filter(p => p.connected && p.stats).map(platform => (
                        <div key={platform.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium" style={{ color: colors.primary }}>
                              {platform.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {platform.type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div style={{ color: colors.textLight }}>Views</div>
                              <div className="font-semibold">{platform.stats?.views.toLocaleString()}</div>
                            </div>
                            <div>
                              <div style={{ color: colors.textLight }}>Likes</div>
                              <div className="font-semibold">{platform.stats?.likes.toLocaleString()}</div>
                            </div>
                            <div>
                              <div style={{ color: colors.textLight }}>Comments</div>
                              <div className="font-semibold">{platform.stats?.comments}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm border-2"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      Export Analytics
                    </CardTitle>
                    <CardDescription style={{ color: colors.textSecondary }}>
                      Download analytics data or connect to Zapier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full" style={{ backgroundColor: colors.primary }}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV Report
                      </Button>
                      <Button className="w-full" variant="outline" style={{ borderColor: colors.secondary }}>
                        <Zap className="mr-2 h-4 w-4" />
                        Connect to Zapier
                      </Button>
                      <div className="text-xs mt-4" style={{ color: colors.textLight }}>
                        <p>• CSV exports include all platform metrics</p>
                        <p>• Zapier integration for automated analytics</p>
                        <p>• Real-time data synchronization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}