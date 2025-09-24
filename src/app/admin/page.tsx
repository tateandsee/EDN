'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Settings, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  Link, 
  Download,
  Upload,
  BarChart3,
  Shield,
  Bell,
  CreditCard,
  Bitcoin,
  Landmark,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Crown,
  Zap,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  Check,
  PieChart,
  Tag,
  X
} from 'lucide-react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isNSFW, setIsNSFW] = useState(false)
  
  // Promotional Code States
  const [promotionalCodes, setPromotionalCodes] = useState([])
  const [showCreatePromoModal, setShowCreatePromoModal] = useState(false)
  const [editingPromoCode, setEditingPromoCode] = useState(null)
  const [loadingPromoCodes, setLoadingPromoCodes] = useState(true)
  
  // New Promotional Code Form
  const [newPromoCode, setNewPromoCode] = useState({
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: 10,
    maxUses: '',
    validUntil: '',
    minAmount: '',
    applicablePlans: '',
    isActive: true
  })
  
  const nsfwColors = {
    primary: '#FF69B4', // neon pink
    secondary: '#00FFFF', // cyan
    accent: '#FF4500', // burning red
    bg: 'from-pink-900 via-purple-900 to-black',
    cardBg: 'rgba(30, 0, 30, 0.85)',
    cardBorder: 'rgba(255, 20, 147, 0.5)',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textLight: '#B0B0B0',
  }

  const sfwColors = {
    primary: '#FF6B35', // vibrant coral orange
    secondary: '#4ECDC4', // bright turquoise
    accent: '#FFE66D', // golden yellow
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(0, 0, 0, 0.1)',
    textPrimary: '#1A202C', // dark gray
    textSecondary: '#2D3748', // medium gray
    textLight: '#4A5568', // light gray
  }

  const colors = isNSFW ? nsfwColors : sfwColors

  // Admin Stats
  const adminStats = {
    totalUsers: 15420,
    activeAffiliates: 3420,
    totalRevenue: 284750,
    pendingPayouts: 15600,
    platformConnections: 8900,
    totalDistributions: 45600
  }

  // Affiliate Settings
  const [affiliateSettings, setAffiliateSettings] = useState({
    commissionRate: 10,
    minimumPayout: 50,
    payoutMethods: ['paypal', 'bitcoin', 'ethereum', 'bank'],
    tierThresholds: {
      bronze: 1000,
      silver: 5000,
      gold: 15000,
      platinum: 50000,
      diamond: 100000
    },
    gamificationEnabled: true,
    leaderboardEnabled: true,
    autoApproveAffiliates: false
  })

  // Platform Settings
  const [platformSettings, setPlatformSettings] = useState({
    apiRateLimit: 100,
    bulkUploadLimit: 50,
    autoOptimizeContent: true,
    schedulingEnabled: true,
    analyticsRetention: 90,
    supportedPlatforms: [
      'OnlyFans', 'Fansly', 'JustForFans', 'ManyVids', 'Fanvue',
      'Patreon', 'Instagram', 'TikTok', 'Ko-fi', 'AdmireMe.VIP'
    ]
  })

  // Pricing Settings
  const [pricingSettings, setPricingSettings] = useState({
    plans: {
      starter: { price: 0, features: ['Limited AI access', '1 distribution/day'] },
      basic: { price: 10, features: ['10 AI models', '5 distributions/month'] },
      pro: { price: 50, features: ['All AI models', 'Unlimited distributions'] },
      elite: { price: 100, features: ['Elite AI models', 'Priority distributions'] },
      master: { price: 200, features: ['Master AI models', 'VIP distributions'] },
      vip: { price: 500, features: ['Unlimited everything', 'Personal manager'] }
    },
    currency: 'USD',
    yearlyDiscount: 20
  })

  // Revenue Analytics Data
  const revenueData = {
    daily: {
      today: 2847.50,
      yesterday: 2156.30,
      change: 32.1,
      chart: [1200, 1900, 1500, 2100, 2400, 2200, 2847]
    },
    weekly: {
      thisWeek: 18450.75,
      lastWeek: 15230.40,
      change: 21.2,
      chart: [12000, 13500, 14200, 15800, 16900, 17500, 18450]
    },
    monthly: {
      thisMonth: 78450.20,
      lastMonth: 65230.80,
      change: 20.3,
      chart: [45000, 52000, 58000, 64000, 69000, 73000, 78450]
    },
    yearly: {
      thisYear: 845620.50,
      lastYear: 689450.30,
      change: 22.7,
      chart: [420000, 480000, 540000, 600000, 660000, 720000, 780000, 845620]
    }
  }

  // Affiliate Applications
  const affiliateApplications = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      appliedAt: '2 hours ago',
      status: 'pending',
      experience: 'Social Media Influencer',
      audienceSize: '50K+ followers'
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike@example.com',
      appliedAt: '5 hours ago',
      status: 'pending',
      experience: 'Content Creator',
      audienceSize: '100K+ followers'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      appliedAt: '1 day ago',
      status: 'approved',
      experience: 'Marketing Professional',
      audienceSize: '25K+ followers'
    }
  ]

  // Top Affiliates
  const topAffiliates = [
    {
      id: 1,
      name: 'Alex Rodriguez',
      earnings: 15420.50,
      referrals: 89,
      conversionRate: 12.8,
      tier: 'Diamond'
    },
    {
      id: 2,
      name: 'Jessica Liu',
      earnings: 12340.20,
      referrals: 76,
      conversionRate: 15.2,
      tier: 'Platinum'
    },
    {
      id: 3,
      name: 'David Kim',
      earnings: 9870.80,
      referrals: 54,
      conversionRate: 11.5,
      tier: 'Gold'
    }
  ]

  // Recent Affiliate Activity
  const recentAffiliateActivity = [
    {
      id: 1,
      user: 'John Doe',
      action: 'New referral',
      amount: 15.00,
      status: 'completed',
      date: '2 hours ago'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Payout requested',
      amount: 250.00,
      status: 'pending',
      date: '5 hours ago'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'Tier upgrade',
      amount: 0,
      status: 'completed',
      date: '1 day ago'
    }
  ]

  // Platform Integrations
  const platformIntegrations = [
    {
      name: 'PayPal',
      status: 'connected',
      type: 'payment',
      lastSync: '2 hours ago'
    },
    {
      name: 'Stripe',
      status: 'connected',
      type: 'payment',
      lastSync: '1 hour ago'
    },
    {
      name: 'Coinbase',
      status: 'disconnected',
      type: 'crypto',
      lastSync: 'Never'
    },
    {
      name: 'Mailchimp',
      status: 'connected',
      type: 'email',
      lastSync: '30 minutes ago'
    }
  ]

  // Marketplace Management States
  const [marketplaceItems, setMarketplaceItems] = useState([])
  const [showCreateItemModal, setShowCreateItemModal] = useState(false)
  const [editingMarketplaceItem, setEditingMarketplaceItem] = useState(null)
  const [loadingMarketplaceItems, setLoadingMarketplaceItems] = useState(true)
  
  // New Marketplace Item Form
  const [newMarketplaceItem, setNewMarketplaceItem] = useState({
    title: '',
    description: '',
    type: 'DIGITAL_GOOD',
    category: 'SFW',
    price: 0,
    currency: 'USD',
    isNsfw: false,
    tags: '',
    thumbnail: '',
    images: '',
    pdfFile: null as File | null,
    pdfFileName: '',
    pdfFileSize: 0
  })

  // Marketplace Settings
  const [marketplaceSettings, setMarketplaceSettings] = useState({
    platformCommissionRate: 30, // 30% default commission
    minimumPrice: 1.00,
    maximumPrice: 999.99,
    allowedCategories: ['SFW', 'NSFW', 'EDUCATION', 'PROMPTS'],
    requireApproval: true,
    autoApproveVerifiedCreators: false,
    payoutFrequency: 'WEEKLY', // DAILY, WEEKLY, MONTHLY
    payoutMethods: ['paypal', 'stripe', 'bank_transfer', 'cryptocurrency'],
    minimumPayoutThreshold: 50.00
  })

  // Platform Settings (Enhanced)
  const [enhancedPlatformSettings, setEnhancedPlatformSettings] = useState({
    ...platformSettings,
    apiKeys: {
      openai: '',
      anthropic: '',
      google: '',
      aws: '',
      cloudinary: ''
    },
    webhooks: {
      paymentWebhook: '',
      fulfillmentWebhook: '',
      notificationWebhook: ''
    },
    security: {
      twoFactorAuth: true,
      apiRateLimiting: true,
      contentModeration: true,
      dataEncryption: true
    },
    email: {
      smtpServer: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@edn.com'
    }
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    gateways: {
      stripe: {
        enabled: true,
        publishableKey: '',
        secretKey: '',
        webhookSecret: ''
      },
      paypal: {
        enabled: true,
        clientId: '',
        clientSecret: '',
        webhookId: ''
      },
      coinbase: {
        enabled: false,
        apiKey: '',
        webhookSecret: ''
      },
      bankTransfer: {
        enabled: true,
        accountDetails: {}
      }
    },
    currencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    defaultCurrency: 'USD',
    autoPayouts: {
      enabled: true,
      frequency: 'WEEKLY', // DAILY, WEEKLY, MONTHLY
      minimumAmount: 50.00,
      processingFee: 2.5
    },
    refunds: {
      enabled: true,
      automaticApproval: false,
      timeLimit: 30 // days
    },
    subscriptions: {
      enabled: true,
      trialPeriod: 7,
      proratedUpgrades: true,
      cancellationPolicy: 'IMMEDIATE'
    }
  })

  const handleSaveSettings = () => {
    console.log('Saving settings...')
    // Show success notification
  }

  const handleApprovePayout = (id: number) => {
    console.log(`Approving payout ${id}`)
  }

  const handleRejectPayout = (id: number) => {
    console.log(`Rejecting payout ${id}`)
  }

  // Promotional Code Functions
  const fetchPromotionalCodes = async () => {
    try {
      const response = await fetch('/api/promotional-codes')
      if (response.ok) {
        const data = await response.json()
        setPromotionalCodes(data.promotionalCodes)
      }
    } catch (error) {
      console.error('Error fetching promotional codes:', error)
    } finally {
      setLoadingPromoCodes(false)
    }
  }

  const createPromotionalCode = async () => {
    try {
      const response = await fetch('/api/promotional-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPromoCode,
          maxUses: newPromoCode.maxUses ? parseInt(newPromoCode.maxUses) : null,
          validUntil: newPromoCode.validUntil || null,
          minAmount: newPromoCode.minAmount ? parseFloat(newPromoCode.minAmount) : null,
          applicablePlans: newPromoCode.applicablePlans ? newPromoCode.applicablePlans.split(',').map(p => p.trim()) : []
        })
      })

      if (response.ok) {
        setShowCreatePromoModal(false)
        setNewPromoCode({
          code: '',
          description: '',
          type: 'PERCENTAGE',
          value: 10,
          maxUses: '',
          validUntil: '',
          minAmount: '',
          applicablePlans: '',
          isActive: true
        })
        fetchPromotionalCodes()
      }
    } catch (error) {
      console.error('Error creating promotional code:', error)
    }
  }

  const updatePromotionalCode = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/promotional-codes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchPromotionalCodes()
        setEditingPromoCode(null)
      }
    } catch (error) {
      console.error('Error updating promotional code:', error)
    }
  }

  const deletePromotionalCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotional code?')) return

    try {
      const response = await fetch(`/api/promotional-codes/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPromotionalCodes()
      }
    } catch (error) {
      console.error('Error deleting promotional code:', error)
    }
  }

  const togglePromoCodeStatus = async (id: string, isActive: boolean) => {
    await updatePromotionalCode(id, { isActive })
  }

  // Marketplace Management Functions
  const fetchMarketplaceItems = async () => {
    try {
      const response = await fetch('/api/marketplace/items')
      if (response.ok) {
        const data = await response.json()
        setMarketplaceItems(data.items)
      }
    } catch (error) {
      console.error('Error fetching marketplace items:', error)
    } finally {
      setLoadingMarketplaceItems(false)
    }
  }

  const createMarketplaceItem = async () => {
    try {
      const formData = new FormData()
      formData.append('title', newMarketplaceItem.title)
      formData.append('description', newMarketplaceItem.description)
      formData.append('type', newMarketplaceItem.type)
      formData.append('category', newMarketplaceItem.category)
      formData.append('price', newMarketplaceItem.price.toString())
      formData.append('currency', newMarketplaceItem.currency)
      formData.append('isNsfw', newMarketplaceItem.isNsfw.toString())
      formData.append('tags', newMarketplaceItem.tags)
      
      // Handle image files
      if (newMarketplaceItem.thumbnail) {
        formData.append('thumbnail', newMarketplaceItem.thumbnail)
      }
      
      if (newMarketplaceItem.images) {
        const imageFiles = newMarketplaceItem.images.split(',').map(i => i.trim())
        imageFiles.forEach(imageFile => {
          if (imageFile) {
            formData.append('images', imageFile)
          }
        })
      }
      
      // Handle PDF file
      if (newMarketplaceItem.pdfFile) {
        formData.append('pdfFile', newMarketplaceItem.pdfFile)
      }

      const response = await fetch('/api/marketplace/items', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer your-token-here' // Replace with actual auth
        },
        body: formData
      })

      if (response.ok) {
        setShowCreateItemModal(false)
        setNewMarketplaceItem({
          title: '',
          description: '',
          type: 'DIGITAL_GOOD',
          category: 'SFW',
          price: 0,
          currency: 'USD',
          isNsfw: false,
          tags: '',
          thumbnail: '',
          images: '',
          pdfFile: null,
          pdfFileName: '',
          pdfFileSize: 0
        })
        fetchMarketplaceItems()
      }
    } catch (error) {
      console.error('Error creating marketplace item:', error)
    }
  }

  const updateMarketplaceItem = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/marketplace/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchMarketplaceItems()
        setEditingMarketplaceItem(null)
      }
    } catch (error) {
      console.error('Error updating marketplace item:', error)
    }
  }

  const deleteMarketplaceItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this marketplace item?')) return

    try {
      const response = await fetch(`/api/marketplace/items/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchMarketplaceItems()
      }
    } catch (error) {
      console.error('Error deleting marketplace item:', error)
    }
  }

  const toggleMarketplaceItemStatus = async (id: string, status: string) => {
    await updateMarketplaceItem(id, { status })
  }

  const updateMarketplaceSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/marketplace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marketplaceSettings)
      })

      if (response.ok) {
        alert('Marketplace settings updated successfully!')
      }
    } catch (error) {
      console.error('Error updating marketplace settings:', error)
    }
  }

  const updatePlatformSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/platform', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enhancedPlatformSettings)
      })

      if (response.ok) {
        alert('Platform settings updated successfully!')
      }
    } catch (error) {
      console.error('Error updating platform settings:', error)
    }
  }

  const updatePaymentSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentSettings)
      })

      if (response.ok) {
        alert('Payment settings updated successfully!')
      }
    } catch (error) {
      console.error('Error updating payment settings:', error)
    }
  }

  // Load promotional codes and marketplace items on component mount
  useEffect(() => {
    fetchPromotionalCodes()
    fetchMarketplaceItems()
  }, [])

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Admin Panel
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Manage affiliate programs, distribution settings, and platform integrations
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8" style={{ paddingTop: '0' }}>
        <div className="max-w-7xl mx-auto">
          {/* NSFW/SFW Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant={isNSFW ? "default" : "outline"}
                size="sm"
                onClick={() => setIsNSFW(true)}
                className="text-xs"
                style={{ 
                  backgroundColor: isNSFW ? colors.primary : 'transparent',
                  borderColor: colors.primary,
                  color: isNSFW ? 'white' : colors.primary
                }}
              >
                NSFW
              </Button>
              
              <Button
                variant={!isNSFW ? "default" : "outline"}
                size="sm"
                onClick={() => setIsNSFW(false)}
                className="text-xs"
                style={{ 
                  backgroundColor: !isNSFW ? colors.primary : 'transparent',
                  borderColor: colors.primary,
                  color: !isNSFW ? 'white' : colors.primary
                }}
              >
                SFW
              </Button>
            </div>
          </div>

          {/* Admin Stats Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total Users</p>
                    <p className="text-xl font-bold" style={{ color: colors.primary }}>
                      {adminStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-6 w-6" style={{ color: colors.primary }} />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Active Affiliates</p>
                    <p className="text-xl font-bold" style={{ color: colors.primary }}>
                      {adminStats.activeAffiliates.toLocaleString()}
                    </p>
                  </div>
                  <Star className="h-6 w-6" style={{ color: colors.primary }} />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total Revenue</p>
                    <p className="text-xl font-bold" style={{ color: colors.primary }}>
                      ${adminStats.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6" style={{ color: colors.primary }} />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Pending Payouts</p>
                    <p className="text-xl font-bold" style={{ color: colors.accent }}>
                      ${adminStats.pendingPayouts.toLocaleString()}
                    </p>
                  </div>
                  <Clock className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Platform Connections</p>
                    <p className="text-xl font-bold" style={{ color: colors.secondary }}>
                      {adminStats.platformConnections.toLocaleString()}
                    </p>
                  </div>
                  <Globe className="h-6 w-6" style={{ color: colors.secondary }} />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Total Distributions</p>
                    <p className="text-xl font-bold" style={{ color: colors.accent }}>
                      {adminStats.totalDistributions.toLocaleString()}
                    </p>
                  </div>
                  <Upload className="h-6 w-6" style={{ color: colors.accent }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-10">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="promotional">Promotional Codes</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="platform">Platform</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Bell className="inline mr-2 h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAffiliateActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)' }}>
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${activity.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            <div>
                              <p className="font-medium" style={{ color: colors.textPrimary }}>{activity.user}</p>
                              <p className="text-sm" style={{ color: colors.textLight }}>{activity.action}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {activity.amount > 0 && (
                              <p className="font-medium" style={{ color: colors.primary }}>${activity.amount}</p>
                            )}
                            <p className="text-xs" style={{ color: colors.textLight }}>{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Shield className="inline mr-2 h-5 w-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span style={{ color: colors.textPrimary }}>API Status</span>
                        <Badge className="bg-green-500">Operational</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: colors.textPrimary }}>Database</span>
                        <Badge className="bg-green-500">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: colors.textPrimary }}>Payment Processing</span>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: colors.textPrimary }}>Distribution Queue</span>
                        <Badge className="bg-yellow-500">Processing</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ color: colors.textPrimary }}>Email Service</span>
                        <Badge className="bg-green-500">Delivering</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="mt-6">
              <div className="space-y-8">
                {/* Revenue Overview Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>Today's Revenue</p>
                          <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                            ${revenueData.daily.today.toLocaleString()}
                          </p>
                          <p className="text-xs mt-1" style={{ color: revenueData.daily.change > 0 ? '#4ADE80' : '#EF4444' }}>
                            {revenueData.daily.change > 0 ? '+' : ''}{revenueData.daily.change}% vs yesterday
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8" style={{ color: colors.primary }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>This Week</p>
                          <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                            ${revenueData.weekly.thisWeek.toLocaleString()}
                          </p>
                          <p className="text-xs mt-1" style={{ color: revenueData.weekly.change > 0 ? '#4ADE80' : '#EF4444' }}>
                            {revenueData.weekly.change > 0 ? '+' : ''}{revenueData.weekly.change}% vs last week
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8" style={{ color: colors.primary }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>This Month</p>
                          <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                            ${revenueData.monthly.thisMonth.toLocaleString()}
                          </p>
                          <p className="text-xs mt-1" style={{ color: revenueData.monthly.change > 0 ? '#4ADE80' : '#EF4444' }}>
                            {revenueData.monthly.change > 0 ? '+' : ''}{revenueData.monthly.change}% vs last month
                          </p>
                        </div>
                        <BarChart3 className="h-8 w-8" style={{ color: colors.primary }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm mb-1" style={{ color: colors.textSecondary }}>This Year</p>
                          <p className="text-2xl font-bold" style={{ color: colors.primary }}>
                            ${revenueData.yearly.thisYear.toLocaleString()}
                          </p>
                          <p className="text-xs mt-1" style={{ color: revenueData.yearly.change > 0 ? '#4ADE80' : '#EF4444' }}>
                            {revenueData.yearly.change > 0 ? '+' : ''}{revenueData.yearly.change}% vs last year
                          </p>
                        </div>
                        <Crown className="h-8 w-8" style={{ color: colors.primary }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Revenue Sources */}
                  <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <CardTitle style={{ color: colors.primary }}>
                        <PieChart className="inline mr-2 h-5 w-5" />
                        Revenue Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span style={{ color: colors.textPrimary }}>Subscriptions</span>
                            <span className="font-semibold" style={{ color: colors.primary }}>65%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span style={{ color: colors.textPrimary }}>Marketplace Sales</span>
                            <span className="font-semibold" style={{ color: colors.primary }}>25%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span style={{ color: colors.textPrimary }}>Affiliate Commissions</span>
                            <span className="font-semibold" style={{ color: colors.primary }}>10%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Trend */}
                  <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                    <CardHeader>
                      <CardTitle style={{ color: colors.primary }}>
                        <TrendingUp className="inline mr-2 h-5 w-5" />
                        Monthly Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {revenueData.monthly.chart.map((value, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-sm w-16" style={{ color: colors.textLight }}>
                              Month {index + 1}
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                                style={{ width: `${(value / revenueData.monthly.chart[revenueData.monthly.chart.length - 1]) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold w-20 text-right" style={{ color: colors.primary }}>
                              ${value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="affiliate" className="mt-6">
              <div className="space-y-8">
                {/* Affiliate Applications */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Users className="inline mr-2 h-5 w-5" />
                      Affiliate Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {affiliateApplications.map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: colors.cardBorder }}>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${application.status === 'approved' ? 'bg-green-400' : application.status === 'rejected' ? 'bg-red-400' : 'bg-yellow-400'}`}></div>
                              <div>
                                <p className="font-medium" style={{ color: colors.textPrimary }}>{application.name}</p>
                                <p className="text-sm" style={{ color: colors.textLight }}>{application.email}</p>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span style={{ color: colors.textLight }}>Experience:</span>
                                <span className="ml-1" style={{ color: colors.textPrimary }}>{application.experience}</span>
                              </div>
                              <div>
                                <span style={{ color: colors.textLight }}>Audience:</span>
                                <span className="ml-1" style={{ color: colors.textPrimary }}>{application.audienceSize}</span>
                              </div>
                            </div>
                            <p className="text-xs mt-1" style={{ color: colors.textLight }}>Applied: {application.appliedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {application.status === 'pending' && (
                              <>
                                <Button size="sm" onClick={() => console.log(`Approve ${application.id}`)} className="bg-green-600 hover:bg-green-700">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => console.log(`Reject ${application.id}`)} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Badge className={application.status === 'approved' ? 'bg-green-500' : application.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Affiliates */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Crown className="inline mr-2 h-5 w-5" />
                      Top Performing Affiliates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topAffiliates.map((affiliate, index) => (
                        <div key={affiliate.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: colors.cardBorder }}>
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium" style={{ color: colors.textPrimary }}>{affiliate.name}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span style={{ color: colors.textLight }}>{affiliate.referrals} referrals</span>
                                <span style={{ color: colors.textLight }}>{affiliate.conversionRate}% conversion</span>
                                <Badge className={
                                  affiliate.tier === 'Diamond' ? 'bg-purple-500' :
                                  affiliate.tier === 'Platinum' ? 'bg-blue-500' :
                                  affiliate.tier === 'Gold' ? 'bg-yellow-500' : 'bg-gray-500'
                                }>
                                  {affiliate.tier}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold" style={{ color: colors.primary }}>${affiliate.earnings.toLocaleString()}</p>
                            <p className="text-sm" style={{ color: colors.textLight }}>total earnings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Settings className="inline mr-2 h-5 w-5" />
                      Affiliate Program Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="commissionRate" style={{ color: colors.textPrimary }}>Commission Rate (%)</Label>
                        <Input
                          id="commissionRate"
                          type="number"
                          value={affiliateSettings.commissionRate}
                          onChange={(e) => setAffiliateSettings({...affiliateSettings, commissionRate: Number(e.target.value)})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="minimumPayout" style={{ color: colors.textPrimary }}>Minimum Payout ($)</Label>
                        <Input
                          id="minimumPayout"
                          type="number"
                          value={affiliateSettings.minimumPayout}
                          onChange={(e) => setAffiliateSettings({...affiliateSettings, minimumPayout: Number(e.target.value)})}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label style={{ color: colors.textPrimary }}>Gamification Enabled</Label>
                        <Switch
                          checked={affiliateSettings.gamificationEnabled}
                          onCheckedChange={(checked) => setAffiliateSettings({...affiliateSettings, gamificationEnabled: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label style={{ color: colors.textPrimary }}>Leaderboard Enabled</Label>
                        <Switch
                          checked={affiliateSettings.leaderboardEnabled}
                          onCheckedChange={(checked) => setAffiliateSettings({...affiliateSettings, leaderboardEnabled: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label style={{ color: colors.textPrimary }}>Auto-Approve Affiliates</Label>
                        <Switch
                          checked={affiliateSettings.autoApproveAffiliates}
                          onCheckedChange={(checked) => setAffiliateSettings({...affiliateSettings, autoApproveAffiliates: checked})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label style={{ color: colors.textPrimary }}>Tier Thresholds ($)</Label>
                      <div className="grid md:grid-cols-5 gap-4 mt-2">
                        {Object.entries(affiliateSettings.tierThresholds).map(([tier, threshold]) => (
                          <div key={tier}>
                            <Label htmlFor={tier} className="text-sm" style={{ color: colors.textLight }}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</Label>
                            <Input
                              id={tier}
                              type="number"
                              value={threshold}
                              onChange={(e) => setAffiliateSettings({
                                ...affiliateSettings,
                                tierThresholds: {
                                  ...affiliateSettings.tierThresholds,
                                  [tier]: Number(e.target.value)
                                }
                              })}
                              className="mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleSaveSettings} className="w-full" style={{ backgroundColor: colors.primary }}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Affiliate Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Pending Payouts */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <CreditCard className="inline mr-2 h-5 w-5" />
                      Pending Payouts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAffiliateActivity.filter(a => a.action === 'Payout requested').map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: colors.cardBorder }}>
                          <div>
                            <p className="font-medium" style={{ color: colors.textPrimary }}>{payout.user}</p>
                            <p className="text-sm" style={{ color: colors.textLight }}>{payout.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold" style={{ color: colors.primary }}>${payout.amount}</p>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleApprovePayout(payout.id)} className="bg-green-600 hover:bg-green-700">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleRejectPayout(payout.id)} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="distribution" className="mt-6">
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>
                    <Globe className="inline mr-2 h-5 w-5" />
                    Distribution Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="apiRateLimit" style={{ color: colors.textPrimary }}>API Rate Limit (requests/hour)</Label>
                      <Input
                        id="apiRateLimit"
                        type="number"
                        value={platformSettings.apiRateLimit}
                        onChange={(e) => setPlatformSettings({...platformSettings, apiRateLimit: Number(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bulkUploadLimit" style={{ color: colors.textPrimary }}>Bulk Upload Limit</Label>
                      <Input
                        id="bulkUploadLimit"
                        type="number"
                        value={platformSettings.bulkUploadLimit}
                        onChange={(e) => setPlatformSettings({...platformSettings, bulkUploadLimit: Number(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label style={{ color: colors.textPrimary }}>Auto-Optimize Content</Label>
                      <Switch
                        checked={platformSettings.autoOptimizeContent}
                        onCheckedChange={(checked) => setPlatformSettings({...platformSettings, autoOptimizeContent: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label style={{ color: colors.textPrimary }}>Scheduling Enabled</Label>
                      <Switch
                        checked={platformSettings.schedulingEnabled}
                        onCheckedChange={(checked) => setPlatformSettings({...platformSettings, schedulingEnabled: checked})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="analyticsRetention" style={{ color: colors.textPrimary }}>Analytics Retention (days)</Label>
                    <Input
                      id="analyticsRetention"
                      type="number"
                      value={platformSettings.analyticsRetention}
                      onChange={(e) => setPlatformSettings({...platformSettings, analyticsRetention: Number(e.target.value)})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label style={{ color: colors.textPrimary }}>Supported Platforms</Label>
                    <div className="mt-2 space-y-2">
                      {platformSettings.supportedPlatforms.map((platform, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={platform} className="flex-1" />
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Platform
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings} className="w-full" style={{ backgroundColor: colors.primary }}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Distribution Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>
                    <DollarSign className="inline mr-2 h-5 w-5" />
                    Pricing Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="currency" style={{ color: colors.textPrimary }}>Currency</Label>
                      <Select value={pricingSettings.currency} onValueChange={(value) => setPricingSettings({...pricingSettings, currency: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="yearlyDiscount" style={{ color: colors.textPrimary }}>Yearly Discount (%)</Label>
                      <Input
                        id="yearlyDiscount"
                        type="number"
                        value={pricingSettings.yearlyDiscount}
                        onChange={(e) => setPricingSettings({...pricingSettings, yearlyDiscount: Number(e.target.value)})}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label style={{ color: colors.textPrimary }}>Subscription Plans</Label>
                    <div className="mt-4 space-y-4">
                      {Object.entries(pricingSettings.plans).map(([planName, planData]) => (
                        <div key={planName} className="p-4 rounded-lg border" style={{ borderColor: colors.cardBorder }}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold" style={{ color: colors.textPrimary }}>{planName.charAt(0).toUpperCase() + planName.slice(1)}</h3>
                            <div className="flex items-center gap-2">
                              <span style={{ color: colors.textPrimary }}>$</span>
                              <Input
                                type="number"
                                value={planData.price}
                                onChange={(e) => setPricingSettings({
                                  ...pricingSettings,
                                  plans: {
                                    ...pricingSettings.plans,
                                    [planName]: {
                                      ...planData,
                                      price: Number(e.target.value)
                                    }
                                  }
                                })}
                                className="w-20"
                              />
                              <span style={{ color: colors.textLight }}>/month</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {planData.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400" />
                                <span className="text-sm" style={{ color: colors.textLight }}>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings} className="w-full" style={{ backgroundColor: colors.primary }}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Pricing Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promotional" className="mt-6">
              <Card className="backdrop-blur-sm border-2 mb-6" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle style={{ color: colors.primary }}>
                        <Tag className="inline mr-2 h-5 w-5" />
                        Promotional Codes
                      </CardTitle>
                      <CardDescription style={{ color: colors.textSecondary }}>
                        Manage discount codes and special offers
                      </CardDescription>
                    </div>
                    <Dialog open={showCreatePromoModal} onOpenChange={setShowCreatePromoModal}>
                      <DialogTrigger asChild>
                        <Button style={{ backgroundColor: colors.primary }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Create Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                        <DialogHeader>
                          <DialogTitle style={{ color: colors.primary }}>Create Promotional Code</DialogTitle>
                          <DialogDescription style={{ color: colors.textSecondary }}>
                            Create a new promotional code for discounts
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label style={{ color: colors.primary }}>Code</Label>
                            <Input
                              value={newPromoCode.code}
                              onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                              placeholder="SUMMER2024"
                              style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white', color: colors.textPrimary }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.primary }}>Description</Label>
                            <Input
                              value={newPromoCode.description}
                              onChange={(e) => setNewPromoCode({ ...newPromoCode, description: e.target.value })}
                              placeholder="Summer sale discount"
                              style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white', color: colors.textPrimary }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.primary }}>Type</Label>
                            <Select value={newPromoCode.type} onValueChange={(value) => setNewPromoCode({ ...newPromoCode, type: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                                <SelectItem value="FREE_TRIAL">Free Trial</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label style={{ color: colors.primary }}>Value</Label>
                            <Input
                              type="number"
                              value={newPromoCode.value}
                              onChange={(e) => setNewPromoCode({ ...newPromoCode, value: parseFloat(e.target.value) })}
                              placeholder="10"
                              style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white', color: colors.textPrimary }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.primary }}>Max Uses (optional)</Label>
                            <Input
                              type="number"
                              value={newPromoCode.maxUses}
                              onChange={(e) => setNewPromoCode({ ...newPromoCode, maxUses: e.target.value })}
                              placeholder="100"
                              style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white', color: colors.textPrimary }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.primary }}>Valid Until (optional)</Label>
                            <Input
                              type="datetime-local"
                              value={newPromoCode.validUntil}
                              onChange={(e) => setNewPromoCode({ ...newPromoCode, validUntil: e.target.value })}
                              style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white', color: colors.textPrimary }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.primary }}>Minimum Amount (optional)</Label>
                            <Input
                              type="number"
                              value={newPromoCode.minAmount}
                              onChange={(e) => setNewPromoCode({ ...newPromoCode, minAmount: e.target.value })}
                              placeholder="50"
                              style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white', color: colors.textPrimary }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.primary }}>Applicable Plans (comma-separated)</Label>
                            <Input
                              value={newPromoCode.applicablePlans}
                              onChange={(e) => setNewPromoCode({ ...newPromoCode, applicablePlans: e.target.value })}
                              placeholder="PRO, ELITE, MASTER"
                              style={{ backgroundColor: isNSFW ? 'rgba(255, 255, 255, 0.1)' : 'white', color: colors.textPrimary }}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="active"
                              checked={newPromoCode.isActive}
                              onCheckedChange={(checked) => setNewPromoCode({ ...newPromoCode, isActive: checked })}
                            />
                            <Label htmlFor="active" style={{ color: colors.primary }}>Active</Label>
                          </div>
                          <Button onClick={createPromotionalCode} className="w-full" style={{ backgroundColor: colors.primary }}>
                            Create Code
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPromoCodes ? (
                    <div className="text-center py-8">Loading promotional codes...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead style={{ color: colors.primary }}>Code</TableHead>
                          <TableHead style={{ color: colors.primary }}>Description</TableHead>
                          <TableHead style={{ color: colors.primary }}>Type</TableHead>
                          <TableHead style={{ color: colors.primary }}>Value</TableHead>
                          <TableHead style={{ color: colors.primary }}>Used</TableHead>
                          <TableHead style={{ color: colors.primary }}>Status</TableHead>
                          <TableHead style={{ color: colors.primary }}>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {promotionalCodes.map((code: any) => (
                          <TableRow key={code.id}>
                            <TableCell style={{ color: colors.textPrimary }}>
                              <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <span className="font-mono">{code.code}</span>
                              </div>
                            </TableCell>
                            <TableCell style={{ color: colors.textSecondary }}>{code.description || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {code.type === 'PERCENTAGE' ? '%' : code.type === 'FIXED_AMOUNT' ? '$' : 'Trial'}
                              </Badge>
                            </TableCell>
                            <TableCell style={{ color: colors.textPrimary }}>
                              {code.type === 'PERCENTAGE' ? `${code.value}%` : `$${code.value}`}
                            </TableCell>
                            <TableCell style={{ color: colors.textSecondary }}>
                              {code.usedCount}{code.maxUses ? `/${code.maxUses}` : ''}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={code.isActive}
                                onCheckedChange={(checked) => togglePromoCodeStatus(code.id, checked)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingPromoCode(code)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deletePromotionalCode(code.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace" className="mt-6">
              <div className="space-y-8">
                {/* Marketplace Settings */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Settings className="inline mr-2 h-5 w-5" />
                      Marketplace Settings
                    </CardTitle>
                    <CardDescription style={{ color: colors.textSecondary }}>
                      Configure commission rates, approval requirements, and payout settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label style={{ color: colors.textPrimary }}>Platform Commission Rate</Label>
                          <Input
                            type="number"
                            value={marketplaceSettings.platformCommissionRate}
                            onChange={(e) => setMarketplaceSettings({
                              ...marketplaceSettings,
                              platformCommissionRate: parseFloat(e.target.value)
                            })}
                            className="mt-1"
                            style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                          />
                          <p className="text-xs mt-1" style={{ color: colors.textLight }}>Percentage of each sale (e.g., 30 for 30%)</p>
                        </div>
                        
                        <div>
                          <Label style={{ color: colors.textPrimary }}>Minimum Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={marketplaceSettings.minimumPrice}
                            onChange={(e) => setMarketplaceSettings({
                              ...marketplaceSettings,
                              minimumPrice: parseFloat(e.target.value)
                            })}
                            className="mt-1"
                            style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                          />
                        </div>

                        <div>
                          <Label style={{ color: colors.textPrimary }}>Maximum Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={marketplaceSettings.maximumPrice}
                            onChange={(e) => setMarketplaceSettings({
                              ...marketplaceSettings,
                              maximumPrice: parseFloat(e.target.value)
                            })}
                            className="mt-1"
                            style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label style={{ color: colors.textPrimary }}>Payout Frequency</Label>
                          <Select value={marketplaceSettings.payoutFrequency} onValueChange={(value) => setMarketplaceSettings({
                            ...marketplaceSettings,
                            payoutFrequency: value
                          })}>
                            <SelectTrigger className="mt-1" style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DAILY">Daily</SelectItem>
                              <SelectItem value="WEEKLY">Weekly</SelectItem>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label style={{ color: colors.textPrimary }}>Minimum Payout Threshold</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={marketplaceSettings.minimumPayoutThreshold}
                            onChange={(e) => setMarketplaceSettings({
                              ...marketplaceSettings,
                              minimumPayoutThreshold: parseFloat(e.target.value)
                            })}
                            className="mt-1"
                            style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={marketplaceSettings.requireApproval}
                            onCheckedChange={(checked) => setMarketplaceSettings({
                              ...marketplaceSettings,
                              requireApproval: checked
                            })}
                          />
                          <Label style={{ color: colors.textPrimary }}>Require approval for new items</Label>
                        </div>
                      </div>
                    </div>

                    <Button onClick={updateMarketplaceSettings} className="w-full" style={{ backgroundColor: colors.primary }}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Marketplace Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Marketplace Items Management */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle style={{ color: colors.primary }}>
                          <Tag className="inline mr-2 h-5 w-5" />
                          Marketplace Items
                        </CardTitle>
                        <CardDescription style={{ color: colors.textSecondary }}>
                          Manage items listed in the marketplace
                        </CardDescription>
                      </div>
                      <Dialog open={showCreateItemModal} onOpenChange={setShowCreateItemModal}>
                        <DialogTrigger asChild>
                          <Button style={{ backgroundColor: colors.primary }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                          <DialogHeader>
                            <DialogTitle style={{ color: colors.textPrimary }}>Create New Marketplace Item</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label style={{ color: colors.textPrimary }}>Title</Label>
                              <Input
                                value={newMarketplaceItem.title}
                                onChange={(e) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  title: e.target.value
                                })}
                                style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                              />
                            </div>
                            <div>
                              <Label style={{ color: colors.textPrimary }}>Description</Label>
                              <Textarea
                                value={newMarketplaceItem.description}
                                onChange={(e) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  description: e.target.value
                                })}
                                style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                              />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label style={{ color: colors.textPrimary }}>Type</Label>
                                <Select value={newMarketplaceItem.type} onValueChange={(value) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  type: value
                                })}>
                                  <SelectTrigger style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="AI_MODEL">AI Model</SelectItem>
                                    <SelectItem value="MENTORSHIP">Mentorship</SelectItem>
                                    <SelectItem value="TEMPLATE">Template</SelectItem>
                                    <SelectItem value="SERVICE">Service</SelectItem>
                                    <SelectItem value="DIGITAL_GOOD">Digital Good</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label style={{ color: colors.textPrimary }}>Category</Label>
                                <Select value={newMarketplaceItem.category} onValueChange={(value) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  category: value
                                })}>
                                  <SelectTrigger style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="SFW">SFW Content</SelectItem>
                                    <SelectItem value="NSFW">NSFW Content</SelectItem>
                                    <SelectItem value="EDUCATION">Education</SelectItem>
                                    <SelectItem value="PROMPTS">Prompts</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label style={{ color: colors.textPrimary }}>Price</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={newMarketplaceItem.price}
                                  onChange={(e) => setNewMarketplaceItem({
                                    ...newMarketplaceItem,
                                    price: parseFloat(e.target.value)
                                  })}
                                  style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                                />
                              </div>
                              <div>
                                <Label style={{ color: colors.textPrimary }}>Currency</Label>
                                <Select value={newMarketplaceItem.currency} onValueChange={(value) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  currency: value
                                })}>
                                  <SelectTrigger style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label style={{ color: colors.textPrimary }}>Tags (comma-separated)</Label>
                              <Input
                                value={newMarketplaceItem.tags}
                                onChange={(e) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  tags: e.target.value
                                })}
                                placeholder="ai, tools, digital"
                                style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                              />
                            </div>
                            <div>
                              <Label style={{ color: colors.textPrimary }}>Thumbnail Image URL</Label>
                              <Input
                                value={newMarketplaceItem.thumbnail}
                                onChange={(e) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  thumbnail: e.target.value
                                })}
                                placeholder="https://example.com/image.jpg"
                                style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                              />
                            </div>
                            <div>
                              <Label style={{ color: colors.textPrimary }}>Additional Image URLs (comma-separated)</Label>
                              <Input
                                value={newMarketplaceItem.images}
                                onChange={(e) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  images: e.target.value
                                })}
                                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                              />
                            </div>
                            <div>
                              <Label style={{ color: colors.textPrimary }}>PDF File (for mentorship/ebooks)</Label>
                              <Input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    setNewMarketplaceItem({
                                      ...newMarketplaceItem,
                                      pdfFile: file,
                                      pdfFileName: file.name,
                                      pdfFileSize: file.size
                                    })
                                  }
                                }}
                                style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                              />
                              {newMarketplaceItem.pdfFileName && (
                                <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                                  Selected: {newMarketplaceItem.pdfFileName} ({(newMarketplaceItem.pdfFileSize / 1024 / 1024).toFixed(2)} MB)
                                </p>
                              )}
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> Mentorship programs / Ebooks / Prompts should be in PDF format.
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={newMarketplaceItem.isNsfw}
                                onCheckedChange={(checked) => setNewMarketplaceItem({
                                  ...newMarketplaceItem,
                                  isNsfw: checked
                                })}
                              />
                              <Label style={{ color: colors.textPrimary }}>NSFW Content</Label>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setShowCreateItemModal(false)}>
                                Cancel
                              </Button>
                              <Button onClick={createMarketplaceItem} style={{ backgroundColor: colors.primary }}>
                                Create Item
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loadingMarketplaceItems ? (
                        <div className="text-center py-8">
                          <p style={{ color: colors.textSecondary }}>Loading marketplace items...</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ color: colors.textPrimary }}>Item</TableHead>
                              <TableHead style={{ color: colors.textPrimary }}>Category</TableHead>
                              <TableHead style={{ color: colors.textPrimary }}>Price</TableHead>
                              <TableHead style={{ color: colors.textPrimary }}>Status</TableHead>
                              <TableHead style={{ color: colors.textPrimary }}>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {marketplaceItems.map((item: any) => (
                              <TableRow key={item.id}>
                                <TableCell style={{ color: colors.textPrimary }}>
                                  <div className="flex items-center gap-3">
                                    {item.thumbnail && (
                                      <img src={item.thumbnail} alt={item.title} className="w-10 h-10 rounded object-cover" />
                                    )}
                                    <div>
                                      <p className="font-medium">{item.title}</p>
                                      <p className="text-sm" style={{ color: colors.textLight }}>{item.description?.substring(0, 50)}...</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell style={{ color: colors.textSecondary }}>{item.category}</TableCell>
                                <TableCell style={{ color: colors.textPrimary }}>{item.currency} {item.price}</TableCell>
                                <TableCell>
                                  <Badge variant={item.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                    {item.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingMarketplaceItem(item)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteMarketplaceItem(item.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="platform" className="mt-6">
              <div className="space-y-8">
                {/* API Keys */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Globe className="inline mr-2 h-5 w-5" />
                      API Keys & Integrations
                    </CardTitle>
                    <CardDescription style={{ color: colors.textSecondary }}>
                      Configure third-party service integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label style={{ color: colors.textPrimary }}>OpenAI API Key</Label>
                        <Input
                          type="password"
                          value={enhancedPlatformSettings.apiKeys.openai}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            apiKeys: {
                              ...enhancedPlatformSettings.apiKeys,
                              openai: e.target.value
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                      <div>
                        <Label style={{ color: colors.textPrimary }}>Anthropic API Key</Label>
                        <Input
                          type="password"
                          value={enhancedPlatformSettings.apiKeys.anthropic}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            apiKeys: {
                              ...enhancedPlatformSettings.apiKeys,
                              anthropic: e.target.value
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                      <div>
                        <Label style={{ color: colors.textPrimary }}>Google API Key</Label>
                        <Input
                          type="password"
                          value={enhancedPlatformSettings.apiKeys.google}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            apiKeys: {
                              ...enhancedPlatformSettings.apiKeys,
                              google: e.target.value
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                      <div>
                        <Label style={{ color: colors.textPrimary }}>AWS Access Key</Label>
                        <Input
                          type="password"
                          value={enhancedPlatformSettings.apiKeys.aws}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            apiKeys: {
                              ...enhancedPlatformSettings.apiKeys,
                              aws: e.target.value
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Webhooks */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Link className="inline mr-2 h-5 w-5" />
                      Webhook Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label style={{ color: colors.textPrimary }}>Payment Webhook URL</Label>
                      <Input
                        value={enhancedPlatformSettings.webhooks.paymentWebhook}
                        onChange={(e) => setEnhancedPlatformSettings({
                          ...enhancedPlatformSettings,
                          webhooks: {
                            ...enhancedPlatformSettings.webhooks,
                            paymentWebhook: e.target.value
                          }
                        })}
                        className="mt-1"
                        style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                      />
                    </div>
                    <div>
                      <Label style={{ color: colors.textPrimary }}>Fulfillment Webhook URL</Label>
                      <Input
                        value={enhancedPlatformSettings.webhooks.fulfillmentWebhook}
                        onChange={(e) => setEnhancedPlatformSettings({
                          ...enhancedPlatformSettings,
                          webhooks: {
                            ...enhancedPlatformSettings.webhooks,
                            fulfillmentWebhook: e.target.value
                          }
                        })}
                        className="mt-1"
                        style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Email Configuration */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Bell className="inline mr-2 h-5 w-5" />
                      Email Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label style={{ color: colors.textPrimary }}>SMTP Server</Label>
                        <Input
                          value={enhancedPlatformSettings.email.smtpServer}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            email: {
                              ...enhancedPlatformSettings.email,
                              smtpServer: e.target.value
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                      <div>
                        <Label style={{ color: colors.textPrimary }}>SMTP Port</Label>
                        <Input
                          type="number"
                          value={enhancedPlatformSettings.email.smtpPort}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            email: {
                              ...enhancedPlatformSettings.email,
                              smtpPort: parseInt(e.target.value)
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                      <div>
                        <Label style={{ color: colors.textPrimary }}>SMTP Username</Label>
                        <Input
                          value={enhancedPlatformSettings.email.smtpUsername}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            email: {
                              ...enhancedPlatformSettings.email,
                              smtpUsername: e.target.value
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                      <div>
                        <Label style={{ color: colors.textPrimary }}>From Email</Label>
                        <Input
                          type="email"
                          value={enhancedPlatformSettings.email.fromEmail}
                          onChange={(e) => setEnhancedPlatformSettings({
                            ...enhancedPlatformSettings,
                            email: {
                              ...enhancedPlatformSettings.email,
                              fromEmail: e.target.value
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                    </div>
                    <Button onClick={updatePlatformSettings} className="w-full" style={{ backgroundColor: colors.primary }}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Platform Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <div className="space-y-8">
                {/* Payment Gateways */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <CreditCard className="inline mr-2 h-5 w-5" />
                      Payment Gateways
                    </CardTitle>
                    <CardDescription style={{ color: colors.textSecondary }}>
                      Configure payment processing gateways
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stripe */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 style={{ color: colors.textPrimary }}>Stripe</h4>
                        <Switch
                          checked={paymentSettings.gateways.stripe.enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            gateways: {
                              ...paymentSettings.gateways,
                              stripe: {
                                ...paymentSettings.gateways.stripe,
                                enabled: checked
                              }
                            }
                          })}
                        />
                      </div>
                      {paymentSettings.gateways.stripe.enabled && (
                        <div className="grid md:grid-cols-2 gap-4 ml-4">
                          <div>
                            <Label style={{ color: colors.textPrimary }}>Publishable Key</Label>
                            <Input
                              type="password"
                              value={paymentSettings.gateways.stripe.publishableKey}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                gateways: {
                                  ...paymentSettings.gateways,
                                  stripe: {
                                    ...paymentSettings.gateways.stripe,
                                    publishableKey: e.target.value
                                  }
                                }
                              })}
                              className="mt-1"
                              style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.textPrimary }}>Secret Key</Label>
                            <Input
                              type="password"
                              value={paymentSettings.gateways.stripe.secretKey}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                gateways: {
                                  ...paymentSettings.gateways,
                                  stripe: {
                                    ...paymentSettings.gateways.stripe,
                                    secretKey: e.target.value
                                  }
                                }
                              })}
                              className="mt-1"
                              style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* PayPal */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 style={{ color: colors.textPrimary }}>PayPal</h4>
                        <Switch
                          checked={paymentSettings.gateways.paypal.enabled}
                          onCheckedChange={(checked) => setPaymentSettings({
                            ...paymentSettings,
                            gateways: {
                              ...paymentSettings.gateways,
                              paypal: {
                                ...paymentSettings.gateways.paypal,
                                enabled: checked
                              }
                            }
                          })}
                        />
                      </div>
                      {paymentSettings.gateways.paypal.enabled && (
                        <div className="grid md:grid-cols-2 gap-4 ml-4">
                          <div>
                            <Label style={{ color: colors.textPrimary }}>Client ID</Label>
                            <Input
                              type="password"
                              value={paymentSettings.gateways.paypal.clientId}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                gateways: {
                                  ...paymentSettings.gateways,
                                  paypal: {
                                    ...paymentSettings.gateways.paypal,
                                    clientId: e.target.value
                                  }
                                }
                              })}
                              className="mt-1"
                              style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                            />
                          </div>
                          <div>
                            <Label style={{ color: colors.textPrimary }}>Client Secret</Label>
                            <Input
                              type="password"
                              value={paymentSettings.gateways.paypal.clientSecret}
                              onChange={(e) => setPaymentSettings({
                                ...paymentSettings,
                                gateways: {
                                  ...paymentSettings.gateways,
                                  paypal: {
                                    ...paymentSettings.gateways.paypal,
                                    clientSecret: e.target.value
                                  }
                                }
                              })}
                              className="mt-1"
                              style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payout Settings */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <Landmark className="inline mr-2 h-5 w-5" />
                      Payout Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label style={{ color: colors.textPrimary }}>Payout Frequency</Label>
                        <Select value={paymentSettings.autoPayouts.frequency} onValueChange={(value) => setPaymentSettings({
                          ...paymentSettings,
                          autoPayouts: {
                            ...paymentSettings.autoPayouts,
                            frequency: value
                          }
                        })}>
                          <SelectTrigger className="mt-1" style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label style={{ color: colors.textPrimary }}>Minimum Payout Amount</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={paymentSettings.autoPayouts.minimumAmount}
                          onChange={(e) => setPaymentSettings({
                            ...paymentSettings,
                            autoPayouts: {
                              ...paymentSettings.autoPayouts,
                              minimumAmount: parseFloat(e.target.value)
                            }
                          })}
                          className="mt-1"
                          style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={paymentSettings.autoPayouts.enabled}
                        onCheckedChange={(checked) => setPaymentSettings({
                          ...paymentSettings,
                          autoPayouts: {
                            ...paymentSettings.autoPayouts,
                            enabled: checked
                          }
                        })}
                      />
                      <Label style={{ color: colors.textPrimary }}>Enable automatic payouts</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Currency Settings */}
                <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                  <CardHeader>
                    <CardTitle style={{ color: colors.primary }}>
                      <DollarSign className="inline mr-2 h-5 w-5" />
                      Currency Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label style={{ color: colors.textPrimary }}>Default Currency</Label>
                      <Select value={paymentSettings.defaultCurrency} onValueChange={(value) => setPaymentSettings({
                        ...paymentSettings,
                        defaultCurrency: value
                      })}>
                        <SelectTrigger className="mt-1" style={{ backgroundColor: isNSFW ? 'rgba(0, 0, 0, 0.3)' : 'white', borderColor: colors.cardBorder }}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentSettings.currencies.map(currency => (
                            <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={updatePaymentSettings} className="w-full" style={{ backgroundColor: colors.primary }}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Payment Settings
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="mt-6">
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>
                    <Link className="inline mr-2 h-5 w-5" />
                    Platform Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformIntegrations.map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: colors.cardBorder }}>
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${integration.status === 'connected' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                          <div>
                            <p className="font-medium" style={{ color: colors.textPrimary }}>{integration.name}</p>
                            <p className="text-sm" style={{ color: colors.textLight }}>{integration.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-sm" style={{ color: colors.textLight }}>Last sync: {integration.lastSync}</p>
                          <Button size="sm" variant={integration.status === 'connected' ? 'outline' : 'default'}>
                            {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Button size="lg" className="w-full" style={{ backgroundColor: colors.primary }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Integration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}