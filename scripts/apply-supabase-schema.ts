#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function applySupabaseSchema() {
  console.log('🗄️  Applying database schema to Supabase...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  console.log('🔧 Configuration check:');
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase credentials not found in environment');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Test connection first
    console.log('\n🔌 Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('📋 Connection test result:', error.message);
      console.log('💡 This is expected if the schema hasn\'t been applied yet');
    } else {
      console.log('✅ Supabase connection successful');
    }
    
    // Read the schema file
    const schemaSQL = readFileSync('supabase-schema.sql', 'utf8');
    
    console.log('\n📝 Schema file loaded successfully');
    console.log(`📊 Schema size: ${schemaSQL.length} characters`);
    
    // For now, let's create a simpler approach - just test the connection
    // and provide manual instructions for schema application
    console.log('\n🎯 Manual Schema Application Required');
    console.log('====================================');
    console.log('The schema needs to be applied manually. Please follow these steps:');
    console.log('\n1. Go to your Supabase dashboard: https://app.supabase.com');
    console.log('2. Select your project: pbpajqxpuljydokgpfry');
    console.log('3. Go to the SQL Editor');
    console.log('4. Copy the contents of supabase-schema.sql');
    console.log('5. Paste and execute the SQL in the editor');
    console.log('\nAlternatively, you can use the Supabase CLI:');
    console.log('supabase db push');
    
    console.log('\n🔍 Testing current database state...');
    
    // Test if basic tables exist
    const tables = ['users', 'profiles', 'marketplace_items'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message.includes('relation') ? 'Does not exist' : 'Error'}`);
        } else {
          console.log(`✅ Table ${table}: Exists`);
        }
      } catch (error) {
        console.log(`❌ Table ${table}: Error checking`);
      }
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Apply the schema manually using the Supabase dashboard');
    console.log('2. Run: npx tsx scripts/migrate-to-supabase.ts');
    console.log('3. Test: npx tsx scripts/check-current-status.ts');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

applySupabaseSchema().catch(console.error);