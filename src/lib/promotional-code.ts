import { db } from '@/lib/db'
import { PromotionalCode, PromotionalCodeType, Order } from '@prisma/client'

export interface PromotionalCodeCreateInput {
  code: string
  description?: string
  type: PromotionalCodeType
  value: number
  maxUses?: number
  validUntil?: Date
  minAmount?: number
  applicablePlans?: string[]
}

export interface PromotionalCodeUpdateInput {
  description?: string
  type?: PromotionalCodeType
  value?: number
  maxUses?: number
  validUntil?: Date
  minAmount?: number
  applicablePlans?: string[]
  isActive?: boolean
}

export class PromotionalCodeService {
  static async create(data: PromotionalCodeCreateInput): Promise<PromotionalCode> {
    return await db.promotionalCode.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        type: data.type,
        value: data.value,
        maxUses: data.maxUses,
        validUntil: data.validUntil,
        minAmount: data.minAmount,
        applicablePlans: data.applicablePlans ? JSON.stringify(data.applicablePlans) : null,
      }
    })
  }

  static async update(id: string, data: PromotionalCodeUpdateInput): Promise<PromotionalCode> {
    return await db.promotionalCode.update({
      where: { id },
      data: {
        ...(data.description !== undefined && { description: data.description }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.value !== undefined && { value: data.value }),
        ...(data.maxUses !== undefined && { maxUses: data.maxUses }),
        ...(data.validUntil !== undefined && { validUntil: data.validUntil }),
        ...(data.minAmount !== undefined && { minAmount: data.minAmount }),
        ...(data.applicablePlans !== undefined && { 
          applicablePlans: data.applicablePlans ? JSON.stringify(data.applicablePlans) : null 
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      }
    })
  }

  static async delete(id: string): Promise<void> {
    await db.promotionalCode.delete({
      where: { id }
    })
  }

  static async findById(id: string): Promise<PromotionalCode | null> {
    return await db.promotionalCode.findUnique({
      where: { id }
    })
  }

  static async findByCode(code: string): Promise<PromotionalCode | null> {
    return await db.promotionalCode.findUnique({
      where: { code: code.toUpperCase() }
    })
  }

  static async findAll(): Promise<PromotionalCode[]> {
    return await db.promotionalCode.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  static async validateCode(code: string, planAmount: number, planName: string): Promise<{
    isValid: boolean
    promotionalCode?: PromotionalCode
    error?: string
    discountAmount?: number
  }> {
    const promotionalCode = await this.findByCode(code)
    
    if (!promotionalCode) {
      return { isValid: false, error: 'Promotional code not found' }
    }

    if (!promotionalCode.isActive) {
      return { isValid: false, error: 'Promotional code is not active' }
    }

    const now = new Date()
    if (promotionalCode.validFrom > now) {
      return { isValid: false, error: 'Promotional code is not yet valid' }
    }

    if (promotionalCode.validUntil && promotionalCode.validUntil < now) {
      return { isValid: false, error: 'Promotional code has expired' }
    }

    if (promotionalCode.maxUses && promotionalCode.usedCount >= promotionalCode.maxUses) {
      return { isValid: false, error: 'Promotional code has been fully used' }
    }

    if (promotionalCode.minAmount && planAmount < promotionalCode.minAmount) {
      return { 
        isValid: false, 
        error: `Minimum order amount of $${promotionalCode.minAmount} required` 
      }
    }

    // Check if code applies to this plan
    if (promotionalCode.applicablePlans) {
      const applicablePlans = JSON.parse(promotionalCode.applicablePlans) as string[]
      if (applicablePlans.length > 0 && !applicablePlans.includes(planName)) {
        return { isValid: false, error: 'Promotional code not applicable to this plan' }
      }
    }

    // Calculate discount
    let discountAmount = 0
    if (promotionalCode.type === 'PERCENTAGE') {
      discountAmount = planAmount * (promotionalCode.value / 100)
    } else if (promotionalCode.type === 'FIXED_AMOUNT') {
      discountAmount = Math.min(promotionalCode.value, planAmount)
    }

    return {
      isValid: true,
      promotionalCode,
      discountAmount
    }
  }

  static async useCode(codeId: string): Promise<void> {
    await db.promotionalCode.update({
      where: { id: codeId },
      data: { usedCount: { increment: 1 } }
    })
  }

  static async getUsageStats(codeId: string): Promise<{
    totalUses: number
    totalDiscount: number
    orders: Order[]
  }> {
    const orders = await db.order.findMany({
      where: { promotionalCodeId: codeId },
      include: { user: true }
    })

    const totalUses = orders.length
    const totalDiscount = orders.reduce((sum, order) => sum + (order.discountAmount || 0), 0)

    return {
      totalUses,
      totalDiscount,
      orders
    }
  }
}