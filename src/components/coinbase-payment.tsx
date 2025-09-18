'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'

interface CoinbasePaymentProps {
  itemName: string
  itemDescription: string
  amount: number
  currency?: string
  metadata?: Record<string, any>
  onSuccess?: (chargeData: any) => void
  onError?: (error: string) => void
  className?: string
}

interface ChargeData {
  code: string
  hosted_url: string
  name: string
  description: string
  amount: string
  currency: string
  status: string
  created_at: string
  expires_at: string
}

export function CoinbasePayment({
  itemName,
  itemDescription,
  amount,
  currency = 'USD',
  metadata = {},
  onSuccess,
  onError,
  className = ''
}: CoinbasePaymentProps) {
  const [loading, setLoading] = useState(false)
  const [charge, setCharge] = useState<ChargeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle')

  const createCharge = async () => {
    setLoading(true)
    setError(null)
    setPaymentStatus('processing')

    try {
      const response = await fetch('/api/coinbase/charges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemName,
          description: itemDescription,
          amount,
          currency,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString(),
          },
          redirectUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancelled`,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment charge')
      }

      setCharge(result.charge)
      
      // Open the payment URL in a new window
      window.open(result.charge.hosted_url, '_blank')
      
      // Start polling for payment status
      pollPaymentStatus(result.charge.code)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setPaymentStatus('failed')
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const pollPaymentStatus = async (chargeCode: string) => {
    const maxAttempts = 60 // Poll for up to 10 minutes (every 10 seconds)
    let attempts = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/coinbase/charges?code=${chargeCode}`)
        const result = await response.json()

        if (result.success) {
          const currentStatus = result.charge.status
          
          if (currentStatus === 'COMPLETED' || currentStatus === 'CONFIRMED') {
            setPaymentStatus('success')
            setCharge(result.charge)
            onSuccess?.(result.charge)
            return
          } else if (currentStatus === 'FAILED' || currentStatus === 'EXPIRED') {
            setPaymentStatus('failed')
            setError(`Payment ${currentStatus.toLowerCase()}`)
            onError?.(`Payment ${currentStatus.toLowerCase()}`)
            return
          }
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000) // Poll every 10 seconds
        } else {
          setPaymentStatus('failed')
          setError('Payment verification timeout')
          onError?.('Payment verification timeout')
        }
      } catch (err) {
        console.error('Error polling payment status:', err)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000)
        } else {
          setPaymentStatus('failed')
          setError('Failed to verify payment status')
          onError?.('Failed to verify payment status')
        }
      }
    }

    // Start polling after 5 seconds
    setTimeout(poll, 5000)
  }

  const resetPayment = () => {
    setCharge(null)
    setError(null)
    setPaymentStatus('idle')
  }

  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cryptocurrency Payment
          </CardTitle>
          <CardDescription>
            Pay with Bitcoin, Ethereum, and other cryptocurrencies via Coinbase Commerce
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Payment Details */}
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold">{itemName}</p>
              <p className="text-sm text-gray-600">{itemDescription}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${amount}</p>
              <p className="text-sm text-gray-600">{currency}</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Success Display */}
          {paymentStatus === 'success' && charge && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">Payment completed successfully!</p>
            </div>
          )}

          {/* Charge Info */}
          {charge && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Charge Code:</span>
                <Badge variant="outline">{charge.code}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <Badge 
                  variant={charge.status === 'COMPLETED' || charge.status === 'CONFIRMED' ? 'default' : 'secondary'}
                >
                  {charge.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Created:</span>
                <span className="text-sm text-gray-600">
                  {new Date(charge.created_at).toLocaleString()}
                </span>
              </div>
              {charge.expires_at && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expires:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(charge.expires_at).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {paymentStatus === 'idle' && (
              <Button 
                onClick={createCharge} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay with Crypto
                  </>
                )}
              </Button>
            )}

            {charge && (
              <Button 
                variant="outline" 
                onClick={() => window.open(charge.hosted_url, '_blank')}
                className="flex-1"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Payment Page
              </Button>
            )}

            {(paymentStatus === 'success' || paymentStatus === 'failed') && (
              <Button 
                variant="outline" 
                onClick={resetPayment}
              >
                New Payment
              </Button>
            )}
          </div>

          {/* Payment Instructions */}
          {paymentStatus === 'processing' && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Payment Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>A new tab will open with the Coinbase Commerce payment page</li>
                <li>Complete your payment in the new tab</li>
                <li>We'll automatically verify your payment status</li>
                <li>You'll receive confirmation once payment is complete</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}