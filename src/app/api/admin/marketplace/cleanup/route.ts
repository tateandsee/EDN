import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/marketplace/cleanup - Remove non-female AI models from marketplace
export async function POST(request: NextRequest) {
  try {
    // Get all marketplace items
    const allItems = await db.marketplaceItem.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orders: true,
        reviews: true
      }
    })

    const itemsToDelete = []
    const itemsToKeep = []

    // Identify items to delete (non-female AI models)
    for (const item of allItems) {
      // Check if item is an AI model and if it's not a female AI model
      const isAIModel = item.type === 'AI_MODEL'
      const isFemaleAIModel = isFemaleModel(item.title, item.description, item.tags)
      
      if (isAIModel && !isFemaleAIModel) {
        // Check if item has orders or reviews
        if (item.orders.length === 0 && item.reviews.length === 0) {
          itemsToDelete.push(item)
        } else {
          // Mark as inactive instead of deleting if it has orders/reviews
          itemsToKeep.push({
            ...item,
            reason: 'Has orders or reviews, marked as inactive'
          })
        }
      } else {
        itemsToKeep.push({
          ...item,
          reason: isAIModel ? 'Female AI model - keeping' : 'Not an AI model - keeping'
        })
      }
    }

    // Delete items that can be safely removed
    const deletedItems = []
    for (const item of itemsToDelete) {
      try {
        await db.marketplaceItem.delete({
          where: { id: item.id }
        })
        deletedItems.push({
          id: item.id,
          title: item.title,
          reason: 'Non-female AI model - deleted'
        })
      } catch (error) {
        console.error(`Error deleting item ${item.id}:`, error)
      }
    }

    // Mark items with orders/reviews as inactive
    const markedInactive = []
    for (const item of itemsToKeep.filter(i => i.reason.includes('marked as inactive'))) {
      try {
        await db.marketplaceItem.update({
          where: { id: item.id },
          data: { status: 'INACTIVE' }
        })
        markedInactive.push({
          id: item.id,
          title: item.title,
          reason: 'Non-female AI model with orders/reviews - marked inactive'
        })
      } catch (error) {
        console.error(`Error marking item ${item.id} as inactive:`, error)
      }
    }

    return NextResponse.json({
      message: 'Marketplace cleanup completed',
      stats: {
        totalItems: allItems.length,
        itemsDeleted: deletedItems.length,
        itemsMarkedInactive: markedInactive.length,
        itemsKept: itemsToKeep.filter(i => !i.reason.includes('marked as inactive')).length
      },
      deletedItems,
      markedInactive,
      keptItems: itemsToKeep.filter(i => !i.reason.includes('marked as inactive'))
    })
  } catch (error) {
    console.error('Error during marketplace cleanup:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup marketplace' },
      { status: 500 }
    )
  }
}

// Helper function to determine if an AI model is female
function isFemaleModel(title: string, description: string | null, tags: string | null): boolean {
  const textToCheck = `${title} ${description || ''} ${tags || ''}`.toLowerCase()
  
  // Female indicators
  const femaleIndicators = [
    'female', 'woman', 'women', 'girl', 'lady', 'ladies', 'she', 'her',
    'feminine', 'goddess', 'queen', 'princess', 'babe', 'chick', 'gal',
    'miss', 'mrs', 'ms', 'bride', 'wife', 'girlfriend', 'sister', 'mother',
    'daughter', 'aunt', 'cousin', 'niece', 'grandmother', 'granddaughter'
  ]
  
  // Male indicators (to exclude)
  const maleIndicators = [
    'male', 'man', 'men', 'boy', 'guy', 'gentleman', 'he', 'him', 'his',
    'masculine', 'god', 'king', 'prince', 'dude', 'bro', 'buddy', 'pal',
    'mr', 'groom', 'husband', 'boyfriend', 'brother', 'father', 'son',
    'uncle', 'nephew', 'grandfather', 'grandson'
  ]
  
  // Check for female indicators
  const hasFemaleIndicator = femaleIndicators.some(indicator => 
    textToCheck.includes(indicator)
  )
  
  // Check for male indicators
  const hasMaleIndicator = maleIndicators.some(indicator => 
    textToCheck.includes(indicator)
  )
  
  // If it has female indicators and no male indicators, it's likely a female model
  if (hasFemaleIndicator && !hasMaleIndicator) {
    return true
  }
  
  // If it has male indicators, it's definitely not a female model
  if (hasMaleIndicator) {
    return false
  }
  
  // If no clear gender indicators, check for EDN female model naming patterns
  const ednFemalePatterns = [
    'edn_sfw_', 'edn_nsfw_', 'female model', 'ai girl', 'ai woman',
    'virtual girl', 'virtual woman', 'digital girl', 'digital woman'
  ]
  
  const hasEDNFemalePattern = ednFemalePatterns.some(pattern => 
    textToCheck.includes(pattern)
  )
  
  return hasEDNFemalePattern
}