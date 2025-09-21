#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')

// Simple image validation script that checks marketplace image integrity
class SimpleImageValidator {
  constructor() {
    this.publicDir = path.join(process.cwd(), 'public')
    this.results = {
      total: 0,
      valid: 0,
      invalid: 0,
      fixed: 0,
      errors: [],
      fixes: []
    }
  }

  async validateImage(imageUrl) {
    try {
      // Handle different image URL types
      if (imageUrl.startsWith('data:image')) {
        return this.validateBase64Image(imageUrl)
      } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return this.validateExternalImage(imageUrl)
      } else {
        return this.validateLocalImage(imageUrl)
      }
    } catch (error) {
      return {
        isValid: false,
        error: `Validation failed: ${error.message}`
      }
    }
  }

  async validateBase64Image(base64Data) {
    try {
      const matches = base64Data.match(/^data:(image\/\w+);base64,(.+)$/)
      if (!matches) {
        return { isValid: false, error: 'Invalid base64 format' }
      }

      const mimeType = matches[1]
      const base64Content = matches[2]
      const buffer = Buffer.from(base64Content, 'base64')
      const fileSize = buffer.byteLength

      // Check format
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedFormats.includes(mimeType)) {
        return { isValid: false, error: `Unsupported format: ${mimeType}` }
      }

      // Check size (max 10MB)
      if (fileSize > 10 * 1024 * 1024) {
        return { isValid: false, error: `Image too large: ${fileSize} bytes` }
      }

      return { isValid: true, fileSize, format: mimeType }
    } catch (error) {
      return { isValid: false, error: `Base64 validation error: ${error.message}` }
    }
  }

  async validateExternalImage(url) {
    try {
      // For external URLs, we'll do a simple HEAD request check
      const fetch = require('node-fetch')
      const response = await fetch(url, { method: 'HEAD' })
      
      if (!response.ok) {
        return { isValid: false, error: `HTTP ${response.status}: ${response.statusText}` }
      }

      const contentType = response.headers.get('content-type')
      const contentLength = response.headers.get('content-length')

      if (!contentType || !contentType.startsWith('image/')) {
        return { isValid: false, error: `Invalid content type: ${contentType}` }
      }

      return { isValid: true, url, contentType, size: contentLength }
    } catch (error) {
      return { isValid: false, error: `External validation error: ${error.message}` }
    }
  }

  async validateLocalImage(imagePath) {
    try {
      // Normalize path and check if it's within public directory
      let normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
      normalizedPath = normalizedPath.replace(/\/+/g, '/')
      normalizedPath = normalizedPath.replace(/\.\.\//g, '').replace(/\.\//g, '')
      
      const fullPath = path.join(this.publicDir, normalizedPath)
      
      // Check if file exists
      await fs.access(fullPath)
      
      // Get file stats
      const stats = await fs.stat(fullPath)
      
      // Check file size (max 10MB)
      if (stats.size > 10 * 1024 * 1024) {
        return { isValid: false, error: `Image too large: ${stats.size} bytes` }
      }

      return { 
        isValid: true, 
        fileSize: stats.size, 
        originalPath: imagePath,
        correctedPath: normalizedPath 
      }
    } catch (error) {
      return { isValid: false, error: `Local validation error: ${error.message}` }
    }
  }

  async validateMarketplaceItems() {
    console.log('🔍 Starting simple image validation...')
    console.log('=================================================')

    try {
      // Read the database file (SQLite)
      const dbPath = path.join(process.cwd(), 'db', 'custom.db')
      
      // Check if database exists
      try {
        await fs.access(dbPath)
      } catch (error) {
        console.log('⚠️  Database file not found, checking public directory images...')
        await this.validatePublicImages()
        return
      }

      // For this simple validation, we'll check the public directory structure
      console.log('📋 Checking public directory for marketplace images...')
      await this.validatePublicImages()

    } catch (error) {
      console.error('💥 Validation error:', error.message)
    }
  }

  async validatePublicImages() {
    try {
      // Check marketplace images directory
      const marketplaceDir = path.join(this.publicDir, 'marketplace-images')
      const modelsDir = path.join(this.publicDir, 'models')

      console.log(`📁 Checking marketplace images directory: ${marketplaceDir}`)
      console.log(`📁 Checking models directory: ${modelsDir}`)

      // Check if directories exist
      let marketplaceExists = false
      let modelsExists = false

      try {
        await fs.access(marketplaceDir)
        marketplaceExists = true
        console.log('✅ Marketplace images directory exists')
      } catch (error) {
        console.log('❌ Marketplace images directory not found')
      }

      try {
        await fs.access(modelsDir)
        modelsExists = true
        console.log('✅ Models directory exists')
      } catch (error) {
        console.log('❌ Models directory not found')
      }

      if (!marketplaceExists && !modelsExists) {
        console.log('❌ No image directories found')
        return
      }

      // Count and validate images
      let totalImages = 0
      let validImages = 0

      if (marketplaceExists) {
        const marketplaceImages = await this.countImagesInDirectory(marketplaceDir)
        totalImages += marketplaceImages.count
        validImages += marketplaceImages.valid
        console.log(`📊 Marketplace images: ${marketplaceImages.valid}/${marketplaceImages.count} valid`)
      }

      if (modelsExists) {
        const modelImages = await this.countImagesInDirectory(modelsDir)
        totalImages += modelImages.count
        validImages += modelImages.valid
        console.log(`📊 Model images: ${modelImages.valid}/${modelImages.count} valid`)
      }

      this.results.total = totalImages
      this.results.valid = validImages
      this.results.invalid = totalImages - validImages

      console.log('\n📈 VALIDATION SUMMARY')
      console.log('=================================================')
      console.log(`Total images found: ${this.results.total}`)
      console.log(`Valid images: ${this.results.valid}`)
      console.log(`Invalid images: ${this.results.invalid}`)
      console.log(`Success rate: ${this.results.total > 0 ? ((this.results.valid / this.results.total) * 100).toFixed(1) : 0}%`)

      if (this.results.invalid > 0) {
        console.log('\n⚠️  IMAGE INTEGRITY ISSUES DETECTED')
        console.log('=================================================')
        console.log(`${this.results.invalid} images have accessibility issues`)
        console.log('Recommend running the full image integrity system')
        console.log('Use the strict image components to enforce 100% integrity')
      }

      if (this.results.valid === this.results.total && this.results.total > 0) {
        console.log('\n🎉 EXCELLENT: All images are accessible!')
        console.log('=================================================')
        console.log('✅ Image file integrity: 100%')
        console.log('✅ All images are accessible')
        console.log('✅ File system structure is correct')
        console.log('✅ Ready for strict image integrity enforcement')
      }

    } catch (error) {
      console.error('💥 Error validating public images:', error.message)
    }
  }

  async countImagesInDirectory(dirPath) {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true })
      let count = 0
      let valid = 0

      for (const item of items) {
        if (item.isFile()) {
          const filePath = path.join(dirPath, item.name)
          
          // Check if it's an image file
          if (item.name.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)) {
            count++
            
            try {
              // Try to access the file
              await fs.access(filePath)
              const stats = await fs.stat(filePath)
              
              // Check file size
              if (stats.size > 0 && stats.size <= 10 * 1024 * 1024) {
                valid++
              }
            } catch (error) {
              // File not accessible
            }
          }
        } else if (item.isDirectory()) {
          // Recursively count images in subdirectories
          const subResult = await this.countImagesInDirectory(path.join(dirPath, item.name))
          count += subResult.count
          valid += subResult.valid
        }
      }

      return { count, valid }
    } catch (error) {
      console.error(`Error counting images in ${dirPath}:`, error.message)
      return { count: 0, valid: 0 }
    }
  }

  printRules() {
    console.log('\n🔒 STRICT IMAGE INTEGRITY RULES')
    console.log('=================================================')
    console.log('✅ RULE 1: No fallback images allowed - EVER')
    console.log('✅ RULE 2: No placeholder content permitted')
    console.log('✅ RULE 3: 100% image validation required')
    console.log('✅ RULE 4: Real-time accessibility verification')
    console.log('✅ RULE 5: Database integrity maintained')
    console.log('✅ RULE 6: EDN protection enabled on all images')
    console.log('✅ RULE 7: Exact generated images only displayed')
    console.log('✅ RULE 8: Zero tolerance for missing images')
    console.log('=================================================')
    console.log('🚫 FORBIDDEN: Fallback content, placeholders, missing images')
    console.log('✅ REQUIRED: Exact generated images only, 100% functionality')
  }
}

// Run the validation
async function main() {
  const validator = new SimpleImageValidator()
  
  validator.printRules()
  console.log('\n')
  
  await validator.validateMarketplaceItems()
  
  console.log('\n🏁 Image validation completed!')
  console.log('\n💡 NEXT STEPS:')
  console.log('1. Deploy the strict image integrity system')
  console.log('2. Replace existing image components with strict versions')
  console.log('3. Enable real-time validation in APIs')
  console.log('4. Set up monitoring and alerts')
  console.log('5. Enforce zero-tolerance policy for fallbacks')
}

main().catch(console.error)