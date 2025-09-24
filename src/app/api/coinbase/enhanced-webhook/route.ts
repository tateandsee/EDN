import { NextRequest, NextResponse } from 'next/server'
import { enhancedPayment } from '@/lib/enhanced-payment'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const signature = request.headers.get('x-cc-webhook-signature') || ''

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Handle the webhook
    await enhancedPayment.handlePaymentWebhook(payload, signature)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Coinbase webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Coinbase webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}