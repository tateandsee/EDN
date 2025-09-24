/**
 * Enhanced File Upload System
 * Advanced file handling with validation, security, and marketplace integration
 */

import { getUploadConfig } from '@/lib/config'
import { enhancedContentModeration } from '@/lib/enhanced-content-moderation'

export interface UploadOptions {
  maxFileSize?: number
  allowedTypes?: string[]
  requireModeration?: boolean
  generateThumbnails?: boolean
  compressImages?: boolean
  enableVirusScan?: boolean
  enableDuplicateDetection?: boolean
  storageLocation?: 'local' | 's3' | 'cloudinary'
  accessLevel?: 'public' | 'private' | 'protected'
}

export interface UploadedFile {
  id: string
  originalName: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  extension: string
  url: string
  thumbnailUrl?: string
  moderationStatus?: 'pending' | 'approved' | 'flagged' | 'rejected'
  moderationResult?: any
  metadata: {
    uploadedAt: string
    uploadedBy: string
    checksum: string
    dimensions?: { width: number; height: number }
    duration?: number
    compressionRatio?: number
    virusScanResult?: 'clean' | 'infected' | 'scanning' | 'failed'
    duplicateOf?: string
  }
  access: {
    level: 'public' | 'private' | 'protected'
    permissions: string[]
    downloadCount: number
    viewCount: number
  }
}

export interface UploadProgress {
  id: string
  fileName: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'failed' | 'cancelled'
  speed: number // bytes per second
  estimatedTimeRemaining: number // seconds
  error?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  fileSize: number
  mimeType: string
  extension: string
}

class EnhancedFileUploadService {
  private uploadProgress: Map<string, UploadProgress> = new Map()
  private uploadOptions: UploadOptions

  constructor(options: UploadOptions = {}) {
    this.uploadOptions = {
      maxFileSize: options.maxFileSize || getUploadConfig().maxFileSize,
      allowedTypes: options.allowedTypes || getUploadConfig().allowedFileTypes,
      requireModeration: options.requireModeration !== false,
      generateThumbnails: options.generateThumbnails !== false,
      compressImages: options.compressImages !== false,
      enableVirusScan: options.enableVirusScan !== false,
      enableDuplicateDetection: options.enableDuplicateDetection !== false,
      storageLocation: options.storageLocation || 'local',
      accessLevel: options.accessLevel || 'public'
    }
  }

  /**
   * Validate file before upload
   */
  async validateFile(file: File): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []

    // Check file size
    if (file.size > this.uploadOptions.maxFileSize!) {
      errors.push(`File size (${this.formatFileSize(file.size)}) exceeds maximum allowed size (${this.formatFileSize(this.uploadOptions.maxFileSize!)})`)
    }

    // Check file type
    const extension = this.getFileExtension(file.name)
    const mimeType = file.type || this.getMimeTypeFromExtension(extension)
    
    if (!this.uploadOptions.allowedTypes!.includes(extension.toLowerCase()) && 
        !this.uploadOptions.allowedTypes!.includes(mimeType)) {
      errors.push(`File type "${extension}" is not allowed. Allowed types: ${this.uploadOptions.allowedTypes!.join(', ')}`)
    }

    // Additional validations
    if (file.size === 0) {
      errors.push('File is empty')
    }

    if (file.name.length > 255) {
      warnings.push('File name is very long and may cause issues')
    }

    // Check for potentially malicious file names
    const suspiciousPatterns = ['..', '/', '\\', ':', '*', '?', '"', '<', '>', '|']
    if (suspiciousPatterns.some(pattern => file.name.includes(pattern))) {
      errors.push('File name contains suspicious characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fileSize: file.size,
      mimeType,
      extension
    }
  }

  /**
   * Upload single file with enhanced processing
   */
  async uploadFile(
    file: File,
    options: {
      userId?: string
      folder?: string
      metadata?: Record<string, any>
      onProgress?: (progress: UploadProgress) => void
    } = {}
  ): Promise<UploadedFile> {
    try {
      const uploadId = this.generateUploadId()
      const validation = await this.validateFile(file)

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
      }

      // Initialize progress tracking
      const progress: UploadProgress = {
        id: uploadId,
        fileName: file.name,
        progress: 0,
        status: 'uploading',
        speed: 0,
        estimatedTimeRemaining: 0
      }

      this.uploadProgress.set(uploadId, progress)
      this.updateProgress(uploadId, { status: 'uploading' })

      // Generate file info
      const fileInfo = await this.generateFileInfo(file, options.folder)

      // Check for duplicates if enabled
      if (this.uploadOptions.enableDuplicateDetection) {
        const duplicate = await this.checkForDuplicate(file, validation.checksum || '')
        if (duplicate) {
          this.updateProgress(uploadId, { 
            status: 'completed',
            progress: 100 
          })
          return duplicate
        }
      }

      // Upload file
      const uploadResult = await this.performUpload(file, fileInfo, (progressEvent) => {
        const updatedProgress = {
          ...progress,
          progress: Math.round((progressEvent.loaded / progressEvent.total) * 100),
          speed: progressEvent.speed || 0,
          estimatedTimeRemaining: progressEvent.estimatedTimeRemaining || 0
        }
        this.updateProgress(uploadId, updatedProgress)
        options.onProgress?.(updatedProgress)
      })

      this.updateProgress(uploadId, { status: 'processing' })

      // Process uploaded file
      const processedFile = await this.processUploadedFile(uploadResult, file, validation)

      // Content moderation if required
      if (this.uploadOptions.requireModeration) {
        const moderationResult = await this.moderateContent(processedFile)
        processedFile.moderationStatus = moderationResult.isFlagged ? 'flagged' : 'approved'
        processedFile.moderationResult = moderationResult
      }

      // Virus scan if enabled
      if (this.uploadOptions.enableVirusScan) {
        const virusScanResult = await this.performVirusScan(processedFile.filePath)
        processedFile.metadata.virusScanResult = virusScanResult

        if (virusScanResult === 'infected') {
          await this.deleteFile(processedFile.filePath)
          throw new Error('File contains malware and was rejected')
        }
      }

      this.updateProgress(uploadId, { status: 'completed', progress: 100 })

      return processedFile

    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: FileList | File[],
    options: {
      userId?: string
      folder?: string
      metadata?: Record<string, any>
      onProgress?: (progress: UploadProgress) => void
      onComplete?: (results: UploadedFile[]) => void
      onError?: (error: Error, file: File) => void
    } = {}
  ): Promise<UploadedFile[]> {
    const results: UploadedFile[] = []
    const uploadPromises: Promise<UploadedFile>[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      const uploadPromise = this.uploadFile(file, {
        userId: options.userId,
        folder: options.folder,
        metadata: { ...options.metadata, fileIndex: i },
        onProgress: options.onProgress
      }).catch(error => {
        options.onError?.(error, file)
        throw error
      })

      uploadPromises.push(uploadPromise)
    }

    try {
      const uploadResults = await Promise.allSettled(uploadPromises)
      
      uploadResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          console.error(`File ${files[index].name} upload failed:`, result.reason)
        }
      })

      options.onComplete?.(results)
      return results

    } catch (error) {
      console.error('Multiple file upload error:', error)
      throw error
    }
  }

  /**
   * Generate file information
   */
  private async generateFileInfo(file: File, folder?: string): Promise<{
    fileName: string
    filePath: string
    extension: string
    checksum: string
  }> {
    const extension = this.getFileExtension(file.name)
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 9)
    const fileName = `${timestamp}_${random}.${extension}`
    const filePath = folder ? `${folder}/${fileName}` : fileName
    const checksum = await this.generateChecksum(file)

    return {
      fileName,
      filePath,
      extension,
      checksum
    }
  }

  /**
   * Perform actual file upload
   */
  private async performUpload(
    file: File,
    fileInfo: { fileName: string; filePath: string },
    onProgress?: (progress: { loaded: number; total: number; speed?: number; estimatedTimeRemaining?: number }) => void
  ): Promise<{ filePath: string; url: string }> {
    // This is a simplified upload implementation
    // In production, you would integrate with cloud storage services
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      let loaded = 0
      const startTime = Date.now()

      reader.onload = async () => {
        try {
          // Simulate upload progress
          const total = file.size
          const chunkSize = 64 * 1024 // 64KB chunks
          let currentLoaded = 0

          const uploadChunk = () => {
            const chunk = Math.min(chunkSize, total - currentLoaded)
            currentLoaded += chunk

            if (onProgress) {
              const elapsed = (Date.now() - startTime) / 1000
              const speed = currentLoaded / elapsed
              const remaining = (total - currentLoaded) / speed

              onProgress({
                loaded: currentLoaded,
                total,
                speed,
                estimatedTimeRemaining: remaining
              })
            }

            if (currentLoaded < total) {
              setTimeout(uploadChunk, 10) // Simulate network delay
            } else {
              // Upload complete
              const url = `/uploads/${fileInfo.filePath}`
              resolve({
                filePath: fileInfo.filePath,
                url
              })
            }
          }

          uploadChunk()

        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  /**
   * Process uploaded file (thumbnails, compression, etc.)
   */
  private async processUploadedFile(
    uploadResult: { filePath: string; url: string },
    originalFile: File,
    validation: ValidationResult
  ): Promise<UploadedFile> {
    const processedFile: UploadedFile = {
      id: this.generateUploadId(),
      originalName: originalFile.name,
      fileName: uploadResult.filePath.split('/').pop() || '',
      filePath: uploadResult.filePath,
      fileSize: validation.fileSize,
      mimeType: validation.mimeType,
      extension: validation.extension,
      url: uploadResult.url,
      metadata: {
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'system', // Would come from auth context
        checksum: validation.checksum || ''
      },
      access: {
        level: this.uploadOptions.accessLevel!,
        permissions: ['read'],
        downloadCount: 0,
        viewCount: 0
      }
    }

    // Generate thumbnails for images
    if (this.uploadOptions.generateThumbnails && validation.mimeType.startsWith('image/')) {
      try {
        const thumbnailUrl = await this.generateThumbnail(uploadResult.filePath)
        processedFile.thumbnailUrl = thumbnailUrl
      } catch (error) {
        console.warn('Failed to generate thumbnail:', error)
      }
    }

    // Extract metadata for different file types
    if (validation.mimeType.startsWith('image/')) {
      const dimensions = await this.getImageDimensions(originalFile)
      if (dimensions) {
        processedFile.metadata.dimensions = dimensions
      }
    }

    if (validation.mimeType.startsWith('video/')) {
      const duration = await this.getVideoDuration(originalFile)
      if (duration) {
        processedFile.metadata.duration = duration
      }
    }

    return processedFile
  }

  /**
   * Moderate content using the enhanced moderation system
   */
  private async moderateContent(file: UploadedFile): Promise<any> {
    try {
      const content: any = {}
      
      if (file.mimeType.startsWith('image/')) {
        content.imageUrl = file.url
      } else if (file.mimeType.startsWith('video/')) {
        content.videoUrl = file.url
      } else if (file.mimeType.startsWith('audio/')) {
        content.audioUrl = file.url
      }

      return await enhancedContentModeration.moderateContent(content)

    } catch (error) {
      console.error('Content moderation failed:', error)
      return {
        isFlagged: false,
        confidence: 0,
        categories: {},
        riskLevel: 'low'
      }
    }
  }

  /**
   * Perform virus scan (simplified)
   */
  private async performVirusScan(filePath: string): Promise<'clean' | 'infected' | 'scanning' | 'failed'> {
    // In production, this would integrate with actual virus scanning services
    // For now, we'll simulate the scan
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate scan result (99% clean for demo)
        const isInfected = Math.random() < 0.01
        resolve(isInfected ? 'infected' : 'clean')
      }, 2000)
    })
  }

  /**
   * Check for duplicate files
   */
  private async checkForDuplicate(file: File, checksum: string): Promise<UploadedFile | null> {
    // In production, this would query the database for existing files with the same checksum
    // For now, we'll return null (no duplicate found)
    return null
  }

  /**
   * Generate thumbnail for image
   */
  private async generateThumbnail(filePath: string): Promise<string> {
    // In production, this would use image processing libraries
    // For now, return a placeholder URL
    return `${filePath}_thumb.jpg`
  }

  /**
   * Get image dimensions
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => resolve(null)
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * Get video duration
   */
  private async getVideoDuration(file: File): Promise<number | null> {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        resolve(video.duration)
      }
      video.onerror = () => resolve(null)
      video.src = URL.createObjectURL(file)
    })
  }

  /**
   * Generate checksum for file
   */
  private async generateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Delete file
   */
  private async deleteFile(filePath: string): Promise<void> {
    // In production, this would delete from storage service
    console.log(`Deleting file: ${filePath}`)
  }

  /**
   * Update upload progress
   */
  private updateProgress(uploadId: string, updates: Partial<UploadProgress>): void {
    const current = this.uploadProgress.get(uploadId)
    if (current) {
      const updated = { ...current, ...updates }
      this.uploadProgress.set(uploadId, updated)
    }
  }

  /**
   * Get upload progress
   */
  getUploadProgress(uploadId: string): UploadProgress | null {
    return this.uploadProgress.get(uploadId) || null
  }

  /**
   * Get all active uploads
   */
  getActiveUploads(): UploadProgress[] {
    return Array.from(this.uploadProgress.values()).filter(
      progress => progress.status === 'uploading' || progress.status === 'processing'
    )
  }

  /**
   * Cancel upload
   */
  cancelUpload(uploadId: string): boolean {
    const progress = this.uploadProgress.get(uploadId)
    if (progress && (progress.status === 'uploading' || progress.status === 'processing')) {
      this.updateProgress(uploadId, { status: 'cancelled' })
      return true
    }
    return false
  }

  /**
   * Get file extension
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || ''
  }

  /**
   * Get MIME type from extension
   */
  private getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'mp4': 'video/mp4',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo',
      'wmv': 'video/x-ms-wmv',
      'flv': 'video/x-flv',
      'webm': 'video/webm',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'aac': 'audio/aac',
      'flac': 'audio/flac',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain'
    }
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
  }

  /**
   * Format file size
   */
  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Generate upload ID
   */
  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Update configuration
   */
  updateConfig(newOptions: Partial<UploadOptions>): void {
    this.uploadOptions = { ...this.uploadOptions, ...newOptions }
  }

  /**
   * Get current configuration
   */
  getConfig(): UploadOptions {
    return { ...this.uploadOptions }
  }
}

// Export singleton instance
export const enhancedFileUpload = new EnhancedFileUploadService()

// Export types and utilities
export type { UploadOptions, UploadedFile, UploadProgress, ValidationResult }
export { EnhancedFileUploadService }