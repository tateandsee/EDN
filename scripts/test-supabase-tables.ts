#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase configuration not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testTables() {
  console.log('🔍 Testing Supabase tables...');
  
  const tables = [
    'users',
    'profiles', 
    'contents',
    'subscriptions',
    'marketplace_items',
    'marketplace_orders',
    'affiliates',
    'affiliate_referrals',
    'downloads'
  ];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': Exists and accessible`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}': Error - ${err.message}`);
    }
  }
}

async function main() {
  console.log('🚀 Testing Supabase database schema...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Cannot connect to Supabase:', error.message);
      console.log('💡 Please make sure your Supabase project is set up and the database schema is applied.');
      console.log('💡 Copy the SQL from SUPABASE_SETUP_GUIDE.md and paste it into the Supabase SQL Editor.');
      process.exit(1);
    }
    
    console.log('✅ Supabase connection successful');
    
    // Test all tables
    await testTables();
    
    console.log('\n🎯 Summary:');
    console.log('If you see ❌ for any tables, the database schema has not been applied yet.');
    console.log('Please follow the instructions in SUPABASE_SETUP_GUIDE.md to set up the database.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();