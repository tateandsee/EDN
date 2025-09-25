import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

<<<<<<< HEAD
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await db.marketplaceItem.findUnique({
      where: { id: params.id },
=======
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
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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
<<<<<<< HEAD
=======
            id: true,
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
<<<<<<< HEAD
=======
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
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
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

<<<<<<< HEAD
    // Process item to parse tags and extract title information
    const processedItem = {
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
      images: item.images ? JSON.parse(item.images) : []
    }

    return NextResponse.json({ item: processedItem })
=======
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
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  } catch (error) {
    console.error('Error fetching marketplace item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace item' },
      { status: 500 }
    )
  }
}