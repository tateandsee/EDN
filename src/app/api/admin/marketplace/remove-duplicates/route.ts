import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/marketplace/remove-duplicates - Remove duplicate items from marketplace
export async function POST(request: NextRequest) {
  try {
    // Get all active marketplace items
    const allItems = await db.marketplaceItem.findMany({
      where: {
        status: 'ACTIVE'
      },
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
      },
      orderBy: {
        createdAt: 'desc' // Keep newer items
      }
    })

    const duplicatesToRemove = []
    const itemsToKeep = []
    const processedGroups = new Set()

    // Group items by similarity and identify duplicates
    for (const item of allItems) {
      // Skip if already processed
      if (processedGroups.has(item.id)) continue

      // Find potential duplicates
      const duplicates = allItems.filter(otherItem => {
        if (otherItem.id === item.id || processedGroups.has(otherItem.id)) return false
        
        // Check for title similarity (case insensitive, ignoring minor differences)
        const titleSimilar = areTitlesSimilar(item.title, otherItem.title)
        
        // Check for description similarity if both have descriptions
        const descSimilar = item.description && otherItem.description && 
                          areDescriptionsSimilar(item.description, otherItem.description)
        
        // Check for image similarity if both have images
        const imageSimilar = item.images && otherItem.images && 
                           areImagesSimilar(item.images, otherItem.images)
        
        // Consider items duplicates if they have similar titles OR
        // (similar descriptions AND similar images)
        return titleSimilar || (descSimilar && imageSimilar)
      })

      if (duplicates.length > 0) {
        // Mark all duplicates as processed
        duplicates.forEach(dup => processedGroups.add(dup.id))
        processedGroups.add(item.id)

        // Keep the newest item (already ordered by createdAt desc)
        itemsToKeep.push({
          ...item,
          reason: 'Kept - newest version'
        })

        // Mark duplicates for removal
        duplicates.forEach(dup => {
          // Check if duplicate has orders or reviews
          if (dup.orders.length === 0 && dup.reviews.length === 0) {
            duplicatesToRemove.push(dup)
          } else {
            // Mark as inactive instead of deleting if it has orders/reviews
            itemsToKeep.push({
              ...dup,
              reason: 'Has orders or reviews - marked as inactive'
            })
          }
        })
      } else {
        // No duplicates found, keep the item
        processedGroups.add(item.id)
        itemsToKeep.push({
          ...item,
          reason: 'No duplicates found'
        })
      }
    }

    // Delete duplicate items that can be safely removed
    const deletedItems = []
    for (const item of duplicatesToRemove) {
      try {
        await db.marketplaceItem.delete({
          where: { id: item.id }
        })
        deletedItems.push({
          id: item.id,
          title: item.title,
          reason: 'Duplicate - deleted'
        })
      } catch (error) {
        console.error(`Error deleting duplicate item ${item.id}:`, error)
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
          reason: 'Duplicate with orders/reviews - marked inactive'
        })
      } catch (error) {
        console.error(`Error marking duplicate item ${item.id} as inactive:`, error)
      }
    }

    return NextResponse.json({
      message: 'Duplicate removal completed',
      stats: {
        totalItems: allItems.length,
        duplicatesFound: duplicatesToRemove.length + markedInactive.length,
        itemsDeleted: deletedItems.length,
        itemsMarkedInactive: markedInactive.length,
        itemsKept: itemsToKeep.filter(i => !i.reason.includes('marked as inactive')).length
      },
      deletedItems,
      markedInactive,
      keptItems: itemsToKeep.filter(i => !i.reason.includes('marked as inactive'))
    })
  } catch (error) {
    console.error('Error during duplicate removal:', error)
    return NextResponse.json(
      { error: 'Failed to remove duplicates' },
      { status: 500 }
    )
  }
}

// Helper function to check if titles are similar
function areTitlesSimilar(title1: string, title2: string): boolean {
  const cleanTitle1 = title1.toLowerCase().trim()
  const cleanTitle2 = title2.toLowerCase().trim()
  
  // Exact match
  if (cleanTitle1 === cleanTitle2) return true
  
  // Check if one is a subset of the other (allowing for minor variations)
  if (cleanTitle1.includes(cleanTitle2) || cleanTitle2.includes(cleanTitle1)) {
    return true
  }
  
  // Check for EDN pattern similarity (e.g., EDN SFW Model vs EDN NSFW Model)
  const ednPattern1 = cleanTitle1.replace(/edn_(sfw|nsfw)_/i, 'edn_')
  const ednPattern2 = cleanTitle2.replace(/edn_(sfw|nsfw)_/i, 'edn_')
  if (ednPattern1 === ednPattern2) return true
  
  // Check for common AI model patterns
  const modelPattern1 = cleanTitle1.replace(/\s*(model|ai|virtual|digital)\s*/gi, '')
  const modelPattern2 = cleanTitle2.replace(/\s*(model|ai|virtual|digital)\s*/gi, '')
  if (modelPattern1 === modelPattern2) return true
  
  return false
}

// Helper function to check if descriptions are similar
function areDescriptionsSimilar(desc1: string, desc2: string): boolean {
  const cleanDesc1 = desc1.toLowerCase().trim()
  const cleanDesc2 = desc2.toLowerCase().trim()
  
  // Exact match
  if (cleanDesc1 === cleanDesc2) return true
  
  // Check if one is a subset of the other
  if (cleanDesc1.includes(cleanDesc2) || cleanDesc2.includes(cleanDesc1)) {
    return true
  }
  
  // Check for high similarity (more than 80% similar words)
  const words1 = cleanDesc1.split(/\s+/).filter(word => word.length > 2)
  const words2 = cleanDesc2.split(/\s+/).filter(word => word.length > 2)
  
  if (words1.length === 0 || words2.length === 0) return false
  
  const commonWords = words1.filter(word => words2.includes(word))
  const similarity = Math.max(
    commonWords.length / words1.length,
    commonWords.length / words2.length
  )
  
  return similarity > 0.8
}

// Helper function to check if images are similar
function areImagesSimilar(images1: string, images2: string): boolean {
  try {
    const parsedImages1 = JSON.parse(images1)
    const parsedImages2 = JSON.parse(images2)
    
    if (!Array.isArray(parsedImages1) || !Array.isArray(parsedImages2)) return false
    if (parsedImages1.length === 0 || parsedImages2.length === 0) return false
    
    // Check if they have the same number of images
    if (parsedImages1.length !== parsedImages2.length) return false
    
    // Check if any images are identical (exact URL match)
    const hasIdenticalImage = parsedImages1.some(img1 => 
      parsedImages2.some(img2 => img1 === img2)
    )
    
    if (hasIdenticalImage) return true
    
    // For base64 images, check if they start with the same data pattern
    const hasSimilarPattern = parsedImages1.some(img1 => {
      if (!img1.startsWith('data:')) return false
      const mimeType1 = img1.split(';')[0]
      return parsedImages2.some(img2 => {
        if (!img2.startsWith('data:')) return false
        const mimeType2 = img2.split(';')[0]
        return mimeType1 === mimeType2
      })
    })
    
    return hasSimilarPattern
  } catch (error) {
    console.error('Error parsing images for similarity check:', error)
    return false
  }
}