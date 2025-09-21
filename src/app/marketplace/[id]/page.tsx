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
  ShoppingCart, 
  User, 
  CheckCircle, 
  ArrowLeft,
  Crown,
  Lock,
  LogIn,
  Download,
  Share2,
  MessageCircle,
  Package,
  AlertCircle
} from 'lucide-react'
import { CoinbasePayment } from '@/components/coinbase-payment'
import Link from 'next/link'

interface MarketplaceItem {
  id: string
  title: string
  description?: string
  type: 'AI_MODEL' | 'MENTORSHIP' | 'TEMPLATE' | 'SERVICE' | 'DIGITAL_GOOD'
  category: 'MODELS' | 'EDUCATION' | 'TOOLS' | 'SERVICES' | 'ENTERTAINMENT'
  price: number
  currency: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED' | 'SOLD'
  thumbnail?: string
  images?: string[]
  tags?: string[]
  userId: string
  createdAt: string
  updatedAt: string
  isNsfw: boolean
  promptConfig?: any
  user: {
    id: string
    name?: string
    avatar?: string
    verified: boolean
  }
  reviews: Array<{
    rating: number
    comment?: string
    createdAt: string
    user: {
      name?: string
      avatar?: string
    }
  }>
  _count: {
    reviews: number
    orders: number
  }
}

export default function MarketplaceDetailPage() {
  const params = useParams()
  const { isNSFW } = useNSFW()
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalReason, setAuthModalReason] = useState<'general' | 'nsfw'>('general')
  const [item, setItem] = useState<MarketplaceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const itemId = params.id as string

  // Fetch item data
  useState(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/marketplace/items/${itemId}`)
        if (response.ok) {
          const data = await response.json()
          setItem(data)
        } else if (response.status === 404) {
          setNotFound(true)
        } else {
          console.error('Error fetching item:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching item:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
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

  const shouldBlurContent = () => {
    return false // Always return false to remove blur from NSFW content
  }

  const handleBuyItem = () => {
    if (!user) {
      setAuthModalReason('general')
      setShowAuthModal(true)
    } else {
      console.log('Buying EDN item:', itemId)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isNSFW ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-red-900' : 'bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p className="text-xl" style={{ color: colors.textPrimary }}>Loading EDN Model Details...</p>
        </div>
      </div>
    )
  }

  if (notFound || !item) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isNSFW ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-red-900' : 'bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200'}`}>
        <div className="text-center max-w-md mx-4">
          <div className="mb-6">
            <Package className="h-24 w-24 mx-auto mb-4" style={{ color: colors.primary }} />
            <h1 className="text-4xl font-bold mb-4" style={{ color: colors.textPrimary }}>Item Not Found</h1>
            <p className="text-lg mb-6" style={{ color: colors.textSecondary }}>
              This marketplace item doesn't exist or has been removed. The marketplace has been cleared for a fresh start.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link href="/marketplace">
              <Button 
                className="w-full"
                style={{ backgroundColor: colors.primary }}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Marketplace
              </Button>
            </Link>
            
            {user && (
              <Link href="/marketplace/create">
                <Button 
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  Create New Listing
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  const blurContent = shouldBlurContent()

  return (
    <div className={`min-h-screen ${isNSFW ? 'bg-gradient-to-br from-pink-900 via-purple-900 to-red-900' : 'bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200'}`}>
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/marketplace">
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
            Back to Marketplace
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden" style={{ backgroundColor: colors.cardBg, border: `2px solid ${colors.cardBorder}` }}>
              {blurContent && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm">
                  <div className="text-center text-white p-6 bg-black/60 rounded-lg border border-white/20">
                    <Lock className="h-12 w-12 mx-auto mb-3 text-yellow-400" />
                    <p className="text-lg font-bold mb-2">EDN NSFW Content</p>
                    <p className="text-sm mb-4 opacity-90">Login to view EDN NSFW content</p>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setAuthModalReason('nsfw')
                        setShowAuthModal(true)
                      }}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 font-semibold shadow-lg"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login to View
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="aspect-square">
                <div className="relative w-full h-full">
                  <img 
                    src={item.images?.[0] || item.thumbnail || '/placeholder.jpg'} 
                    alt={item.title}
                    className={`w-full h-full object-cover ${blurContent ? 'blur-md' : ''}`}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-70 pointer-events-none">
                    🔒 EDN Protected Content
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                  <Crown className="mr-1 h-3 w-3" />
                  EDN Featured
                </Badge>
                <Badge variant={item.isNsfw ? "destructive" : "default"}>
                  {item.isNsfw ? "NSFW" : "SFW"}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  className={`flex-1 ${blurContent ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: colors.primary }}
                  onClick={handleBuyItem}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy EDN Model - ${item.price}
                </Button>
                <Button variant="outline" className="flex-1" style={{ borderColor: colors.primary, color: colors.primary }}>
                  <Heart className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
              
              {/* Cryptocurrency Payment Option */}
              <div className="mt-4">
                <CoinbasePayment
                  itemName={item.title}
                  itemDescription={item.description || `Purchase ${item.title} from EDN Marketplace`}
                  amount={item.price}
                  currency="USD"
                  metadata={{
                    item_id: item.id,
                    user_id: user?.id || 'anonymous',
                    item_type: item.type,
                    category: item.category
                  }}
                  onSuccess={(chargeData) => {
                    console.log('Payment successful:', chargeData)
                    // Handle successful payment (e.g., show success message, enable download)
                  }}
                  onError={(error) => {
                    console.error('Payment failed:', error)
                    // Handle payment error
                  }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-4">
                  <Star className="h-6 w-6 mx-auto mb-2 fill-yellow-400 text-yellow-400" />
                  <div className="text-lg font-bold" style={{ color: colors.primary }}>
                    {item._count.reviews > 0 ? 
                      (item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length).toFixed(1) : 
                      'New'
                    }
                  </div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Rating</div>
                </CardContent>
              </Card>
              
              <Card className="text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-4">
                  <ShoppingCart className="h-6 w-6 mx-auto mb-2" style={{ color: colors.primary }} />
                  <div className="text-lg font-bold" style={{ color: colors.primary }}>{item._count.orders}</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Sales</div>
                </CardContent>
              </Card>
              
              <Card className="text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-4">
                  <Eye className="h-6 w-6 mx-auto mb-2" style={{ color: colors.primary }} />
                  <div className="text-lg font-bold" style={{ color: colors.primary }}>1.2K</div>
                  <div className="text-sm" style={{ color: colors.textSecondary }}>Views</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2" style={{ color: colors.textPrimary }}>
                      {item.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" style={{ backgroundColor: colors.accent, color: colors.textOnWhite }}>
                        {item.category}
                      </Badge>
                      <Badge variant="outline" style={{ borderColor: colors.primary, color: colors.primary }}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold mb-1" style={{ color: colors.primary }}>
                      ${item.price}
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      {item.currency}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-base" style={{ color: colors.textSecondary }}>
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Creator Info */}
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold" style={{ color: colors.textPrimary }}>
                        {item.user?.name || 'EDN Creator'}
                      </div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>
                        Verified Creator
                      </div>
                    </div>
                  </div>
                  {item.user?.verified && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" style={{ borderColor: colors.primary, color: colors.primary }}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                <div>
                  <h3 className="font-semibold mb-3" style={{ color: colors.textPrimary }}>
                    Reviews ({item._count.reviews})
                  </h3>
                  <div className="space-y-3">
                    {item.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm" style={{ color: colors.textLight }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                          {review.comment}
                        </p>
                        <div className="text-xs mt-1" style={{ color: colors.textLight }}>
                          by {review.user?.name || 'Anonymous'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" style={{ borderColor: colors.primary, color: colors.primary }}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1" style={{ borderColor: colors.primary, color: colors.primary }}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}