import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PromptAccessService } from '@/lib/prompt-access-service'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orderId = params.id

    // Get the order
    const order = await db.marketplaceOrder.findUnique({
      where: { id: orderId },
      include: {
        promptAccess: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (order.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Order must be completed to unlock prompts' }, { status: 400 })
    }

    // Unlock prompt access
    const promptAccess = await PromptAccessService.unlockPromptAccess(
      orderId,
      order.userId,
      order.itemId
    )

    return NextResponse.json({
      success: true,
      promptAccess: {
        id: promptAccess.id,
        isUnlocked: promptAccess.isUnlocked,
        unlockedAt: promptAccess.unlockedAt
      }
    })

  } catch (error) {
    console.error('Error unlocking prompt access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}