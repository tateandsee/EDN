import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AffiliatePayoutRequest {
  affiliateId: string
  amount: number
  method: 'coinbase' | 'paypal' | 'bank_transfer'
}

interface CoinbaseWithdrawalRequest {
  amount: string
  currency: string
  payment_method_id: string
}

interface CoinbaseWithdrawalResponse {
  data: {
    id: string
    type: string
    status: string
    amount: {
      amount: string
      currency: string
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'ADMIN') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    if (req.method === 'POST') {
      const body: AffiliatePayoutRequest = await req.json()
      const { affiliateId, amount, method } = body

      if (!affiliateId || !amount || !method) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Get affiliate details
      const { data: affiliate, error: affiliateError } = await supabaseClient
        .from('affiliates')
        .select(`
          *,
          user:users!affiliates_userId_fkey (
            email,
            paymentDetails
          )
        `)
        .eq('id', affiliateId)
        .single()

      if (affiliateError || !affiliate) {
        return new Response(
          JSON.stringify({ error: 'Affiliate not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }

      // Check if affiliate has sufficient earnings
      if (affiliate.earnings < amount) {
        return new Response(
          JSON.stringify({ error: 'Insufficient earnings' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Check minimum payout threshold
      if (amount < affiliate.minimumPayoutThreshold) {
        return new Response(
          JSON.stringify({ error: `Amount below minimum threshold of $${affiliate.minimumPayoutThreshold}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      let payoutResult: any = null

      // Process payout based on method
      switch (method) {
        case 'coinbase':
          payoutResult = await processCoinbasePayout(affiliate, amount)
          break
        case 'paypal':
          payoutResult = await processPayPalPayout(affiliate, amount)
          break
        case 'bank_transfer':
          payoutResult = await processBankTransferPayout(affiliate, amount)
          break
        default:
          return new Response(
            JSON.stringify({ error: 'Unsupported payout method' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
      }

      if (!payoutResult.success) {
        return new Response(
          JSON.stringify({ error: payoutResult.error }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Create affiliate payout record
      const { data: payoutRecord, error: payoutError } = await supabaseClient
        .from('affiliate_payouts')
        .insert({
          affiliateId,
          amount,
          commissionRate: affiliate.commission,
          status: 'COMPLETED',
          method,
          providerResponse: payoutResult.data,
          processedAt: new Date().toISOString()
        })
        .select()
        .single()

      if (payoutError) {
        return new Response(
          JSON.stringify({ error: 'Failed to create payout record' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Update affiliate earnings
      const { error: updateError } = await supabaseClient
        .from('affiliates')
        .update({
          earnings: affiliate.earnings - amount,
          updatedAt: new Date().toISOString()
        })
        .eq('id', affiliateId)

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to update affiliate earnings' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      // Mark related membership referrals as paid
      // This ensures we track which referral commissions have been paid out
      const { error: referralUpdateError } = await supabaseClient
        .from('membership_referrals')
        .update({ status: 'PAID' })
        .eq('affiliateId', affiliateId)
        .eq('status', 'PENDING')

      if (referralUpdateError) {
        console.error('Warning: Failed to update membership referral status:', referralUpdateError)
        // Don't fail the payout for this error
      }

      // Log the activity
      await supabaseClient
        .from('onboarding_activities')
        .insert({
          userId: affiliate.userId,
          action: 'REWARD_REDEEMED',
          details: {
            type: 'payout',
            amount,
            method,
            payoutId: payoutRecord.id
          }
        })

      return new Response(
        JSON.stringify({
          success: true,
          payout: payoutRecord,
          providerResponse: payoutResult.data
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // GET request to fetch pending payouts
    if (req.method === 'GET') {
      const { data: pendingPayouts, error } = await supabaseClient
        .from('affiliate_payouts')
        .select(`
          *,
          affiliate:affiliates!affiliate_payouts_affiliateId_fkey (
            *,
            user:users!affiliates_userId_fkey (
              email,
              name
            )
          )
        `)
        .eq('status', 'PENDING')
        .order('createdAt', { ascending: true })

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch pending payouts' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      return new Response(
        JSON.stringify({ pendingPayouts }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function processCoinbasePayout(affiliate: any, amount: number): Promise<any> {
  try {
    const coinbaseApiKey = Deno.env.get('COINBASE_API_KEY')
    const coinbaseApiSecret = Deno.env.get('COINBASE_API_SECRET')

    if (!coinbaseApiKey || !coinbaseApiSecret) {
      return { success: false, error: 'Coinbase API credentials not configured' }
    }

    // Get payment method from affiliate's payout method or user's payment details
    const paymentMethod = affiliate.payoutMethod?.coinbase || affiliate.user?.paymentDetails?.coinbase
    
    if (!paymentMethod?.payment_method_id) {
      return { success: false, error: 'Coinbase payment method not configured' }
    }

    // Simulate Coinbase API call (in production, you would make actual API calls)
    const withdrawalRequest: CoinbaseWithdrawalRequest = {
      amount: amount.toString(),
      currency: 'USD',
      payment_method_id: paymentMethod.payment_method_id
    }

    // Mock response for demonstration
    const mockResponse: CoinbaseWithdrawalResponse = {
      data: {
        id: `withdrawal_${Date.now()}`,
        type: 'withdrawal',
        status: 'completed',
        amount: {
          amount: amount.toString(),
          currency: 'USD'
        }
      }
    }

    // In production, you would make the actual API call:
    // const response = await fetch('https://api.coinbase.com/v2/withdrawals/fiat', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${coinbaseApiKey}`,
    //     'CB-ACCESS-SIGN': generateSignature(),
    //     'CB-ACCESS-TIMESTAMP': Date.now().toString(),
    //     'CB-ACCESS-KEY': coinbaseApiKey
    //   },
    //   body: JSON.stringify(withdrawalRequest)
    // })
    // const data = await response.json()

    return { success: true, data: mockResponse }

  } catch (error) {
    console.error('Coinbase payout error:', error)
    return { success: false, error: 'Failed to process Coinbase payout' }
  }
}

async function processPayPalPayout(affiliate: any, amount: number): Promise<any> {
  try {
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')

    if (!paypalClientId || !paypalClientSecret) {
      return { success: false, error: 'PayPal API credentials not configured' }
    }

    // Get PayPal email from affiliate's payout method or user's payment details
    const paypalEmail = affiliate.payoutMethod?.paypal?.email || affiliate.user?.paymentDetails?.paypal?.email
    
    if (!paypalEmail) {
      return { success: false, error: 'PayPal email not configured' }
    }

    // Simulate PayPal payout API call
    const mockResponse = {
      batch_header: {
        payout_batch_id: `paypal_${Date.now()}`,
        batch_status: 'SUCCESS'
      },
      items: [{
        payout_item_id: `item_${Date.now()}`,
        transaction_status: 'SUCCESS',
        payout_item_fee: {
          currency: 'USD',
          value: (amount * 0.025).toString() // 2.5% fee
        }
      }]
    }

    return { success: true, data: mockResponse }

  } catch (error) {
    console.error('PayPal payout error:', error)
    return { success: false, error: 'Failed to process PayPal payout' }
  }
}

async function processBankTransferPayout(affiliate: any, amount: number): Promise<any> {
  try {
    // Get bank details from affiliate's payout method or user's payment details
    const bankDetails = affiliate.payoutMethod?.bank || affiliate.user?.paymentDetails?.bank
    
    if (!bankDetails?.account_number || !bankDetails?.routing_number) {
      return { success: false, error: 'Bank details not configured' }
    }

    // Simulate bank transfer API call
    const mockResponse = {
      transfer_id: `bank_${Date.now()}`,
      status: 'processed',
      estimated_arrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      fee: {
        currency: 'USD',
        value: (amount * 0.01).toString() // 1% fee
      }
    }

    return { success: true, data: mockResponse }

  } catch (error) {
    console.error('Bank transfer error:', error)
    return { success: false, error: 'Failed to process bank transfer' }
  }
}

// Helper function to generate Coinbase API signature (for production use)
function generateSignature(): string {
  // In production, implement proper Coinbase API signature generation
  return 'mock_signature'
}