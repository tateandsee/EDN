import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Get user's downloads with expiration info
    const [downloads, total] = await Promise.all([
      db.aiModelDownload.findMany({
        where: {
          userId: session.user.id,
          isDeleted: false
        },
        include: {
          generation: {
            select: {
              id: true,
              type: true,
              prompt: true,
              createdAt: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      db.aiModelDownload.count({
        where: {
          userId: session.user.id,
          isDeleted: false
        }
      })
    ])

    // Calculate time remaining for each download
    const downloadsWithTimeLeft = downloads.map(download => {
      const now = new Date()
      const expiresAt = new Date(download.expiresAt)
      const timeLeft = expiresAt.getTime() - now.getTime()
      const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)))
      
      return {
        ...download,
        hoursLeft,
        isExpiringSoon: hoursLeft <= 24 && hoursLeft > 0,
        isExpired: hoursLeft <= 0
      }
    })

    return NextResponse.json({
      downloads: downloadsWithTimeLeft,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching AI downloads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { generationId, fileName, filePath, fileSize, mimeType, downloadUrl } = await request.json()

    if (!generationId || !fileName || !filePath || !downloadUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Verify the generation belongs to the user
    const generation = await db.aiGeneration.findUnique({
      where: {
        id: generationId,
        userId: session.user.id
      }
    })

    if (!generation) {
      return NextResponse.json({ error: 'Generation not found or access denied' }, { status: 404 })
    }

    // Calculate expiration time (48 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48)

    // Create the download record
    const download = await db.aiModelDownload.create({
      data: {
        generationId,
        userId: session.user.id,
        fileName,
        filePath,
        fileSize,
        mimeType,
        downloadUrl,
        expiresAt
      },
      include: {
        generation: {
          select: {
            id: true,
            type: true,
            prompt: true,
            createdAt: true
          }
        }
      }
    })

    // Schedule expiration notifications (this would be handled by a background job)
    await scheduleExpirationNotifications(download.id, expiresAt)

    return NextResponse.json({
      download: {
        ...download,
        hoursLeft: 48,
        isExpiringSoon: false,
        isExpired: false
      }
    })
  } catch (error) {
    console.error('Error creating AI download:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to schedule notifications (in a real app, this would use a job queue)
async function scheduleExpirationNotifications(downloadId: string, expiresAt: Date) {
  const now = new Date()
  const timeUntilExpiration = expiresAt.getTime() - now.getTime()
  
  // Schedule 24-hour warning
  const twentyFourHoursBefore = new Date(expiresAt.getTime() - 24 * 60 * 60 * 1000)
  if (twentyFourHoursBefore > now) {
    setTimeout(() => {
      createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRING_24H')
    }, twentyFourHoursBefore.getTime() - now.getTime())
  }
  
  // Schedule 12-hour warning
  const twelveHoursBefore = new Date(expiresAt.getTime() - 12 * 60 * 60 * 1000)
  if (twelveHoursBefore > now) {
    setTimeout(() => {
      createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRING_12H')
    }, twelveHoursBefore.getTime() - now.getTime())
  }
  
  // Schedule 3-hour warning
  const threeHoursBefore = new Date(expiresAt.getTime() - 3 * 60 * 60 * 1000)
  if (threeHoursBefore > now) {
    setTimeout(() => {
      createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRING_3H')
    }, threeHoursBefore.getTime() - now.getTime())
  }
  
  // Schedule expiration notification
  setTimeout(() => {
    createExpirationNotification(downloadId, 'DOWNLOAD_EXPIRED')
    markDownloadAsExpired(downloadId)
  }, timeUntilExpiration)
}

async function createExpirationNotification(downloadId: string, type: string) {
  try {
    const download = await db.aiModelDownload.findUnique({
      where: { id: downloadId },
      include: { user: true }
    })

    if (!download) return

    const messages = {
      DOWNLOAD_EXPIRING_24H: 'Your AI model download will expire in 24 hours. Download now before it\'s too late!',
      DOWNLOAD_EXPIRING_12H: 'Your AI model download will expire in 12 hours. Don\'t forget to download it!',
      DOWNLOAD_EXPIRING_3H: 'Your AI model download will expire in 3 hours. This is your final reminder!',
      DOWNLOAD_EXPIRED: 'Your AI model download has expired and the file has been deleted.'
    }

    await db.notification.create({
      data: {
        userId: download.userId,
        type: type as any,
        title: 'AI Model Download Expiration',
        message: messages[type as keyof typeof messages] || 'Your download is expiring soon.',
        metadata: {
          downloadId,
          fileName: download.fileName,
          expiresAt: download.expiresAt
        },
        expiresAt: type === 'DOWNLOAD_EXPIRED' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined // Keep expired notifications for 7 days
      }
    })
  } catch (error) {
    console.error('Error creating expiration notification:', error)
  }
}

async function markDownloadAsExpired(downloadId: string) {
  try {
    await db.aiModelDownload.update({
      where: { id: downloadId },
      data: {
        isExpired: true,
        isDeleted: true
      }
    })
  } catch (error) {
    console.error('Error marking download as expired:', error)
  }
}