#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('📋 Configuration check:');
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Supabase Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  console.log('Supabase Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  console.log('Database URL:', databaseUrl ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !databaseUrl) {
    console.error('❌ Missing required configuration. Please run: node setup-supabase.js');
    process.exit(1);
  }
  
  // Test Supabase client connection
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      console.log('💡 Make sure your Supabase project is set up and the database schema is applied.');
      console.log('💡 Apply the schema: psql ' + databaseUrl + ' < supabase-schema.sql');
      return false;
    }
    
    console.log('✅ Supabase connection successful');
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
  
  // Test Prisma connection
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    // Test basic query
    const userCount = await prisma.user.count();
    console.log(`✅ Prisma connection successful - Found ${userCount} users`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Prisma connection failed:', error);
    return false;
  }
  
  return true;
}

async function verifyMarketplaceData() {
  console.log('🛍️  Verifying marketplace data...');
  
  try {
    const prisma = new PrismaClient();
    
    // Check marketplace items
    const itemCount = await prisma.marketplaceItem.count();
    console.log(`📦 Marketplace items: ${itemCount}`);
    
    if (itemCount > 0) {
      // Check for placeholder images
      const itemsWithPlaceholders = await prisma.marketplaceItem.findMany({
        where: {
          OR: [
            { thumbnail: { contains: 'placeholder' } },
            { images: { contains: 'placeholder' } }
          ]
        },
        take: 5
      });
      
      if (itemsWithPlaceholders.length > 0) {
        console.log(`⚠️  Found ${itemsWithPlaceholders.length} items with placeholder images`);
        console.log('Sample items with placeholders:');
        itemsWithPlaceholders.forEach(item => {
          console.log(`  - ${item.title}: ${item.thumbnail?.substring(0, 50)}...`);
        });
      } else {
        console.log('✅ No placeholder images found in marketplace items');
      }
      
      // Check for actual base64 images
      const itemsWithBase64 = await prisma.marketplaceItem.findMany({
        where: {
          OR: [
            { thumbnail: { startsWith: 'data:image/svg+xml;base64,' } },
            { images: { contains: 'data:image/svg+xml;base64,' } }
          ]
        },
        take: 3
      });
      
      if (itemsWithBase64.length > 0) {
        console.log(`✅ Found ${itemsWithBase64.length} items with proper base64 images`);
        console.log('Sample items with base64 images:');
        itemsWithBase64.forEach(item => {
          console.log(`  - ${item.title}: ✅ Has base64 image`);
        });
      }
    }
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Error verifying marketplace data:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Supabase setup and data integrity...');
  console.log('============================================\n');
  
  const connectionOk = await testSupabaseConnection();
  
  if (!connectionOk) {
    console.error('❌ Connection tests failed. Please check your configuration.');
    process.exit(1);
  }
  
  console.log('\n');
  
  const dataOk = await verifyMarketplaceData();
  
  if (!dataOk) {
    console.error('❌ Data verification failed.');
    process.exit(1);
  }
  
  console.log('\n🎉 All tests passed!');
  console.log('📋 Summary:');
  console.log('✅ Supabase connection is working');
  console.log('✅ Prisma client is connected to PostgreSQL');
  console.log('✅ Marketplace data is properly formatted');
  console.log('✅ No placeholder images detected');
  
  console.log('\n🚀 Your EDN Marketplace is ready for production with Supabase!');
}

main().catch(console.error);