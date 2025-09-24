'use client'

import { useState, useEffect } from 'react'
import { enhancedPayment } from '@/lib/enhanced-payment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Loader2, 
  Crown, 
  Star, 
  Zap, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  CreditCard,
  Calendar,
  RefreshCw,
  TrendingUp
} from 'lucide-react'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'monthly' | 'yearly'
  features: string[]
  isActive: boolean
  popular?: boolean
  maxContentGenerations?: number
  maxStorageGB?: number
  prioritySupport?: boolean
  apiAccess?: boolean
  customModels?: boolean
}

interface UserSubscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  createdAt: string
  updatedAt: string
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [refundDescription, setRefundDescription] = useState('')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [immediateCancel, setImmediateCancel] = useState(false)

  useEffect(() => {
    loadSubscriptionData()
  }, [])

  const loadSubscriptionData = async () => {
    try {
      setLoading(true)
      
      // Load subscription plans
      const subscriptionPlans = await enhancedPayment.getSubscriptionPlans()
      setPlans(subscriptionPlans)
      
      // Load user subscription (you would get user ID from auth context)
      const userId = 'current-user-id' // This would come from auth context
      const userSubscription = await enhancedPayment.getUserSubscription(userId)
      setSubscription(userSubscription)
      
    } catch (err) {
      setError('Failed to load subscription data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const userId = 'current-user-id' // This would come from auth context
      const result = await enhancedPayment.createSubscription(userId, planId)
      
      if (result.success && result.redirectUrl) {
        // Redirect to payment page
        window.location.href = result.redirectUrl
      } else {
        setError(result.error || 'Failed to create subscription')
      }
      
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const userId = 'current-user-id' // This would come from auth context
      const result = await enhancedPayment.cancelSubscription(userId, immediateCancel)
      
      if (result.success) {
        setSuccess(result.message)
        setShowCancelDialog(false)
        // Reload subscription data
        await loadSubscriptionData()
      } else {
        setError(result.error || 'Failed to cancel subscription')
      }
      
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestRefund = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      if (!subscription) {
        setError('No active subscription found')
        return
      }
      
      // You would need to get the order ID from the subscription
      const orderId = 'order-id-placeholder' // This would come from subscription data
      
      const result = await enhancedPayment.requestRefund({
        orderId,
        reason: refundReason,
        description: refundDescription
      })
      
      if (result.success) {
        setSuccess(result.message)
        setShowRefundDialog(false)
        setRefundReason('')
        setRefundDescription('')
      } else {
        setError(result.error || 'Failed to request refund')
      }
      
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradePlan = async (newPlanId: string) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const userId = 'current-user-id' // This would come from auth context
      const result = await enhancedPayment.updateSubscriptionPlan(userId, newPlanId)
      
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl
      } else {
        setError(result.error || 'Failed to update subscription plan')
      }
      
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString)
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading && !plans.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-gray-600">Manage your EDN subscription and billing</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-400 bg-green-400/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="plans" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          <TabsTrigger value="current">Current Subscription</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {subscription && subscription.plan.id === plan.id ? (
                    <Button className="w-full" variant="outline" disabled>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => subscription ? handleUpgradePlan(plan.id) : handleSubscribe(plan.id)}
                      disabled={loading}
                    >
                      {subscription ? 'Upgrade Plan' : 'Subscribe Now'}
                      {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          {subscription ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-5 h-5 mr-2 text-yellow-500" />
                    Current Subscription
                  </CardTitle>
                  <CardDescription>Your active subscription details</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Plan</span>
                    <Badge>{subscription.plan.name}</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Status</span>
                    <Badge className={
                      subscription.status === 'active' ? 'bg-green-500' :
                      subscription.status === 'cancelled' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }>
                      {subscription.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price</span>
                    <span>${subscription.plan.price}/{subscription.plan.interval}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Current Period</span>
                    <span className="text-sm">
                      {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Days Remaining</span>
                    <span className="font-medium">
                      {getDaysRemaining(subscription.currentPeriodEnd)} days
                    </span>
                  </div>
                  
                  {subscription.cancelAtPeriodEnd && (
                    <Alert className="border-orange-400 bg-orange-400/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Your subscription will cancel at the end of the current billing period.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Actions</CardTitle>
                  <CardDescription>Manage your subscription settings</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(true)}
                      disabled={subscription.status !== 'active'}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Subscription
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowRefundDialog(true)}
                      disabled={subscription.status !== 'active'}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request Refund
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Navigate to billing portal
                        window.location.href = '/dashboard/billing'
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Crown className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-6">
                  You don't have an active subscription. Choose a plan to get started with EDN.
                </p>
                <Button
                  onClick={() => {
                    const plansTab = document.querySelector('[value="plans"]') as HTMLElement
                    if (plansTab) plansTab.click()
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  View Subscription Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your recent payments and transactions</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No Billing History</h3>
                <p className="text-gray-600">
                  Your billing history will appear here once you have active subscriptions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You will lose access to premium features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="immediate-cancel"
                checked={immediateCancel}
                onChange={(e) => setImmediateCancel(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="immediate-cancel">
                Cancel immediately (instead of at the end of the billing period)
              </Label>
            </div>
            
            {immediateCancel && (
              <Alert className="border-red-400 bg-red-400/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Immediate cancellation will revoke access to all premium features immediately.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Subscription
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelSubscription}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cancel Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Request Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Refund</DialogTitle>
            <DialogDescription>
              Please provide a reason for your refund request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="refund-reason">Reason for Refund</Label>
              <Input
                id="refund-reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="e.g., Not satisfied with service, technical issues, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="refund-description">Additional Details</Label>
              <Textarea
                id="refund-description"
                value={refundDescription}
                onChange={(e) => setRefundDescription(e.target.value)}
                placeholder="Provide more details about your refund request..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2 justify-end">
              <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleRequestRefund}
                disabled={loading || !refundReason.trim()}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Refund Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}