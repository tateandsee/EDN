import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/settings/platform - Get platform settings
export async function GET() {
  try {
    // In a real implementation, you would store these settings in a database table
    // For now, we'll return default settings
    const settings = {
      apiRateLimit: 100,
      bulkUploadLimit: 50,
      autoOptimizeContent: true,
      schedulingEnabled: true,
      analyticsRetention: 90,
      supportedPlatforms: [
        'OnlyFans', 'Fansly', 'JustForFans', 'ManyVids', 'Fanvue',
        'Patreon', 'Instagram', 'TikTok', 'Ko-fi', 'AdmireMe.VIP'
      ],
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
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching platform settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings/platform - Update platform settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      apiRateLimit,
      bulkUploadLimit,
      autoOptimizeContent,
      schedulingEnabled,
      analyticsRetention,
      supportedPlatforms,
      apiKeys,
      webhooks,
      security,
      email
    } = body

    // Validate settings
    if (apiRateLimit < 1 || apiRateLimit > 10000) {
      return NextResponse.json(
        { error: 'API rate limit must be between 1 and 10000' },
        { status: 400 }
      )
    }

    if (bulkUploadLimit < 1 || bulkUploadLimit > 1000) {
      return NextResponse.json(
        { error: 'Bulk upload limit must be between 1 and 1000' },
        { status: 400 }
      )
    }

    if (analyticsRetention < 1 || analyticsRetention > 365) {
      return NextResponse.json(
        { error: 'Analytics retention must be between 1 and 365 days' },
        { status: 400 }
      )
    }

    // Validate email settings if provided
    if (email && email.smtpPort && (email.smtpPort < 1 || email.smtpPort > 65535)) {
      return NextResponse.json(
        { error: 'SMTP port must be between 1 and 65535' },
        { status: 400 }
      )
    }

    // In a real implementation, you would update these settings in a database table
    // For now, we'll just return success
    const updatedSettings = {
      apiRateLimit,
      bulkUploadLimit,
      autoOptimizeContent,
      schedulingEnabled,
      analyticsRetention,
      supportedPlatforms,
      apiKeys,
      webhooks,
      security,
      email,
      updatedAt: new Date().toISOString()
    }

    // Log the settings update (in production, you would save to database)
    console.log('Platform settings updated:', updatedSettings)

    // Mask sensitive data in response
    const sanitizedSettings = {
      ...updatedSettings,
      apiKeys: {
        ...updatedSettings.apiKeys,
        openai: updatedSettings.apiKeys.openai ? '***' : '',
        anthropic: updatedSettings.apiKeys.anthropic ? '***' : '',
        google: updatedSettings.apiKeys.google ? '***' : '',
        aws: updatedSettings.apiKeys.aws ? '***' : '',
        cloudinary: updatedSettings.apiKeys.cloudinary ? '***' : ''
      },
      email: updatedSettings.email ? {
        ...updatedSettings.email,
        smtpPassword: updatedSettings.email.smtpPassword ? '***' : ''
      } : undefined
    }

    return NextResponse.json({ 
      message: 'Platform settings updated successfully',
      settings: sanitizedSettings 
    })
  } catch (error) {
    console.error('Error updating platform settings:', error)
    return NextResponse.json(
      { error: 'Failed to update platform settings' },
      { status: 500 }
    )
  }
}