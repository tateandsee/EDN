import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/user - Get current user profile
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { expiresAt: 'desc' },
          take: 1
        },
        affiliate: true,
        earnings: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        marketplaceItems: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            contents: true,
            marketplaceItems: true,
            reviews: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Format user data for response
    const formattedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      verified: user.verified,
      isPaidMember: user.isPaidMember,
      points: user.points,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      subscription: user.subscriptions[0] || null,
      affiliate: user.affiliate,
      recentEarnings: user.earnings,
      stats: {
        contentCount: user._count.contents,
        marketplaceItems: user._count.marketplaceItems,
        reviews: user._count.reviews
      }
    }

    return NextResponse.json({ user: formattedUser })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/user - Update user profile
export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, bio, avatar, preferences } = body

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
        ...(preferences && { 
          // Store preferences as JSON if needed
          // For now, we'll just update basic fields
        })
      },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { expiresAt: 'desc' },
          take: 1
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/user - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user (this will cascade delete related records due to Prisma relations)
    await db.user.delete({
      where: { id: user.id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}