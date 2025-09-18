import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get total marketplace items count
    const totalItems = await db.marketplaceItem.count({
      where: {
        status: 'ACTIVE'
      }
    })

    // Get active creators count (users with active marketplace items)
    const activeCreatorsData = await db.marketplaceItem.groupBy({
      by: ['userId'],
      where: {
        status: 'ACTIVE'
      },
      _count: true
    })
    const activeCreators = activeCreatorsData.length

    // Get total revenue from completed marketplace orders
    const revenueResult = await db.marketplaceOrder.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })
    const totalRevenue = revenueResult._sum.amount || 0

    // Get average rating
    const ratingsResult = await db.marketplaceReview.aggregate({
      _avg: {
        rating: true
      }
    })
    const avgRating = ratingsResult._avg.rating || 0

    // Get SFW and NSFW counts
    const sfwCount = await db.marketplaceItem.count({
      where: {
        status: 'ACTIVE',
        isNsfw: false
      }
    })

    const nsfwCount = await db.marketplaceItem.count({
      where: {
        status: 'ACTIVE',
        isNsfw: true
      }
    })

    return NextResponse.json({
      totalItems,
      activeCreators,
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      avgRating: Math.round(avgRating * 10) / 10,
      sfwCount,
      nsfwCount
    })
  } catch (error) {
    console.error('Error fetching marketplace stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace stats' },
      { status: 500 }
    )
  }
}