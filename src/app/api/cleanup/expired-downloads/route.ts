import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { AiDownloadManager } from '@/lib/ai-download-manager'

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (in production, you'd use proper authentication)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Clean up expired downloads
    const result = await AiDownloadManager.cleanupExpiredDownloads()

    // Log the cleanup action
    console.log(`Cleanup completed: ${result.cleaned} expired downloads removed`)

    return NextResponse.json({
      success: true,
      cleaned: result.cleaned,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in cleanup job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}