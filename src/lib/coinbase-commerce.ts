import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

interface CoinbaseCharge {
  name: string
  description: string
  local_price: {
    amount: string
    currency: string
  }
  pricing_type: 'fixed_price' | 'no_price'
  metadata?: {
    order_id: string
    user_id: string
    item_id: string
  }
  redirect_url?: string
  cancel_url?: string
}

interface CoinbaseChargeResponse {
  data: {
    code: string
    hosted_url: string
    name: string
    description: string
    local_price: {
      amount: string
      currency: string
    }
    pricing_type: string
    metadata: any
    created_at: string
    expires_at: string
    timeline: Array<{
      status: string
      time: string
    }>
  }
}

export class CoinbaseCommerceService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.COINBASE_COMMERCE_API_KEY || ''
    this.baseUrl = 'https://api.commerce.coinbase.com'
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': this.apiKey,
        'X-CC-Version': '2018-03-22',
      },
    }

    const config = { ...defaultOptions, ...options }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Coinbase Commerce API Error: ${response.status} - ${JSON.stringify(errorData)}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Coinbase Commerce request failed:', error)
      throw error
    }
  }

  async createCharge(chargeData: CoinbaseCharge): Promise<CoinbaseChargeResponse> {
    const response = await this.makeRequest('/charges', {
      method: 'POST',
      body: JSON.stringify(chargeData),
    })

    return response
  }

  async getCharge(chargeCode: string): Promise<CoinbaseChargeResponse> {
    const response = await this.makeRequest(`/charges/${chargeCode}`)
    return response
  }

  async listCharges(): Promise<{ data: CoinbaseChargeResponse['data'][] }> {
    const response = await this.makeRequest('/charges')
    return response
  }

  async cancelCharge(chargeCode: string): Promise<void> {
    await this.makeRequest(`/charges/${chargeCode}/cancel`, {
      method: 'POST',
    })
  }

  resolveWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // This is a simplified verification - in production, use proper crypto verification
    // For now, we'll do a basic check
    try {
      const hmac = createHmac('sha256', secret)
      const computedSignature = hmac.update(payload).digest('hex')
      return signature === computedSignature
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return false
    }
  }
}

// Singleton instance
export const coinbaseService = new CoinbaseCommerceService()