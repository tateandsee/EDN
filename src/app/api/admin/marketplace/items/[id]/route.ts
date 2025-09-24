import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/admin/marketplace/items/[id] - Update marketplace item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { id } = await params

    // Check if item exists
    const existingItem = await db.marketplaceItem.findUnique({
      where: { id }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Marketplace item not found' },
        { status: 404 }
      )
    }

    // Update marketplace item
    const updatedItem = await db.marketplaceItem.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.type && { type: body.type }),
        ...(body.category && { category: body.category }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.currency && { currency: body.currency }),
        ...(body.isNsfw !== undefined && { isNsfw: body.isNsfw }),
        ...(body.tags !== undefined && { tags: body.tags ? JSON.stringify(body.tags) : null }),
        ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
        ...(body.images !== undefined && { images: body.images ? JSON.stringify(body.images) : null }),
        ...(body.status && { status: body.status })
      },
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
        }
      }
    })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('Error updating marketplace item:', error)
    return NextResponse.json(
      { error: 'Failed to update marketplace item' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/marketplace/items/[id] - Delete marketplace item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if item exists
    const existingItem = await db.marketplaceItem.findUnique({
      where: { id },
      include: {
        orders: true,
        reviews: true
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Marketplace item not found' },
        { status: 404 }
      )
    }

    // Check if item has orders or reviews
    if (existingItem.orders.length > 0 || existingItem.reviews.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete item with existing orders or reviews' },
        { status: 400 }
      )
    }

    // Delete marketplace item
    await db.marketplaceItem.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Marketplace item deleted successfully' })
  } catch (error) {
    console.error('Error deleting marketplace item:', error)
    return NextResponse.json(
      { error: 'Failed to delete marketplace item' },
      { status: 500 }
    )
  }
}