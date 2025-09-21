#!/usr/bin/env tsx

import { db } from '../src/lib/db'

interface ImageIssue {
  id: string
  title: string
  thumbnail: string | null
  images: string[] | null
  issues: string[]
  severity: 'low' | 'medium' | 'high'
}

interface ImageAuditResult {
  totalItems: number
  itemsWithIssues: number
  issues: ImageIssue[]
  summary: {
    missingThumbnails: number
    missingImages: number
    malformedUrls: number
    base64Images: number
    relativeUrls: number
  }
}

function validateImageUrl(url: string): { isValid: boolean; issues: string[] } {
  const issues: string[] = []
  
  if (!url || url.trim() === '') {
    issues.push('Empty URL')
    return { isValid: false, issues }
  }
  
  // Check for base64 data URLs
  if (url.startsWith('data:image/')) {
    // Basic validation for base64
    if (!url.includes('base64,')) {
      issues.push('Invalid base64 format')
    }
    return { isValid: issues.length === 0, issues }
  }
  
  // Check for HTTP/HTTPS URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      new URL(url)
      return { isValid: true, issues }
    } catch {
      issues.push('Invalid URL format')
      return { isValid: false, issues }
    }
  }
  
  // Check for relative URLs
  if (url.startsWith('/')) {
    // Valid relative URL
    return { isValid: true, issues }
  }
  
  // Check if it might be a relative URL without leading slash
  if (!url.startsWith('http') && !url.startsWith('data:')) {
    issues.push('Possible missing leading slash in relative URL')
    return { isValid: false, issues }
  }
  
  issues.push('Unknown URL format')
  return { isValid: false, issues }
}

function getSeverity(issues: string[]): 'low' | 'medium' | 'high' {
  if (issues.some(issue => issue.includes('Empty') || issue.includes('Invalid base64') || issue.includes('Invalid URL format'))) {
    return 'high'
  }
  if (issues.some(issue => issue.includes('missing leading slash'))) {
    return 'medium'
  }
  return 'low'
}

async function auditMarketplaceImages(): Promise<ImageAuditResult> {
  console.log('🔍 Starting marketplace image audit...')
  
  try {
    // Fetch all marketplace items
    const items = await db.marketplaceItem.findMany({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true,
      }
    })
    
    console.log(`📊 Found ${items.length} marketplace items to audit`)
    
    const issues: ImageIssue[] = []
    const summary = {
      missingThumbnails: 0,
      missingImages: 0,
      malformedUrls: 0,
      base64Images: 0,
      relativeUrls: 0
    }
    
    for (const item of items) {
      const itemIssues: string[] = []
      
      // Audit thumbnail
      if (!item.thumbnail) {
        itemIssues.push('Missing thumbnail')
        summary.missingThumbnails++
      } else {
        const thumbnailValidation = validateImageUrl(item.thumbnail)
        if (!thumbnailValidation.isValid) {
          itemIssues.push(...thumbnailValidation.issues.map(issue => `Thumbnail: ${issue}`))
          summary.malformedUrls++
        } else if (item.thumbnail.startsWith('data:image/')) {
          summary.base64Images++
        } else if (item.thumbnail.startsWith('/')) {
          summary.relativeUrls++
        }
      }
      
      // Audit images array
      let parsedImages: string[] = []
      try {
        parsedImages = item.images ? (typeof item.images === 'string' ? JSON.parse(item.images) : item.images) : []
      } catch (error) {
        itemIssues.push('Invalid images JSON format')
        summary.malformedUrls++
      }
      
      if (parsedImages.length === 0) {
        itemIssues.push('No images in array')
        summary.missingImages++
      } else {
        for (const imageUrl of parsedImages) {
          const imageValidation = validateImageUrl(imageUrl)
          if (!imageValidation.isValid) {
            itemIssues.push(...imageValidation.issues.map(issue => `Image: ${issue}`))
            summary.malformedUrls++
          } else if (imageUrl.startsWith('data:image/')) {
            summary.base64Images++
          } else if (imageUrl.startsWith('/')) {
            summary.relativeUrls++
          }
        }
      }
      
      if (itemIssues.length > 0) {
        issues.push({
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          images: parsedImages,
          issues: itemIssues,
          severity: getSeverity(itemIssues)
        })
      }
    }
    
    const result: ImageAuditResult = {
      totalItems: items.length,
      itemsWithIssues: issues.length,
      issues,
      summary
    }
    
    return result
  } catch (error) {
    console.error('❌ Error during image audit:', error)
    throw error
  }
}

function printAuditReport(result: ImageAuditResult) {
  console.log('\n📋 MARKETPLACE IMAGE AUDIT REPORT')
  console.log('═'.repeat(50))
  console.log(`Total items audited: ${result.totalItems}`)
  console.log(`Items with issues: ${result.itemsWithIssues}`)
  console.log(`Items without issues: ${result.totalItems - result.itemsWithIssues}`)
  console.log('\n📊 Summary of Issues:')
  console.log(`  Missing thumbnails: ${result.summary.missingThumbnails}`)
  console.log(`  Missing images: ${result.summary.missingImages}`)
  console.log(`  Malformed URLs: ${result.summary.malformedUrls}`)
  console.log(`  Base64 images: ${result.summary.base64Images}`)
  console.log(`  Relative URLs: ${result.summary.relativeUrls}`)
  
  if (result.issues.length > 0) {
    console.log('\n🚨 Issues Found:')
    console.log('═'.repeat(50))
    
    const highSeverityIssues = result.issues.filter(issue => issue.severity === 'high')
    const mediumSeverityIssues = result.issues.filter(issue => issue.severity === 'medium')
    const lowSeverityIssues = result.issues.filter(issue => issue.severity === 'low')
    
    if (highSeverityIssues.length > 0) {
      console.log('\n🔴 HIGH SEVERITY ISSUES:')
      highSeverityIssues.forEach(issue => {
        console.log(`  ID: ${issue.id}`)
        console.log(`  Title: ${issue.title}`)
        console.log(`  Issues: ${issue.issues.join(', ')}`)
        console.log('  ---')
      })
    }
    
    if (mediumSeverityIssues.length > 0) {
      console.log('\n🟡 MEDIUM SEVERITY ISSUES:')
      mediumSeverityIssues.forEach(issue => {
        console.log(`  ID: ${issue.id}`)
        console.log(`  Title: ${issue.title}`)
        console.log(`  Issues: ${issue.issues.join(', ')}`)
        console.log('  ---')
      })
    }
    
    if (lowSeverityIssues.length > 0) {
      console.log('\n🟢 LOW SEVERITY ISSUES:')
      lowSeverityIssues.forEach(issue => {
        console.log(`  ID: ${issue.id}`)
        console.log(`  Title: ${issue.title}`)
        console.log(`  Issues: ${issue.issues.join(', ')}`)
        console.log('  ---')
      })
    }
  } else {
    console.log('\n✅ No image issues found!')
  }
}

async function fixImageUrls() {
  console.log('\n🔧 Starting image URL fixes...')
  
  try {
    // Get all items with potential URL issues
    const items = await db.marketplaceItem.findMany({
      where: {
        OR: [
          {
            thumbnail: {
              contains: 'marketplace-images',
              not: {
                startsWith: '/'
              }
            }
          },
          {
            images: {
              contains: 'marketplace-images',
              not: {
                startsWith: '['
              }
            }
          }
        ]
      }
    })
    
    console.log(`Found ${items.length} items with potential URL issues`)
    
    let fixedCount = 0
    
    for (const item of items) {
      const updates: any = {}
      
      // Fix thumbnail URL
      if (item.thumbnail && !item.thumbnail.startsWith('/') && !item.thumbnail.startsWith('http') && !item.thumbnail.startsWith('data:')) {
        updates.thumbnail = `/${item.thumbnail}`
        console.log(`Fixing thumbnail for item ${item.id}: ${item.thumbnail} -> ${updates.thumbnail}`)
      }
      
      // Fix images array
      if (item.images) {
        let parsedImages: string[] = []
        try {
          parsedImages = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
        } catch {
          // Skip if JSON is invalid
          continue
        }
        
        const fixedImages = parsedImages.map(img => {
          if (!img.startsWith('/') && !img.startsWith('http') && !img.startsWith('data:')) {
            return `/${img}`
          }
          return img
        })
        
        if (JSON.stringify(parsedImages) !== JSON.stringify(fixedImages)) {
          updates.images = JSON.stringify(fixedImages)
          console.log(`Fixing images for item ${item.id}`)
        }
      }
      
      if (Object.keys(updates).length > 0) {
        await db.marketplaceItem.update({
          where: { id: item.id },
          data: updates
        })
        fixedCount++
      }
    }
    
    console.log(`✅ Fixed ${fixedCount} items`)
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const shouldFix = args.includes('--fix')
  
  try {
    const auditResult = await auditMarketplaceImages()
    printAuditReport(auditResult)
    
    if (shouldFix) {
      await fixImageUrls()
      console.log('\n🔄 Running audit again after fixes...')
      const newAuditResult = await auditMarketplaceImages()
      printAuditReport(newAuditResult)
    }
    
    console.log('\n✅ Image audit completed!')
    
    if (!shouldFix && auditResult.itemsWithIssues > 0) {
      console.log('\n💡 To fix the issues automatically, run:')
      console.log('npm run audit-images -- --fix')
    }
  } catch (error) {
    console.error('❌ Image audit failed:', error)
    process.exit(1)
  }
}

// Run the script
main()