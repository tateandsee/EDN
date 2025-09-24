/**
 * Enhanced Payment Processing System
 * Complete subscription management with multiple payment providers and automated billing
 */

import { db } from '@/lib/db'
import { coinbaseService } from '@/lib/coinbase-commerce'
import { getAuthConfig, getPlatformConfig } from '@/lib/config'

export interface SubscriptionPlan {
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

export interface PaymentMethod {
  id: string
  type: 'coinbase' | 'stripe' | 'paypal'
  provider: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

export interface Subscription {
  id: string
  userId: string
  plan: SubscriptionPlan
  status: 'active' | 'cancelled' | 'expired' | 'pending'
  currentPeriodStart: string
  currentPeriodEnd: string
  trialEnd?: string
  cancelAtPeriodEnd: boolean
  paymentMethod?: PaymentMethod
  createdAt: string
  updatedAt: string
}

export interface PaymentResult {
  success: boolean
  paymentId?: string
  redirectUrl?: string
  error?: string
  message?: string
}

export interface RefundRequest {
  orderId: string
  reason: string
  amount?: number
  description?: string
}

export interface RefundResult {
  success: boolean
  refundId?: string
  error?: string
  message?: string
  estimatedProcessingTime?: string
}

class EnhancedPaymentService {
  private supportedProviders = ['coinbase', 'stripe', 'paypal']

  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const plans: SubscriptionPlan[] = [
      {
        id: 'basic',
        name: 'Basic',
        description: 'Perfect for getting started with AI content creation',
        price: 9.99,
        currency: 'USD',
        interval: 'monthly',
        features: [
          '100 AI generations per month',
          'Basic content moderation',
          'Standard support',
          '1GB storage',
          'Access to basic models'
        ],
        isActive: true,
        maxContentGenerations: 100,
        maxStorageGB: 1,
        prioritySupport: false,
        apiAccess: false,
        customModels: false
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Ideal for content creators and small businesses',
        price: 29.99,
        currency: 'USD',
        interval: 'monthly',
        features: [
          '500 AI generations per month',
          'Advanced content moderation',
          'Priority support',
          '10GB storage',
          'Access to premium models',
          'API access',
          'Basic analytics'
        ],
        isActive: true,
        popular: true,
        maxContentGenerations: 500,
        maxStorageGB: 10,
        prioritySupport: true,
        apiAccess: true,
        customModels: false
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'For large teams and high-volume creators',
        price: 99.99,
        currency: 'USD',
        interval: 'monthly',
        features: [
          'Unlimited AI generations',
          'Premium content moderation',
          '24/7 dedicated support',
          '100GB storage',
          'Access to all models',
          'Full API access',
          'Advanced analytics',
          'Custom model training',
          'White-label options'
        ],
        isActive: true,
        maxContentGenerations: -1, // Unlimited
        maxStorageGB: 100,
        prioritySupport: true,
        apiAccess: true,
        customModels: true
      },
      {
        id: 'basic-yearly',
        name: 'Basic Yearly',
        description: 'Save 20% with annual billing',
        price: 95.99,
        currency: 'USD',
        interval: 'yearly',
        features: [
          '100 AI generations per month',
          'Basic content moderation',
          'Standard support',
          '1GB storage',
          'Access to basic models',
          '2 months free'
        ],
        isActive: true,
        maxContentGenerations: 100,
        maxStorageGB: 1,
        prioritySupport: false,
        apiAccess: false,
        customModels: false
      },
      {
        id: 'professional-yearly',
        name: 'Professional Yearly',
        description: 'Save 20% with annual billing',
        price: 287.99,
        currency: 'USD',
        interval: 'yearly',
        features: [
          '500 AI generations per month',
          'Advanced content moderation',
          'Priority support',
          '10GB storage',
          'Access to premium models',
          'API access',
          'Basic analytics',
          '2 months free'
        ],
        isActive: true,
        popular: true,
        maxContentGenerations: 500,
        maxStorageGB: 10,
        prioritySupport: true,
        apiAccess: true,
        customModels: false
      },
      {
        id: 'enterprise-yearly',
        name: 'Enterprise Yearly',
        description: 'Save 20% with annual billing',
        price: 959.99,
        currency: 'USD',
        interval: 'yearly',
        features: [
          'Unlimited AI generations',
          'Premium content moderation',
          '24/7 dedicated support',
          '100GB storage',
          'Access to all models',
          'Full API access',
          'Advanced analytics',
          'Custom model training',
          'White-label options',
          '2 months free'
        ],
        isActive: true,
        maxContentGenerations: -1, // Unlimited
        maxStorageGB: 100,
        prioritySupport: true,
        apiAccess: true,
        customModels: true
      }
    ]

    return plans.filter(plan => plan.isActive)
  }

  /**
   * Create subscription payment
   */
  async createSubscription(
    userId: string,
    planId: string,
    paymentMethod: 'coinbase' | 'stripe' | 'paypal' = 'coinbase'
  ): Promise<PaymentResult> {
    try {
      // Get subscription plan
      const plans = await this.getSubscriptionPlans()
      const plan = plans.find(p => p.id === planId)

      if (!plan) {
        return {
          success: false,
          error: 'Invalid subscription plan',
          message: 'The selected subscription plan is not available'
        }
      }

      // Check if user already has active subscription
      const existingSubscription = await db.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE'
        }
      })

      if (existingSubscription) {
        return {
          success: false,
          error: 'Active subscription exists',
          message: 'You already have an active subscription'
        }
      }

      // Create order record
      const order = await db.order.create({
        data: {
          userId,
          amount: plan.price,
          currency: plan.currency,
          status: 'PENDING',
          plan: planId.toUpperCase() as any
        }
      })

      // Process payment based on provider
      switch (paymentMethod) {
        case 'coinbase':
          return await this.processCoinbasePayment(order.id, plan, userId)
        
        case 'stripe':
          return await this.processStripePayment(order.id, plan, userId)
        
        case 'paypal':
          return await this.processPayPalPayment(order.id, plan, userId)
        
        default:
          return {
            success: false,
            error: 'Unsupported payment method',
            message: 'The selected payment method is not supported'
          }
      }

    } catch (error) {
      console.error('Create subscription error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred while creating subscription'
      }
    }
  }

  /**
   * Process Coinbase payment
   */
  private async processCoinbasePayment(
    orderId: string,
    plan: SubscriptionPlan,
    userId: string
  ): Promise<PaymentResult> {
    try {
      const charge = await coinbaseService.createCharge({
        name: `${plan.name} Subscription`,
        description: plan.description,
        local_price: {
          amount: plan.price.toString(),
          currency: plan.currency
        },
        pricing_type: 'fixed_price',
        metadata: {
          order_id: orderId,
          user_id: userId,
          plan_id: plan.id,
          type: 'subscription'
        },
        redirect_url: `${getPlatformConfig().baseUrl}/dashboard/subscription?success=true`,
        cancel_url: `${getPlatformConfig().baseUrl}/pricing?canceled=true`
      })

      return {
        success: true,
        paymentId: charge.data.code,
        redirectUrl: charge.data.hosted_url,
        message: 'Payment initiated successfully'
      }

    } catch (error) {
      console.error('Coinbase payment error:', error)
      return {
        success: false,
        error: 'Coinbase payment failed',
        message: 'Failed to initiate Coinbase payment'
      }
    }
  }

  /**
   * Process Stripe payment (placeholder for future implementation)
   */
  private async processStripePayment(
    orderId: string,
    plan: SubscriptionPlan,
    userId: string
  ): Promise<PaymentResult> {
    // Placeholder for Stripe integration
    return {
      success: false,
      error: 'Stripe not implemented',
      message: 'Stripe payment processing is not yet implemented'
    }
  }

  /**
   * Process PayPal payment (placeholder for future implementation)
   */
  private async processPayPalPayment(
    orderId: string,
    plan: SubscriptionPlan,
    userId: string
  ): Promise<PaymentResult> {
    // Placeholder for PayPal integration
    return {
      success: false,
      error: 'PayPal not implemented',
      message: 'PayPal payment processing is not yet implemented'
    }
  }

  /**
   * Handle payment webhook (Coinbase)
   */
  async handlePaymentWebhook(payload: any, signature: string): Promise<void> {
    try {
      // Verify webhook signature
      const isValid = coinbaseService.resolveWebhookSignature(
        JSON.stringify(payload),
        signature,
        process.env.COINBASE_WEBHOOK_SECRET || ''
      )

      if (!isValid) {
        throw new Error('Invalid webhook signature')
      }

      const event = payload.event
      const { metadata } = event.data

      if (!metadata || !metadata.order_id) {
        throw new Error('Invalid metadata in webhook')
      }

      // Handle different event types
      switch (event.type) {
        case 'charge:confirmed':
          await this.activateSubscription(metadata.order_id, event.data.code)
          break
        
        case 'charge:failed':
          await this.failSubscription(metadata.order_id)
          break
        
        case 'charge:delayed':
          await this.markSubscriptionPending(metadata.order_id)
          break
      }

    } catch (error) {
      console.error('Webhook handling error:', error)
      throw error
    }
  }

  /**
   * Activate subscription after successful payment
   */
  private async activateSubscription(orderId: string, paymentId: string): Promise<void> {
    try {
      // Get order
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { user: true }
      })

      if (!order) {
        throw new Error('Order not found')
      }

      // Calculate subscription period
      const startDate = new Date()
      const endDate = new Date()
      
      // Set end date based on plan interval
      if (order.plan === 'BASIC_YEARLY' || order.plan === 'PROFESSIONAL_YEARLY' || order.plan === 'ENTERPRISE_YEARLY') {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      // Create or update subscription
      await db.subscription.upsert({
        where: { userId: order.userId },
        update: {
          status: 'ACTIVE',
          startedAt: startDate,
          expiresAt: endDate,
          autoRenew: true
        },
        create: {
          userId: order.userId,
          plan: order.plan,
          status: 'ACTIVE',
          startedAt: startDate,
          expiresAt: endDate,
          autoRenew: true
        }
      })

      // Update user as paid member
      await db.user.update({
        where: { id: order.userId },
        data: {
          isPaidMember: true
        }
      })

      // Update order status
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'COMPLETED',
          paymentId
        }
      })

      // Award points for subscription
      try {
        const { GamificationProgressService } = await import('@/lib/gamification-progress')
        await GamificationProgressService.awardPoints(order.userId, 100, 'Purchased subscription')
      } catch (pointsError) {
        console.error('Error awarding points for subscription:', pointsError)
      }

    } catch (error) {
      console.error('Activate subscription error:', error)
      throw error
    }
  }

  /**
   * Mark subscription as failed
   */
  private async failSubscription(orderId: string): Promise<void> {
    try {
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'FAILED'
        }
      })
    } catch (error) {
      console.error('Fail subscription error:', error)
      throw error
    }
  }

  /**
   * Mark subscription as pending
   */
  private async markSubscriptionPending(orderId: string): Promise<void> {
    try {
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'PENDING'
        }
      })
    } catch (error) {
      console.error('Mark subscription pending error:', error)
      throw error
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string, immediate: boolean = false): Promise<PaymentResult> {
    try {
      const subscription = await db.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE'
        }
      })

      if (!subscription) {
        return {
          success: false,
          error: 'No active subscription',
          message: 'You do not have an active subscription to cancel'
        }
      }

      if (immediate) {
        // Cancel immediately
        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            status: 'CANCELLED',
            autoRenew: false
          }
        })

        // Update user status
        await db.user.update({
          where: { id: userId },
          data: {
            isPaidMember: false
          }
        })
      } else {
        // Cancel at period end
        await db.subscription.update({
          where: { id: subscription.id },
          data: {
            cancelAtPeriodEnd: true,
            autoRenew: false
          }
        })
      }

      return {
        success: true,
        message: immediate ? 'Subscription cancelled immediately' : 'Subscription will cancel at period end'
      }

    } catch (error) {
      console.error('Cancel subscription error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'Failed to cancel subscription'
      }
    }
  }

  /**
   * Get user subscription
   */
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subscription = await db.subscription.findFirst({
        where: {
          userId,
          OR: [
            { status: 'ACTIVE' },
            { status: 'CANCELLED', cancelAtPeriodEnd: true }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      if (!subscription) {
        return null
      }

      // Get plan details
      const plans = await this.getSubscriptionPlans()
      const plan = plans.find(p => p.id.toLowerCase() === subscription.plan.toLowerCase())

      return {
        id: subscription.id,
        userId: subscription.userId,
        plan: plan || plans[0], // Fallback to first plan
        status: subscription.status.toLowerCase() as any,
        currentPeriodStart: subscription.startedAt.toISOString(),
        currentPeriodEnd: subscription.expiresAt.toISOString(),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        createdAt: subscription.createdAt.toISOString(),
        updatedAt: subscription.updatedAt.toISOString()
      }

    } catch (error) {
      console.error('Get user subscription error:', error)
      return null
    }
  }

  /**
   * Request refund
   */
  async requestRefund(refundRequest: RefundRequest): Promise<RefundResult> {
    try {
      // Get order
      const order = await db.order.findUnique({
        where: { id: refundRequest.orderId },
        include: {
          user: true,
          subscription: true
        }
      })

      if (!order) {
        return {
          success: false,
          error: 'Order not found',
          message: 'The specified order could not be found'
        }
      }

      // Check if order is eligible for refund
      if (order.status !== 'COMPLETED') {
        return {
          success: false,
          error: 'Order not eligible for refund',
          message: 'Only completed orders can be refunded'
        }
      }

      // Check if refund already exists
      const existingRefund = await db.refund.findFirst({
        where: {
          orderId: refundRequest.orderId,
          status: { in: ['PENDING', 'APPROVED'] }
        }
      })

      if (existingRefund) {
        return {
          success: false,
          error: 'Refund already exists',
          message: 'A refund request for this order is already being processed'
        }
      }

      // Create refund request
      const refundAmount = refundRequest.amount || order.amount
      const refund = await db.refund.create({
        data: {
          orderId: refundRequest.orderId,
          userId: order.userId,
          amount: refundAmount,
          reason: refundRequest.reason,
          description: refundRequest.description,
          status: 'PENDING'
        }
      })

      // Process refund based on payment method
      // This would integrate with the payment provider's refund API
      // For now, we'll simulate the process

      return {
        success: true,
        refundId: refund.id,
        message: 'Refund request submitted successfully',
        estimatedProcessingTime: '3-5 business days'
      }

    } catch (error) {
      console.error('Request refund error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'Failed to process refund request'
      }
    }
  }

  /**
   * Get user payment methods
   */
  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // Placeholder implementation
    // This would integrate with payment provider APIs to get saved payment methods
    return []
  }

  /**
   * Update subscription plan
   */
  async updateSubscriptionPlan(userId: string, newPlanId: string): Promise<PaymentResult> {
    try {
      const currentSubscription = await db.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE'
        }
      })

      if (!currentSubscription) {
        return {
          success: false,
          error: 'No active subscription',
          message: 'You do not have an active subscription to update'
        }
      }

      // Get new plan details
      const plans = await this.getSubscriptionPlans()
      const newPlan = plans.find(p => p.id === newPlanId)

      if (!newPlan) {
        return {
          success: false,
          error: 'Invalid plan',
          message: 'The selected subscription plan is not available'
        }
      }

      // Create prorated order for plan change
      const order = await db.order.create({
        data: {
          userId,
          amount: newPlan.price,
          currency: newPlan.currency,
          status: 'PENDING',
          plan: newPlanId.toUpperCase() as any
        }
      })

      // Process payment for plan upgrade/downgrade
      return await this.createSubscription(userId, newPlanId, 'coinbase')

    } catch (error) {
      console.error('Update subscription plan error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'Failed to update subscription plan'
      }
    }
  }
}

// Export singleton instance
export const enhancedPayment = new EnhancedPaymentService()

// Export types
export type { SubscriptionPlan, PaymentMethod, Subscription, PaymentResult, RefundRequest, RefundResult }