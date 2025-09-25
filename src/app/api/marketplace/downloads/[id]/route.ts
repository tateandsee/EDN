import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the marketplace order with item details
    const order = await db.marketplaceOrder.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        status: 'COMPLETED'
      },
      include: {
        item: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 })
    }

    // Check if download record already exists
    let download = await db.marketplaceDownload.findFirst({
      where: {
        orderId: order.id,
        userId: session.user.id,
        isDeleted: false
      }
    })

    // If no download exists, create one
    if (!download) {
      // Get the best available image (highest resolution)
      const images = order.item.images ? JSON.parse(order.item.images) : []
      const thumbnail = order.item.thumbnail
      
      // Determine the best image URL for download
      let downloadUrl = thumbnail
      let fileName = `${order.item.title.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')}_thumbnail.jpg`
      let fileSize = null
      let mimeType = 'image/jpeg'

      // Use the first image from images array if available (presumed to be higher quality)
      if (images && images.length > 0) {
        downloadUrl = images[0]
        fileName = `${order.item.title.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')}_hd.jpg`
        
        // Try to determine file size and mime type from data URL
        if (downloadUrl.startsWith('data:')) {
          const matches = downloadUrl.match(/^data:(.+?);base64,(.+)$/)
          if (matches) {
            mimeType = matches[1]
            const base64Data = matches[2]
            fileSize = Math.round((base64Data.length * 3) / 4) // Approximate size
          }
        }
      }

      // Calculate expiration time (7 days from now for marketplace downloads)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      // Create the download record
      download = await db.marketplaceDownload.create({
        data: {
          orderId: order.id,
          userId: session.user.id,
          itemId: order.itemId,
          fileName,
          filePath: downloadUrl,
          fileSize,
          mimeType,
          downloadUrl,
          expiresAt,
          maxDownloads: 5, // Allow 5 download attempts
          downloadCount: 0
        }
      })
    }

    // Check if download is expired
    const now = new Date()
    if (now > download.expiresAt) {
      await db.marketplaceDownload.update({
        where: { id: download.id },
        data: {
          isExpired: true,
          isDeleted: true
        }
      })
      return NextResponse.json({ error: 'Download has expired' }, { status: 410 })
    }

    // Check if max downloads reached
    if (download.downloadCount >= download.maxDownloads) {
      return NextResponse.json({ error: 'Maximum download attempts reached' }, { status: 429 })
    }

    // Increment download count and update last downloaded time
    await db.marketplaceDownload.update({
      where: { id: download.id },
      data: {
        downloadCount: {
          increment: 1
        },
        lastDownloadedAt: now
      }
    })

    // Return download information
    return NextResponse.json({
      download: {
        id: download.id,
        fileName: download.fileName,
        fileSize: download.fileSize,
        mimeType: download.mimeType,
        downloadUrl: download.downloadUrl,
        expiresAt: download.expiresAt,
        remainingDownloads: download.maxDownloads - download.downloadCount - 1,
        hoursLeft: Math.max(0, Math.floor((download.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)))
      },
      item: {
        id: order.item.id,
        title: order.item.title,
        description: order.item.description,
        promptConfig: order.item.promptConfig,
        positivePrompt: order.item.positivePrompt,
        negativePrompt: order.item.negativePrompt,
        fullPrompt: order.item.fullPrompt,
        tags: order.item.tags ? JSON.parse(order.item.tags) : []
      }
    })

  } catch (error) {
    console.error('Error processing marketplace download:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { generateHighDef } = await request.json()

    // Get the marketplace order with item details
    const order = await db.marketplaceOrder.findFirst({
      where: {
        id: id,
        userId: session.user.id,
        status: 'COMPLETED'
      },
      include: {
        item: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 })
    }

    // If high-def generation is requested, use AI to generate a higher quality version
    if (generateHighDef && order.item.promptConfig) {
      try {
        // Import ZAI SDK
        const ZAI = await import('z-ai-web-dev-sdk')
        const zai = await ZAI.create()

        // Generate high-definition image using the original prompt configuration
        const response = await zai.images.generations.create({
          prompt: order.item.positivePrompt || order.item.fullPrompt || '',
          negative_prompt: order.item.negativePrompt || '',
          size: '1024x1024', // High definition size
          quality: 'hd' // High quality
        })

        if (response.data && response.data[0]) {
          const highDefImageBase64 = response.data[0].base64
          const highDefImageUrl = `data:image/png;base64,${highDefImageBase64}`

          // Create or update download record with high-def image
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + 7)

          const download = await db.marketplaceDownload.upsert({
            where: {
              orderId_userId: {
                orderId: order.id,
                userId: session.user.id
              }
            },
            update: {
              filePath: highDefImageUrl,
              downloadUrl: highDefImageUrl,
              fileName: `${order.item.title.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')}_HD.png`,
              mimeType: 'image/png',
              fileSize: null, // Will be calculated when downloaded
              expiresAt,
              isHighDef: true,
              maxDownloads: 3, // Fewer downloads for high-def content
              downloadCount: 0
            },
            create: {
              orderId: order.id,
              userId: session.user.id,
              itemId: order.itemId,
              fileName: `${order.item.title.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')}_HD.png`,
              filePath: highDefImageUrl,
              downloadUrl: highDefImageUrl,
              mimeType: 'image/png',
              fileSize: null,
              expiresAt,
              isHighDef: true,
              maxDownloads: 3,
              downloadCount: 0
            }
          })

          return NextResponse.json({
            success: true,
            download: {
              id: download.id,
              fileName: download.fileName,
              isHighDef: true,
              expiresAt: download.expiresAt,
              remainingDownloads: download.maxDownloads - download.downloadCount
            },
            message: 'High-definition image generated successfully'
          })
        }
      } catch (aiError) {
        console.error('Error generating high-def image:', aiError)
        return NextResponse.json({ 
          error: 'Failed to generate high-definition image', 
          details: aiError.message 
        }, { status: 500 })
      }
    }

    return NextResponse.json({ 
      error: 'High-definition generation not available for this item' 
    }, { status: 400 })

  } catch (error) {
    console.error('Error in marketplace download POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}