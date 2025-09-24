'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText, ResponsiveButton, ResponsiveCard } from "@/components/ui/responsive"
import { useIntegration } from "@/contexts/integration-context"
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Calendar, 
  Clock, 
  BarChart3, 
  PieChart,
  LineChart,
  Plus,
  Play,
  Pause,
  Stop,
  Edit,
  Trash2,
  Eye,
  Share2,
  Download,
  Filter,
  Search,
  Mail,
  MessageSquare,
  Bell,
  Gift,
  Star,
  Award,
  Zap,
  Rocket,
  Megaphone,
  Link,
  Copy,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Settings,
  Network,
  UserPlus,
  Activity,
  Building2
} from "lucide-react"

interface Campaign {
  id: string
  name: string
  type: 'email' | 'social' | 'influencer' | 'paid' | 'referral'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled'
  budget: number
  spent: number
  targetAudience: string
  startDate: string
  endDate?: string
  description: string
  metrics: {
    impressions: number
    clicks: number
    conversions: number
    ctr: number
    cpc: number
    roas: number
  }
  platforms: string[]
  tags: string[]
  affiliateEnabled?: boolean
  affiliateCode?: string
  affiliateConversions?: number
  affiliateEarnings?: number
}

interface MarketingTemplate {
  id: string
  name: string
  type: 'email' | 'social' | 'ad' | 'landing_page'
  category: string
  description: string
  preview: string
  isPremium: boolean
  usageCount: number
  rating: number
  affiliateCompatible?: boolean
}

interface AnalyticsData {
  overview: {
    totalCampaigns: number
    activeCampaigns: number
    totalBudget: number
    totalSpent: number
    totalImpressions: number
    totalClicks: number
    totalConversions: number
    avgCTR: number
    avgROAS: number
    affiliateEnabledCampaigns: number
    affiliateConversions: number
    affiliateEarnings: number
  }
  campaigns: {
    topPerforming: Campaign[]
    recentActivity: Campaign[]
  }
  audience: {
    demographics: any[]
    engagement: any[]
  }
  revenue: {
    byCampaign: any[]
    byPlatform: any[]
    bySource: any[]
  }
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer AI Art Campaign',
    type: 'social',
    status: 'active',
    budget: 5000,
    spent: 2350,
    targetAudience: 'Digital artists, AI enthusiasts',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    description: 'Promote AI art creation tools and features during summer season',
    metrics: {
      impressions: 125000,
      clicks: 3750,
      conversions: 187,
      ctr: 3.0,
      cpc: 0.63,
      roas: 4.2
    },
    platforms: ['Instagram', 'TikTok', 'Twitter'],
    tags: ['AI', 'Art', 'Summer', 'Promotion'],
    affiliateEnabled: true,
    affiliateCode: 'SUMMER2024',
    affiliateConversions: 23,
    affiliateEarnings: 345
  },
  {
    id: '2',
    name: 'Influencer Partnership Program',
    type: 'influencer',
    status: 'active',
    budget: 10000,
    spent: 6200,
    targetAudience: 'Content creators, social media influencers',
    startDate: '2024-05-15',
    description: 'Partner with influencers to promote EDN AI platform',
    metrics: {
      impressions: 890000,
      clicks: 26700,
      conversions: 1335,
      ctr: 3.0,
      cpc: 0.23,
      roas: 5.8
    },
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    tags: ['Influencer', 'Partnership', 'Growth'],
    affiliateEnabled: true,
    affiliateCode: 'INFLUENCE2024',
    affiliateConversions: 67,
    affiliateEarnings: 1005
  },
  {
    id: '3',
    name: 'Email Newsletter Campaign',
    type: 'email',
    status: 'completed',
    budget: 2000,
    spent: 1850,
    targetAudience: 'Existing users, newsletter subscribers',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    description: 'Monthly newsletter with product updates and tips',
    metrics: {
      impressions: 45000,
      clicks: 6750,
      conversions: 337,
      ctr: 15.0,
      cpc: 0.27,
      roas: 6.5
    },
    platforms: ['Email'],
    tags: ['Newsletter', 'Retention', 'Updates'],
    affiliateEnabled: false
  }
]

const mockTemplates: MarketingTemplate[] = [
  {
    id: '1',
    name: 'AI Art Showcase Template',
    type: 'social',
    category: 'Art & Design',
    description: 'Beautiful template for showcasing AI-generated artwork',
    preview: '/templates/ai-art-showcase.jpg',
    isPremium: false,
    usageCount: 1250,
    rating: 4.8,
    affiliateCompatible: true
  },
  {
    id: '2',
    name: 'Product Launch Email',
    type: 'email',
    category: 'Product',
    description: 'Professional email template for new product announcements',
    preview: '/templates/product-launch.jpg',
    isPremium: true,
    usageCount: 890,
    rating: 4.6,
    affiliateCompatible: true
  },
  {
    id: '3',
    name: 'Influencer Collaboration Kit',
    type: 'ad',
    category: 'Influencer',
    description: 'Complete kit for influencer marketing campaigns',
    preview: '/templates/influencer-kit.jpg',
    isPremium: true,
    usageCount: 567,
    rating: 4.9,
    affiliateCompatible: true
  }
]

const mockAnalytics: AnalyticsData = {
  overview: {
    totalCampaigns: 15,
    activeCampaigns: 8,
    totalBudget: 45000,
    totalSpent: 28500,
    totalImpressions: 2150000,
    totalClicks: 64500,
    totalConversions: 3225,
    avgCTR: 3.0,
    avgROAS: 4.8,
    affiliateEnabledCampaigns: 6,
    affiliateConversions: 890,
    affiliateEarnings: 13350
  },
  campaigns: {
    topPerforming: mockCampaigns.slice(0, 3),
    recentActivity: mockCampaigns
  },
  audience: {
    demographics: [
      { range: '18-24', percentage: 25 },
      { range: '25-34', percentage: 40 },
      { range: '35-44', percentage: 20 },
      { range: '45-54', percentage: 10 },
      { range: '55+', percentage: 5 }
    ],
    engagement: [
      { platform: 'Instagram', rate: 4.2 },
      { platform: 'TikTok', rate: 3.8 },
      { platform: 'Twitter', rate: 2.1 },
      { platform: 'YouTube', rate: 3.5 },
      { platform: 'Email', rate: 5.2 }
    ]
  },
  revenue: {
    byCampaign: [
      { name: 'Influencer Partnership', revenue: 35940, spent: 6200 },
      { name: 'Summer AI Art', revenue: 9870, spent: 2350 },
      { name: 'Email Newsletter', revenue: 12025, spent: 1850 }
    ],
    byPlatform: [
      { platform: 'Instagram', revenue: 28500, spent: 12000 },
      { platform: 'TikTok', revenue: 19500, spent: 8500 },
      { platform: 'YouTube', revenue: 12300, spent: 4500 },
      { platform: 'Twitter', revenue: 8900, spent: 2500 },
      { platform: 'Email', revenue: 15600, spent: 3500 }
    ],
    bySource: [
      { source: 'Direct Campaigns', revenue: 98500, spent: 28500 },
      { source: 'Affiliate Referrals', revenue: 13350, spent: 0 },
      { source: 'Social Posts', revenue: 8900, spent: 1200 }
    ]
  }
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [templates, setTemplates] = useState<MarketingTemplate[]>(mockTemplates)
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)
  const [showAffiliateDialog, setShowAffiliateDialog] = useState<string | null>(null)
  const [affiliateCode, setAffiliateCode] = useState('')
  const [customLandingPage, setCustomLandingPage] = useState('')
  
  const { 
    state: integrationState, 
    createCampaignAffiliateLink,
    generateAffiliateLinkForCampaign,
    updateIntegrationSettings 
  } = useIntegration()

  const handleCampaignAction = (campaignId: string, action: 'start' | 'pause' | 'stop') => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        let newStatus: Campaign['status'] = campaign.status
        switch (action) {
          case 'start':
            newStatus = 'active'
            break
          case 'pause':
            newStatus = 'paused'
            break
          case 'stop':
            newStatus = 'cancelled'
            break
        }
        return { ...campaign, status: newStatus }
      }
      return campaign
    }))
  }

  const handleEnableAffiliate = async (campaignId: string) => {
    try {
      const code = affiliateCode || `CAMP${campaignId.slice(-6).toUpperCase()}`
      await createCampaignAffiliateLink(campaignId, code, customLandingPage)
      
      setCampaigns(prev => prev.map(campaign => 
        campaign.id === campaignId 
          ? { 
              ...campaign, 
              affiliateEnabled: true, 
              affiliateCode: code,
              affiliateConversions: 0,
              affiliateEarnings: 0
            }
          : campaign
      ))
      
      setShowAffiliateDialog(null)
      setAffiliateCode('')
      setCustomLandingPage('')
    } catch (error) {
      console.error('Failed to enable affiliate:', error)
    }
  }

  const handleDisableAffiliate = async (campaignId: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { 
            ...campaign, 
            affiliateEnabled: false, 
            affiliateCode: undefined,
            affiliateConversions: undefined,
            affiliateEarnings: undefined
          }
        : campaign
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'completed': return 'bg-blue-500'
      case 'cancelled': return 'bg-red-500'
      case 'draft': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail
      case 'social': return MessageSquare
      case 'influencer': return Star
      case 'paid': return DollarSign
      case 'referral': return Gift
      default: return Target
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <Megaphone className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
            Marketing Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Create, manage, and optimize your marketing campaigns with advanced analytics and automation
          </p>
        </div>

        {/* Quick Stats */}
        <ResponsiveGrid cols={2} mdCols={4} gap={4}>
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold text-green-500">{analytics.overview.activeCampaigns}</p>
              </div>
              <Rocket className="h-8 w-8 text-green-500" />
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-blue-500">{formatCurrency(analytics.overview.totalBudget)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg ROAS</p>
                <p className="text-2xl font-bold text-purple-500">{analytics.overview.avgROAS}x</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </ResponsiveCard>
          
          <ResponsiveCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Affiliate Revenue</p>
                <p className="text-2xl font-bold text-orange-500">{formatCurrency(analytics.overview.affiliateEarnings)}</p>
              </div>
              <Gift className="h-8 w-8 text-orange-500" />
            </div>
          </ResponsiveCard>
        </ResponsiveGrid>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Campaign
              </Button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search campaigns..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="space-y-4">
              {campaigns.map((campaign) => {
                const TypeIcon = getTypeIcon(campaign.type)
                const progress = (campaign.spent / campaign.budget) * 100
                
                return (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-6 w-6 text-blue-500" />
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {campaign.name}
                              {campaign.affiliateEnabled && (
                                <Badge className="bg-purple-500">
                                  <Gift className="h-3 w-3 mr-1" />
                                  Affiliate
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{campaign.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.type}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Budget Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Usage</span>
                          <span>{formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progress.toFixed(1)}% used</span>
                          <span>{formatCurrency(campaign.budget - campaign.spent)} remaining</span>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Impressions</p>
                          <p className="font-semibold">{formatNumber(campaign.metrics.impressions)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Clicks</p>
                          <p className="font-semibold">{formatNumber(campaign.metrics.clicks)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">CTR</p>
                          <p className="font-semibold">{campaign.metrics.ctr}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ROAS</p>
                          <p className="font-semibold">{campaign.metrics.roas}x</p>
                        </div>
                      </div>

                      {/* Affiliate Metrics */}
                      {campaign.affiliateEnabled && (
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-purple-600 flex items-center gap-2">
                              <Gift className="h-4 w-4" />
                              Affiliate Performance
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-purple-600">
                                Code: {campaign.affiliateCode}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(generateAffiliateLinkForCampaign(campaign.id))}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy Link
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Conversions</p>
                              <p className="font-semibold text-purple-600">{campaign.affiliateConversions}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Revenue</p>
                              <p className="font-semibold text-green-600">{formatCurrency(campaign.affiliateEarnings || 0)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Conversion Rate</p>
                              <p className="font-semibold text-blue-600">
                                {((campaign.affiliateConversions || 0) / campaign.metrics.clicks * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Campaign Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Start: {new Date(campaign.startDate).toLocaleDateString()}</span>
                          </div>
                          {campaign.endDate && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>End: {new Date(campaign.endDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span>{campaign.targetAudience}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {campaign.affiliateEnabled ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDisableAffiliate(campaign.id)}
                            >
                              <Gift className="h-4 w-4 mr-1" />
                              Disable Affiliate
                            </Button>
                          ) : (
                            <Dialog open={showAffiliateDialog === campaign.id} onOpenChange={(open) => setShowAffiliateDialog(open ? campaign.id : null)}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Gift className="h-4 w-4 mr-1" />
                                  Enable Affiliate
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Enable Affiliate Tracking</DialogTitle>
                                  <DialogDescription>
                                    Set up affiliate tracking for this campaign to earn commissions from referrals.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="text-sm font-medium">Affiliate Code</label>
                                    <Input
                                      placeholder="Enter custom code or leave blank for auto-generated"
                                      value={affiliateCode}
                                      onChange={(e) => setAffiliateCode(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Custom Landing Page (optional)</label>
                                    <Input
                                      placeholder="/custom-landing-page"
                                      value={customLandingPage}
                                      onChange={(e) => setCustomLandingPage(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setShowAffiliateDialog(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={() => handleEnableAffiliate(campaign.id)}>
                                      Enable Affiliate
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {campaign.status === 'draft' && (
                            <Button size="sm" onClick={() => handleCampaignAction(campaign.id, 'start')}>
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {campaign.status === 'active' && (
                            <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'pause')}>
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                          )}
                          {campaign.status === 'paused' && (
                            <>
                              <Button size="sm" onClick={() => handleCampaignAction(campaign.id, 'start')}>
                                <Play className="h-4 w-4 mr-1" />
                                Resume
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, 'stop')}>
                                <Stop className="h-4 w-4 mr-1" />
                                Stop
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Campaign Analytics</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalSpent)}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.overview.avgROAS}x ROAS
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Affiliate Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(analytics.overview.affiliateEarnings)}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.overview.affiliateConversions} conversions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.activeCampaigns}</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.overview.affiliateEnabledCampaigns} with affiliate
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.overview.avgCTR}%</div>
                  <p className="text-xs text-muted-foreground">
                    Average click-through rate
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.revenue.bySource.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            source.source === 'Direct Campaigns' ? 'bg-blue-500' :
                            source.source === 'Affiliate Referrals' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`} />
                          <span className="text-sm font-medium">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(source.revenue)}</div>
                          <div className="text-xs text-muted-foreground">
                            {source.spent > 0 ? `${((source.revenue - source.spent) / source.spent * 100).toFixed(1)}% ROI` : '100% ROI'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.campaigns.topPerforming.map((campaign, index) => (
                      <div key={campaign.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">{campaign.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(campaign.metrics.roas * campaign.spent)}</div>
                          <div className="text-xs text-muted-foreground">{campaign.metrics.roas}x ROAS</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Marketing Templates</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {template.name}
                          {template.affiliateCompatible && (
                            <Badge className="bg-purple-500">
                              <Gift className="h-3 w-3 mr-1" />
                              Affiliate
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                      {template.isPremium && (
                        <Badge className="bg-yellow-500">Premium</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <Badge variant="outline">{template.type}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usage</span>
                      <span>{formatNumber(template.usageCount)} uses</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{template.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <h2 className="text-2xl font-bold">Cross-Platform Integration</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-blue-500" />
                    Marketing-Affiliate
                  </CardTitle>
                  <CardDescription>
                    Connect your marketing campaigns with affiliate tracking
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {integrationState.campaignAffiliateLinks.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Connected Campaigns</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {formatCurrency(integrationState.unifiedAnalytics.totalEarnings)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Affiliate Revenue</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    Manage Connections
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    Social-Affiliate
                  </CardTitle>
                  <CardDescription>
                    Share affiliate links through social media posts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {integrationState.socialAffiliatePosts.length}
                    </div>
                    <p className="text-sm text-muted-foreground">Social Posts with Links</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {integrationState.socialAffiliatePosts.reduce((acc, post) => acc + post.conversions, 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">Social Conversions</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Social Posts
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    Unified Analytics
                  </CardTitle>
                  <CardDescription>
                    Track performance across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {integrationState.unifiedAnalytics.totalReferrals}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {integrationState.unifiedAnalytics.affiliateEnabledCampaigns + integrationState.unifiedAnalytics.affiliateEnabledPosts}
                    </div>
                    <p className="text-sm text-muted-foreground">Active Integrations</p>
                  </div>
                  <Button className="w-full" variant="outline">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Configure how your marketing tools integrate with affiliate and social features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Automation Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Auto-generate Affiliate Links</div>
                          <div className="text-sm text-muted-foreground">
                            Automatically create affiliate links for new campaigns
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={integrationState.settings.autoGenerateAffiliateLinks}
                          onChange={(e) => updateIntegrationSettings({ autoGenerateAffiliateLinks: e.target.checked })}
                          className="h-4 w-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Track Social Engagement</div>
                          <div className="text-sm text-muted-foreground">
                            Monitor social media performance for affiliate links
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={integrationState.settings.trackSocialEngagement}
                          onChange={(e) => updateIntegrationSettings({ trackSocialEngagement: e.target.checked })}
                          className="h-4 w-4"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Cross-Platform Analytics</div>
                          <div className="text-sm text-muted-foreground">
                            Combine data from all marketing channels
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={integrationState.settings.enableCrossPlatformAnalytics}
                          onChange={(e) => updateIntegrationSettings({ enableCrossPlatformAnalytics: e.target.checked })}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Affiliate Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Default Commission Rate</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="5"
                            max="50"
                            value={integrationState.settings.defaultCommissionRate}
                            onChange={(e) => updateIntegrationSettings({ defaultCommissionRate: parseInt(e.target.value) })}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12">{integrationState.settings.defaultCommissionRate}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Custom Tracking Parameters</label>
                        <Input
                          placeholder="utm_source=marketing&utm_campaign=summer"
                          value={Object.entries(integrationState.settings.customTrackingParameters)
                            .map(([key, value]) => `${key}=${value}`)
                            .join('&')}
                          onChange={(e) => {
                            const params = Object.fromEntries(
                              e.target.value.split('&').map(param => param.split('='))
                            )
                            updateIntegrationSettings({ customTrackingParameters: params })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <h2 className="text-2xl font-bold">Marketing Automation</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automated Campaigns</CardTitle>
                  <CardDescription>
                    Set up automated marketing campaigns that run on triggers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Welcome Series</div>
                        <div className="text-sm text-muted-foreground">
                          Trigger: User signup
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Abandoned Cart</div>
                        <div className="text-sm text-muted-foreground">
                          Trigger: Cart abandoned
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Re-engagement</div>
                        <div className="text-sm text-muted-foreground">
                          Trigger: User inactive 30 days
                        </div>
                      </div>
                      <Badge className="bg-yellow-500">Paused</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Automation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trigger Rules</CardTitle>
                  <CardDescription>
                    Configure triggers and actions for automated campaigns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">User Signup</div>
                        <div className="text-sm text-muted-foreground">
                          Action: Send welcome email
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Purchase Complete</div>
                        <div className="text-sm text-muted-foreground">
                          Action: Send thank you email
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Affiliate Conversion</div>
                        <div className="text-sm text-muted-foreground">
                          Action: Notify affiliate & update stats
                        </div>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Rules
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  )
}