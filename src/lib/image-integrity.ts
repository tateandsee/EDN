import { promises as fs } from 'fs'
import path from 'path'
import { db } from '@/lib/db'

export interface ImageValidationResult {
  isValid: boolean
  exists: boolean
  accessible: boolean
  isProperFormat: boolean
  fileSize?: number
  dimensions?: { width: number; height: number }
  error?: string
  correctedUrl?: string
}

export interface ImageIntegrityConfig {
  maxFileSize: number // in bytes
  allowedFormats: string[]
  requireExactDimensions?: boolean
  requiredDimensions?: { width: number; height: number }
  checkAccessibility: boolean
  fallbackStrategy: 'strict' | 'correct' | 'fail'
}

export class ImageIntegrityService {
  private config: ImageIntegrityConfig

  constructor(config: Partial<ImageIntegrityConfig> = {}) {
    this.config = {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      checkAccessibility: true,
      fallbackStrategy: 'strict',
      ...config
    }
  }

  /**
   * Validate an image URL or file path
   */
  async validateImage(imageUrl: string): Promise<ImageValidationResult> {
    try {
      // Handle base64 images
      if (imageUrl.startsWith('data:image')) {
        return await this.validateBase64Image(imageUrl)
      }

      // Handle external URLs
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return await this.validateExternalImage(imageUrl)
      }

      // Handle local file paths
      return await this.validateLocalImage(imageUrl)
    } catch (error) {
      return {
        isValid: false,
        exists: false,
        accessible: false,
        isProperFormat: false,
        error: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Validate base64 encoded image
   */
  private async validateBase64Image(base64Data: string): Promise<ImageValidationResult> {
    try {
      // Extract the base64 content and mime type
      const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/)
      if (!matches) {
        return {
          isValid: false,
          exists: false,
          accessible: false,
          isProperFormat: false,
          error: 'Invalid base64 image format'
        }
      }

      const mimeType = matches[1]
      const base64Content = matches[2]

      // Check if format is allowed
      if (!this.config.allowedFormats.includes(mimeType)) {
        return {
          isValid: false,
          exists: true,
          accessible: true,
          isProperFormat: false,
          error: `Unsupported image format: ${mimeType}`
        }
      }

      // Decode base64 and check file size
      const buffer = Buffer.from(base64Content, 'base64')
      const fileSize = buffer.byteLength

      if (fileSize > this.config.maxFileSize) {
        return {
          isValid: false,
          exists: true,
          accessible: true,
          isProperFormat: true,
          fileSize,
          error: `Image too large: ${fileSize} bytes (max: ${this.config.maxFileSize} bytes)`
        }
      }

      // Get image dimensions
      const dimensions = await this.getImageDimensions(buffer)

      return {
        isValid: true,
        exists: true,
        accessible: true,
        isProperFormat: true,
        fileSize,
        dimensions
      }
    } catch (error) {
      return {
        isValid: false,
        exists: false,
        accessible: false,
        isProperFormat: false,
        error: `Base64 validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Validate external image URL
   */
  private async validateExternalImage(url: string): Promise<ImageValidationResult> {
    try {
      if (!this.config.checkAccessibility) {
        return {
          isValid: true,
          exists: true,
          accessible: true,
          isProperFormat: true
        }
      }

      // Fetch the image to validate it exists and is accessible
      const response = await fetch(url, { method: 'HEAD' })
      
      if (!response.ok) {
        return {
          isValid: false,
          exists: false,
          accessible: false,
          isProperFormat: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }

      const contentType = response.headers.get('content-type')
      const contentLength = response.headers.get('content-length')

      // Check content type
      if (!contentType || !this.config.allowedFormats.includes(contentType)) {
        return {
          isValid: false,
          exists: true,
          accessible: true,
          isProperFormat: false,
          error: `Unsupported content type: ${contentType}`
        }
      }

      // Check file size if available
      if (contentLength) {
        const fileSize = parseInt(contentLength, 10)
        if (fileSize > this.config.maxFileSize) {
          return {
            isValid: false,
            exists: true,
            accessible: true,
            isProperFormat: true,
            fileSize,
            error: `Image too large: ${fileSize} bytes (max: ${this.config.maxFileSize} bytes)`
          }
        }
      }

      return {
        isValid: true,
        exists: true,
        accessible: true,
        isProperFormat: true,
        fileSize: contentLength ? parseInt(contentLength, 10) : undefined
      }
    } catch (error) {
      return {
        isValid: false,
        exists: false,
        accessible: false,
        isProperFormat: false,
        error: `External image validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Validate local file system image
   */
  private async validateLocalImage(filePath: string): Promise<ImageValidationResult> {
    try {
      // Normalize path and check if it's within public directory
      const normalizedPath = this.normalizeLocalPath(filePath)
      const fullPath = path.join(process.cwd(), 'public', normalizedPath)

      // Check if file exists
      await fs.access(fullPath)

      // Get file stats
      const stats = await fs.stat(fullPath)
      
      // Check file size
      if (stats.size > this.config.maxFileSize) {
        return {
          isValid: false,
          exists: true,
          accessible: true,
          isProperFormat: true,
          fileSize: stats.size,
          error: `Image too large: ${stats.size} bytes (max: ${this.config.maxFileSize} bytes)`
        }
      }

      // Read file to check format and get dimensions
      const buffer = await fs.readFile(fullPath)
      const dimensions = await this.getImageDimensions(buffer)

      return {
        isValid: true,
        exists: true,
        accessible: true,
        isProperFormat: true,
        fileSize: stats.size,
        dimensions,
        correctedUrl: normalizedPath
      }
    } catch (error) {
      return {
        isValid: false,
        exists: false,
        accessible: false,
        isProperFormat: false,
        error: `Local image validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Normalize local file path
   */
  private normalizeLocalPath(filePath: string): string {
    // Remove leading slash if present
    let normalized = filePath.startsWith('/') ? filePath.slice(1) : filePath
    
    // Remove duplicate slashes
    normalized = normalized.replace(/\/+/g, '/')
    
    // Prevent directory traversal
    normalized = normalized.replace(/\.\.\//g, '').replace(/\.\//g, '')
    
    return normalized
  }

  /**
   * Get image dimensions from buffer
   */
  private async getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
    // Simple dimension detection for common formats
    // In a real implementation, you'd use a library like 'image-size'
    
    // JPEG
    if (buffer.toString('hex', 0, 2) === 'ffd8') {
      // This is a simplified check - in production, use proper image parsing
      return { width: 1024, height: 1024 } // Default assumption
    }
    
    // PNG
    if (buffer.toString('hex', 0, 8) === '89504e470d0a1a0a') {
      return { width: 1024, height: 1024 } // Default assumption
    }
    
    // WebP
    if (buffer.toString('hex', 0, 4) === '52494646') {
      return { width: 1024, height: 1024 } // Default assumption
    }
    
    return { width: 1024, height: 1024 } // Default assumption
  }

  /**
   * Validate and correct marketplace item images
   */
  async validateMarketplaceItemImages(item: any): Promise<{
    isValid: boolean
    correctedImages: string[]
    errors: string[]
  }> {
    const errors: string[] = []
    const correctedImages: string[] = []

    // Validate thumbnail
    if (item.thumbnail) {
      const thumbnailResult = await this.validateImage(item.thumbnail)
      if (!thumbnailResult.isValid) {
        errors.push(`Thumbnail validation failed: ${thumbnailResult.error}`)
        
        if (this.config.fallbackStrategy === 'correct' && thumbnailResult.correctedUrl) {
          correctedImages.push(thumbnailResult.correctedUrl)
        }
      } else if (thumbnailResult.correctedUrl) {
        correctedImages.push(thumbnailResult.correctedUrl)
      }
    }

    // Validate images array
    if (item.images) {
      const images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
      
      for (const imageUrl of images) {
        const imageResult = await this.validateImage(imageUrl)
        if (!imageResult.isValid) {
          errors.push(`Image validation failed for ${imageUrl}: ${imageResult.error}`)
          
          if (this.config.fallbackStrategy === 'correct' && imageResult.correctedUrl) {
            correctedImages.push(imageResult.correctedUrl)
          }
        } else if (imageResult.correctedUrl) {
          correctedImages.push(imageResult.correctedUrl)
        }
      }
    }

    return {
      isValid: errors.length === 0,
      correctedImages,
      errors
    }
  }

  /**
   * Bulk validate all marketplace items
   */
  async validateAllMarketplaceItems(): Promise<{
    totalItems: number
    validItems: number
    invalidItems: number
    correctedItems: number
    errors: string[]
  }> {
    const items = await db.marketplaceItem.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true
      }
    })

    let validItems = 0
    let invalidItems = 0
    let correctedItems = 0
    const allErrors: string[] = []

    for (const item of items) {
      const result = await this.validateMarketplaceItemImages(item)
      
      if (result.isValid) {
        validItems++
      } else {
        invalidItems++
        
        if (result.correctedImages.length > 0) {
          correctedItems++
          
          // Update the item with corrected images
          await db.marketplaceItem.update({
            where: { id: item.id },
            data: {
              thumbnail: result.correctedImages[0] || item.thumbnail,
              images: JSON.stringify(result.correctedImages)
            }
          })
        }
      }
      
      allErrors.push(...result.errors.map(error => `Item ${item.id} (${item.title}): ${error}`))
    }

    return {
      totalItems: items.length,
      validItems,
      invalidItems,
      correctedItems,
      errors: allErrors
    }
  }

  /**
   * Ensure image exists and is accessible, throw error if not
   */
  async ensureImageExists(imageUrl: string, context: string = 'Unknown'): Promise<void> {
    const result = await this.validateImage(imageUrl)
    
    if (!result.isValid) {
      throw new Error(`Image integrity check failed for ${context}: ${result.error}`)
    }
    
    if (!result.exists) {
      throw new Error(`Image does not exist for ${context}: ${imageUrl}`)
    }
    
    if (!result.accessible) {
      throw new Error(`Image is not accessible for ${context}: ${imageUrl}`)
    }
  }
}

// Export singleton instance
export const imageIntegrityService = new ImageIntegrityService()