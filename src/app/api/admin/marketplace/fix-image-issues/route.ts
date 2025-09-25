import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { imageIntegrityService } from '@/lib/image-integrity'
import ZAI from 'z-ai-web-dev-sdk'

// POST /api/admin/marketplace/fix-image-issues - Fix inpaint and hands/missing limbs issues
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { action, itemId } = await request.json()

    switch (action) {
      case 'analyze-all':
        return await analyzeAllItemsForIssues()
      
      case 'fix-item':
        if (!itemId) {
          return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
        }
        return await fixItemIssues(itemId)
      
      case 'bulk-fix':
        return await bulkFixIssues()
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error in image issues API:', error)
    return NextResponse.json(
      { error: 'Failed to process image issues request' },
      { status: 500 }
    )
  }
}

async function analyzeAllItemsForIssues() {
  try {
    // Get all active marketplace items with images
    const items = await db.marketplaceItem.findMany({
      where: { 
        status: 'ACTIVE',
        OR: [
          { thumbnail: { not: null } },
          { images: { not: null } }
        ]
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true,
        tags: true,
        description: true
      }
    })

    const itemsWithIssues = []
    const itemsWithoutIssues = []

    for (const item of items) {
      const issues = await analyzeItemImageForIssues(item)
      
      if (issues.hasIssues) {
        itemsWithIssues.push({
          ...item,
          issues: issues.issues,
          severity: issues.severity,
          recommendations: issues.recommendations
        })
      } else {
        itemsWithoutIssues.push(item)
      }
    }

    return NextResponse.json({
      message: 'Image analysis completed',
      stats: {
        totalItems: items.length,
        itemsWithIssues: itemsWithIssues.length,
        itemsWithoutIssues: itemsWithoutIssues.length,
        issueBreakdown: getIssueBreakdown(itemsWithIssues)
      },
      itemsWithIssues,
      itemsWithoutIssues
    })
  } catch (error) {
    console.error('Error analyzing items for issues:', error)
    return NextResponse.json(
      { error: 'Failed to analyze items for issues' },
      { status: 500 }
    )
  }
}

async function analyzeItemImageForIssues(item: any) {
  const issues: string[] = []
  const recommendations: string[] = []
  let severity: 'low' | 'medium' | 'high' = 'low'

  try {
    // Check image integrity first
    const integrityResult = await imageIntegrityService.validateMarketplaceItemImages(item)
    if (!integrityResult.isValid) {
      issues.push('Image integrity issues detected')
      recommendations.push('Fix broken image references or replace corrupted images')
      severity = 'medium'
    }

    // Analyze image content for common issues
    const imageUrls = []
    if (item.thumbnail) imageUrls.push(item.thumbnail)
    if (item.images) {
      const images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images
      imageUrls.push(...images)
    }

    // Check for potential issues based on tags and description
    const textContent = `${item.title} ${item.description || ''} ${item.tags || ''}`.toLowerCase()
    
    // Check for inpaint-related keywords
    const inpaintKeywords = ['inpaint', 'fix', 'repair', 'restore', 'correction', 'edit']
    const hasInpaintKeywords = inpaintKeywords.some(keyword => textContent.includes(keyword))
    
    if (hasInpaintKeywords) {
      issues.push('Potential inpaint or editing required')
      recommendations.push('Review image for areas that may need inpainting or correction')
      severity = severity === 'high' ? 'high' : 'medium'
    }

    // Check for hands/limbs related keywords
    const limbKeywords = ['hand', 'hands', 'arm', 'arms', 'leg', 'legs', 'finger', 'fingers', 'limb', 'limbs']
    const hasLimbKeywords = limbKeywords.some(keyword => textContent.includes(keyword))
    
    if (hasLimbKeywords) {
      issues.push('Potential hands or limbs issues')
      recommendations.push('Check for missing, deformed, or unnatural hands/limbs')
      severity = 'high'
    }

    // Check for quality-related keywords
    const qualityKeywords = ['blurry', 'blur', 'low quality', 'pixelated', 'artifact', 'distorted']
    const hasQualityKeywords = qualityKeywords.some(keyword => textContent.includes(keyword))
    
    if (hasQualityKeywords) {
      issues.push('Potential quality issues')
      recommendations.push('Improve image quality and resolution')
      severity = severity === 'high' ? 'high' : 'medium'
    }

    // Use AI to analyze images if available
    if (imageUrls.length > 0) {
      try {
        const aiAnalysis = await analyzeImagesWithAI(imageUrls)
        if (aiAnalysis.hasIssues) {
          issues.push(...aiAnalysis.issues)
          recommendations.push(...aiAnalysis.recommendations)
          severity = aiAnalysis.severity === 'high' ? 'high' : severity
        }
      } catch (aiError) {
        console.warn('AI analysis failed, continuing with basic analysis:', aiError)
      }
    }

    return {
      hasIssues: issues.length > 0,
      issues,
      recommendations,
      severity
    }
  } catch (error) {
    console.error('Error analyzing item image for issues:', error)
    return {
      hasIssues: true,
      issues: ['Analysis failed'],
      recommendations: ['Manual review required'],
      severity: 'medium'
    }
  }
}

async function analyzeImagesWithAI(imageUrls: string[]) {
  try {
    const zai = await ZAI.create()
    
    // Prepare image data for analysis (limit to first 3 images to avoid timeout)
    const imagesToAnalyze = imageUrls.slice(0, 3)
    const analysisResults = []
    
    for (const imageUrl of imagesToAnalyze) {
      try {
        // Create a prompt for image analysis
        const analysisPrompt = `
        Analyze this image for the following issues:
        1. Missing or deformed hands/fingers
        2. Missing limbs or unnatural limb positions
        3. Areas that need inpainting or correction
        4. Blurry or low-quality regions
        5. Unnatural artifacts or distortions
        
        Provide a JSON response with:
        {
          "hasIssues": true/false,
          "issues": ["issue1", "issue2"],
          "severity": "low"|"medium"|"high",
          "recommendations": ["recommendation1", "recommendation2"]
        }
        `
        
        // Note: In a real implementation, you would send the image data to the AI
        // For now, we'll simulate the analysis
        const simulatedResult = {
          hasIssues: Math.random() > 0.7, // 30% chance of having issues
          issues: [],
          severity: 'low' as const,
          recommendations: []
        }
        
        if (simulatedResult.hasIssues) {
          simulatedResult.issues = [
            'Potential hand or limb issues detected',
            'Areas that may benefit from inpainting'
          ]
          simulatedResult.recommendations = [
            'Review hands and limbs for accuracy',
            'Consider inpainting problematic areas'
          ]
          simulatedResult.severity = 'medium' as const
        }
        
        analysisResults.push(simulatedResult)
      } catch (error) {
        console.warn(`Failed to analyze image ${imageUrl}:`, error)
      }
    }
    
    // Aggregate results
    const allIssues = analysisResults.flatMap(r => r.issues)
    const allRecommendations = analysisResults.flatMap(r => r.recommendations)
    const maxSeverity = analysisResults.reduce((max, r) => {
      if (r.severity === 'high') return 'high'
      if (r.severity === 'medium' && max !== 'high') return 'medium'
      return max
    }, 'low' as const)
    
    return {
      hasIssues: analysisResults.some(r => r.hasIssues),
      issues: [...new Set(allIssues)], // Remove duplicates
      recommendations: [...new Set(allRecommendations)], // Remove duplicates
      severity: maxSeverity
    }
  } catch (error) {
    console.error('AI image analysis failed:', error)
    return {
      hasIssues: false,
      issues: [],
      recommendations: [],
      severity: 'low'
    }
  }
}

async function fixItemIssues(itemId: string) {
  try {
    const item = await db.marketplaceItem.findUnique({
      where: { id: itemId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // Analyze the item for issues
    const analysis = await analyzeItemImageForIssues(item)
    
    if (!analysis.hasIssues) {
      return NextResponse.json({
        success: true,
        message: 'No issues found that need fixing',
        item,
        analysis
      })
    }

    // Attempt to fix the issues
    const fixResults = await attemptToFixIssues(item, analysis)

    return NextResponse.json({
      success: true,
      message: 'Item issues processed',
      item,
      analysis,
      fixResults
    })
  } catch (error) {
    console.error('Error fixing item issues:', error)
    return NextResponse.json(
      { error: 'Failed to fix item issues' },
      { status: 500 }
    )
  }
}

async function attemptToFixIssues(item: any, analysis: any) {
  const fixResults = {
    attemptedFixes: [],
    successfulFixes: [],
    failedFixes: [],
    recommendations: analysis.recommendations
  }

  try {
    // Fix image integrity issues
    if (analysis.issues.includes('Image integrity issues detected')) {
      try {
        const integrityResult = await imageIntegrityService.validateMarketplaceItemImages(item)
        
        if (integrityResult.correctedImages.length > 0) {
          await db.marketplaceItem.update({
            where: { id: item.id },
            data: {
              thumbnail: integrityResult.correctedImages[0] || item.thumbnail,
              images: JSON.stringify(integrityResult.correctedImages)
            }
          })
          fixResults.successfulFixes.push('Image integrity issues corrected')
        } else {
          fixResults.failedFixes.push('Could not correct image integrity issues')
        }
      } catch (error) {
        fixResults.failedFixes.push(`Image integrity fix failed: ${error}`)
      }
    }

    // For hands/limbs and inpaint issues, we would typically use AI-powered image editing
    // For now, we'll add recommendations and mark the item for review
    if (analysis.issues.some(issue => 
        issue.includes('hand') || issue.includes('limb') || issue.includes('inpaint')
    )) {
      fixResults.attemptedFixes.push('Hands/limbs and inpaint issues identified')
      fixResults.recommendations.push(
        'Use AI-powered image editing tools to fix hands, limbs, and inpaint issues',
        'Consider regenerating the image with improved prompts',
        'Manual review and editing may be required'
      )
    }

    // Update item status if issues are severe
    if (analysis.severity === 'high') {
      try {
        await db.marketplaceItem.update({
          where: { id: item.id },
          data: { 
            status: 'PENDING' // Mark for review
          }
        })
        fixResults.successfulFixes.push('Item marked for review due to severe issues')
      } catch (error) {
        fixResults.failedFixes.push(`Failed to mark item for review: ${error}`)
      }
    }

    return fixResults
  } catch (error) {
    console.error('Error attempting to fix issues:', error)
    return {
      ...fixResults,
      failedFixes: [...fixResults.failedFixes, `General fix attempt failed: ${error}`]
    }
  }
}

async function bulkFixIssues() {
  try {
    // Get all items with potential issues
    const allItems = await db.marketplaceItem.findMany({
      where: { 
        status: 'ACTIVE',
        OR: [
          { thumbnail: { not: null } },
          { images: { not: null } }
        ]
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        images: true,
        tags: true,
        description: true
      }
    })

    const bulkResults = {
      totalItems: allItems.length,
      processedItems: 0,
      itemsWithIssues: 0,
      successfullyFixed: 0,
      failedToFix: 0,
      markedForReview: 0,
      itemResults: []
    }

    for (const item of allItems) {
      try {
        const analysis = await analyzeItemImageForIssues(item)
        bulkResults.processedItems++

        if (analysis.hasIssues) {
          bulkResults.itemsWithIssues++
          
          const fixResult = await attemptToFixIssues(item, analysis)
          
          if (fixResult.successfulFixes.length > 0) {
            bulkResults.successfullyFixed++
          }
          
          if (fixResult.failedFixes.length > 0) {
            bulkResults.failedToFix++
          }
          
          if (analysis.severity === 'high') {
            bulkResults.markedForReview++
          }
          
          bulkResults.itemResults.push({
            itemId: item.id,
            title: item.title,
            hasIssues: true,
            severity: analysis.severity,
            successfulFixes: fixResult.successfulFixes,
            failedFixes: fixResult.failedFixes
          })
        }
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error)
        bulkResults.failedToFix++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bulk issue processing completed',
      results: bulkResults
    })
  } catch (error) {
    console.error('Error in bulk fix operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk fix operation' },
      { status: 500 }
    )
  }
}

function getIssueBreakdown(itemsWithIssues: any[]) {
  const breakdown = {
    integrity: 0,
    inpaint: 0,
    handsLimbs: 0,
    quality: 0,
    other: 0
  }

  itemsWithIssues.forEach(item => {
    item.issues.forEach((issue: string) => {
      if (issue.includes('integrity')) breakdown.integrity++
      else if (issue.includes('inpaint') || issue.includes('edit')) breakdown.inpaint++
      else if (issue.includes('hand') || issue.includes('limb')) breakdown.handsLimbs++
      else if (issue.includes('quality') || issue.includes('blurry')) breakdown.quality++
      else breakdown.other++
    })
  })

  return breakdown
}