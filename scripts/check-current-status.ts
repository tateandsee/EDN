#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config({ 
  path: '.env.local',
  override: true 
});

async function checkCurrentStatus() {
  console.log('📊 EDN Marketplace Current Status');
  console.log('==================================\n');
  
  // Check if we have real Supabase credentials
  const envContent = readFileSync('.env.local', 'utf8');
  const hasRealCredentials = !envContent.includes('your-project.supabase.co') && 
                            !envContent.includes('your-anon-key') &&
                            !envContent.includes('your-service-role-key');
  
  console.log('🔧 Configuration Status:');
  console.log(hasRealCredentials ? '✅ Real Supabase credentials found' : '⚠️  Using placeholder credentials');
  
  // Check database configuration
  const dbUrl = process.env.DATABASE_URL;
  const usePostgreSQL = dbUrl?.startsWith('postgresql://');
  
  console.log('🔍 Debug info:');
  console.log('dbUrl:', dbUrl?.substring(0, 50) + '...');
  console.log('usePostgreSQL:', usePostgreSQL);
  
  console.log(usePostgreSQL ? '✅ Configured for PostgreSQL' : '⚠️  Not configured for PostgreSQL');
  
  console.log('\n');
  
  // Try to check current data using the appropriate database
  if (usePostgreSQL && hasRealCredentials) {
    console.log('🗄️  Checking PostgreSQL/Supabase database...');
    try {
      const prisma = new PrismaClient();
      await prisma.$connect();
      
      const userCount = await prisma.user.count();
      const itemCount = await prisma.marketplaceItem.count();
      
      console.log(`✅ Connected to PostgreSQL database`);
      console.log(`📦 Users: ${userCount}`);
      console.log(`📦 Marketplace Items: ${itemCount}`);
      
      if (itemCount > 0) {
        const sampleItems = await prisma.marketplaceItem.findMany({
          select: {
            id: true,
            title: true,
            thumbnail: true
          },
          take: 3
        });
        
        console.log('\n📸 Sample items:');
        sampleItems.forEach(item => {
          const hasPlaceholder = item.thumbnail?.includes('placeholder');
          const hasBase64 = item.thumbnail?.startsWith('data:image/svg+xml;base64,');
          console.log(`- ${item.title}: ${hasPlaceholder ? '❌ Placeholder' : hasBase64 ? '✅ Base64' : '⚠️ Unknown'}`);
        });
      }
      
      await prisma.$disconnect();
      
    } catch (error) {
      console.log('❌ Could not connect to PostgreSQL database:', error.message);
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('💡 This is expected if the database schema hasn\'t been applied yet');
      }
    }
  } else {
    console.log('🗄️  Checking SQLite database (development)...');
    try {
      // Create a temporary Prisma client for SQLite
      const sqlitePrisma = new PrismaClient({
        datasources: {
          db: {
            url: 'file:/home/z/my-project/db/custom.db'
          }
        }
      });
      
      await sqlitePrisma.$connect();
      
      const userCount = await sqlitePrisma.user.count();
      const itemCount = await sqlitePrisma.marketplaceItem.count();
      
      console.log(`✅ Connected to SQLite database`);
      console.log(`📦 Users: ${userCount}`);
      console.log(`📦 Marketplace Items: ${itemCount}`);
      
      if (itemCount > 0) {
        const sampleItems = await sqlitePrisma.marketplaceItem.findMany({
          select: {
            id: true,
            title: true,
            thumbnail: true
          },
          take: 3
        });
        
        console.log('\n📸 Sample items:');
        sampleItems.forEach(item => {
          const hasPlaceholder = item.thumbnail?.includes('placeholder');
          const hasBase64 = item.thumbnail?.startsWith('data:image/svg+xml;base64,');
          console.log(`- ${item.title}: ${hasPlaceholder ? '❌ Placeholder' : hasBase64 ? '✅ Base64' : '⚠️ Unknown'}`);
        });
        
        // Check overall statistics
        const itemsWithPlaceholders = await sqlitePrisma.marketplaceItem.count({
          where: {
            OR: [
              { thumbnail: { contains: 'placeholder' } },
              { images: { contains: 'placeholder' } }
            ]
          }
        });
        
        const itemsWithBase64 = await sqlitePrisma.marketplaceItem.count({
          where: {
            OR: [
              { thumbnail: { startsWith: 'data:image/svg+xml;base64,' } },
              { images: { contains: 'data:image/svg+xml;base64,' } }
            ]
          }
        });
        
        console.log('\n📊 Image Statistics:');
        console.log(`Total items: ${itemCount}`);
        console.log(`Items with base64 images: ${itemsWithBase64}`);
        console.log(`Items with placeholder images: ${itemsWithPlaceholders}`);
        
        if (itemsWithPlaceholders === 0 && itemsWithBase64 === itemCount) {
          console.log('✅ All items have proper base64 images - ready for migration!');
        } else if (itemsWithPlaceholders > 0) {
          console.log('⚠️  Some items still have placeholder images');
        } else {
          console.log('⚠️  Mixed image formats detected');
        }
      }
      
      await sqlitePrisma.$disconnect();
      
    } catch (error) {
      console.log('❌ Could not connect to SQLite database:', error.message);
    }
  }
  
  console.log('\n');
  
  // Test Supabase connection
  console.log('🌐 Testing Supabase Connection...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Supabase credentials not found in environment');
  } else {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.from('users').select('count').limit(1);
      
      if (error) {
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          console.log('⚠️  Supabase connected but tables don\'t exist yet');
          console.log('💡 Schema needs to be applied');
        } else {
          console.log('❌ Supabase connection failed:', error.message);
        }
      } else {
        console.log('✅ Supabase connection successful');
      }
    } catch (error) {
      console.log('❌ Supabase connection error:', error.message);
    }
  }
  
  console.log('\n');
  
  // Provide guidance
  console.log('🎯 Current Status Summary:');
  
  if (hasRealCredentials && usePostgreSQL) {
    console.log('✅ Ready for production with Supabase');
    console.log('📋 Your application is configured and ready to use Supabase');
  } else if (!hasRealCredentials) {
    console.log('⚠️  Needs Supabase credentials');
    console.log('📋 Please get your Supabase credentials and update .env.local');
  } else if (!usePostgreSQL) {
    console.log('⚠️  Needs PostgreSQL configuration');
    console.log('📋 Please update DATABASE_URL to use PostgreSQL');
  }
  
  console.log('\n🚀 Next Steps:');
  if (!hasRealCredentials) {
    console.log('1. Create a Supabase project at https://app.supabase.com');
    console.log('2. Get your project URL and API keys');
    console.log('3. Update .env.local with real credentials');
  }
  
  if (hasRealCredentials && usePostgreSQL) {
    console.log('1. Apply database schema using Supabase dashboard SQL Editor');
    console.log('2. Run migration: npx tsx scripts/migrate-to-supabase.ts');
    console.log('3. Test: npx tsx scripts/check-current-status.ts');
  }
  
  console.log('\n🌟 EDN Marketplace Status Check Complete!');
}

checkCurrentStatus().catch(console.error);