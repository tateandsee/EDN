'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNSFW } from '@/contexts/nsfw-context'
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Star, 
  Heart, 
  Share2, 
  Search, 
  Filter,
  Calendar,
  Trophy,
  Award,
  Zap,
  Plus,
  Eye,
  ThumbsUp,
  MessageCircle
} from 'lucide-react'

export default function CommunityPage() {
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

  const communityStats = {
    totalMembers: 15420,
    onlineNow: 1247,
    postsToday: 89,
    activeCreators: 3421
  }

  const trendingTopics = [
    { name: 'AI Art Techniques', posts: 1243, trend: '+12%' },
    { name: 'Character Design', posts: 892, trend: '+8%' },
    { name: 'Style Transfer', posts: 756, trend: '+15%' },
    { name: 'Prompt Engineering', posts: 634, trend: '+22%' },
    { name: 'Model Training', posts: 445, trend: '+5%' }
  ]

  const communityPosts = [
    {
      id: 1,
      author: 'CreativeMaster',
      avatar: '/avatars/user1.jpg',
      title: 'New technique for realistic skin textures',
      content: 'Just discovered an amazing prompt combination that creates incredibly realistic skin textures. The key is layering multiple texture descriptors...',
      likes: 234,
      comments: 45,
      shares: 12,
      timeAgo: '2 hours ago',
      tags: ['tutorial', 'textures', 'realism'],
      isFeatured: true
    },
    {
      id: 2,
      author: 'ArtEnthusiast',
      avatar: '/avatars/user2.jpg',
      title: 'Showcase: My latest character series',
      content: 'Been working on this character series for the past month. Each character has their own unique style and personality...',
      likes: 189,
      comments: 32,
      shares: 8,
      timeAgo: '4 hours ago',
      tags: ['showcase', 'characters', 'series'],
      isFeatured: false
    },
    {
      id: 3,
      author: 'TechWizard',
      avatar: '/avatars/user3.jpg',
      title: 'Understanding lighting in AI generation',
      content: 'Lighting is one of the most crucial elements in AI art generation. Here are my findings on how different lighting prompts affect the output...',
      likes: 156,
      comments: 28,
      shares: 15,
      timeAgo: '6 hours ago',
      tags: ['tutorial', 'lighting', 'techniques'],
      isFeatured: false
    }
  ]

  const upcomingEvents = [
    {
      title: 'AI Art Masterclass',
      date: '2024-01-20',
      time: '18:00 UTC',
      participants: 234,
      type: 'workshop'
    },
    {
      title: 'Community Showcase',
      date: '2024-01-25',
      time: '20:00 UTC',
      participants: 567,
      type: 'event'
    },
    {
      title: 'Prompt Engineering 101',
      date: '2024-01-30',
      time: '19:00 UTC',
      participants: 189,
      type: 'workshop'
    }
  ]

  const topContributors = [
    { name: 'CreativeMaster', contributions: 1247, level: 'Expert' },
    { name: 'ArtEnthusiast', contributions: 982, level: 'Advanced' },
    { name: 'TechWizard', contributions: 856, level: 'Advanced' },
    { name: 'DesignGuru', contributions: 743, level: 'Intermediate' },
    { name: 'PromptMaster', contributions: 621, level: 'Intermediate' }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <img 
          src={isNSFW ? "/hero-community-nsfw.jpg" : "/hero-community-sfw.jpg"} 
          alt="Community Hub" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text community ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Connections with EDN' : 'Join the EDN Creative Community'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Connect, share, and grow with fellow AI creators worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, label: 'Total Members', value: communityStats.totalMembers.toLocaleString(), color: 'text-blue-400' },
                { icon: Eye, label: 'Online Now', value: communityStats.onlineNow.toLocaleString(), color: 'text-green-400' },
                { icon: MessageSquare, label: 'Posts Today', value: communityStats.postsToday.toLocaleString(), color: 'text-purple-400' },
                { icon: Star, label: 'Active Creators', value: communityStats.activeCreators.toLocaleString(), color: 'text-yellow-400' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm ${scheme.textSecondary}`}>{stat.label}</p>
                          <p className={`text-2xl font-bold ${scheme.text}`}>{stat.value}</p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <Tabs defaultValue="feed" className="mb-12">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed">Community Feed</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="leaders">Top Contributors</TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex gap-6">
                  {/* Main Feed */}
                  <div className="flex-1 space-y-6">
                    {/* Create Post */}
                    <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center">
                            <Plus className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <Button 
                              className="w-full justify-start text-left"
                              variant="outline"
                              onClick={() => {}}
                            >
                              Share your thoughts, ask questions, or showcase your work...
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Community Posts */}
                    {communityPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                      >
                        <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 ${post.isFeatured ? 'ring-2 ring-yellow-400' : ''}`}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
                                <div>
                                  <h3 className={`font-semibold ${scheme.text}`}>{post.author}</h3>
                                  <p className={`text-sm ${scheme.textSecondary}`}>{post.timeAgo}</p>
                                </div>
                              </div>
                              {post.isFeatured && (
                                <Badge className="bg-yellow-500 text-black">
                                  <Star className="h-3 w-3 mr-1" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardTitle className={scheme.text}>{post.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className={`mb-4 ${scheme.text}`}>{post.content}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-4">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <ThumbsUp className="h-4 w-4" />
                                  {post.likes}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  {post.comments}
                                </Button>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <Share2 className="h-4 w-4" />
                                  {post.shares}
                                </Button>
                              </div>
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Sidebar */}
                  <div className="w-80 space-y-6">
                    {/* Trending Topics */}
                    <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                          <TrendingUp className="h-5 w-5" />
                          Trending Topics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {trendingTopics.map((topic, index) => (
                            <div key={topic.name} className="flex items-center justify-between">
                              <div>
                                <p className={`font-medium ${scheme.text}`}>{topic.name}</p>
                                <p className={`text-sm ${scheme.textSecondary}`}>{topic.posts} posts</p>
                              </div>
                              <Badge variant="outline" className="text-green-400">
                                {topic.trend}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${scheme.text}`}>
                          <Calendar className="h-5 w-5" />
                          Upcoming Events
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {upcomingEvents.map((event, index) => (
                            <div key={event.title} className="p-3 rounded-lg bg-white/5">
                              <h4 className={`font-semibold ${scheme.text}`}>{event.title}</h4>
                              <p className={`text-sm ${scheme.textSecondary}`}>{event.date} at {event.time}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline">{event.type}</Badge>
                                <span className={`text-sm ${scheme.textSecondary}`}>
                                  {event.participants} attending
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="trending">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Trending Topics</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Most popular discussions in the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trendingTopics.map((topic, index) => (
                        <div key={topic.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < 3 ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'}`}>
                              {index + 1}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${scheme.text}`}>{topic.name}</h3>
                              <p className={`text-sm ${scheme.textSecondary}`}>{topic.posts.toLocaleString()} posts</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-400">
                            {topic.trend}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="events">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                      <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                        <CardHeader>
                          <Calendar className="h-8 w-8 text-purple-400 mb-2" />
                          <CardTitle className={scheme.text}>{event.title}</CardTitle>
                          <CardDescription className={scheme.textSecondary}>
                            {event.date} at {event.time}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${scheme.textSecondary}`}>Type</span>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm ${scheme.textSecondary}`}>Attending</span>
                              <span className={scheme.text}>{event.participants} people</span>
                            </div>
                            <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                              Register Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="leaders">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Top Contributors</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Most active members in our community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topContributors.map((contributor, index) => (
                        <div key={contributor.name} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < 3 ? 'bg-yellow-500 text-black' : 'bg-gray-500 text-white'}`}>
                              {index + 1}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${scheme.text}`}>{contributor.name}</h3>
                              <p className={`text-sm ${scheme.textSecondary}`}>{contributor.level}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${scheme.text}`}>{contributor.contributions.toLocaleString()}</p>
                            <p className={`text-sm ${scheme.textSecondary}`}>contributions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}