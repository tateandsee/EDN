
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ImageValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  imageData?: {
    isBase64Svg: boolean
    hasWatermark: boolean
    size: number
    format: string
  }
}

export class MarketplaceImageValidator {
  
  /**
   * Validate a single image URL or data URL
   */
  static async validateImage(image: string | null | undefined): Promise<ImageValidationResult> {
    const result: ImageValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    }

    if (!image) {
      result.isValid = false
      result.errors.push('Image is required')
      return result
    }

    // Check for placeholder paths
    if (image.startsWith('/placeholder-') || image.includes('placeholder-')) {
      result.isValid = false
      result.errors.push('Image cannot be a placeholder path')
      return result
    }

    // Check for external URLs that might be placeholders
    if (image.startsWith('http://') || image.startsWith('https://')) {
      result.warnings.push('External URLs should be avoided - use base64-encoded SVGs')
    }

    // Validate base64 SVG format
    if (image.startsWith('data:image/svg+xml;base64,')) {
      try {
        const base64Data = image.split(',')[1]
        const svgContent = Buffer.from(base64Data, 'base64').toString('utf-8')
        
        // Check for EDN watermark
        const hasWatermark = svgContent.includes('EDN Protected')
        if (!hasWatermark) {
          result.warnings.push('Image should contain EDN Protected watermark')
        }
        
        // Check for potentially dangerous content
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /onload=/i,
          /onerror=/i,
          /foreignObject/i
        ]
        
        for (const pattern of dangerousPatterns) {
          if (pattern.test(svgContent)) {
            result.isValid = false
            result.errors.push(`Image contains potentially dangerous content: ${pattern}`)
            break
          }
        }
        
        // Analyze image data
        result.imageData = {
          isBase64Svg: true,
          hasWatermark,
          size: Buffer.from(base64Data, 'base64').length,
          format: 'svg+xml'
        }
        
        // Size validation (should be reasonable for SVG)
        if (result.imageData.size > 50000) { // 50KB max
          result.warnings.push('Image size is large for an SVG')
        }
        
        if (result.imageData.size < 500) { // Too small
          result.warnings.push('Image size is very small - may be incomplete')
        }
        
      } catch (error) {
        result.isValid = false
        result.errors.push('Invalid base64-encoded SVG: ' + error.message)
      }
    } else {
      // Not a base64 SVG
      result.isValid = false
      result.errors.push('Image must be a base64-encoded SVG')
    }

    return result
  }

  /**
   * Validate marketplace item images
   */
  static async validateMarketplaceItem(data: {
    thumbnail?: string | null
    images?: string | string[] | null
  }): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    }

    // Validate thumbnail
    if (data.thumbnail) {
      const thumbnailResult = await this.validateImage(data.thumbnail)
      if (!thumbnailResult.isValid) {
        result.isValid = false
        result.errors.push(...thumbnailResult.errors.map(e => `Thumbnail: ${e}`))
      }
      result.warnings.push(...thumbnailResult.warnings.map(w => `Thumbnail: ${w}`))
    } else {
      result.warnings.push('Thumbnail is recommended')
    }

    // Validate images array
    let imagesArray: string[] = []
    
    if (data.images) {
      if (typeof data.images === 'string') {
        try {
          imagesArray = JSON.parse(data.images)
        } catch {
          result.isValid = false
          result.errors.push('Images must be a valid JSON array')
        }
      } else if (Array.isArray(data.images)) {
        imagesArray = data.images
      }
    }

    if (imagesArray.length > 0) {
      for (let i = 0; i < imagesArray.length; i++) {
        const imageResult = await this.validateImage(imagesArray[i])
        if (!imageResult.isValid) {
          result.isValid = false
          result.errors.push(...imageResult.errors.map(e => `Image ${i + 1}: ${e}`))
        }
        result.warnings.push(...imageResult.warnings.map(w => `Image ${i + 1}: ${w}`))
      }
    } else {
      result.warnings.push('At least one image is recommended')
    }

    return result
  }

  /**
   * Log validation results
   */
  static async logValidation(
    itemId: string, 
    fieldName: string, 
    result: ValidationResult | ImageValidationResult
  ): Promise<void> {
    try {
      for (const error of result.errors) {
        await prisma.$executeRawUnsafe(`
          INSERT INTO marketplace_image_validation (item_id, field_name, is_valid, error_message)
          VALUES (?, ?, 0, ?)
        `, itemId, fieldName, error)
      }
      
      for (const warning of result.warnings) {
        await prisma.$executeRawUnsafe(`
          INSERT INTO marketplace_image_validation (item_id, field_name, is_valid, error_message)
          VALUES (?, ?, 1, ?)
        `, itemId, fieldName, `WARNING: ${warning}`)
      }
    } catch (error) {
      console.error('Failed to log validation result:', error)
    }
  }

  /**
   * Scan all marketplace items for image issues
   */
  static async scanAllItems(): Promise<{
    totalItems: number
    validItems: number
    itemsWithIssues: number
    issues: Array<{
      id: string
      title: string
      errors: string[]
      warnings: string[]
    }>
  }> {
    const items = await prisma.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true
      }
    })

    const issues: any[] = []
    let validItems = 0

    for (const item of items) {
      const validation = await this.validateMarketplaceItem({
        thumbnail: item.thumbnail,
        images: item.images
      })

      if (validation.errors.length > 0 || validation.warnings.length > 0) {
        issues.push({
          id: item.id,
          title: item.title,
          errors: validation.errors,
          warnings: validation.warnings
        })
        
        // Log the validation results
        await this.logValidation(item.id, 'comprehensive', validation)
      } else {
        validItems++
      }
    }

    return {
      totalItems: items.length,
      validItems,
      itemsWithIssues: issues.length,
      issues
    }
  }

  /**
   * Auto-fix common image issues
   */
  static async autoFixItem(itemId: string): Promise<boolean> {
    try {
      const item = await prisma.marketplaceItem.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          title: true,
          tags: true,
          isNsfw: true,
          thumbnail: true,
          images: true
        }
      })

      if (!item) {
        return false
      }

      // Check if item needs fixing
      const validation = await this.validateMarketplaceItem({
        thumbnail: item.thumbnail,
        images: item.images
      })

      if (validation.isValid) {
        return true // No fix needed
      }

      // Extract attributes from tags
      const tags = item.tags ? (typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags) : []
      const ethnicity = tags.find(tag => ['caucasian', 'asian', 'mixed race', 'persian'].includes(tag.toLowerCase())) || 'Caucasian'
      const hairColor = tags.find(tag => ['golden', 'red', 'dark'].includes(tag.toLowerCase())) || 'Golden'
      const eyeColor = tags.find(tag => ['blue', 'green', 'brown'].includes(tag.toLowerCase())) || 'Blue'

      // Generate new image
      const newImage = await this.generateSvgImage(ethnicity, hairColor, eyeColor, item.isNsfw)

      // Update the item
      await prisma.marketplaceItem.update({
        where: { id: itemId },
        data: {
          thumbnail: newImage,
          images: JSON.stringify([newImage])
        }
      })

      // Log the fix
      await this.logValidation(itemId, 'auto-fix', {
        isValid: true,
        errors: [],
        warnings: ['Auto-fixed placeholder images']
      })

      return true
    } catch (error) {
      console.error(`Failed to auto-fix item ${itemId}:`, error)
      return false
    }
  }

  /**
   * Generate a new SVG image
   */
  static async generateSvgImage(
    ethnicity: string, 
    hairColor: string, 
    eyeColor: string, 
    isNsfw: boolean
  ): Promise<string> {
    const colorSchemes = {
      sfw: {
        skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642'],
        hair: ['#8B4513', '#D2691E', '#FFD700', '#FF4500'],
        eyes: ['#4169E1', '#228B22', '#8B4513']
      },
      nsfw: {
        skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642'],
        hair: ['#8B4513', '#D2691E', '#FFD700', '#FF4500', '#FF1493'],
        eyes: ['#4169E1', '#228B22', '#8B4513', '#DC143C']
      }
    }

    const scheme = colorSchemes[isNsfw ? 'nsfw' : 'sfw']
    
    const skinColors = {
      'Caucasian': scheme.skin[0],
      'Asian': scheme.skin[1],
      'Mixed Race': scheme.skin[2],
      'Persian': scheme.skin[3]
    }

    const hairColors = {
      'Golden': scheme.hair[2],
      'Red': scheme.hair[3],
      'Dark': scheme.hair[0]
    }

    const eyeColors = {
      'Blue': scheme.eyes[0],
      'Green': scheme.eyes[1],
      'Brown': scheme.eyes[2]
    }

    const skinColor = skinColors[ethnicity] || scheme.skin[0]
    const hairColorValue = hairColors[hairColor] || scheme.hair[0]
    const eyeColorValue = eyeColors[eyeColor] || scheme.eyes[2]

    const svg = isNsfw ? this.createNsfwSvg(skinColor, hairColorValue, eyeColorValue) : this.createSfwSvg(skinColor, hairColorValue, eyeColorValue)
    const base64 = Buffer.from(svg).toString('base64')
    return `data:image/svg+xml;base64,${base64}`
  }

  private static createSfwSvg(skinColor: string, hairColor: string, eyeColor: string): string {
    return `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#f0f0f0"/>
  <ellipse cx="200" cy="150" rx="80" ry="90" fill="${skinColor}"/>
  <path d="M 120 100 Q 200 60 280 100 Q 300 140 280 180 L 270 170 Q 200 130 130 170 L 120 180 Q 100 140 120 100" fill="${hairColor}"/>
  <ellipse cx="170" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="230" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="170" cy="140" rx="6" ry="6" fill="#000"/>
  <ellipse cx="230" cy="140" rx="6" ry="6" fill="#000"/>
  <path d="M 200 150 L 195 165 L 200 170 L 205 165 Z" fill="${skinColor}" stroke="#000" stroke-width="0.5"/>
  <path d="M 180 185 Q 200 195 220 185" fill="none" stroke="#000" stroke-width="1.5"/>
  <rect x="180" y="230" width="40" height="60" fill="${skinColor}"/>
  <ellipse cx="200" cy="290" rx="100" ry="40" fill="${skinColor}"/>
  <rect x="100" y="280" width="200" height="150" fill="#4169E1" rx="10"/>
  <text x="200" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">EDN Protected</text>
</svg>`
  }

  private static createNsfwSvg(skinColor: string, hairColor: string, eyeColor: string): string {
    return `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#1a1a1a"/>
  <ellipse cx="200" cy="150" rx="80" ry="90" fill="${skinColor}"/>
  <path d="M 120 100 Q 200 60 280 100 Q 300 140 280 180 L 270 170 Q 200 130 130 170 L 120 180 Q 100 140 120 100" fill="${hairColor}"/>
  <ellipse cx="170" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="230" cy="140" rx="12" ry="8" fill="${eyeColor}"/>
  <ellipse cx="170" cy="140" rx="6" ry="6" fill="#000"/>
  <ellipse cx="230" cy="140" rx="6" ry="6" fill="#000"/>
  <path d="M 158 135 Q 165 130 172 135" fill="none" stroke="#000" stroke-width="1"/>
  <path d="M 228 135 Q 235 130 242 135" fill="none" stroke="#000" stroke-width="1"/>
  <path d="M 200 150 L 195 165 L 200 170 L 205 165 Z" fill="${skinColor}" stroke="#000" stroke-width="0.5"/>
  <path d="M 180 185 Q 200 195 220 185" fill="${skinColor}" stroke="#000" stroke-width="1.5"/>
  <path d="M 185 190 Q 200 198 215 190" fill="#FF1493" stroke="#000" stroke-width="0.5"/>
  <rect x="180" y="230" width="40" height="60" fill="${skinColor}"/>
  <ellipse cx="200" cy="290" rx="100" ry="40" fill="${skinColor}"/>
  <path d="M 100 280 Q 200 260 300 280 L 300 320 Q 200 340 100 320 Z" fill="#FF1493" stroke="#000" stroke-width="1"/>
  <circle cx="150" cy="300" r="3" fill="#FFF"/>
  <circle cx="250" cy="300" r="3" fill="#FFF"/>
  <text x="200" y="550" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#FF1493">EDN Protected</text>
</svg>`
  }
}

// Export singleton instance
export const marketplaceImageValidator = MarketplaceImageValidator
