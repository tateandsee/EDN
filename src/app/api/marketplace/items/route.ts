import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { GamificationProgressService } from '@/lib/gamification-progress'
import { generateTitleFromPrompt, extractTitleFromMarketplaceItem } from '@/lib/marketplace-title-extractor'
import { contentModeration } from '@/lib/content-moderation'

// Helper function to check if user is admin or if in development mode
async function shouldBypassRestrictions(): Promise<boolean> {
  // Check if in development mode
  if (process.env.NODE_ENV === 'development') {
    return true
  }

  // Check if user is admin
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      })
      return user?.role === 'ADMIN'
    }
  } catch (error) {
    console.error('Error checking user role:', error)
  }

  return false
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const ethnicity = searchParams.get('ethnicity')
    const hairColor = searchParams.get('hairColor')
    const bodyType = searchParams.get('bodyType')
    const attire = searchParams.get('attire')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')

    const where: any = {
      status: 'ACTIVE' // Only show active items by default
    }

    // Handle SFW/NSFW filtering
    if (category === 'SFW') {
      where.isNsfw = false
    } else if (category === 'NSFW') {
      where.isNsfw = true
    } else if (category && category !== 'all' && category !== 'ETHNICITY' && category !== 'HAIR_COLOR' && category !== 'BODY_TYPE' && category !== 'ATTIRE') {
      where.category = category
    }

    // Handle sub-category filtering
    if (ethnicity && ethnicity !== 'all') {
      where.tags = {
        contains: ethnicity,
        mode: 'insensitive'
      }
    }

    if (hairColor && hairColor !== 'all') {
      where.tags = {
        contains: hairColor,
        mode: 'insensitive'
      }
    }

    if (bodyType && bodyType !== 'all') {
      where.tags = {
        contains: bodyType,
        mode: 'insensitive'
      }
    }

    if (attire && attire !== 'all') {
      // Filter by attire tags - look for exact attire tag match
      where.tags = {
        contains: `"${attire}"`
      }
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      db.marketplaceItem.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          category: true,
          price: true,
          currency: true,
          status: true,
          thumbnail: true,
          images: true,
          tags: true,
          isNsfw: true,
          userId: true,
          positivePrompt: true,
          negativePrompt: true,
          promptConfig: true,
          // New content moderation fields
          contentLevel: true,
          nudityLevel: true,
          adultContent: true,
          suggestiveContent: true,
          artisticNudity: true,
          moderationStatus: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
              verified: true
            }
          },
          reviews: {
            select: {
              rating: true,
              comment: true,
              createdAt: true,
              user: {
                select: {
                  name: true,
                  avatar: true
                }
              }
            }
          },
          _count: {
            select: {
              reviews: true,
              orders: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      db.marketplaceItem.count({ where })
    ])

    // Process items to extract title information and parse tags
    const bypassRestrictions = await shouldBypassRestrictions()
    
    const processedItems = items.map(item => {
      const { displayTitle, isAutoGenerated } = extractTitleFromMarketplaceItem(item)
      const parsedTags = item.tags ? JSON.parse(item.tags) : []
      const parsedImages = item.images ? JSON.parse(item.images) : []
      
      // Apply content restrictions using enhanced moderation system (bypass for admin/dev mode)
      if (!bypassRestrictions) {
        // Use the moderation system to check content restrictions
        const itemText = `${item.title} ${item.description || ''} ${item.tags || ''}`
        const itemModeration = await contentModeration.moderateText(itemText)
        
        // Check gender restrictions
        if (itemModeration.gender === 'MALE' || itemModeration.gender === 'MIXED') {
          return null
        }
        
        // Check restricted content
        if (itemModeration.hasRestrictedContent) {
          if (itemModeration.restrictedContentTypes.includes('child_content') ||
              itemModeration.restrictedContentTypes.includes('animal_content')) {
            return null
          }
        }
        
        // Check age restrictions
        if (!itemModeration.ageAppropriate) {
          return null
        }
      }
      
      return {
        ...item,
        tags: parsedTags,
        images: parsedImages,
        displayTitle,
        isAutoGenerated
      }
    }).filter(item => item !== null) // Remove filtered items

    // Calculate pagination based on filtered items if restrictions are applied, otherwise use original count
    const displayTotal = bypassRestrictions ? total : processedItems.length
    const displayPages = Math.ceil(displayTotal / limit)

    return NextResponse.json({
      items: processedItems,
      pagination: {
        page,
        limit,
        total: displayTotal,
        pages: displayPages
      }
    })
  } catch (error) {
    console.error('Error fetching marketplace items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch marketplace items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const bypassRestrictions = await shouldBypassRestrictions()

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const type = formData.get('type') as string
    const category = formData.get('category') as string
    const price = formData.get('price') as string
    const thumbnail = formData.get('thumbnail') as string
    const tags = formData.get('tags') as string
    const isNsfw = formData.get('isNsfw') === 'true'
    
    // New content moderation fields
    const contentLevel = formData.get('contentLevel') as string
    const nudityLevel = formData.get('nudityLevel') as string
    const adultContent = formData.get('adultContent') === 'true'
    const suggestiveContent = formData.get('suggestiveContent') === 'true'
    const artisticNudity = formData.get('artisticNudity') === 'true'
    
    // Prompt-related fields
    const positivePrompt = formData.get('positivePrompt') as string
    const negativePrompt = formData.get('negativePrompt') as string
    const promptConfigStr = formData.get('promptConfig') as string
    let promptConfig = null
    
    if (promptConfigStr) {
      try {
        promptConfig = JSON.parse(promptConfigStr)
      } catch (error) {
        console.error('Error parsing prompt config:', error)
      }
    }
    
    // Handle file uploads
    const imageFiles = formData.getAll('images') as File[]
    const pdfFile = formData.get('pdfFile') as File | null

    if (!title || !type || !category || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Parse and validate tags for content restrictions
    const parsedTags = tags ? tags.split(',').map(t => t.trim()) : []
    
    // Perform content moderation analysis
    const textToAnalyze = `${title} ${description || ''} ${tags || ''}`
    const moderationResult = await contentModeration.moderateText(textToAnalyze)
    
    // Apply content restrictions (bypass for admin/dev mode)
    if (!bypassRestrictions) {
      // Use enhanced content moderation system
      if (moderationResult.gender === 'MALE' || moderationResult.gender === 'MIXED') {
        return NextResponse.json(
          { error: 'Male content not allowed. Only female content is permitted.' },
          { status: 400 }
        )
      }
      
      if (moderationResult.hasRestrictedContent) {
        if (moderationResult.restrictedContentTypes.includes('child_content')) {
          return NextResponse.json(
            { error: 'Child content not allowed. Strictly prohibited.' },
            { status: 400 }
          )
        }
        
        if (moderationResult.restrictedContentTypes.includes('animal_content')) {
          return NextResponse.json(
            { error: 'Animal content not allowed. Strictly prohibited.' },
            { status: 400 }
          )
        }
      }
      
      if (!moderationResult.ageAppropriate) {
        return NextResponse.json(
          { error: 'Content must feature subjects aged 18-40 only.' },
          { status: 400 }
        )
      }
      
      // Check if content moderation status allows creation
      if (moderationResult.moderationStatus === 'REJECTED') {
        return NextResponse.json(
          { error: 'Content rejected by moderation system', details: moderationResult.recommendations },
          { status: 400 }
        )
      }
    }

    // Generate title from prompt data if not explicitly provided or if it's an auto-generated title
    let finalTitle = title
    let isAutoGenerated = false
    
    if (!title || title.startsWith('EDN ') || (positivePrompt || promptConfig)) {
      const extractedData = generateTitleFromPrompt(
        promptConfig,
        positivePrompt,
        negativePrompt
      )
      
      // Use the extracted title if no title is provided or if the current title looks auto-generated
      if (!title || title.startsWith('EDN ')) {
        finalTitle = extractedData.suggestedTitle
        isAutoGenerated = true
      }
      
      // Override category if extracted from prompts
      const extractedCategory = extractedData.category
      let finalCategory = category
      if (!category || category === 'auto') {
        finalCategory = extractedCategory
      }
    }

    // Process image files (in a real implementation, you would upload to cloud storage)
    const imageUrls: string[] = []
    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        if (imageFile instanceof File) {
          // Convert to base64 for demo (in production, upload to cloud storage)
          const buffer = Buffer.from(await imageFile.arrayBuffer())
          const base64 = buffer.toString('base64')
          const mimeType = imageFile.type
          imageUrls.push(`data:${mimeType};base64,${base64}`)
        }
      }
    }

    // Process PDF file
    let pdfFileUrl = null
    let pdfFileName = null
    let pdfFileSize = null

    if (pdfFile && pdfFile instanceof File) {
      // Convert to base64 for demo (in production, upload to cloud storage)
      const buffer = Buffer.from(await pdfFile.arrayBuffer())
      const base64 = buffer.toString('base64')
      pdfFileUrl = `data:application/pdf;base64,${base64}`
      pdfFileName = pdfFile.name
      pdfFileSize = pdfFile.size
    }

    const item = await db.marketplaceItem.create({
      data: {
        title: finalTitle,
        description: description || undefined,
        type: type as any,
        category: finalCategory as any,
        price: parseFloat(price),
        currency: 'USD',
        thumbnail: thumbnail || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        pdfFile: pdfFileUrl || undefined,
        pdfFileName: pdfFileName || undefined,
        pdfFileSize: pdfFileSize || undefined,
        tags: tags ? JSON.stringify(tags.split(',').map(t => t.trim())) : undefined,
        isNsfw,
        // New content moderation fields
        contentLevel: contentLevel as any || moderationResult.contentLevel,
        nudityLevel: nudityLevel as any || moderationResult.nudityLevel,
        adultContent: adultContent || moderationResult.adultContent,
        suggestiveContent: suggestiveContent || moderationResult.suggestiveContent,
        artisticNudity: artisticNudity || moderationResult.artisticNudity,
        moderationStatus: moderationResult.moderationStatus,
        moderationNotes: moderationResult.recommendations.join(', '),
        moderatedAt: new Date(),
        userId,
        // Store prompt-related fields
        promptConfig: promptConfig || undefined,
        positivePrompt: positivePrompt || undefined,
        negativePrompt: negativePrompt || undefined,
        fullPrompt: positivePrompt && negativePrompt ? `${positivePrompt} ${negativePrompt}` : positivePrompt || undefined
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            verified: true
          }
        }
      }
    })

    // Award points for creating marketplace item
    try {
      await GamificationProgressService.awardPoints(userId, 25, 'Created marketplace item')
    } catch (pointsError) {
      console.error('Error awarding points for marketplace item creation:', pointsError)
      // Don't fail the request if points awarding fails
    }

    return NextResponse.json({ 
      item, 
      moderation: moderationResult,
      metadata: {
        titleGenerated: isAutoGenerated,
        titleSource: isAutoGenerated ? 'prompts' : 'user_input',
        contentModeration: {
          status: moderationResult.moderationStatus,
          contentLevel: moderationResult.contentLevel,
          nudityLevel: moderationResult.nudityLevel,
          recommendations: moderationResult.recommendations
        }
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating marketplace item:', error)
    return NextResponse.json(
      { error: 'Failed to create marketplace item' },
      { status: 500 }
    )
  }
}