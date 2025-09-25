import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { imageIntegrityService } from '@/lib/image-integrity'
import { db } from '@/lib/db'

// Admin-only endpoint for image integrity management
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const itemId = searchParams.get('itemId')

    switch (action) {
      case 'validate-all':
        const bulkResult = await imageIntegrityService.validateAllMarketplaceItems()
        return NextResponse.json(bulkResult)

      case 'validate-item':
        if (!itemId) {
          return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
        }

        const item = await db.marketplaceItem.findUnique({
          where: { id: itemId },
          select: {
            id: true,
            title: true,
            thumbnail: true,
            images: true
          }
        })

        if (!item) {
          return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }

        const itemResult = await imageIntegrityService.validateMarketplaceItemImages(item)
        return NextResponse.json({
          itemId,
          title: item.title,
          ...itemResult
        })

      case 'stats':
        const stats = await getImageIntegrityStats()
        return NextResponse.json(stats)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in image integrity API:', error)
    return NextResponse.json(
      { error: 'Failed to process image integrity request' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { action, itemId, corrections } = await request.json()

    switch (action) {
      case 'correct-item':
        if (!itemId || !corrections) {
          return NextResponse.json({ error: 'Item ID and corrections required' }, { status: 400 })
        }

        const correctedItem = await db.marketplaceItem.update({
          where: { id: itemId },
          data: {
            thumbnail: corrections.thumbnail,
            images: corrections.images ? JSON.stringify(corrections.images) : undefined
          }
        })

        return NextResponse.json({
          success: true,
          item: correctedItem,
          message: 'Item image references corrected successfully'
        })

      case 'bulk-correct':
        if (!corrections || !Array.isArray(corrections)) {
          return NextResponse.json({ error: 'Valid corrections array required' }, { status: 400 })
        }

        const bulkCorrectionResults = []
        
        for (const correction of corrections) {
          try {
            await db.marketplaceItem.update({
              where: { id: correction.itemId },
              data: {
                thumbnail: correction.thumbnail,
                images: correction.images ? JSON.stringify(correction.images) : undefined
              }
            })
            bulkCorrectionResults.push({ itemId: correction.itemId, success: true })
          } catch (error) {
            bulkCorrectionResults.push({ 
              itemId: correction.itemId, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            })
          }
        }

        return NextResponse.json({
          success: true,
          results: bulkCorrectionResults,
          message: `Bulk correction completed for ${corrections.length} items`
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in image integrity POST API:', error)
    return NextResponse.json(
      { error: 'Failed to process image integrity request' },
      { status: 500 }
    )
  }
}

async function getImageIntegrityStats() {
  const [totalItems, itemsWithImages, itemsWithoutImages] = await Promise.all([
    db.marketplaceItem.count({ where: { status: 'ACTIVE' } }),
    db.marketplaceItem.count({ 
      where: { 
        status: 'ACTIVE',
        OR: [
          { thumbnail: { not: null } },
          { images: { not: null } }
        ]
      }
    }),
    db.marketplaceItem.count({ 
      where: { 
        status: 'ACTIVE',
        AND: [
          { thumbnail: null },
          { images: null }
        ]
      }
    })
  ])

  // Sample validation for first 100 items to estimate integrity
  const sampleItems = await db.marketplaceItem.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      title: true,
      thumbnail: true,
      images: true
    },
    take: 100
  })

  let validSampleCount = 0
  const sampleErrors: string[] = []

  for (const item of sampleItems) {
    try {
      const result = await imageIntegrityService.validateMarketplaceItemImages(item)
      if (result.isValid) {
        validSampleCount++
      } else {
        sampleErrors.push(...result.errors.slice(0, 3)) // Limit errors per item
      }
    } catch (error) {
      sampleErrors.push(`Item ${item.id}: Validation failed`)
    }
  }

  const estimatedValidItems = Math.round((validSampleCount / sampleItems.length) * itemsWithImages)
  const estimatedInvalidItems = itemsWithImages - estimatedValidItems

  return {
    totalItems,
    itemsWithImages,
    itemsWithoutImages,
    estimatedValidItems,
    estimatedInvalidItems,
    sampleSize: sampleItems.length,
    sampleValidCount: validSampleCount,
    sampleErrorRate: ((sampleItems.length - validSampleCount) / sampleItems.length * 100).toFixed(1) + '%',
    recentErrors: sampleErrors.slice(0, 10) // Show first 10 errors
  }
}