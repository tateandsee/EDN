import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock affiliate data
const mockAffiliateStats = {
  totalReferrals: 15,
  activeReferrals: 12,
  totalEarnings: 2850,
  pendingEarnings: 450,
  conversionRate: 68,
  currentTier: 2
}

const mockCommissionTiers = [
  {
    name: 'Bronze Affiliate',
    referrals: 0,
    commission: 10,
    bonus: 0,
    icon: 'star'
  },
  {
    name: 'Silver Affiliate',
    referrals: 10,
    commission: 15,
    bonus: 50,
    icon: 'award'
  },
  {
    name: 'Gold Affiliate',
    referrals: 25,
    commission: 20,
    bonus: 150,
    icon: 'crown'
  },
  {
    name: 'Platinum Affiliate',
    referrals: 50,
    commission: 25,
    bonus: 300,
    icon: 'rocket'
  },
  {
    name: 'Diamond Affiliate',
    referrals: 100,
    commission: 30,
    bonus: 500,
    icon: 'zap'
  }
]

const mockReferrals = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    plan: 'Pro',
    commission: 10,
    date: '2024-01-15',
    status: 'Active',
    source: 'marketing_campaign',
    campaignId: '1'
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
    postId: '2'
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

const mockPayoutHistory = [
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

const mockMarketingMaterials = [
  {
    id: '1',
    type: 'Banner Ads',
    description: 'High-converting banner ads in various sizes',
    formats: ['728x90', '300x250', '160x600'],
    downloadUrl: '/materials/banners.zip',
    usageCount: 1250
  },
  {
    id: '2',
    type: 'Email Templates',
    description: 'Pre-written email templates for your campaigns',
    formats: ['Welcome', 'Promotional', 'Follow-up'],
    downloadUrl: '/materials/email-templates.zip',
    usageCount: 890
  },
  {
    id: '3',
    type: 'Social Media Posts',
    description: 'Ready-to-share social media content',
    formats: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn'],
    downloadUrl: '/materials/social-posts.zip',
    usageCount: 567
  },
  {
    id: '4',
    type: 'Video Content',
    description: 'Promotional videos and tutorials',
    formats: ['30s Spot', 'Demo Video', 'Tutorial'],
    downloadUrl: '/materials/videos.zip',
    usageCount: 234
  }
]

const mockCampaignIntegrations = [
  {
    id: '1',
    campaignId: '1',
    campaignName: 'Summer AI Art Campaign',
    affiliateTracking: true,
    referralCode: 'SUMMER2024',
    customLandingPage: '/summer-ai-art',
    conversionRate: 12.5,
    totalReferrals: 8,
    totalEarnings: 320
  },
  {
    id: '2',
    campaignId: '2',
    campaignName: 'Influencer Partnership Program',
    affiliateTracking: true,
    referralCode: 'INFLUENCE2024',
    customLandingPage: '/influencer-program',
    conversionRate: 18.2,
    totalReferrals: 15,
    totalEarnings: 750
  }
]

const mockSocialIntegrations = [
  {
    id: '1',
    postId: '1',
    platform: 'Instagram',
    content: 'Check out this amazing AI art platform!',
    affiliateLink: 'https://edn.com/ref/USER123',
    clicks: 245,
    conversions: 18,
    earnings: 180
  },
  {
    id: '2',
    postId: '2',
    platform: 'Twitter',
    content: 'Just discovered this incredible AI tool for creators!',
    affiliateLink: 'https://edn.com/ref/USER123',
    clicks: 189,
    conversions: 12,
    earnings: 120
  }
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    switch (type) {
      case 'stats':
        return NextResponse.json(mockAffiliateStats)

      case 'tiers':
        return NextResponse.json(mockCommissionTiers)

      case 'referrals':
        const referrals = mockReferrals.slice(offset, offset + limit)
        return NextResponse.json({
          referrals,
          total: mockReferrals.length,
          hasMore: offset + limit < mockReferrals.length
        })

      case 'payouts':
        const payouts = mockPayoutHistory.slice(offset, offset + limit)
        return NextResponse.json({
          payouts,
          total: mockPayoutHistory.length,
          hasMore: offset + limit < mockPayoutHistory.length
        })

      case 'materials':
        const materials = mockMarketingMaterials.slice(offset, offset + limit)
        return NextResponse.json({
          materials,
          total: mockMarketingMaterials.length,
          hasMore: offset + limit < mockMarketingMaterials.length
        })

      case 'campaign_integrations':
        return NextResponse.json(mockCampaignIntegrations)

      case 'social_integrations':
        return NextResponse.json(mockSocialIntegrations)

      case 'overview':
        return NextResponse.json({
          stats: mockAffiliateStats,
          currentTier: mockCommissionTiers[mockAffiliateStats.currentTier],
          recentReferrals: mockReferrals.slice(0, 5),
          recentPayouts: mockPayoutHistory.slice(0, 3),
          campaignPerformance: mockCampaignIntegrations,
          socialPerformance: mockSocialIntegrations
        })

      case 'performance':
        const period = searchParams.get('period') || '30d'
        // Mock performance data based on period
        const performanceData = {
          period,
          clicks: Math.floor(Math.random() * 1000) + 500,
          conversions: Math.floor(Math.random() * 100) + 20,
          earnings: Math.floor(Math.random() * 1000) + 200,
          conversionRate: Math.floor(Math.random() * 20) + 5,
          topSources: [
            { source: 'marketing_campaigns', clicks: 450, conversions: 45 },
            { source: 'social_posts', clicks: 320, conversions: 28 },
            { source: 'direct_links', clicks: 180, conversions: 12 }
          ]
        }
        return NextResponse.json(performanceData)

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

  } catch (error) {
    console.error('Affiliate GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'generate_referral_link':
        const { campaignId, customCode, landingPage } = data
        
        // Simulate referral link generation
        await new Promise(resolve => setTimeout(resolve, 500))

        const referralLink = {
          id: `ref_${Date.now()}`,
          code: customCode || `REF${Date.now().toString().slice(-6)}`,
          url: `https://edn.com/ref/${customCode || `REF${Date.now().toString().slice(-6)}`}`,
          campaignId: campaignId || null,
          landingPage: landingPage || '/',
          createdAt: new Date().toISOString(),
          clicks: 0,
          conversions: 0,
          earnings: 0
        }

        return NextResponse.json({
          message: 'Referral link generated successfully',
          referralLink
        }, { status: 201 })

      case 'create_campaign_integration':
        const { 
          campaignId: intCampaignId, 
          referralCode, 
          customLandingPage, 
          trackingSettings 
        } = data
        
        if (!intCampaignId || !referralCode) {
          return NextResponse.json({ error: 'Campaign ID and referral code are required' }, { status: 400 })
        }

        // Simulate campaign integration creation
        await new Promise(resolve => setTimeout(resolve, 800))

        const campaignIntegration = {
          id: `int_${Date.now()}`,
          campaignId: intCampaignId,
          referralCode,
          customLandingPage: customLandingPage || '/',
          trackingSettings: trackingSettings || {},
          conversionRate: 0,
          totalReferrals: 0,
          totalEarnings: 0,
          createdAt: new Date().toISOString()
        }

        return NextResponse.json({
          message: 'Campaign integration created successfully',
          integration: campaignIntegration
        }, { status: 201 })

      case 'create_social_integration':
        const { 
          postId, 
          platform, 
          content, 
          affiliateLink, 
          scheduledTime 
        } = data
        
        if (!postId || !platform || !content || !affiliateLink) {
          return NextResponse.json({ error: 'Post ID, platform, content, and affiliate link are required' }, { status: 400 })
        }

        // Simulate social integration creation
        await new Promise(resolve => setTimeout(resolve, 600))

        const socialIntegration = {
          id: `social_${Date.now()}`,
          postId,
          platform,
          content,
          affiliateLink,
          scheduledTime: scheduledTime || null,
          status: scheduledTime ? 'scheduled' : 'active',
          clicks: 0,
          conversions: 0,
          earnings: 0,
          createdAt: new Date().toISOString()
        }

        return NextResponse.json({
          message: 'Social integration created successfully',
          integration: socialIntegration
        }, { status: 201 })

      case 'request_payout':
        const { amount, method, payoutDetails } = data
        
        if (!amount || !method || !payoutDetails) {
          return NextResponse.json({ error: 'Amount, method, and payout details are required' }, { status: 400 })
        }

        if (amount > mockAffiliateStats.pendingEarnings) {
          return NextResponse.json({ error: 'Insufficient pending earnings' }, { status: 400 })
        }

        // Simulate payout request
        await new Promise(resolve => setTimeout(resolve, 1000))

        const payoutRequest = {
          id: `payout_${Date.now()}`,
          amount,
          method,
          payoutDetails,
          status: 'pending',
          requestedAt: new Date().toISOString(),
          estimatedProcessingTime: '3-5 business days'
        }

        return NextResponse.json({
          message: 'Payout request submitted successfully',
          payout: payoutRequest
        }, { status: 201 })

      case 'update_marketing_material':
        const { materialId, updates } = data
        
        if (!materialId || !updates) {
          return NextResponse.json({ error: 'Material ID and updates are required' }, { status: 400 })
        }

        // Simulate material update
        await new Promise(resolve => setTimeout(resolve, 400))

        return NextResponse.json({
          message: 'Marketing material updated successfully',
          materialId,
          updates
        })

      case 'track_click':
        const { trackReferralId, source, userAgent } = data
        
        if (!trackReferralId || !source) {
          return NextResponse.json({ error: 'Referral ID and source are required' }, { status: 400 })
        }

        // Simulate click tracking
        await new Promise(resolve => setTimeout(resolve, 100))

        return NextResponse.json({
          message: 'Click tracked successfully',
          referralId: trackReferralId,
          source,
          timestamp: new Date().toISOString()
        })

      case 'track_conversion':
        const { convReferralId, conversionValue, planType } = data
        
        if (!convReferralId || !conversionValue) {
          return NextResponse.json({ error: 'Referral ID and conversion value are required' }, { status: 400 })
        }

        // Simulate conversion tracking
        await new Promise(resolve => setTimeout(resolve, 200))

        const commission = conversionValue * (mockCommissionTiers[mockAffiliateStats.currentTier].commission / 100)
        
        return NextResponse.json({
          message: 'Conversion tracked successfully',
          referralId: convReferralId,
          conversionValue,
          commission,
          planType: planType || 'unknown',
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Affiliate POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id, updates } = body

    if (!type || !id || !updates) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Simulate update operation
    await new Promise(resolve => setTimeout(resolve, 500))

    switch (type) {
      case 'referral':
        return NextResponse.json({
          message: 'Referral updated successfully',
          referralId: id,
          updates
        })

      case 'campaign_integration':
        return NextResponse.json({
          message: 'Campaign integration updated successfully',
          integrationId: id,
          updates
        })

      case 'social_integration':
        return NextResponse.json({
          message: 'Social integration updated successfully',
          integrationId: id,
          updates
        })

      case 'payout':
        return NextResponse.json({
          message: 'Payout updated successfully',
          payoutId: id,
          updates
        })

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Affiliate PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 500))

    switch (type) {
      case 'referral_link':
        return NextResponse.json({ message: 'Referral link deleted successfully' })
      
      case 'campaign_integration':
        return NextResponse.json({ message: 'Campaign integration deleted successfully' })
      
      case 'social_integration':
        return NextResponse.json({ message: 'Social integration deleted successfully' })
      
      case 'payout_request':
        return NextResponse.json({ message: 'Payout request cancelled successfully' })
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Affiliate DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}