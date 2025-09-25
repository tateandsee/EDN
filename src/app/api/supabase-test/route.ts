<<<<<<< HEAD
import { getSupabaseConfig } from '@/lib/config'
=======
import { createClient } from '@/lib/supabase-client'
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
import { NextResponse } from 'next/server'

export async function GET() {
  try {
<<<<<<< HEAD
    const supabaseConfig = getSupabaseConfig()
    
    // Check if Supabase is configured
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase not configured',
        details: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
      }, { status: 503 })
    }

    // Import dynamically only if configured
    const { createClient } = await import('@/lib/supabase-client')
=======
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    const supabase = createClient()
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Failed to connect to Supabase'
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      userCount: data?.count || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}