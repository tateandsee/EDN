import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

// Only import Supabase if it's configured
let supabase: any;
try {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { supabase: supabaseClient } = await import('@/lib/supabase');
    supabase = supabaseClient;
  }
} catch (error) {
  console.warn('Supabase not configured, content will work without authentication');
}

export async function POST(request: Request) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      )
    }

=======
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: Request) {
  try {
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { prompt, type, loraModel, resolution, tags } = await request.json()

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    // Check if Z-AI is configured
    if (!process.env.ZAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      )
    }

    // Check user subscription
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { expiresAt: 'desc' },
          take: 1
        }
      }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const subscription = dbUser.subscriptions[0]
    if (!subscription && type !== 'TEXT') {
      return NextResponse.json(
        { error: 'Premium subscription required for content generation' },
        { status: 403 }
      )
    }

    // Create content record
    const content = await db.content.create({
      data: {
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${new Date().toLocaleDateString()}`,
        type: type.toUpperCase(),
        status: 'PROCESSING',
        prompt,
        loraModel,
        resolution,
        tags: tags || [],
        userId: user.id
      }
    })

    // Generate content using ZAI SDK
    try {
      const zai = await ZAI.create()
      
      if (type === 'IMAGE') {
        const response = await zai.images.generations.create({
          prompt,
          size: resolution === '4K' ? '1024x1024' : '768x1344'
        })
        
        const imageBase64 = response.data[0].base64
        
        // Upload to Supabase Storage (if configured)
        if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('content')
            .upload(`${user.id}/${content.id}.png`, Buffer.from(imageBase64, 'base64'), {
              contentType: 'image/png'
            })
          
          if (uploadError) throw uploadError
          
          const { data: { publicUrl } } = supabase.storage
            .from('content')
            .getPublicUrl(uploadData.path)
          
          // Update content record
          await db.content.update({
            where: { id: content.id },
            data: {
              status: 'COMPLETED',
              url: publicUrl,
              resolution: resolution || '1024x1024'
            }
          })
          
          return NextResponse.json({ 
            success: true, 
            content: { ...content, url: publicUrl, status: 'COMPLETED' }
          })
        } else {
          // Return base64 data if Supabase is not configured
          await db.content.update({
            where: { id: content.id },
            data: {
              status: 'COMPLETED',
              url: `data:image/png;base64,${imageBase64}`,
              resolution: resolution || '1024x1024'
            }
          })
          
          return NextResponse.json({ 
            success: true, 
            content: { ...content, url: `data:image/png;base64,${imageBase64}`, status: 'COMPLETED' }
          })
        }
        
      } else if (type === 'TEXT') {
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a creative content writer. Generate engaging content based on the user\'s prompt.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000
        })
        
        const generatedText = completion.choices[0]?.message?.content
        
        // Update content record
        await db.content.update({
          where: { id: content.id },
          data: {
            status: 'COMPLETED',
            url: generatedText
          }
        })
        
        return NextResponse.json({ 
          success: true, 
          content: { ...content, url: generatedText, status: 'COMPLETED' }
        })
      }
      
    } catch (generationError) {
      console.error('Content generation error:', generationError)
      
      // Update content record to failed
      await db.content.update({
        where: { id: content.id },
        data: { status: 'FAILED' }
      })
      
      return NextResponse.json(
        { error: 'Content generation failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
<<<<<<< HEAD
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication service not configured' },
        { status: 503 }
      )
    }

=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where: any = { userId: user.id }
    if (type) where.type = type.toUpperCase()
    if (status) where.status = status.toUpperCase()

    const [contents, total] = await Promise.all([
      db.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.content.count({ where })
    ])

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}