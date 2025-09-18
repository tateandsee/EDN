import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await db.marketplaceItem.findUnique({
      where: { id: params.id },
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
            rating: true,
            comment: true,
            createdAt: true,
            user: {
              select: {
                name: true,
                avatar: true
              }
            }
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

    // Process item to parse tags and extract title information
    const processedItem = {
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
      images: item.images ? JSON.parse(item.images) : []
    }

    return NextResponse.json({ item: processedItem })
  } catch (error) {
    console.error('Error fetching marketplace item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace item' },
      { status: 500 }
    )
  }
}