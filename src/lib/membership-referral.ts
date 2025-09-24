import { db } from '@/lib/db'

export interface MembershipReferralData {
  affiliateId: string
  referredUserId: string
  membershipPlan: string
  membershipAmount: number
  commissionRate: number
}

export class MembershipReferralService {
  /**
   * Create a new membership referral commission
   * This is called when a new user purchases a membership through an affiliate link
   */
  static async createMembershipReferral(data: MembershipReferralData) {
    try {
      // Check if a referral already exists for this user (one-time commission)
      const existingReferral = await db.membershipReferral.findUnique({
        where: { referredUserId: data.referredUserId }
      })

      if (existingReferral) {
        throw new Error('Referral commission already exists for this user')
      }

      // Calculate commission amount
      const commissionAmount = data.membershipAmount * data.commissionRate

      // Create the referral record
      const referral = await db.membershipReferral.create({
        data: {
          affiliateId: data.affiliateId,
          referredUserId: data.referredUserId,
          membershipPlan: data.membershipPlan as any,
          membershipAmount: data.membershipAmount,
          commissionAmount,
          commissionRate: data.commissionRate,
          status: 'PENDING'
        }
      })

      // Update affiliate earnings and referral count
      await db.affiliate.update({
        where: { id: data.affiliateId },
        data: {
          earnings: {
            increment: commissionAmount
          },
          referrals: {
            increment: 1
          }
        }
      })

      // Create earning record
      await db.earning.create({
        data: {
          userId: data.affiliateId,
          amount: commissionAmount,
          type: 'AFFILIATE_COMMISSION',
          description: `Membership referral commission for ${data.membershipPlan} plan`
        }
      })

      return referral
    } catch (error) {
      console.error('Error creating membership referral:', error)
      throw error
    }
  }

  /**
   * Process a membership referral commission (mark as paid)
   */
  static async processMembershipReferral(referralId: string) {
    try {
      const referral = await db.membershipReferral.update({
        where: { id: referralId },
        data: { status: 'PAID' }
      })

      return referral
    } catch (error) {
      console.error('Error processing membership referral:', error)
      throw error
    }
  }

  /**
   * Get all pending membership referrals for an affiliate
   */
  static async getPendingReferrals(affiliateId: string) {
    try {
      const referrals = await db.membershipReferral.findMany({
        where: {
          affiliateId,
          status: 'PENDING'
        },
        include: {
          referredUser: {
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return referrals
    } catch (error) {
      console.error('Error getting pending referrals:', error)
      throw error
    }
  }

  /**
   * Get all membership referrals for an affiliate
   */
  static async getAllReferrals(affiliateId: string) {
    try {
      const referrals = await db.membershipReferral.findMany({
        where: { affiliateId },
        include: {
          referredUser: {
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return referrals
    } catch (error) {
      console.error('Error getting all referrals:', error)
      throw error
    }
  }

  /**
   * Get referral statistics for an affiliate
   */
  static async getReferralStats(affiliateId: string) {
    try {
      const stats = await db.membershipReferral.groupBy({
        by: ['status'],
        where: { affiliateId },
        _count: {
          status: true
        },
        _sum: {
          commissionAmount: true
        }
      })

      const totalReferrals = await db.membershipReferral.count({
        where: { affiliateId }
      })

      const totalEarnings = await db.membershipReferral.aggregate({
        where: { affiliateId },
        _sum: {
          commissionAmount: true
        }
      })

      return {
        totalReferrals,
        totalEarnings: totalEarnings._sum.commissionAmount || 0,
        pendingReferrals: stats.find(s => s.status === 'PENDING')?._count.status || 0,
        paidReferrals: stats.find(s => s.status === 'PAID')?._count.status || 0,
        pendingEarnings: stats.find(s => s.status === 'PENDING')?._sum.commissionAmount || 0,
        paidEarnings: stats.find(s => s.status === 'PAID')?._sum.commissionAmount || 0
      }
    } catch (error) {
      console.error('Error getting referral stats:', error)
      throw error
    }
  }

  /**
   * Check if a user was referred by an affiliate and process commission
   * This should be called when a user purchases a membership
   */
  static async processMembershipPurchase(userId: string, membershipPlan: string, membershipAmount: number) {
    try {
      // Get user with referral info
      const user = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          referredBy: true,
          isPaidMember: true
        }
      })

      if (!user || !user.referredBy || user.isPaidMember) {
        // No referral info or user already paid (one-time commission)
        return null
      }

      // Find affiliate by code
      const affiliate = await db.affiliate.findFirst({
        where: { code: user.referredBy }
      })

      if (!affiliate) {
        throw new Error('Affiliate not found for referral code')
      }

      // Create the referral commission
      const referral = await this.createMembershipReferral({
        affiliateId: affiliate.id,
        referredUserId: userId,
        membershipPlan,
        membershipAmount,
        commissionRate: affiliate.commission
      })

      // Update user to mark as paid member
      await db.user.update({
        where: { id: userId },
        data: { isPaidMember: true }
      })

      return referral
    } catch (error) {
      console.error('Error processing membership purchase:', error)
      throw error
    }
  }
}