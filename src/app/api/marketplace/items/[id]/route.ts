import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/marketplace/items/[id] - Get individual marketplace item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch marketplace item with all related data
    const item = await db.marketplaceItem.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        orders: {
          select: {
            id: true,
            userId: true,
            createdAt: true,
            status: true
          }
        },
        _count: {
          select: {
            reviews: true,
            orders: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Marketplace item not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format
    const transformedItem = {
      ...item,
      thumbnail: item.thumbnail,
      images: item.images ? JSON.parse(item.images) : [],
      tags: item.tags ? JSON.parse(item.tags) : [],
      reviews: item.reviews.map(review => ({
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        user: {
          name: review.user.name,
          avatar: review.user.avatar
        }
      })),
      user: {
        id: item.user.id,
        name: item.user.name || 'EDN Creator',
        avatar: item.user.avatar,
        verified: item.user.verified
      },
      _count: {
        reviews: item._count.reviews,
        orders: item._count.orders
      }
    }

    return NextResponse.json(transformedItem)
  } catch (error) {
    console.error('Error fetching marketplace item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace item' },
      { status: 500 }
    )
  }
}