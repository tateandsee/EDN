import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PromptAccessService } from '@/lib/prompt-access-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, userId } = await request.json()

    if (!itemId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the marketplace item
    const item = await db.marketplaceItem.findUnique({
      where: { id: itemId }
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Item is not available' }, { status: 400 })
    }

    // Check if user already has a pending or completed order for this item
    const existingOrder = await db.marketplaceOrder.findFirst({
      where: {
        userId,
        itemId,
        status: {
          in: ['PENDING', 'COMPLETED']
        }
      }
    })

    if (existingOrder) {
      return NextResponse.json({ error: 'You already have an order for this item' }, { status: 400 })
    }

    // Create the order
    const order = await db.marketplaceOrder.create({
      data: {
        userId,
        itemId,
        amount: item.price,
        currency: item.currency,
        status: 'COMPLETED' // Auto-complete for demo purposes
      }
    })

    // Create prompt access record (locked by default)
    try {
      await PromptAccessService.createPromptAccess(order.id, userId, itemId)
    } catch (error) {
      console.error('Error creating prompt access:', error)
      // Don't fail the order if prompt access creation fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        itemId: order.itemId,
        amount: order.amount,
        status: order.status,
        createdAt: order.createdAt
      }
    })

  } catch (error) {
    console.error('Error creating marketplace order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = session.user.id
    const status = searchParams.get('status') as string | undefined

    const whereClause: any = {
      userId
    }

    if (status) {
      whereClause.status = status
    }

    const orders = await db.marketplaceOrder.findMany({
      where: whereClause,
      include: {
        item: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            price: true,
            isNsfw: true
          }
        },
        promptAccess: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders })

  } catch (error) {
    console.error('Error fetching marketplace orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}