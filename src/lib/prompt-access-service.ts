import { db } from './db'

export interface PromptAccess {
  id: string
  orderId: string
  userId: string
  itemId: string
  isUnlocked: boolean
  unlockedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export class PromptAccessService {
  /**
   * Check if a user has access to prompts for a specific marketplace item
   */
  static async hasPromptAccess(userId: string, itemId: string): Promise<boolean> {
    try {
      // Check if user has a completed order for this item
      const order = await db.marketplaceOrder.findFirst({
        where: {
          userId,
          itemId,
          status: 'COMPLETED'
        },
        include: {
          promptAccess: true
        }
      })

      if (!order) {
        return false
      }

      // Check if prompt access is unlocked
      if (order.promptAccess) {
        return order.promptAccess.isUnlocked
      }

      // For backward compatibility, if order is completed but no prompt access record exists,
      // consider it as having access (for existing completed orders)
      return true
    } catch (error) {
      console.error('Error checking prompt access:', error)
      return false
    }
  }

  /**
   * Get prompt access details for a user and item
   */
  static async getPromptAccess(userId: string, itemId: string): Promise<PromptAccess | null> {
    try {
      const access = await db.marketplacePromptAccess.findFirst({
        where: {
          userId,
          itemId
        }
      })

      return access
    } catch (error) {
      console.error('Error getting prompt access:', error)
      return null
    }
  }

  /**
   * Unlock prompt access for a user after purchase
   */
  static async unlockPromptAccess(orderId: string, userId: string, itemId: string): Promise<PromptAccess> {
    try {
      // Check if access record already exists
      const existingAccess = await db.marketplacePromptAccess.findUnique({
        where: {
          orderId
        }
      })

      if (existingAccess) {
        // Update existing record
        const updatedAccess = await db.marketplacePromptAccess.update({
          where: {
            orderId
          },
          data: {
            isUnlocked: true,
            unlockedAt: new Date()
          }
        })

        return updatedAccess
      } else {
        // Create new access record
        const newAccess = await db.marketplacePromptAccess.create({
          data: {
            orderId,
            userId,
            itemId,
            isUnlocked: true,
            unlockedAt: new Date()
          }
        })

        return newAccess
      }
    } catch (error) {
      console.error('Error unlocking prompt access:', error)
      throw new Error('Failed to unlock prompt access')
    }
  }

  /**
   * Create prompt access record (locked by default)
   */
  static async createPromptAccess(orderId: string, userId: string, itemId: string): Promise<PromptAccess> {
    try {
      const access = await db.marketplacePromptAccess.create({
        data: {
          orderId,
          userId,
          itemId,
          isUnlocked: false
        }
      })

      return access
    } catch (error) {
      console.error('Error creating prompt access:', error)
      throw new Error('Failed to create prompt access record')
    }
  }

  /**
   * Get all items a user has prompt access to
   */
  static async getUserPromptAccess(userId: string): Promise<string[]> {
    try {
      const accessRecords = await db.marketplacePromptAccess.findMany({
        where: {
          userId,
          isUnlocked: true
        },
        select: {
          itemId: true
        }
      })

      return accessRecords.map(record => record.itemId)
    } catch (error) {
      console.error('Error getting user prompt access:', error)
      return []
    }
  }

  /**
   * Check if user has purchased a specific item (for backward compatibility)
   */
  static async hasPurchasedItem(userId: string, itemId: string): Promise<boolean> {
    try {
      const order = await db.marketplaceOrder.findFirst({
        where: {
          userId,
          itemId,
          status: 'COMPLETED'
        }
      })

      return !!order
    } catch (error) {
      console.error('Error checking purchase status:', error)
      return false
    }
  }

  /**
   * Get user's prompt access statistics
   */
  static async getUserPromptStats(userId: string): Promise<{
    totalItems: number
    unlockedItems: number
    totalSpent: number
  }> {
    try {
      const [completedOrders, unlockedAccess] = await Promise.all([
        db.marketplaceOrder.findMany({
          where: {
            userId,
            status: 'COMPLETED'
          }
        }),
        db.marketplacePromptAccess.findMany({
          where: {
            userId,
            isUnlocked: true
          }
        })
      ])

      const totalSpent = completedOrders.reduce((sum, order) => sum + order.amount, 0)
      const uniqueItems = new Set(completedOrders.map(order => order.itemId))

      return {
        totalItems: uniqueItems.size,
        unlockedItems: unlockedAccess.length,
        totalSpent
      }
    } catch (error) {
      console.error('Error getting user prompt stats:', error)
      return {
        totalItems: 0,
        unlockedItems: 0,
        totalSpent: 0
      }
    }
  }
}