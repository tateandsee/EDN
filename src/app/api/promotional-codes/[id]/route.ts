import { NextRequest, NextResponse } from 'next/server'
import { PromotionalCodeService } from '@/lib/promotional-code'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT /api/promotional-codes/[id] - Update promotional code (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { description, type, value, maxUses, validUntil, minAmount, applicablePlans, isActive } = body

    const promotionalCode = await PromotionalCodeService.update(params.id, {
      description,
      type,
      value,
      maxUses,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      minAmount,
      applicablePlans,
      isActive
    })

    return NextResponse.json({ promotionalCode })
  } catch (error) {
    console.error('Error updating promotional code:', error)
    return NextResponse.json(
      { error: 'Failed to update promotional code' },
      { status: 500 }
    )
  }
}

// DELETE /api/promotional-codes/[id] - Delete promotional code (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await PromotionalCodeService.delete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting promotional code:', error)
    return NextResponse.json(
      { error: 'Failed to delete promotional code' },
      { status: 500 }
    )
  }
}