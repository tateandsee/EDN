'use client'

import { useState, useEffect } from 'react'
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
  AlertCircle,
  Sparkles,
  FileText,
  Settings
} from 'lucide-react'
import { CoinbasePayment } from '@/components/coinbase-payment'
import { BlurredPromptDisplay } from '@/components/blurred-prompt-display'
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
  positivePrompt?: string
  negativePrompt?: string
  fullPrompt?: string
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
  const [item, setItem] = useState<MarketplaceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [userOrder, setUserOrder] = useState<any>(null)
  const [downloadInfo, setDownloadInfo] = useState<any>(null)
  const [isGeneratingHD, setIsGeneratingHD] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalReason, setAuthModalReason] = useState<'general' | 'nsfw'>('general')

  const itemId = params.id as string

  // Fetch item data and user order status
  useEffect(() => {
    const fetchItemAndOrderData = async () => {
      try {
        setLoading(true)
        
        // Fetch item details
        const [itemResponse, ordersResponse] = await Promise.all([
          fetch(`/api/marketplace/items/${itemId}`),
          user ? fetch(`/api/marketplace/orders?status=COMPLETED`) : Promise.resolve({ ok: false })
        ])

        if (itemResponse.ok) {
          const itemData = await itemResponse.json()
          setItem(itemData)
        } else if (itemResponse.status === 404) {
          setNotFound(true)
        }

        // Check if user has purchased this item
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          const userOrderForItem = ordersData.orders?.find((order: any) => order.itemId === itemId)
          setUserOrder(userOrderForItem || null)

          // If user has an order, fetch download info
          if (userOrderForItem) {
            const downloadResponse = await fetch(`/api/marketplace/downloads/${userOrderForItem.id}`)
            if (downloadResponse.ok) {
              const downloadData = await downloadResponse.json()
              setDownloadInfo(downloadData)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching item and order data:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchItemAndOrderData()
  }, [itemId, user])

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

  const handleBuyItem = async () => {
    if (!user) {
      setAuthModalReason('general')
      setShowAuthModal(true)
      return
    }

    try {
      const response = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemId,
          userId: user.id
        })
      })

      if (response.ok) {
        const orderData = await response.json()
        setUserOrder(orderData.order)
        
        // Fetch download info after successful purchase
        const downloadResponse = await fetch(`/api/marketplace/downloads/${orderData.order.id}`)
        if (downloadResponse.ok) {
          const downloadData = await downloadResponse.json()
          setDownloadInfo(downloadData)
        }
      } else {
        const errorData = await response.json()
        console.error('Purchase failed:', errorData.error)
      }
    } catch (error) {
      console.error('Error purchasing item:', error)
    }
  }

  const handleDownload = async () => {
    if (!userOrder || !downloadInfo) return

    try {
      const response = await fetch(`/api/marketplace/downloads/${userOrder.id}`)
      if (response.ok) {
        const downloadData = await response.json()
        
        // Create download link
        const link = document.createElement('a')
        link.href = downloadData.download.downloadUrl
        link.download = downloadData.download.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Update download info
        setDownloadInfo(downloadData)
      }
    } catch (error) {
      console.error('Error downloading item:', error)
    }
  }

  const handleGenerateHD = async () => {
    if (!userOrder || isGeneratingHD) return

    setIsGeneratingHD(true)
    try {
      const response = await fetch(`/api/marketplace/downloads/${userOrder.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          generateHighDef: true
        })
      })

      if (response.ok) {
        const hdData = await response.json()
        
        // Fetch updated download info
        const downloadResponse = await fetch(`/api/marketplace/downloads/${userOrder.id}`)
        if (downloadResponse.ok) {
          const downloadData = await downloadResponse.json()
          setDownloadInfo(downloadData)
        }
      } else {
        const errorData = await response.json()
        console.error('HD generation failed:', errorData.error)
      }
    } catch (error) {
      console.error('Error generating HD image:', error)
    } finally {
      setIsGeneratingHD(false)
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

      <div className="container mx-auto px-4 pb-12 max-w-4xl">
        <div className="flex flex-col gap-6 md:gap-8">
          {/* Image Section */}
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
              
              <div className="aspect-[4/3] max-h-[85vh] flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={item.images?.[0] || item.thumbnail || '/placeholder.jpg'} 
                    alt={item.title}
                    className={`max-w-full max-h-full object-contain ${blurContent ? 'blur-md' : ''}`}
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
              {userOrder ? (
                <>
                  {/* Download Section */}
                  {downloadInfo?.download && (
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1"
                          style={{ backgroundColor: colors.primary }}
                          onClick={handleDownload}
                          disabled={downloadInfo.download.remainingDownloads <= 0}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download {downloadInfo.download.isHighDef ? 'HD' : 'Image'}
                        </Button>
                        {!downloadInfo.download.isHighDef && item.promptConfig && (
                          <Button 
                            variant="outline"
                            className="flex-1"
                            style={{ borderColor: colors.primary, color: colors.primary }}
                            onClick={handleGenerateHD}
                            disabled={isGeneratingHD}
                          >
                            {isGeneratingHD ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{ borderColor: colors.primary }}></div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Generate HD
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      {/* Download Info */}
                      <div className="text-sm space-y-1" style={{ color: colors.textSecondary }}>
                        <div>Downloads remaining: {downloadInfo.download.remainingDownloads}</div>
                        <div>Expires in: {downloadInfo.download.hoursLeft} hours</div>
                        {downloadInfo.download.isHighDef && (
                          <div className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" style={{ color: colors.primary }} />
                            High-definition version
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
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
                        // Refresh order status after successful payment
                        setTimeout(() => {
                          window.location.reload()
                        }, 1000)
                      }}
                      onError={(error) => {
                        console.error('Payment failed:', error)
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              <Card className="text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-3 md:p-4">
                  <Star className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 md:mb-2 fill-yellow-400 text-yellow-400" />
                  <div className="text-base md:text-lg font-bold" style={{ color: colors.primary }}>
                    {item._count.reviews > 0 ? 
                      (item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length).toFixed(1) : 
                      'New'
                    }
                  </div>
                  <div className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>Rating</div>
                </CardContent>
              </Card>
              
              <Card className="text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-3 md:p-4">
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 md:mb-2" style={{ color: colors.primary }} />
                  <div className="text-base md:text-lg font-bold" style={{ color: colors.primary }}>{item._count.orders}</div>
                  <div className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>Sales</div>
                </CardContent>
              </Card>
              
              <Card className="text-center sm:col-span-2 md:col-span-1" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardContent className="p-3 md:p-4">
                  <Eye className="h-5 w-5 md:h-6 md:w-6 mx-auto mb-1 md:mb-2" style={{ color: colors.primary }} />
                  <div className="text-base md:text-lg font-bold" style={{ color: colors.primary }}>1.2K</div>
                  <div className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>Views</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Information Section */}
          <div className="space-y-4 md:space-y-6">
            <Card style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardHeader className="pb-4 md:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl md:text-2xl mb-2" style={{ color: colors.textPrimary }}>
                      {item.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
                      <Badge variant="secondary" className="text-xs" style={{ backgroundColor: colors.accent, color: colors.textOnWhite }}>
                        {item.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs" style={{ borderColor: colors.primary, color: colors.primary }}>
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right sm:text-left">
                    <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: colors.primary }}>
                      ${item.price}
                    </div>
                    <div className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
                      {item.currency}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
                  {item.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 md:space-y-6">
                {/* Creator Info */}
                <div className="flex items-center justify-between p-3 md:p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                      <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base" style={{ color: colors.textPrimary }}>
                        {item.user?.name || 'EDN Creator'}
                      </div>
                      <div className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
                        Verified Creator
                      </div>
                    </div>
                  </div>
                  {item.user?.verified && (
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                  )}
                </div>

                {/* AI Generation Details */}
                {(item.positivePrompt || item.negativePrompt || item.promptConfig) && (
                  <BlurredPromptDisplay
                    itemId={item.id}
                    title={item.title}
                    positivePrompt={item.positivePrompt}
                    negativePrompt={item.negativePrompt}
                    promptConfig={item.promptConfig}
                    price={item.price}
                    isPurchased={!!userOrder}
                    onPurchase={handleBuyItem}
                  />
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base" style={{ color: colors.textPrimary }}>Tags</h3>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs" style={{ borderColor: colors.primary, color: colors.primary }}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                <div>
                  <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base" style={{ color: colors.textPrimary }}>
                    Reviews ({item._count.reviews})
                  </h3>
                  <div className="space-y-2 md:space-y-3">
                    {item.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="p-2 md:p-3 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="flex items-center justify-between mb-1 md:mb-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 md:h-4 md:w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs" style={{ color: colors.textLight }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
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
                <div className="flex gap-2 md:gap-3">
                  <Button variant="outline" className="flex-1 text-sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                    <Share2 className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1 text-sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                    <MessageCircle className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
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