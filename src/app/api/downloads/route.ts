import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'
import { downloadTracker } from '@/lib/download-tracker'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content_id, marketplace_item_id, file_url, file_size } = body

    // Validate required fields
    if (!file_url) {
      return NextResponse.json(
        { error: 'file_url is required' },
        { status: 400 }
      )
    }

    // Determine download type
    const download_type = content_id ? 'content' : 'marketplace_item'
    const record_id = content_id || marketplace_item_id

    if (!record_id) {
      return NextResponse.json(
        { error: 'Either content_id or marketplace_item_id is required' },
        { status: 400 }
      )
    }

    // Get user session
    const supabase = createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Track the download
    const downloadData = {
      user_id: session.user.id,
      content_id: content_id || undefined,
      marketplace_item_id: marketplace_item_id || undefined,
      download_type: download_type as 'content' | 'marketplace_item',
      file_url,
      file_size
    }

    const downloadRecord = await downloadTracker.trackDownload(downloadData)

    if (!downloadRecord) {
      return NextResponse.json(
        { error: 'Failed to track download' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Download tracked successfully',
      download_id: downloadRecord.id
    })

  } catch (error) {
    console.error('Error in download tracking API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const type = searchParams.get('type') // 'user', 'content', or 'marketplace_item'
    const id = searchParams.get('id')

    const supabase = createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Users can only view their own downloads unless they're admins
    if (userId && userId !== session.user.id) {
      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userData?.role !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized to view other users\' downloads' },
          { status: 403 }
        )
      }
    }

    let result

    switch (type) {
      case 'user':
        const targetUserId = userId || session.user.id
        result = await downloadTracker.getUserDownloads(targetUserId)
        break
      
      case 'content':
        if (!id) {
          return NextResponse.json(
            { error: 'Content ID is required' },
            { status: 400 }
          )
        }
        result = await downloadTracker.getContentDownloads(id)
        break
      
      case 'marketplace_item':
        if (!id) {
          return NextResponse.json(
            { error: 'Marketplace item ID is required' },
            { status: 400 }
          )
        }
        result = await downloadTracker.getMarketplaceItemDownloads(id)
        break
      
      case 'stats':
        const statsUserId = userId || session.user.id
        result = await downloadTracker.getDownloadStats(statsUserId)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid type parameter' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error in download tracking API GET:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}