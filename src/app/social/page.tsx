'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText, ResponsiveButton, ResponsiveCard } from "@/components/ui/responsive"
import { useIntegration } from "@/contexts/integration-context"
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Calendar,
  MapPin,
  Link,
  Image as ImageIcon,
  Video,
  Music,
  Star,
  Award,
  Trophy,
  Crown,
  Gift,
  Bell,
  Settings,
  UserPlus,
  MessageSquare,
  ThumbsUp,
  Eye,
  Bookmark,
  MoreHorizontal,
  Network,
  Target,
  Copy,
  ExternalLink,
  DollarSign,
  BarChart3,
  Megaphone,
  Zap,
  Rocket
} from "lucide-react"

interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  followers: number
  following: number
  posts: number
  isVerified: boolean
  isFollowing: boolean
  joinDate: string
  location?: string
  website?: string
  affiliateEnabled?: boolean
  affiliateCode?: string
}

interface Post {
  id: string
  author: User
  content: string
  images?: string[]
  video?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  isLiked: boolean
  isSaved: boolean
  tags: string[]
  affiliateEnabled?: boolean
  affiliateLink?: string
  affiliateClicks?: number
  affiliateConversions?: number
  affiliateEarnings?: number
  campaignLinked?: boolean
  campaignId?: string
}

interface Group {
  id: string
  name: string
  description: string
  members: number
  isPrivate: boolean
  coverImage: string
  category: string
  isJoined: boolean
  admin: User
  affiliateEnabled?: boolean
}

interface Forum {
  id: string
  title: string
  description: string
  category: string
  threads: number
  posts: number
  lastActivity: string
  isActive: boolean
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Creator',
    username: '@alexcreator',
    avatar: '/avatars/alex.jpg',
    bio: 'Digital artist and AI enthusiast. Creating stunning content with cutting-edge technology.',
    followers: 15420,
    following: 342,
    posts: 89,
    isVerified: true,
    isFollowing: false,
    joinDate: '2023-06-15',
    location: 'Los Angeles, CA',
    website: 'https://alexcreator.com',
    affiliateEnabled: true,
    affiliateCode: 'ALEX2024'
  },
  {
    id: '2',
    name: 'Sarah AI',
    username: '@sarahai',
    avatar: '/avatars/sarah.jpg',
    bio: 'Machine learning engineer and content creator. Passionate about AI art and generative models.',
    followers: 8750,
    following: 567,
    posts: 124,
    isVerified: true,
    isFollowing: true,
    joinDate: '2023-03-20',
    location: 'San Francisco, CA',
    affiliateEnabled: true,
    affiliateCode: 'SARAH2024'
  },
  {
    id: '3',
    name: 'Mike Digital',
    username: '@mikedigital',
    avatar: '/avatars/mike.jpg',
    bio: '3D artist and virtual reality enthusiast. Exploring the future of digital creation.',
    followers: 5230,
    following: 234,
    posts: 67,
    isVerified: false,
    isFollowing: false,
    joinDate: '2023-09-10'
  }
]

const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'Just finished training my new custom AI model! The results are incredible - 95% accuracy on face cloning with real-time processing. Who wants to see a demo? 🚀 #AI #MachineLearning #FaceCloning',
    images: ['/posts/ai-demo-1.jpg', '/posts/ai-demo-2.jpg'],
    likes: 342,
    comments: 28,
    shares: 15,
    timestamp: '2 hours ago',
    isLiked: false,
    isSaved: false,
    tags: ['AI', 'MachineLearning', 'FaceCloning'],
    affiliateEnabled: true,
    affiliateLink: 'https://edn.com/ref/ALEX2024',
    affiliateClicks: 89,
    affiliateConversions: 12,
    affiliateEarnings: 180,
    campaignLinked: true,
    campaignId: '1'
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'Excited to share my latest project: a voice synthesis model that can generate emotional speech in 5 languages! The quality is amazing. Check out the sample video below. 🎤 #VoiceAI #Multilingual #DeepLearning',
    video: '/posts/voice-demo.mp4',
    likes: 567,
    comments: 42,
    shares: 23,
    timestamp: '5 hours ago',
    isLiked: true,
    isSaved: true,
    tags: ['VoiceAI', 'Multilingual', 'DeepLearning'],
    affiliateEnabled: true,
    affiliateLink: 'https://edn.com/ref/SARAH2024',
    affiliateClicks: 156,
    affiliateConversions: 18,
    affiliateEarnings: 270
  },
  {
    id: '3',
    author: mockUsers[2],
    content: 'Working on a new VR experience that combines AI-generated environments with real-time interaction. The future of immersive content is here! 🥽 #VR #AI #Immersive',
    likes: 189,
    comments: 16,
    shares: 8,
    timestamp: '1 day ago',
    isLiked: false,
    isSaved: false,
    tags: ['VR', 'AI', 'Immersive']
  }
]

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'AI Artists Collective',
    description: 'A community for artists using AI tools to create stunning digital art and push creative boundaries.',
    members: 15420,
    isPrivate: false,
    coverImage: '/groups/ai-artists.jpg',
    category: 'Art & Design',
    isJoined: true,
    admin: mockUsers[0],
    affiliateEnabled: true
  },
  {
    id: '2',
    name: 'Machine Learning Engineers',
    description: 'Professional network for ML engineers working on cutting-edge AI models and applications.',
    members: 8750,
    isPrivate: true,
    coverImage: '/groups/ml-engineers.jpg',
    category: 'Technology',
    isJoined: false,
    admin: mockUsers[1]
  },
  {
    id: '3',
    name: 'Content Creators Hub',
    description: 'Share tips, collaborate on projects, and grow your audience with fellow content creators.',
    members: 12340,
    isPrivate: false,
    coverImage: '/groups/creators-hub.jpg',
    category: 'Content Creation',
    isJoined: true,
    admin: mockUsers[2],
    affiliateEnabled: true
  }
]

const mockForums: Forum[] = [
  {
    id: '1',
    title: 'AI Model Training',
    description: 'Discuss techniques, share experiences, and get help with training custom AI models.',
    category: 'Technical',
    threads: 342,
    posts: 1542,
    lastActivity: '5 minutes ago',
    isActive: true
  },
  {
    id: '2',
    title: 'Content Creation Tips',
    description: 'Share your best practices and learn new techniques for creating engaging content.',
    category: 'General',
    threads: 567,
    posts: 2341,
    lastActivity: '1 hour ago',
    isActive: true
  },
  {
    id: '3',
    title: 'Platform Integration',
    description: 'Get help with integrating and automating content distribution across platforms.',
    category: 'Technical',
    threads: 189,
    posts: 876,
    lastActivity: '3 hours ago',
    isActive: true
  }
]

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed')
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [groups, setGroups] = useState<Group[]>(mockGroups)
  const [forums, setForums] = useState<Forum[]>(mockForums)
  const [newPostContent, setNewPostContent] = useState('')
  const [showAffiliateDialog, setShowAffiliateDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [affiliateLink, setAffiliateLink] = useState('')
  
  const { 
    state: integrationState, 
    createSocialAffiliatePost,
    generateAffiliateLinkForSocialPost,
    trackReferralConversion 
  } = useIntegration()

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ))
  }

  const handleFollow = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            isFollowing: !user.isFollowing,
            followers: user.isFollowing ? user.followers - 1 : user.followers + 1
          }
        : user
    ))
  }

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            isJoined: !group.isJoined,
            members: group.isJoined ? group.members - 1 : group.members + 1
          }
        : group
    ))
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: mockUsers[0], // Current user
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: 'Just now',
      isLiked: false,
      isSaved: false,
      tags: []
    }

    setPosts(prev => [newPost, ...prev])
    setNewPostContent('')
  }

  const handleEnableAffiliate = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const platform = 'Instagram' // Default platform, could be made dynamic
      const link = affiliateLink || generateAffiliateLinkForSocialPost(postId, platform)
      
      await createSocialAffiliatePost(postId, platform, link)
      
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              affiliateEnabled: true, 
              affiliateLink: link,
              affiliateClicks: 0,
              affiliateConversions: 0,
              affiliateEarnings: 0
            }
          : p
      ))
      
      setShowAffiliateDialog(false)
      setSelectedPost(null)
      setAffiliateLink('')
    } catch (error) {
      console.error('Failed to enable affiliate:', error)
    }
  }

  const handleDisableAffiliate = async (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            affiliateEnabled: false, 
            affiliateLink: undefined,
            affiliateClicks: undefined,
            affiliateConversions: undefined,
            affiliateEarnings: undefined
          }
        : post
    ))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <Users className="h-8 w-8 md:h-10 md:w-10 text-blue-500" />
            Community Hub
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow creators, join groups, participate in forums, and grow your network
          </p>
        </div>

        {/* Quick Stats */}
        <ResponsiveGrid cols={2} mdCols={4} gap={4}>
          <ResponsiveCard>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">{formatNumber(users.reduce((acc, user) => acc + user.followers, 0))}</p>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{groups.length}</p>
              <p className="text-sm text-muted-foreground">Active Groups</p>
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">{forums.length}</p>
              <p className="text-sm text-muted-foreground">Forum Categories</p>
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">
                {posts.filter(p => p.affiliateEnabled).length}
              </p>
              <p className="text-sm text-muted-foreground">Affiliate Posts</p>
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="forums">Forums</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {/* Create Post */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={mockUsers[0].avatar} />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts, projects, or ask questions..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Image
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-1" />
                      Video
                    </Button>
                    <Button variant="outline" size="sm">
                      <Music className="h-4 w-4 mr-1" />
                      Audio
                    </Button>
                    <Button variant="outline" size="sm">
                      <Gift className="h-4 w-4 mr-1" />
                      Affiliate
                    </Button>
                  </div>
                  <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{post.author.name}</h4>
                            {post.author.isVerified && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Star className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {post.author.affiliateEnabled && (
                              <Badge className="bg-purple-500">
                                <Gift className="h-3 w-3 mr-1" />
                                Affiliate
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">@{post.author.username} • {post.timestamp}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">{post.content}</p>
                    
                    {post.images && post.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {post.images.map((image, index) => (
                          <div key={index} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {post.video && (
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Affiliate Section */}
                    {post.affiliateEnabled && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-purple-600 flex items-center gap-2">
                            <Gift className="h-4 w-4" />
                            Affiliate Link
                          </h4>
                          <div className="flex items-center gap-2">
                            {post.campaignLinked && (
                              <Badge variant="outline" className="text-blue-600">
                                <Megaphone className="h-3 w-3 mr-1" />
                                Campaign Linked
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(post.affiliateLink!)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Link
                            </Button>
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <p className="text-sm text-purple-700 mb-2">{post.affiliateLink}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Clicks</p>
                              <p className="font-semibold text-purple-600">{post.affiliateClicks}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Conversions</p>
                              <p className="font-semibold text-green-600">{post.affiliateConversions}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Revenue</p>
                              <p className="font-semibold text-green-600">{formatCurrency(post.affiliateEarnings || 0)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Conversion Rate</p>
                              <p className="font-semibold text-blue-600">
                                {post.affiliateClicks ? ((post.affiliateConversions || 0) / post.affiliateClicks * 100).toFixed(1) : 0}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={post.isLiked ? 'text-red-500' : ''}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                          {formatNumber(post.likes)}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {formatNumber(post.comments)}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          {formatNumber(post.shares)}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSave(post.id)}
                          className={post.isSaved ? 'text-blue-500' : ''}
                        >
                          <Bookmark className={`h-4 w-4 ${post.isSaved ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {post.affiliateEnabled ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisableAffiliate(post.id)}
                          >
                            <Gift className="h-4 w-4 mr-1" />
                            Disable Affiliate
                          </Button>
                        ) : (
                          <Dialog open={showAffiliateDialog && selectedPost === post.id} onOpenChange={(open) => {
                            setShowAffiliateDialog(open)
                            setSelectedPost(open ? post.id : null)
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Gift className="h-4 w-4 mr-1" />
                                Add Affiliate Link
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Affiliate Link</DialogTitle>
                                <DialogDescription>
                                  Add an affiliate link to this post to earn commissions from referrals.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Affiliate Link</label>
                                  <Input
                                    placeholder="Enter affiliate link or leave blank for auto-generated"
                                    value={affiliateLink}
                                    onChange={(e) => setAffiliateLink(e.target.value)}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setShowAffiliateDialog(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => handleEnableAffiliate(post.id)}>
                                    Add Affiliate Link
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Groups</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="h-full">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {group.name}
                          {group.affiliateEnabled && (
                            <Badge className="bg-purple-500">
                              <Gift className="h-3 w-3 mr-1" />
                              Affiliate
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      {group.isPrivate && (
                        <Badge variant="outline">Private</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members</span>
                      <span className="font-semibold">{formatNumber(group.members)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline">{group.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={group.admin.avatar} />
                        <AvatarFallback>{group.admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{group.admin.name}</p>
                        <p className="text-muted-foreground">Admin</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={group.isJoined ? "outline" : "default"}
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      {group.isJoined ? 'Leave Group' : 'Join Group'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Forums Tab */}
          <TabsContent value="forums" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Forums</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Button>
            </div>

            <div className="space-y-4">
              {forums.map((forum) => (
                <Card key={forum.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{forum.title}</CardTitle>
                        <CardDescription>{forum.description}</CardDescription>
                      </div>
                      {forum.isActive && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="font-semibold">{formatNumber(forum.threads)}</p>
                        <p className="text-muted-foreground">Threads</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{formatNumber(forum.posts)}</p>
                        <p className="text-muted-foreground">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{forum.lastActivity}</p>
                        <p className="text-muted-foreground">Last Activity</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <Badge variant="outline">{forum.category}</Badge>
                      <Button variant="outline" size="sm">
                        View Forum
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* People Tab */}
          <TabsContent value="people" className="space-y-6">
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search people..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg flex items-center justify-center gap-2">
                        {user.name}
                        {user.isVerified && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Star className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        {user.affiliateEnabled && (
                          <Badge className="bg-purple-500">
                            <Gift className="h-3 w-3 mr-1" />
                            Affiliate
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>@{user.username}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">{user.bio}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="font-semibold">{formatNumber(user.posts)}</p>
                        <p className="text-muted-foreground">Posts</p>
                      </div>
                      <div>
                        <p className="font-semibold">{formatNumber(user.followers)}</p>
                        <p className="text-muted-foreground">Followers</p>
                      </div>
                      <div>
                        <p className="font-semibold">{formatNumber(user.following)}</p>
                        <p className="text-muted-foreground">Following</p>
                      </div>
                    </div>
                    
                    {user.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    {user.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Link className="h-4 w-4 text-blue-500" />
                        <a href={user.website} className="text-blue-500 hover:underline">
                          Website
                        </a>
                      </div>
                    )}
                    
                    <Button 
                      className="w-full" 
                      variant={user.isFollowing ? "outline" : "default"}
                      onClick={() => handleFollow(user.id)}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Social Analytics</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {posts.filter(p => p.affiliateEnabled).length} with affiliate links
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Affiliate Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {posts.reduce((acc, post) => acc + (post.affiliateClicks || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total clicks on affiliate links
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {posts.reduce((acc, post) => acc + (post.affiliateConversions || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Successful referrals
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(posts.reduce((acc, post) => acc + (post.affiliateEarnings || 0), 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total affiliate earnings
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Posts</CardTitle>
                  <CardDescription>
                    Posts with the highest affiliate engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts
                      .filter(p => p.affiliateEnabled)
                      .sort((a, b) => (b.affiliateEarnings || 0) - (a.affiliateEarnings || 0))
                      .slice(0, 5)
                      .map((post, index) => (
                        <div key={post.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{post.author.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {post.content.substring(0, 50)}...
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(post.affiliateEarnings || 0)}</div>
                            <div className="text-xs text-muted-foreground">
                              {post.affiliateConversions} conversions
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>
                    Affiliate performance by social platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium">Instagram</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$1,245</div>
                        <div className="text-xs text-muted-foreground">67 conversions</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm font-medium">Twitter</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$890</div>
                        <div className="text-xs text-muted-foreground">45 conversions</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">$567</div>
                        <div className="text-xs text-muted-foreground">23 conversions</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  )
}