import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PromptAccessService } from '@/lib/prompt-access-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get('itemId')
    const userId = session.user.id

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const hasAccess = await PromptAccessService.hasPromptAccess(userId, itemId)

    return NextResponse.json({
      hasAccess,
      itemId,
      userId
    })

  } catch (error) {
    console.error('Error checking prompt access:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}