import { NextRequest, NextResponse } from 'next/server'
import { PromotionalCodeService } from '@/lib/promotional-code'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/promotional-codes - Get all promotional codes (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const promotionalCodes = await PromotionalCodeService.findAll()
    
    return NextResponse.json({ promotionalCodes })
  } catch (error) {
    console.error('Error fetching promotional codes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch promotional codes' },
      { status: 500 }
    )
  }
}

// POST /api/promotional-codes - Create new promotional code (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code, description, type, value, maxUses, validUntil, minAmount, applicablePlans } = body

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { error: 'Code, type, and value are required' },
        { status: 400 }
      )
    }

    const promotionalCode = await PromotionalCodeService.create({
      code,
      description,
      type,
      value,
      maxUses,
      validUntil: validUntil ? new Date(validUntil) : undefined,
      minAmount,
      applicablePlans
    })

    return NextResponse.json({ promotionalCode }, { status: 201 })
  } catch (error) {
    console.error('Error creating promotional code:', error)
    return NextResponse.json(
      { error: 'Failed to create promotional code' },
      { status: 500 }
    )
  }
}