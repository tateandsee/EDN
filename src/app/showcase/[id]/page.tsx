'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  Star, 
  Heart, 
  Eye, 
  User, 
  CheckCircle, 
  ArrowLeft,
  Crown,
  Lock,
  LogIn,
  Calendar,
  MessageCircle,
  Share2,
  MapPin,
  Camera,
  Instagram,
  Twitter,
  } from 'lucide-react'
import Link from 'next/link'
import { AIModelProtection } from '@/components/image-protection'

interface Influencer {
  id: string
  name: string
  age: number
  verified: boolean
  bio: string
  image: string
  followers: string
  engagement: string
  tags: string[]
  location?: string
  joinDate?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    tiktok?: string
  }
}

export default function ShowcaseDetailPage() {
  const params = useParams()
  const { isNSFW } = useNSFW()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalReason, setAuthModalReason] = useState<'general' | 'nsfw'>('general')
  const [influencer, setInfluencer] = useState<Influencer | null>(null)
  const [loading, setLoading] = useState(true)

  const influencerId = params.id as string

  // Mock data - in a real app, this would come from an API
  const mockInfluencers: Record<string, Influencer> = {
    emma: {
      id: 'emma',
      name: 'Emma',
      age: 22,
      verified: true,
      bio: 'Fashion lover with a sweet smile ✨ | Coffee addict by day, dreamer by night 🌙 | Let\'s create something beautiful together | Working with top brands in fashion and beauty | DM for collaborations 📧',
      image: '/marketplace-item-1.jpg',
      followers: '125K',
      engagement: '8.2%',
      tags: ['Fashion', 'Lifestyle', 'Beauty'],
      location: 'Los Angeles, CA',
      joinDate: 'March 2022',
      socialLinks: {
        instagram: '@emma.fashion',
        twitter: '@emma_fashion',
        tiktok: '@emma.fashion'
      }
    },
    sophia: {
      id: 'sophia',
      name: 'Sophia',
      age: 21,
      verified: true,
      bio: 'Beach vibes and sunset lover 🌅 | Fitness enthusiast with a passion for adventure 🏃‍♀️ | Living life to the fullest | Spreading positivity and good energy | Fitness coach & lifestyle blogger',
      image: '/marketplace-item-2.jpg',
      followers: '98K',
      engagement: '7.8%',
      tags: ['Fitness', 'Travel', 'Lifestyle'],
      location: 'Miami, FL',
      joinDate: 'June 2022',
      socialLinks: {
        instagram: '@sophia.fitness',
        tiktok: '@sophia.fitness'
      }
    },
    isabella: {
      id: 'isabella',
      name: 'Isabella',
      age: 23,
      verified: true,
      bio: 'Blonde bombshell with a heart of gold 💛 | Art student by day, party starter by night 🎨 | Follow for daily inspiration | Art & fashion enthusiast | Living my best life in NYC',
      image: '/marketplace-item-3.jpg',
      followers: '156K',
      engagement: '9.1%',
      tags: ['Art', 'Party', 'Lifestyle'],
      location: 'New York, NY',
      joinDate: 'January 2022',
      socialLinks: {
        instagram: '@isabella.art',
        tiktok: '@isabella.art'
      }
    },
    olivia: {
      id: 'olivia',
      name: 'Olivia',
      age: 20,
      verified: true,
      bio: 'Cozy vibes and warm hugs 🤗 | Bookworm with a wild side 📚 | Student life mixed with spontaneous adventures | Literature major & lifestyle content creator | Always up for new experiences',
      image: '/marketplace-item-4.jpg',
      followers: '87K',
      engagement: '6.9%',
      tags: ['Lifestyle', 'Books', 'Student'],
      location: 'Boston, MA',
      joinDate: 'September 2022',
      socialLinks: {
        instagram: '@olivia.reads',
        twitter: '@olivia_reads'
      }
    },
    ava: {
      id: 'ava',
      name: 'Ava',
      age: 24,
      verified: true,
      bio: 'Rooftop sunsets and city lights 🌆 | Travel enthusiast exploring the world ✈️ | Join me on this incredible journey | Travel blogger & photographer | Capturing moments around the globe',
      image: '/marketplace-item-5.jpg',
      followers: '203K',
      engagement: '8.7%',
      tags: ['Travel', 'City', 'Photography'],
      location: 'World Traveler',
      joinDate: 'December 2021',
      socialLinks: {
        instagram: '@ava.travels',
        twitter: '@ava_travels'
      }
    },
    mia: {
      id: 'mia',
      name: 'Mia',
      age: 19,
      verified: true,
      bio: 'Asian beauty with a playful spirit 🌸 | Dance lover and fitness fanatic 💃 | Spreading positivity one post at a time | K-pop dance cover artist | Fitness & wellness content',
      image: '/marketplace-item-6.jpg',
      followers: '142K',
      engagement: '9.3%',
      tags: ['Dance', 'Fitness', 'Asian'],
      location: 'Seoul, South Korea',
      joinDate: 'August 2022',
      socialLinks: {
        instagram: '@mia.dance',
        tiktok: '@mia.dance'
      }
    },
    charlotte: {
      id: 'charlotte',
      name: 'Charlotte',
      age: 22,
      verified: true,
      bio: 'Blonde goddess with morning glow ☀️ | Wellness coach and yoga instructor 🧘‍♀️ | Finding balance in a chaotic world | Certified yoga teacher | Mental health advocate',
      image: '/marketplace-item-7.jpg',
      followers: '178K',
      engagement: '8.5%',
      tags: ['Wellness', 'Yoga', 'Lifestyle'],
      location: 'San Diego, CA',
      joinDate: 'April 2022',
      socialLinks: {
        instagram: '@charlotte.yoga',
        twitter: '@charlotte_yoga'
      }
    },
    amelia: {
      id: 'amelia',
      name: 'Amelia',
      age: 23,
      verified: true,
      bio: 'Kitchen queen with a cozy aesthetic ☕ | Home chef and lifestyle blogger 👩‍🍳 | Making everyday moments magical | Food photographer | Recipe developer',
      image: '/marketplace-item-8.jpg',
      followers: '134K',
      engagement: '7.6%',
      tags: ['Food', 'Lifestyle', 'Cooking'],
      location: 'Portland, OR',
      joinDate: 'February 2022',
      socialLinks: {
        instagram: '@amelia.cooks',
        tiktok: '@amelia.cooks'
      }
    }
  }

  useState(() => {
    setInfluencer(mockInfluencers[influencerId] || null)
    setLoading(false)
  })

  const sfwColors = {
    primary: '#FF6B35',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    particle: '#FF6B35',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(0, 0, 0, 0.1)',
    textPrimary: '#1A202C',
    textSecondary: '#2D3748',
    textLight: '#4A5568',
    textOnWhite: '#2D3748'
  }

  const nsfwColors = {
    primary: '#FF1493',
    secondary: '#00CED1',
    accent: '#FF1744',
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

  const handleContact = () => {
    if (!user) {
      setAuthModalReason('general')
      setShowAuthModal(true)
    } else {
      console.log('Contacting influencer:', influencerId)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isNSFW ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-red-900' : 'bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p className="text-xl" style={{ color: colors.textPrimary }}>Loading EDN Influencer Profile...</p>
        </div>
      </div>
    )
  }

  if (!influencer) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isNSFW ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-red-900' : 'bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200'}`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>EDN Influencer Not Found</h1>
          <Link href="/showcase">
            <Button style={{ backgroundColor: colors.primary }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Showcase
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isNSFW ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-red-900' : 'bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200'}`}>
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/showcase">
          <Button 
            variant="outline" 
            className="mb-6 font-semibold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200 border-2" 
            style={{ 
              borderColor: colors.primary, 
              color: colors.primary,
              backgroundColor: isNSFW ? 'rgba(255, 20, 147, 0.1)' : 'rgba(255, 107, 53, 0.1)'
            }}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Showcase
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Image and Basic Info */}
          <div className="space-y-6">
            {/* Profile Image */}
            <Card className="relative overflow-hidden" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <div className="aspect-[4/5] relative">
                <AIModelProtection watermarkText="EDN INFLUENCER">
                  <img 
                    src={influencer.image} 
                    alt={influencer.name}
                    className="w-full h-full object-cover"
                  />
                </AIModelProtection>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Top Right Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {influencer.verified && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      EDN Verified
                    </Badge>
                  )}
                </div>

                {/* Bottom Left Info */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-3xl font-bold mb-1">{influencer.name}</h1>
                  <p className="text-lg opacity-90">{influencer.age} years old</p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {influencer.followers}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Followers</div>
                </CardContent>
              </Card>
              
              <Card className="text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {influencer.engagement}
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Engagement</div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full" 
                style={{ backgroundColor: colors.primary }}
                onClick={handleContact}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact EDN Influencer
              </Button>
              <Button variant="outline" className="w-full" style={{ borderColor: colors.primary, color: colors.primary }}>
                <Heart className="mr-2 h-4 w-4" />
                Follow Profile
              </Button>
              <Button variant="outline" className="w-full" style={{ borderColor: colors.primary, color: colors.primary }}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Profile
              </Button>
            </div>
          </div>

          {/* Middle Column - Bio and Details */}
          <div className="space-y-6">
            {/* Bio Card */}
            <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardHeader>
                <CardTitle style={{ color: colors.primary }}>About {influencer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 leading-relaxed" style={{ color: colors.textSecondary }}>
                  {influencer.bio}
                </p>
                
                {/* Location and Join Date */}
                <div className="space-y-3">
                  {influencer.location && (
                    <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <MapPin className="h-4 w-4" />
                      <span>{influencer.location}</span>
                    </div>
                  )}
                  {influencer.joinDate && (
                    <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                      <Calendar className="h-4 w-4" />
                      <span>Joined {influencer.joinDate}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardHeader>
                <CardTitle style={{ color: colors.primary }}>Interests & Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {influencer.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-sm"
                      style={{ backgroundColor: colors.accent, color: colors.textOnWhite }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {influencer.socialLinks && (
              <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {influencer.socialLinks.instagram && (
                      <div className="flex items-center gap-3">
                        <Instagram className="h-5 w-5" style={{ color: colors.primary }} />
                        <span style={{ color: colors.textSecondary }}>{influencer.socialLinks.instagram}</span>
                      </div>
                    )}
                    {influencer.socialLinks.twitter && (
                      <div className="flex items-center gap-3">
                        <Twitter className="h-5 w-5" style={{ color: colors.primary }} />
                        <span style={{ color: colors.textSecondary }}>{influencer.socialLinks.twitter}</span>
                      </div>
                    )}
                    {influencer.socialLinks.tiktok && (
                      <div className="flex items-center gap-3">
                        <Camera className="h-5 w-5" style={{ color: colors.primary }} />
                        <span style={{ color: colors.textSecondary }}>{influencer.socialLinks.tiktok}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Content Gallery */}
          <div className="space-y-6">
            {/* Content Gallery */}
            <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardHeader>
                <CardTitle style={{ color: colors.primary }}>Content Gallery</CardTitle>
                <CardDescription style={{ color: colors.textSecondary }}>
                  Recent posts and content from {influencer.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img 
                        src={`/marketplace-item-${(index % 8) + 1}.jpg`} 
                        alt={`${influencer.name} content ${index}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* EDN Creator Info */}
            <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardHeader>
                <CardTitle style={{ color: colors.primary }}>EDN Creator Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                      <Camera className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>EDN Generated</div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        AI-powered influencer creation
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>Premium Quality</div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        High-resolution content generation
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>Top Performer</div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        High engagement rates
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
            <CardHeader>
              <CardTitle style={{ color: colors.primary }}>
                EDN Authentication Required
              </CardTitle>
              <CardDescription style={{ color: colors.textSecondary }}>
                Please sign in to contact EDN influencers and access premium features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" style={{ backgroundColor: colors.primary }}>
                <LogIn className="mr-2 h-4 w-4" />
                EDN Sign In
              </Button>
              <Button variant="outline" className="w-full" style={{ borderColor: colors.primary, color: colors.primary }}>
                Create EDN Account
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                style={{ color: colors.textSecondary }}
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}