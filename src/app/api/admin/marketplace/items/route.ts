import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/marketplace/items - Get all marketplace items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const category = searchParams.get('category')

    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category

    const [items, total] = await Promise.all([
      db.marketplaceItem.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true
            }
          },
          orders: {
            select: {
              id: true,
              amount: true,
              status: true,
              createdAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.marketplaceItem.count({ where })
    ])

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching marketplace items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace items' },
      { status: 500 }
    )
  }
}

// POST /api/admin/marketplace/items - Create new marketplace item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      type,
      category,
      price,
      currency,
      isNsfw,
      tags,
      thumbnail,
      images,
      userId
    } = body

    // Validate required fields
    if (!title || !description || !type || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create marketplace item
    const item = await db.marketplaceItem.create({
      data: {
        title,
        description,
        type,
        category,
        price: parseFloat(price),
        currency: currency || 'USD',
        isNsfw: isNsfw || false,
        tags: tags ? JSON.stringify(tags) : null,
        thumbnail,
        images: images ? JSON.stringify(images) : null,
        userId: userId || 'admin', // Default to admin user if not specified
        status: 'ACTIVE' // Admin-created items are automatically active
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('Error creating marketplace item:', error)
    return NextResponse.json(
      { error: 'Failed to create marketplace item' },
      { status: 500 }
    )
  }
}