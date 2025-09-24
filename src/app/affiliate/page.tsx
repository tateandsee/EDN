'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { useIntegration } from '@/contexts/integration-context'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Gift, 
  Star, 
  Share2, 
  Copy, 
  BarChart3, 
  Target,
  Award,
  Zap,
  Crown,
  Rocket,
  CreditCard,
  Calendar,
  Link,
  LogIn,
  UserPlus,
  Megaphone,
  MessageSquare,
  Network,
  ExternalLink,
  Filter,
  Search,
  Plus,
  Settings,
  Activity,
  Building2,
  Eye,
  Click,
  ShoppingCart,
  Users2,
  TrendingUpIcon,
  PieChart as PieChartIcon,
  Download
} from 'lucide-react'

export default function AffiliatePage() {
  const { isNSFW } = useNSFW()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const { state: integrationState } = useIntegration()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Show loading state while checking auth
  if (!mounted || loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${isNSFW ? 'from-pink-900 via-purple-900 to-black' : 'from-orange-100 via-cyan-100 to-yellow-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className={isNSFW ? 'text-white' : 'text-gray-800'}>Loading...</p>
        </div>
      </div>
    )
  }
  
  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${isNSFW ? 'from-pink-900 via-purple-900 to-black' : 'from-orange-100 via-cyan-100 to-yellow-100'} relative overflow-hidden`}>
        {/* Hero Section */}
        <div className="relative h-80 overflow-hidden pt-16">
          <img 
            src={isNSFW ? "/hero-affiliate-nsfw.jpg" : "/hero-affiliate-sfw.jpg"} 
            alt="Affiliate Program" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-6">
              <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text affiliate ${isNSFW ? 'nsfw' : 'sfw'}`}>
                {isNSFW ? 'Seductive Earnings with EDN' : 'Partner with EDN & Earn Big'}
              </h1>
              <p className="text-xl md:text-2xl drop-shadow-md">
                Join our affiliate program and earn up to 30% commission on every referral
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className={`${isNSFW ? 'bg-black/40' : 'bg-white/80'} backdrop-blur-sm border border-white/20`}>
              <CardHeader className="text-center">
                <CardTitle className={isNSFW ? 'text-white' : 'text-gray-800'}>
                  <UserPlus className="inline mr-2 h-8 w-8" />
                  Login to See Your Unique Affiliate Information
                </CardTitle>
                <CardDescription className={isNSFW ? 'text-gray-300' : 'text-gray-600'}>
                  Access your personalized referral link, track your earnings, and manage your affiliate account
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Link className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: isNSFW ? '#FF1493' : '#FF6B35' }}>Unique Referral Link</h3>
                    <p className="text-sm" style={{ color: isNSFW ? '#E0E0E0' : '#4A5568' }}>
                      Get your personalized referral link to start earning commissions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: isNSFW ? '#00FFFF' : '#4ECDC4' }}>Track Performance</h3>
                    <p className="text-sm" style={{ color: isNSFW ? '#E0E0E0' : '#4A5568' }}>
                      Monitor your referrals, earnings, and conversion rates in real-time
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: isNSFW ? '#FFD700' : '#FFE66D' }}>Get Paid</h3>
                    <p className="text-sm" style={{ color: isNSFW ? '#E0E0E0' : '#4A5568' }}>
                      Receive commissions through multiple payout methods
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto"
                    style={{ backgroundColor: isNSFW ? '#FF1493' : '#FF6B35' }}
                    onClick={() => window.location.href = '/auth/signin'}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In to Your Account
                  </Button>
                  <p className="text-sm" style={{ color: isNSFW ? '#B0B0B0' : '#718096' }}>
                    Don't have an account?{' '}
                    <button 
                      onClick={() => window.location.href = '/auth/signin'}
                      className="font-semibold hover:underline"
                      style={{ color: isNSFW ? '#00FFFF' : '#4ECDC4' }}
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
  
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

  const commissionTiers = [
    {
      name: 'Bronze Affiliate',
      referrals: 0,
      commission: 10,
      bonus: 0,
      icon: Star
    },
    {
      name: 'Silver Affiliate',
      referrals: 10,
      commission: 15,
      bonus: 50,
      icon: Award
    },
    {
      name: 'Gold Affiliate',
      referrals: 25,
      commission: 20,
      bonus: 150,
      icon: Crown
    },
    {
      name: 'Platinum Affiliate',
      referrals: 50,
      commission: 25,
      bonus: 300,
      icon: Rocket
    },
    {
      name: 'Diamond Affiliate',
      referrals: 100,
      commission: 30,
      bonus: 500,
      icon: Zap
    }
  ]

  const affiliateStats = {
    totalReferrals: 15,
    activeReferrals: 12,
    totalEarnings: 2850,
    pendingEarnings: 450,
    conversionRate: 68,
    currentTier: 2
  }

  const marketingMaterials = [
    {
      type: 'Banner Ads',
      description: 'High-converting banner ads in various sizes',
      formats: ['728x90', '300x250', '160x600'],
      icon: BarChart3,
      downloads: 1250
    },
    {
      type: 'Email Templates',
      description: 'Pre-written email templates for your campaigns',
      formats: ['Welcome', 'Promotional', 'Follow-up'],
      icon: CreditCard,
      downloads: 890
    },
    {
      type: 'Social Media Posts',
      description: 'Ready-to-share social media content',
      formats: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn'],
      icon: Share2,
      downloads: 567
    },
    {
      type: 'Video Content',
      description: 'Promotional videos and tutorials',
      formats: ['30s Spot', 'Demo Video', 'Tutorial'],
      icon: Target,
      downloads: 234
    }
  ]

  const recentReferrals = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Pro',
      commission: 10,
      date: '2024-01-15',
      status: 'Active',
      source: 'marketing_campaign',
      campaignName: 'Summer AI Art Campaign'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      plan: 'Elite',
      commission: 20,
      date: '2024-01-12',
      status: 'Active',
      source: 'social_post',
      postContent: 'Excited to share my latest project...'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      plan: 'Basic',
      commission: 2,
      date: '2024-01-10',
      status: 'Active',
      source: 'direct_link'
    }
  ]

  const payoutHistory = [
    {
      id: '1',
      amount: 1200,
      date: '2024-01-01',
      method: 'PayPal',
      status: 'Completed',
      period: 'December 2023'
    },
    {
      id: '2',
      amount: 850,
      date: '2023-12-15',
      method: 'Bank Transfer',
      status: 'Completed',
      period: 'November 2023'
    },
    {
      id: '3',
      amount: 500,
      date: '2023-12-01',
      method: 'PayPal',
      status: 'Completed',
      period: 'October 2023'
    }
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scheme.bg} relative overflow-hidden`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden pt-16">
        <img 
          src={isNSFW ? "/hero-affiliate-nsfw.jpg" : "/hero-affiliate-sfw.jpg"} 
          alt="Affiliate Program" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg kinetic-text affiliate ${isNSFW ? 'nsfw' : 'sfw'}`}>
              {isNSFW ? 'Seductive Earnings with EDN' : 'Partner with EDN & Earn Big'}
            </h1>
            <p className="text-xl md:text-2xl drop-shadow-md">
              Join our affiliate program and earn up to 30% commission on every referral
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Affiliate Stats */}
          <div className="mb-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Users, label: 'Total Referrals', value: affiliateStats.totalReferrals, color: 'text-blue-400' },
                { icon: DollarSign, label: 'Total Earnings', value: `$${affiliateStats.totalEarnings}`, color: 'text-green-400' },
                { icon: TrendingUp, label: 'Conversion Rate', value: `${affiliateStats.conversionRate}%`, color: 'text-purple-400' },
                { icon: Gift, label: 'Current Tier', value: commissionTiers[affiliateStats.currentTier].name, color: 'text-yellow-400' }
              ].map((stat, index) => (
                <div key={stat.label}>
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
                </div>
              ))}
            </div>
          </div>

          {/* Commission Tiers */}
          <div className="mb-12">
            <h2 className={`text-3xl font-bold mb-6 ${scheme.text}`}>Commission Tiers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {commissionTiers.map((tier, index) => (
                <div key={tier.name}>
                  <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full ${index === affiliateStats.currentTier ? 'ring-2 ring-yellow-400' : ''}`}>
                    <CardHeader className="text-center">
                      <tier.icon className={`h-8 w-8 mx-auto mb-2 ${index === affiliateStats.currentTier ? 'text-yellow-400' : 'text-gray-400'}`} />
                      <CardTitle className={`text-lg ${scheme.text}`}>{tier.name}</CardTitle>
                      <CardDescription className={scheme.textSecondary}>
                        {tier.referrals}+ referrals
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2">
                        <div>
                          <p className={`text-sm ${scheme.textSecondary}`}>Commission</p>
                          <p className={`text-2xl font-bold ${scheme.text}`}>{tier.commission}%</p>
                        </div>
                        {tier.bonus > 0 && (
                          <div>
                            <p className={`text-sm ${scheme.textSecondary}`}>Bonus</p>
                            <p className={`text-lg font-semibold ${scheme.text}`}>${tier.bonus}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="referral" className="mb-12">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="referral">Referral Link</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="materials">Marketing Materials</TabsTrigger>
              <TabsTrigger value="referrals">Recent Referrals</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payouts">Payout History</TabsTrigger>
            </TabsList>

            <TabsContent value="referral">
              <div>
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Your Referral Link</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Share this link to earn commissions on every signup
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value="https://edn.com/ref/YOURCODE123"
                          readOnly
                          className="flex-1 px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white"
                        />
                        <Button
                          onClick={() => copyToClipboard('https://edn.com/ref/YOURCODE123')}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className={`text-sm font-medium ${scheme.text}`}>Custom Code (Optional)</label>
                          <input
                            type="text"
                            placeholder="Enter custom code"
                            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white mt-1"
                          />
                        </div>
                        <div>
                          <label className={`text-sm font-medium ${scheme.text}`}>Landing Page (Optional)</label>
                          <input
                            type="text"
                            placeholder="/custom-page"
                            className="w-full px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white mt-1"
                          />
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Generate Custom Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integration">
              <div className="space-y-6">
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Cross-Platform Integration</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Connect your affiliate account with marketing campaigns and social media
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className={`font-semibold ${scheme.text} flex items-center gap-2`}>
                          <Megaphone className="h-5 w-5" />
                          Marketing Campaigns
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Summer AI Art Campaign</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>Code: SUMMER2024</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${scheme.text}`}>23 conversions</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>$345 revenue</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Influencer Partnership</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>Code: INFLUENCE2024</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${scheme.text}`}>67 conversions</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>$1,005 revenue</div>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline">
                          View All Campaigns
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className={`font-semibold ${scheme.text} flex items-center gap-2`}>
                          <MessageSquare className="h-5 w-5" />
                          Social Media Posts
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Instagram Post</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>AI model demo</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${scheme.text}`}>89 clicks</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>12 conversions</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Twitter Thread</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>Voice synthesis project</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-semibold ${scheme.text}`}>156 clicks</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>18 conversions</div>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline">
                          View All Posts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Integration Settings</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Configure how your affiliate links work across platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className={`font-semibold ${scheme.text}`}>Tracking Settings</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Auto-tag Campaigns</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>
                                Automatically tag referrals from campaigns
                              </div>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Social Media Tracking</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>
                                Track clicks from social platforms
                              </div>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Cross-Device Tracking</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>
                                Track users across multiple devices
                              </div>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className={`font-semibold ${scheme.text}`}>Notification Settings</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>New Referral Alerts</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>
                                Get notified when someone signs up
                              </div>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Commission Earned</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>
                                Alert when you earn commissions
                              </div>
                            </div>
                            <input type="checkbox" defaultChecked className="h-4 w-4" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-medium ${scheme.text}`}>Campaign Performance</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>
                                Weekly performance summaries
                              </div>
                            </div>
                            <input type="checkbox" className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="materials">
              <div>
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Marketing Materials</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Access ready-to-use promotional content for your marketing campaigns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {marketingMaterials.map((material, index) => (
                        <div key={index} className="border border-white/20 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <material.icon className={`h-8 w-8 ${isNSFW ? 'text-purple-400' : 'text-blue-500'}`} />
                            <div>
                              <h4 className={`font-semibold ${scheme.text}`}>{material.type}</h4>
                              <p className={`text-sm ${scheme.textSecondary}`}>{material.description}</p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <p className={`text-sm ${scheme.textSecondary} mb-2`}>Available Formats:</p>
                            <div className="flex flex-wrap gap-2">
                              {material.formats.map((format, fmtIndex) => (
                                <Badge key={fmtIndex} variant="outline" className="text-xs">
                                  {format}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className={`text-sm ${scheme.textSecondary}`}>
                              {material.downloads} downloads
                            </div>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="referrals">
              <div>
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Recent Referrals</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Track your latest referrals and their status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReferrals.map((referral) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className={`font-medium ${scheme.text}`}>{referral.name}</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>{referral.email}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {referral.plan}
                                </Badge>
                                {referral.source === 'marketing_campaign' && (
                                  <Badge className="bg-blue-500 text-xs">
                                    <Megaphone className="h-3 w-3 mr-1" />
                                    Campaign
                                  </Badge>
                                )}
                                {referral.source === 'social_post' && (
                                  <Badge className="bg-green-500 text-xs">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Social
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${scheme.text}`}>${referral.commission}</div>
                            <div className={`text-sm ${scheme.textSecondary}`}>{referral.date}</div>
                            <Badge className={`text-xs ${referral.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                              {referral.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Performance Analytics</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Detailed analytics about your affiliate performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${scheme.text}`}>
                          {integrationState.unifiedAnalytics.totalReferrals}
                        </div>
                        <p className={`text-sm ${scheme.textSecondary}`}>Total Referrals</p>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-green-400`}>
                          ${integrationState.unifiedAnalytics.totalEarnings}
                        </div>
                        <p className={`text-sm ${scheme.textSecondary}`}>Total Earnings</p>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-blue-400`}>
                          {integrationState.unifiedAnalytics.affiliateEnabledCampaigns}
                        </div>
                        <p className={`text-sm ${scheme.textSecondary}`}>Campaigns Linked</p>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold text-purple-400`}>
                          {integrationState.unifiedAnalytics.affiliateEnabledPosts}
                        </div>
                        <p className={`text-sm ${scheme.textSecondary}`}>Social Posts</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className={`font-semibold ${scheme.text} mb-4`}>Top Campaigns</h4>
                        <div className="space-y-3">
                          {integrationState.unifiedAnalytics.topPerformingCampaigns.slice(0, 3).map((campaign, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                              <div>
                                <div className={`font-medium ${scheme.text}`}>{campaign.campaignName}</div>
                                <div className={`text-sm ${scheme.textSecondary}`}>{campaign.referrals} referrals</div>
                              </div>
                              <div className={`font-semibold ${scheme.text}`}>${campaign.earnings}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`font-semibold ${scheme.text} mb-4`}>Top Social Posts</h4>
                        <div className="space-y-3">
                          {integrationState.unifiedAnalytics.topPerformingPosts.slice(0, 3).map((post, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                              <div>
                                <div className={`font-medium ${scheme.text}`}>{post.platform} Post</div>
                                <div className={`text-sm ${scheme.textSecondary}`}>{post.referrals} referrals</div>
                              </div>
                              <div className={`font-semibold ${scheme.text}`}>${post.earnings}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="payouts">
              <div>
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Payout History</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Track your earnings and payout history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-white/20 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                        <div>
                          <div className={`font-semibold ${scheme.text}`}>Available for Payout</div>
                          <div className={`text-sm ${scheme.textSecondary}`}>Minimum payout: $50</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold text-green-400`}>${affiliateStats.pendingEarnings}</div>
                          <Button size="sm" className="mt-2">
                            Request Payout
                          </Button>
                        </div>
                      </div>
                      
                      {payoutHistory.map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between p-4 border border-white/20 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className={`font-medium ${scheme.text}`}>{payout.method}</div>
                              <div className={`text-sm ${scheme.textSecondary}`}>{payout.period}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${scheme.text}`}>${payout.amount}</div>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${payout.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                {payout.status}
                              </Badge>
                              <span className={`text-sm ${scheme.textSecondary}`}>{payout.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
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