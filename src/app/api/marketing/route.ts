import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock campaigns data
const mockCampaigns = [
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
    tags: ['AI', 'Art', 'Summer', 'Promotion']
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
    tags: ['Influencer', 'Partnership', 'Growth']
  }
]

// Mock templates data
const mockTemplates = [
  {
    id: '1',
    name: 'AI Art Showcase Template',
    type: 'social',
    category: 'Art & Design',
    description: 'Beautiful template for showcasing AI-generated artwork',
    preview: '/templates/ai-art-showcase.jpg',
    isPremium: false,
    usageCount: 1250,
    rating: 4.8
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
    rating: 4.6
  }
]

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalCampaigns: 15,
    activeCampaigns: 8,
    totalBudget: 45000,
    totalSpent: 28500,
    totalImpressions: 2150000,
    totalClicks: 64500,
    totalConversions: 3225,
    avgCTR: 3.0,
    avgROAS: 4.8
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
    ]
  }
}

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
      case 'campaigns':
        const campaigns = mockCampaigns.slice(offset, offset + limit)
        return NextResponse.json({
          campaigns,
          total: mockCampaigns.length,
          hasMore: offset + limit < mockCampaigns.length
        })

      case 'templates':
        const templates = mockTemplates.slice(offset, offset + limit)
        return NextResponse.json({
          templates,
          total: mockTemplates.length,
          hasMore: offset + limit < mockTemplates.length
        })

      case 'analytics':
        return NextResponse.json(mockAnalytics)

      case 'overview':
        return NextResponse.json(mockAnalytics.overview)

      case 'revenue':
        const revenueType = searchParams.get('revenueType')
        if (revenueType === 'campaign') {
          return NextResponse.json(mockAnalytics.revenue.byCampaign)
        } else if (revenueType === 'platform') {
          return NextResponse.json(mockAnalytics.revenue.byPlatform)
        }
        return NextResponse.json(mockAnalytics.revenue)

      case 'audience':
        const audienceType = searchParams.get('audienceType')
        if (audienceType === 'demographics') {
          return NextResponse.json(mockAnalytics.audience.demographics)
        } else if (audienceType === 'engagement') {
          return NextResponse.json(mockAnalytics.audience.engagement)
        }
        return NextResponse.json(mockAnalytics.audience)

      case 'automation':
        return NextResponse.json({
          automatedCampaigns: [
            { id: '1', name: 'Welcome Series', type: 'email', status: 'active', triggers: ['user_signup'] },
            { id: '2', name: 'Abandoned Cart', type: 'email', status: 'active', triggers: ['cart_abandoned'] },
            { id: '3', name: 'Re-engagement', type: 'email', status: 'paused', triggers: ['user_inactive'] }
          ],
          triggerRules: [
            { id: '1', event: 'user_signup', action: 'send_welcome_email', status: 'active' },
            { id: '2', event: 'purchase_complete', action: 'send_thank_you_email', status: 'active' },
            { id: '3', event: 'user_inactive_30d', action: 'send_reengagement_email', status: 'active' }
          ]
        })

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

  } catch (error) {
    console.error('Marketing GET error:', error)
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
      case 'create_campaign':
        const { 
          name, 
          type, 
          budget, 
          targetAudience, 
          startDate, 
          endDate, 
          description, 
          platforms,
          tags 
        } = data
        
        if (!name || !type || !budget || !targetAudience || !startDate) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Simulate campaign creation
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newCampaign = {
          id: `campaign_${Date.now()}`,
          name,
          type,
          status: 'draft' as const,
          budget,
          spent: 0,
          targetAudience,
          startDate,
          endDate,
          description,
          metrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0,
            roas: 0
          },
          platforms: platforms || [],
          tags: tags || []
        }

        return NextResponse.json({
          message: 'Campaign created successfully',
          campaign: newCampaign
        }, { status: 201 })

      case 'create_template':
        const { 
          templateName, 
          templateType, 
          category, 
          description: templateDescription, 
          isPremium 
        } = data
        
        if (!templateName || !templateType || !category || !templateDescription) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Simulate template creation
        await new Promise(resolve => setTimeout(resolve, 800))

        const newTemplate = {
          id: `template_${Date.now()}`,
          name: templateName,
          type: templateType,
          category,
          description: templateDescription,
          preview: '/templates/default.jpg',
          isPremium: isPremium || false,
          usageCount: 0,
          rating: 0
        }

        return NextResponse.json({
          message: 'Template created successfully',
          template: newTemplate
        }, { status: 201 })

      case 'start_campaign':
        const { campaignId } = data
        
        if (!campaignId) {
          return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
        }

        // Simulate campaign start
        await new Promise(resolve => setTimeout(resolve, 500))

        return NextResponse.json({
          message: 'Campaign started successfully',
          campaignId,
          status: 'active'
        })

      case 'pause_campaign':
        const { pauseCampaignId } = data
        
        if (!pauseCampaignId) {
          return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
        }

        // Simulate campaign pause
        await new Promise(resolve => setTimeout(resolve, 500))

        return NextResponse.json({
          message: 'Campaign paused successfully',
          campaignId: pauseCampaignId,
          status: 'paused'
        })

      case 'stop_campaign':
        const { stopCampaignId } = data
        
        if (!stopCampaignId) {
          return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
        }

        // Simulate campaign stop
        await new Promise(resolve => setTimeout(resolve, 500))

        return NextResponse.json({
          message: 'Campaign stopped successfully',
          campaignId: stopCampaignId,
          status: 'cancelled'
        })

      case 'create_automation':
        const { 
          automationName, 
          automationType, 
          triggers, 
          actions 
        } = data
        
        if (!automationName || !automationType || !triggers || !actions) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Simulate automation creation
        await new Promise(resolve => setTimeout(resolve, 1200))

        return NextResponse.json({
          message: 'Automation created successfully',
          automationId: `automation_${Date.now()}`,
          name: automationName,
          type: automationType
        }, { status: 201 })

      case 'update_budget':
        const { budgetCampaignId, newBudget } = data
        
        if (!budgetCampaignId || !newBudget) {
          return NextResponse.json({ error: 'Campaign ID and budget are required' }, { status: 400 })
        }

        // Simulate budget update
        await new Promise(resolve => setTimeout(resolve, 300))

        return NextResponse.json({
          message: 'Budget updated successfully',
          campaignId: budgetCampaignId,
          newBudget
        })

      case 'duplicate_campaign':
        const { duplicateCampaignId } = data
        
        if (!duplicateCampaignId) {
          return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
        }

        // Simulate campaign duplication
        await new Promise(resolve => setTimeout(resolve, 800))

        return NextResponse.json({
          message: 'Campaign duplicated successfully',
          originalCampaignId: duplicateCampaignId,
          newCampaignId: `campaign_${Date.now()}`
        }, { status: 201 })

      case 'export_campaign_data':
        const { exportCampaignId, exportFormat } = data
        
        if (!exportCampaignId || !exportFormat) {
          return NextResponse.json({ error: 'Campaign ID and format are required' }, { status: 400 })
        }

        // Simulate export process
        await new Promise(resolve => setTimeout(resolve, 2000))

        return NextResponse.json({
          message: `Campaign data exported as ${exportFormat.toUpperCase()}`,
          downloadUrl: `/api/marketing/download/${exportCampaignId}.${exportFormat}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Marketing POST error:', error)
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
      case 'campaign':
        return NextResponse.json({
          message: 'Campaign updated successfully',
          campaignId: id,
          updates
        })

      case 'template':
        return NextResponse.json({
          message: 'Template updated successfully',
          templateId: id,
          updates
        })

      case 'automation':
        return NextResponse.json({
          message: 'Automation updated successfully',
          automationId: id,
          updates
        })

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Marketing PATCH error:', error)
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
      case 'campaign':
        return NextResponse.json({ message: 'Campaign deleted successfully' })
      
      case 'template':
        return NextResponse.json({ message: 'Template deleted successfully' })
      
      case 'automation':
        return NextResponse.json({ message: 'Automation deleted successfully' })
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Marketing DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}