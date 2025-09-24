'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Sparkles, 
  Search, 
  Calendar, 
  User, 
  Eye, 
  MessageSquare, 
  Heart, 
  Share2, 
  ArrowRight, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Star, 
  Filter,
  Tag,
  PenTool,
  Image,
  Video,
  Mic,
  Zap
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
  views: number
  likes: number
  comments: number
  featured: boolean
  image: string
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'tutorials', name: 'Tutorials', count: 8 },
    { id: 'news', name: 'News', count: 6 },
    { id: 'tips', name: 'Tips & Tricks', count: 5 },
    { id: 'case-studies', name: 'Case Studies', count: 3 },
    { id: 'updates', name: 'Product Updates', count: 2 }
  ]

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'The Future of AI Content Creation: Trends to Watch in 2024',
      excerpt: 'Explore the cutting-edge trends shaping the future of AI-powered content creation and how creators can stay ahead of the curve.',
      content: 'Full content of the blog post...',
      author: 'Sarah Chen',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'tutorials',
      tags: ['AI', 'Future Trends', 'Content Creation'],
      views: 15420,
      likes: 342,
      comments: 28,
      featured: true,
      image: '/blog-post-1.jpg'
    },
    {
      id: '2',
      title: 'Mastering Prompt Engineering for Photorealistic AI Art',
      excerpt: 'Learn advanced techniques for crafting perfect prompts that generate stunning photorealistic images with AI.',
      content: 'Full content of the blog post...',
      author: 'Marcus Rodriguez',
      date: '2024-01-12',
      readTime: '12 min read',
      category: 'tutorials',
      tags: ['Prompt Engineering', 'AI Art', 'Photorealism'],
      views: 12340,
      likes: 289,
      comments: 45,
      featured: true,
      image: '/blog-post-2.jpg'
    },
    {
      id: '3',
      title: 'EDN Platform Update: New Video Generation Features',
      excerpt: 'Exciting new video generation capabilities are now live on the EDN platform. Here\'s what you need to know.',
      content: 'Full content of the blog post...',
      author: 'EDN Team',
      date: '2024-01-10',
      readTime: '5 min read',
      category: 'updates',
      tags: ['Product Update', 'Video Generation', 'Features'],
      views: 8920,
      likes: 156,
      comments: 23,
      featured: false,
      image: '/blog-post-3.jpg'
    },
    {
      id: '4',
      title: 'Case Study: How Creator Alex Increased Revenue by 300%',
      excerpt: 'Discover how Alex used EDN\'s multi-platform distribution to triple their monthly revenue in just 3 months.',
      content: 'Full content of the blog post...',
      author: 'Emily Watson',
      date: '2024-01-08',
      readTime: '10 min read',
      category: 'case-studies',
      tags: ['Case Study', 'Success Story', 'Revenue Growth'],
      views: 6780,
      likes: 234,
      comments: 19,
      featured: false,
      image: '/blog-post-4.jpg'
    },
    {
      id: '5',
      title: '10 Pro Tips for Better AI-Generated Portraits',
      excerpt: 'Professional photographers share their secrets for creating stunning AI-generated portraits that look completely natural.',
      content: 'Full content of the blog post...',
      author: 'David Kim',
      date: '2024-01-05',
      readTime: '7 min read',
      category: 'tips',
      tags: ['Tips', 'Portraits', 'Photography'],
      views: 5430,
      likes: 189,
      comments: 31,
      featured: false,
      image: '/blog-post-5.jpg'
    },
    {
      id: '6',
      title: 'Understanding AI Ethics in Content Creation',
      excerpt: 'A comprehensive guide to ethical considerations when using AI for content creation and distribution.',
      content: 'Full content of the blog post...',
      author: 'Dr. Lisa Chang',
      date: '2024-01-03',
      readTime: '15 min read',
      category: 'news',
      tags: ['Ethics', 'AI', 'Responsible AI'],
      views: 4320,
      likes: 167,
      comments: 42,
      featured: false,
      image: '/blog-post-6.jpg'
    }
  ]

  const trendingTopics = [
    { name: 'AI Content Creation', posts: 156, growth: '+45%' },
    { name: 'Prompt Engineering', posts: 89, growth: '+32%' },
    { name: 'Video Generation', posts: 67, growth: '+28%' },
    { name: 'Multi-Platform Distribution', posts: 45, growth: '+23%' }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              EDN Blog
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md leading-relaxed">
              Insights, tutorials, and news from the world of AI content creation
            </p>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search articles..."
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
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2" style={{ color: colors.primary }}>
                <Star className="h-8 w-8" />
                Featured Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                        <Badge style={{ backgroundColor: colors.primary, color: colors.textOnWhite }}>
                          {post.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl" style={{ color: colors.primary }}>{post.title}</CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm" style={{ color: colors.textLight }}>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm" style={{ color: colors.textLight }}>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {post.comments}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-8">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    style={{
                      backgroundColor: selectedCategory === category.id ? colors.primary : 'transparent',
                      borderColor: colors.primary,
                      color: selectedCategory === category.id ? colors.textOnWhite : colors.primary
                    }}
                  >
                    {category.name}
                    {category.count > 0 && (
                      <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    )}
                  </Button>
                ))}
              </div>

              {/* Blog Posts Grid */}
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="backdrop-blur-sm border-2 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge style={{ backgroundColor: colors.primary, color: colors.textOnWhite }}>
                          {post.category}
                        </Badge>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs" style={{ borderColor: colors.cardBorder, color: colors.textLight }}>
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <CardTitle className="text-xl hover:text-orange-600 transition-colors cursor-pointer" style={{ color: colors.primary }}>
                        {post.title}
                      </CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm" style={{ color: colors.textLight }}>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {post.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-3 text-sm" style={{ color: colors.textLight }}>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {post.comments}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                            Read
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Trending Topics */}
              <Card className="backdrop-blur-sm border-2 mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.primary }}>
                    <TrendingUp className="h-5 w-5" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium" style={{ color: colors.textPrimary }}>{topic.name}</div>
                          <div className="text-sm" style={{ color: colors.textLight }}>{topic.posts} posts</div>
                        </div>
                        <Badge className="bg-green-500 text-white text-xs">
                          {topic.growth}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="backdrop-blur-sm border-2 mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.primary }}>
                    <BookOpen className="h-5 w-5" />
                    Newsletter
                  </CardTitle>
                  <CardDescription style={{ color: colors.textSecondary }}>
                    Get the latest updates and insights delivered to your inbox
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Your email address"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  />
                  <Button className="w-full" style={{ backgroundColor: colors.primary }}>
                    Subscribe
                  </Button>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: colors.primary }}>
                    <Tag className="h-5 w-5" />
                    Popular Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['AI Art', 'Prompt Engineering', 'Video Generation', 'Content Strategy', 'Monetization', 'Case Studies'].map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                        style={{ borderColor: colors.cardBorder, color: colors.textLight }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}