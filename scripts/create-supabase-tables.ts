#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function createSupabaseTables() {
  console.log('🗄️  Creating Supabase tables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  // SQL statements for creating tables
  const createTablesSQL = `
    -- Enable extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
        id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_paid_member BOOLEAN DEFAULT false,
        subscription_plan TEXT DEFAULT 'free',
        subscription_expires_at TIMESTAMP WITH TIME ZONE,
        points INTEGER DEFAULT 0,
        current_level_id UUID,
        onboarding_completed BOOLEAN DEFAULT false,
        bio TEXT,
        preferences JSONB DEFAULT '{}',
        settings JSONB DEFAULT '{}'
    );
    
    -- Create profiles table
    CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        display_name TEXT,
        bio TEXT,
        website TEXT,
        social_links JSONB DEFAULT '{}',
        is_nsfw_creator BOOLEAN DEFAULT false,
        content_preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create marketplace_items table
    CREATE TABLE IF NOT EXISTS marketplace_items (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        content_url TEXT NOT NULL,
        thumbnail_url TEXT,
        category TEXT NOT NULL,
        tags TEXT[],
        is_nsfw BOOLEAN DEFAULT false,
        is_available BOOLEAN DEFAULT true,
        views INTEGER DEFAULT 0,
        purchases INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create marketplace_reviews table
    CREATE TABLE IF NOT EXISTS marketplace_reviews (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, item_id)
    );
    
    -- Create marketplace_orders table
    CREATE TABLE IF NOT EXISTS marketplace_orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
        seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
        item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
        amount DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_marketplace_items_user_id ON marketplace_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
    CREATE INDEX IF NOT EXISTS idx_marketplace_items_is_nsfw ON marketplace_items(is_nsfw);
    CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_user_id ON marketplace_reviews(user_id);
    CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_item_id ON marketplace_reviews(item_id);
    CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_id ON marketplace_orders(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_marketplace_orders_seller_id ON marketplace_orders(seller_id);
    
    -- Enable RLS
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
    ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    DROP POLICY IF EXISTS "Users can view own data" ON users;
    CREATE POLICY "Users can view own data" ON users
        FOR SELECT USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Users can update own data" ON users;
    CREATE POLICY "Users can update own data" ON users
        FOR UPDATE USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
    CREATE POLICY "Profiles are viewable by everyone" ON profiles
        FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    CREATE POLICY "Users can insert own profile" ON profiles
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    CREATE POLICY "Users can update own profile" ON profiles
        FOR UPDATE USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Marketplace items are viewable by everyone" ON marketplace_items;
    CREATE POLICY "Marketplace items are viewable by everyone" ON marketplace_items
        FOR SELECT USING (is_available = true);
    
    DROP POLICY IF EXISTS "Users can insert own marketplace items" ON marketplace_items;
    CREATE POLICY "Users can insert own marketplace items" ON marketplace_items
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can update own marketplace items" ON marketplace_items;
    CREATE POLICY "Users can update own marketplace items" ON marketplace_items
        FOR UPDATE USING (auth.uid() = user_id);
    
    DROP POLICY IF EXISTS "Users can delete own marketplace items" ON marketplace_items;
    CREATE POLICY "Users can delete own marketplace items" ON marketplace_items
        FOR DELETE USING (auth.uid() = user_id);
  `;
  
  try {
    console.log('🔌 Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && !error.message.includes('relation')) {
      console.log('❌ Connection test failed:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Execute the SQL using RPC
    console.log('📝 Creating tables...');
    const { data: execData, error: execError } = await supabase.rpc('exec_sql', {
      sql: createTablesSQL
    });
    
    if (execError) {
      console.log('⚠️  Could not execute SQL via RPC. This is normal if exec_sql function doesn\'t exist.');
      console.log('💡 Please apply the schema manually using the Supabase dashboard SQL Editor.');
    } else {
      console.log('✅ Tables created successfully!');
    }
    
    // Test if tables were created
    console.log('\n🔍 Testing table creation...');
    
    const tables = ['users', 'profiles', 'marketplace_items', 'marketplace_reviews', 'marketplace_orders'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          if (error.message.includes('relation')) {
            console.log(`❌ Table ${table}: Does not exist`);
          } else {
            console.log(`❌ Table ${table}: ${error.message}`);
          }
        } else {
          console.log(`✅ Table ${table}: Exists`);
        }
      } catch (error) {
        console.log(`❌ Table ${table}: Error checking`);
      }
    }
    
    console.log('\n📋 Manual Schema Application Instructions:');
    console.log('1. Go to: https://app.supabase.com');
    console.log('2. Select project: pbpajqxpuljydokgpfry');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy the SQL from supabase-schema.sql');
    console.log('5. Paste and execute it');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSupabaseTables().catch(console.error);