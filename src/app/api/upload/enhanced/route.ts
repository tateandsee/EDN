import { NextRequest, NextResponse } from 'next/server'
import { enhancedFileUpload } from '@/lib/enhanced-file-upload'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const options = JSON.parse(formData.get('options') as string || '{}')

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      )
    }

    // Upload files
    const results = await enhancedFileUpload.uploadMultipleFiles(files, {
      folder: options.folder,
      metadata: options.metadata,
      onProgress: (progress) => {
        // In production, you might broadcast this via WebSocket
        console.log('Upload progress:', progress)
      }
    })

    return NextResponse.json({
      success: true,
      files: results,
      count: results.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Enhanced file upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload files' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const activeUploads = enhancedFileUpload.getActiveUploads()
    const config = enhancedFileUpload.getConfig()

    return NextResponse.json({
      service: 'Enhanced File Upload',
      status: 'active',
      activeUploads: activeUploads.length,
      config: {
        maxFileSize: config.maxFileSize,
        allowedTypes: config.allowedTypes,
        requireModeration: config.requireModeration,
        generateThumbnails: config.generateThumbnails,
        enableVirusScan: config.enableVirusScan,
        enableDuplicateDetection: config.enableDuplicateDetection,
        storageLocation: config.storageLocation,
        accessLevel: config.accessLevel
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Get upload status error:', error)
    return NextResponse.json(
      { error: 'Failed to get upload status' },
      { status: 500 }
    )
  }
}