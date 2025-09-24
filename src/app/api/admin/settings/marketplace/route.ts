import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/settings/marketplace - Get marketplace settings
export async function GET() {
  try {
    // In a real implementation, you would store these settings in a database table
    // For now, we'll return default settings
    const settings = {
      platformCommissionRate: 30,
      minimumPrice: 1.00,
      maximumPrice: 999.99,
      allowedCategories: ['AI_TOOLS', 'DIGITAL_PRODUCTS', 'TEMPLATES', 'COURSES'],
      requireApproval: true,
      autoApproveVerifiedCreators: false,
      payoutFrequency: 'WEEKLY',
      payoutMethods: ['paypal', 'stripe', 'bank_transfer', 'cryptocurrency'],
      minimumPayoutThreshold: 50.00
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching marketplace settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings/marketplace - Update marketplace settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      platformCommissionRate,
      minimumPrice,
      maximumPrice,
      allowedCategories,
      requireApproval,
      autoApproveVerifiedCreators,
      payoutFrequency,
      payoutMethods,
      minimumPayoutThreshold
    } = body

    // Validate settings
    if (platformCommissionRate < 0 || platformCommissionRate > 100) {
      return NextResponse.json(
        { error: 'Commission rate must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (minimumPrice < 0 || maximumPrice < minimumPrice) {
      return NextResponse.json(
        { error: 'Invalid price range' },
        { status: 400 }
      )
    }

    if (minimumPayoutThreshold < 0) {
      return NextResponse.json(
        { error: 'Minimum payout threshold must be positive' },
        { status: 400 }
      )
    }

    // In a real implementation, you would update these settings in a database table
    // For now, we'll just return success
    const updatedSettings = {
      platformCommissionRate,
      minimumPrice,
      maximumPrice,
      allowedCategories,
      requireApproval,
      autoApproveVerifiedCreators,
      payoutFrequency,
      payoutMethods,
      minimumPayoutThreshold,
      updatedAt: new Date().toISOString()
    }

    // Log the settings update (in production, you would save to database)
    console.log('Marketplace settings updated:', updatedSettings)

    return NextResponse.json({ 
      message: 'Marketplace settings updated successfully',
      settings: updatedSettings 
    })
  } catch (error) {
    console.error('Error updating marketplace settings:', error)
    return NextResponse.json(
      { error: 'Failed to update marketplace settings' },
      { status: 500 }
    )
  }
}