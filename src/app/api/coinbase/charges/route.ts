import { NextRequest, NextResponse } from 'next/server'
import { coinbaseService } from '@/lib/coinbase-commerce'
import { 
  ValidationError, 
  AuthenticationError, 
  ExternalServiceError,
  formatErrorResponse,
  logError,
  withErrorHandling,
  getErrorStatus
} from '@/lib/error-handling'

const createChargeHandler = async (request: NextRequest) => {
  const body = await request.json()
  const { 
    name, 
    description, 
    amount, 
    currency = 'USD', 
    metadata,
    redirectUrl,
    cancelUrl 
  } = body

  // Validate required fields
  if (!name || !description || !amount) {
    throw new ValidationError(
      'Missing required fields: name, description, amount',
      { provided: { name, description, amount } }
    )
  }

  if (typeof amount !== 'number' || amount <= 0) {
    throw new ValidationError(
      'Amount must be a positive number',
      { amount }
    )
  }

  // Create charge data
  const chargeData = {
    name,
    description,
    local_price: {
      amount: amount.toString(),
      currency,
    },
    pricing_type: 'fixed_price' as const,
    metadata: metadata || {},
    ...(redirectUrl && { redirect_url: redirectUrl }),
    ...(cancelUrl && { cancel_url: cancelUrl }),
  }

  // Create charge with Coinbase Commerce
  try {
    const charge = await coinbaseService.createCharge(chargeData)

    // Return the charge details including the hosted URL for payment
    return NextResponse.json({
      success: true,
      charge: {
        code: charge.data.code,
        hosted_url: charge.data.hosted_url,
        name: charge.data.name,
        description: charge.data.description,
        amount: charge.data.local_price.amount,
        currency: charge.data.local_price.currency,
        status: charge.data.timeline[0]?.status || 'NEW',
        created_at: charge.data.created_at,
        expires_at: charge.data.expires_at,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Coinbase Commerce API')) {
      throw new ExternalServiceError(
        'Failed to connect to Coinbase Commerce',
        'coinbase',
        { originalError: error.message }
      )
    }
    throw error
  }
}

const getChargeHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const chargeCode = searchParams.get('code')

  if (!chargeCode) {
    throw new ValidationError('Charge code is required', { chargeCode })
  }

  // Get charge details
  try {
    const charge = await coinbaseService.getCharge(chargeCode)

    return NextResponse.json({
      success: true,
      charge: {
        code: charge.data.code,
        hosted_url: charge.data.hosted_url,
        name: charge.data.name,
        description: charge.data.description,
        amount: charge.data.local_price.amount,
        currency: charge.data.local_price.currency,
        status: charge.data.timeline[charge.data.timeline.length - 1]?.status || 'NEW',
        timeline: charge.data.timeline,
        created_at: charge.data.created_at,
        expires_at: charge.data.expires_at,
        metadata: charge.data.metadata,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes('Coinbase Commerce API')) {
      throw new ExternalServiceError(
        'Failed to fetch charge from Coinbase Commerce',
        'coinbase',
        { chargeCode, originalError: error.message }
      )
    }
    throw error
  }
}

export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    return await createChargeHandler(request)
  } catch (error) {
    logError(error, { endpoint: '/api/coinbase/charges', method: 'POST' })
    const status = error instanceof Error ? getErrorStatus(error) : 500
    return NextResponse.json(
      formatErrorResponse(error),
      { status }
    )
  }
})

export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    return await getChargeHandler(request)
  } catch (error) {
    logError(error, { endpoint: '/api/coinbase/charges', method: 'GET' })
    const status = error instanceof Error ? getErrorStatus(error) : 500
    return NextResponse.json(
      formatErrorResponse(error),
      { status }
    )
  }
})