import { NextRequest, NextResponse } from 'next/server'
import { coinbaseService } from '@/lib/coinbase-commerce'

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-cc-webhook-signature') || ''
    const webhookSecret = process.env.NEXT_PUBLIC_COINBASE_COMMERCE_WEBHOOK_SECRET || ''

    // Verify webhook signature (in production, implement proper verification)
    // For now, we'll skip signature verification in development
    if (process.env.NODE_ENV === 'production') {
      const isValid = coinbaseService.resolveWebhookSignature(payload, signature, webhookSecret)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = JSON.parse(payload)
    const { event: eventType, data } = event

    console.log(`Coinbase Commerce webhook received: ${eventType}`, data)

    // Handle different event types
    switch (eventType) {
      case 'charge:confirmed':
        await handleChargeConfirmed(data)
        break
      case 'charge:failed':
        await handleChargeFailed(data)
        break
      case 'charge:pending':
        await handleChargePending(data)
        break
      case 'charge:resolved':
        await handleChargeResolved(data)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing Coinbase Commerce webhook:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

async function handleChargeConfirmed(chargeData: any) {
  console.log('Charge confirmed:', chargeData.code)
  
  // Here you would typically:
  // 1. Update the order status in your database
  // 2. Grant access to the purchased item
  // 3. Send confirmation email to the user
  // 4. Update user's purchase history
  
  // Example: Update order in database
  // await db.order.update({
  //   where: { id: chargeData.metadata.order_id },
  //   data: { 
  //     status: 'COMPLETED',
  //     payment_id: chargeData.code,
  //     completed_at: new Date()
  //   }
  // })
}

async function handleChargeFailed(chargeData: any) {
  console.log('Charge failed:', chargeData.code)
  
  // Here you would typically:
  // 1. Update the order status to failed
  // 2. Notify the user about the failed payment
  // 3. Maybe retry the payment or offer alternative payment methods
  
  // Example: Update order in database
  // await db.order.update({
  //   where: { id: chargeData.metadata.order_id },
  //   data: { 
  //     status: 'FAILED',
  //     payment_id: chargeData.code,
  //     failed_at: new Date()
  //   }
  // })
}

async function handleChargePending(chargeData: any) {
  console.log('Charge pending:', chargeData.code)
  
  // Here you would typically:
  // 1. Update the order status to pending
  // 2. Wait for confirmation or failure
  
  // Example: Update order in database
  // await db.order.update({
  //   where: { id: chargeData.metadata.order_id },
  //   data: { 
  //     status: 'PENDING',
  //     payment_id: chargeData.code
  //   }
  // })
}

async function handleChargeResolved(chargeData: any) {
  console.log('Charge resolved:', chargeData.code)
  
  // This event occurs when a charge is resolved (completed, failed, or expired)
  // You might want to perform final cleanup or notifications
}