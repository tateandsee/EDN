'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
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
  UserPlus
} from 'lucide-react'

export default function AffiliatePage() {
  const { isNSFW } = useNSFW()
  const { user, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  
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
      icon: BarChart3
    },
    {
      type: 'Email Templates',
      description: 'Pre-written email templates for your campaigns',
      formats: ['Welcome', 'Promotional', 'Follow-up'],
      icon: CreditCard
    },
    {
      type: 'Social Media Posts',
      description: 'Ready-to-share social media content',
      formats: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn'],
      icon: Share2
    },
    {
      type: 'Video Content',
      description: 'Promotional videos and tutorials',
      formats: ['30s Spot', 'Demo Video', 'Tutorial'],
      icon: Target
    }
  ]

  const recentReferrals = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Pro',
      commission: 10,
      date: '2024-01-15',
      status: 'Active'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      plan: 'Elite',
      commission: 20,
      date: '2024-01-12',
      status: 'Active'
    },
    {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      plan: 'Basic',
      commission: 2,
      date: '2024-01-10',
      status: 'Active'
    }
  ]

  const payoutHistory = [
    {
      amount: 1200,
      date: '2024-01-01',
      method: 'PayPal',
      status: 'Completed'
    },
    {
      amount: 850,
      date: '2023-12-15',
      method: 'Bank Transfer',
      status: 'Completed'
    },
    {
      amount: 500,
      date: '2023-12-01',
      method: 'PayPal',
      status: 'Completed'
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
                <div
                  key={tier.name}
                >
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="referral">Referral Link</TabsTrigger>
              <TabsTrigger value="materials">Marketing Materials</TabsTrigger>
              <TabsTrigger value="referrals">Recent Referrals</TabsTrigger>
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
                        <Button className="flex items-center gap-2" style={{ backgroundColor: scheme.primary }}>
                          <Share2 className="h-4 w-4" />
                          Share on Social Media
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Generate Custom Link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="materials">
              <div>
                <div className="grid md:grid-cols-2 gap-6">
                  {marketingMaterials.map((material, index) => (
                    <div
                      key={material.type}
                    >
                      <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20 h-full`}>
                        <CardHeader>
                          <material.icon className="h-8 w-8 text-purple-400 mb-2" />
                          <CardTitle className={scheme.text}>{material.type}</CardTitle>
                          <CardDescription className={scheme.textSecondary}>
                            {material.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className={`text-sm ${scheme.textSecondary}`}>Available Formats</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {material.formats.map((format, i) => (
                                  <Badge key={format} variant="outline">
                                    {format}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button className="w-full" style={{ backgroundColor: scheme.primary }}>
                              Download Materials
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="referrals">
              <div>
                <Card className={`${scheme.cardBg} backdrop-blur-sm border border-white/20`}>
                  <CardHeader>
                    <CardTitle className={scheme.text}>Recent Referrals</CardTitle>
                    <CardDescription className={scheme.textSecondary}>
                      Track your referral activity and earnings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReferrals.map((referral, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                          <div>
                            <p className={`font-semibold ${scheme.text}`}>{referral.name}</p>
                            <p className={`text-sm ${scheme.textSecondary}`}>{referral.email}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${scheme.text}`}>{referral.plan}</p>
                            <p className={`text-sm ${scheme.textSecondary}`}>${referral.commission} commission</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{referral.status}</Badge>
                            <p className={`text-sm ${scheme.textSecondary}`}>{referral.date}</p>
                          </div>
                        </div>
                      ))}
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
                      View your earnings and payout history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {payoutHistory.map((payout, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                          <div>
                            <p className={`font-semibold ${scheme.text}`}>${payout.amount}</p>
                            <p className={`text-sm ${scheme.textSecondary}`}>{payout.method}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={payout.status === 'Completed' ? 'default' : 'secondary'}>
                              {payout.status}
                            </Badge>
                            <p className={`text-sm ${scheme.textSecondary}`}>{payout.date}</p>
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