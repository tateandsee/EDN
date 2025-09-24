import { NextRequest, NextResponse } from 'next/server'
import { PromotionalCodeService } from '@/lib/promotional-code'

// POST /api/promotional-codes/validate - Validate promotional code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, planAmount, planName } = body

    if (!code || planAmount === undefined || !planName) {
      return NextResponse.json(
        { error: 'Code, plan amount, and plan name are required' },
        { status: 400 }
      )
    }

    const result = await PromotionalCodeService.validateCode(code, planAmount, planName)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error validating promotional code:', error)
    return NextResponse.json(
      { error: 'Failed to validate promotional code' },
      { status: 500 }
    )
  }
}