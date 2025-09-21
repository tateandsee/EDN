import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    // Here you would verify the token and get the user ID
    // For now, we'll use a placeholder
    const userId = 'user-id-placeholder'

    const body = await request.json()
    const { itemId, rating, comment } = body

    if (!itemId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid rating or missing item ID' },
        { status: 400 }
      )
    }

    // Check if user has purchased the item
    const order = await db.marketplaceOrder.findFirst({
      where: {
        userId,
        itemId,
        status: 'COMPLETED'
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'You must purchase the item before reviewing' },
        { status: 403 }
      )
    }

    // Check if user already reviewed this item
    const existingReview = await db.marketplaceReview.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this item' },
        { status: 400 }
      )
    }

    const review = await db.marketplaceReview.create({
      data: {
        userId,
        itemId,
        rating,
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating marketplace review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      db.marketplaceReview.findMany({
        where: { itemId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.marketplaceReview.count({ where: { itemId } })
    ])

    // Calculate average rating
    const avgRatingResult = await db.marketplaceReview.aggregate({
      where: { itemId },
      _avg: {
        rating: true
      }
    })

    return NextResponse.json({
      reviews,
      averageRating: avgRatingResult._avg.rating || 0,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching marketplace reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}