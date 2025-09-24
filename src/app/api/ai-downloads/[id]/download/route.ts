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

    // Get the download record
    const download = await db.aiModelDownload.findUnique({
      where: {
        id: id,
        userId: session.user.id,
        isDeleted: false
      }
    })

    if (!download) {
      return NextResponse.json({ error: 'Download not found or access denied' }, { status: 404 })
    }

    // Check if download is expired
    const now = new Date()
    if (now > download.expiresAt) {
      // Mark as expired and deleted
      await db.aiModelDownload.update({
        where: { id: id },
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
    await db.aiModelDownload.update({
      where: { id: id },
      data: {
        downloadCount: {
          increment: 1
        },
        lastDownloadedAt: now
      }
    })

    // In a real application, you would stream the file from storage
    // For now, we'll redirect to the download URL
    return NextResponse.redirect(download.downloadUrl)
  } catch (error) {
    console.error('Error downloading AI model:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}