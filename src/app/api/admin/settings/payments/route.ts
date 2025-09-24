import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/settings/payments - Get payment settings
export async function GET() {
  try {
    // In a real implementation, you would store these settings in a database table
    // For now, we'll return default settings
    const settings = {
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
        frequency: 'WEEKLY',
        minimumAmount: 50.00,
        processingFee: 2.5
      },
      refunds: {
        enabled: true,
        automaticApproval: false,
        timeLimit: 30
      },
      subscriptions: {
        enabled: true,
        trialPeriod: 7,
        proratedUpgrades: true,
        cancellationPolicy: 'IMMEDIATE'
      }
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching payment settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings/payments - Update payment settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      gateways,
      currencies,
      defaultCurrency,
      autoPayouts,
      refunds,
      subscriptions
    } = body

    // Validate settings
    if (!currencies || !Array.isArray(currencies) || currencies.length === 0) {
      return NextResponse.json(
        { error: 'At least one currency must be specified' },
        { status: 400 }
      )
    }

    if (!defaultCurrency || !currencies.includes(defaultCurrency)) {
      return NextResponse.json(
        { error: 'Default currency must be in the currencies list' },
        { status: 400 }
      )
    }

    if (autoPayouts && autoPayouts.minimumAmount < 0) {
      return NextResponse.json(
        { error: 'Minimum payout amount must be positive' },
        { status: 400 }
      )
    }

    if (autoPayouts && autoPayouts.processingFee < 0 || autoPayouts.processingFee > 100) {
      return NextResponse.json(
        { error: 'Processing fee must be between 0 and 100' },
        { status: 400 }
      )
    }

    if (refunds && refunds.timeLimit < 0) {
      return NextResponse.json(
        { error: 'Refund time limit must be positive' },
        { status: 400 }
      )
    }

    if (subscriptions && subscriptions.trialPeriod < 0) {
      return NextResponse.json(
        { error: 'Trial period must be positive' },
        { status: 400 }
      )
    }

    // In a real implementation, you would update these settings in a database table
    // For now, we'll just return success
    const updatedSettings = {
      gateways,
      currencies,
      defaultCurrency,
      autoPayouts,
      refunds,
      subscriptions,
      updatedAt: new Date().toISOString()
    }

    // Log the settings update (in production, you would save to database)
    console.log('Payment settings updated:', updatedSettings)

    // Mask sensitive data in response
    const sanitizedSettings = {
      ...updatedSettings,
      gateways: {
        stripe: {
          ...updatedSettings.gateways.stripe,
          publishableKey: updatedSettings.gateways.stripe.publishableKey ? '***' : '',
          secretKey: updatedSettings.gateways.stripe.secretKey ? '***' : '',
          webhookSecret: updatedSettings.gateways.stripe.webhookSecret ? '***' : ''
        },
        paypal: {
          ...updatedSettings.gateways.paypal,
          clientId: updatedSettings.gateways.paypal.clientId ? '***' : '',
          clientSecret: updatedSettings.gateways.paypal.clientSecret ? '***' : '',
          webhookId: updatedSettings.gateways.paypal.webhookId ? '***' : ''
        },
        coinbase: {
          ...updatedSettings.gateways.coinbase,
          apiKey: updatedSettings.gateways.coinbase.apiKey ? '***' : '',
          webhookSecret: updatedSettings.gateways.coinbase.webhookSecret ? '***' : ''
        },
        bankTransfer: updatedSettings.gateways.bankTransfer
      }
    }

    return NextResponse.json({ 
      message: 'Payment settings updated successfully',
      settings: sanitizedSettings 
    })
  } catch (error) {
    console.error('Error updating payment settings:', error)
    return NextResponse.json(
      { error: 'Failed to update payment settings' },
      { status: 500 }
    )
  }
}