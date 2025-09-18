import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { marketplaceImageValidator } from '@/lib/marketplace-image-validator'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const autoFix = searchParams.get('autoFix') === 'true'
    const detailed = searchParams.get('detailed') === 'true'
    
    // Scan all items
    const scanResult = await marketplaceImageValidator.scanAllItems()
    
    // Auto-fix if requested
    let fixedCount = 0
    if (autoFix && scanResult.itemsWithIssues > 0) {
      for (const issue of scanResult.issues) {
        const fixed = await marketplaceImageValidator.autoFixItem(issue.id)
        if (fixed) fixedCount++
      }
    }
    
    const result = {
      timestamp: new Date().toISOString(),
      totalItems: scanResult.totalItems,
      validItems: scanResult.validItems,
      itemsWithIssues: scanResult.itemsWithIssues,
      issues: detailed ? scanResult.issues : undefined,
      status: scanResult.itemsWithIssues === 0 ? 'HEALTHY' : 'ATTENTION_REQUIRED',
      autoFixed: autoFix ? fixedCount : 0,
      successRate: `${((scanResult.validItems / scanResult.totalItems) * 100).toFixed(2)}%`
    }
    
    console.log('📊 Enhanced Marketplace Monitoring:', {
      totalItems: result.totalItems,
      issuesFound: result.itemsWithIssues,
      status: result.status,
      autoFixed: result.autoFixed,
      successRate: result.successRate
    })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error in enhanced marketplace monitoring:', error)
    return NextResponse.json(
      { 
        error: 'Enhanced monitoring failed',
        timestamp: new Date().toISOString(),
        status: 'ERROR'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, itemId } = body
    
    if (action === 'validate-item' && itemId) {
      // Get the item
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
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }
      
      // Validate the item
      const validation = await marketplaceImageValidator.validateMarketplaceItem({
        thumbnail: item.thumbnail,
        images: item.images
      })
      
      // Log the validation
      await marketplaceImageValidator.logValidation(itemId, 'manual', validation)
      
      return NextResponse.json({
        itemId,
        title: item.title,
        validation,
        timestamp: new Date().toISOString()
      })
    }
    
    if (action === 'auto-fix-item' && itemId) {
      const fixed = await marketplaceImageValidator.autoFixItem(itemId)
      
      return NextResponse.json({
        itemId,
        fixed,
        timestamp: new Date().toISOString()
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error in POST request:', error)
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    )
  }
}