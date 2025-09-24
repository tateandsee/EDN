#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// SQLite client (source)
const sqliteClient = new PrismaClient({
  datasources: {
    db: {
      url: 'file:/home/z/my-project/db/custom.db'
    }
  }
});

// Supabase client (destination)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// PostgreSQL client (destination)
const postgresClient = new PrismaClient();

interface MigrationData {
  users: any[];
  marketplaceItems: any[];
  marketplaceReviews: any[];
  marketplaceOrders: any[];
  // Add other tables as needed
}

async function exportFromSQLite(): Promise<MigrationData> {
  console.log('📦 Exporting data from SQLite...');
  
  const data: MigrationData = {
    users: await sqliteClient.user.findMany(),
    marketplaceItems: await sqliteClient.marketplaceItem.findMany(),
    marketplaceReviews: await sqliteClient.marketplaceReview.findMany(),
    marketplaceOrders: await sqliteClient.marketplaceOrder.findMany(),
  };
  
  console.log(`✅ Exported ${data.users.length} users`);
  console.log(`✅ Exported ${data.marketplaceItems.length} marketplace items`);
  console.log(`✅ Exported ${data.marketplaceReviews.length} marketplace reviews`);
  console.log(`✅ Exported ${data.marketplaceOrders.length} marketplace orders`);
  
  return data;
}

async function importToPostgreSQL(data: MigrationData) {
  console.log('📥 Importing data to PostgreSQL/Supabase...');
  
  try {
    // Import users
    for (const user of data.users) {
      await postgresClient.user.create({
        data: {
          ...user,
          // Convert any SQLite-specific data types if needed
        }
      });
    }
    console.log(`✅ Imported ${data.users.length} users`);
    
    // Import marketplace items
    for (const item of data.marketplaceItems) {
      await postgresClient.marketplaceItem.create({
        data: {
          ...item,
          // Convert any SQLite-specific data types if needed
        }
      });
    }
    console.log(`✅ Imported ${data.marketplaceItems.length} marketplace items`);
    
    // Import marketplace reviews
    for (const review of data.marketplaceReviews) {
      await postgresClient.marketplaceReview.create({
        data: {
          ...review,
          // Convert any SQLite-specific data types if needed
        }
      });
    }
    console.log(`✅ Imported ${data.marketplaceReviews.length} marketplace reviews`);
    
    // Import marketplace orders
    for (const order of data.marketplaceOrders) {
      await postgresClient.marketplaceOrder.create({
        data: {
          ...order,
          // Convert any SQLite-specific data types if needed
        }
      });
    }
    console.log(`✅ Imported ${data.marketplaceOrders.length} marketplace orders`);
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
}

async function verifyMigration() {
  console.log('🔍 Verifying migration...');
  
  const sqliteStats = {
    users: await sqliteClient.user.count(),
    marketplaceItems: await sqliteClient.marketplaceItem.count(),
    marketplaceReviews: await sqliteClient.marketplaceReview.count(),
    marketplaceOrders: await sqliteClient.marketplaceOrder.count(),
  };
  
  const postgresStats = {
    users: await postgresClient.user.count(),
    marketplaceItems: await postgresClient.marketplaceItem.count(),
    marketplaceReviews: await postgresClient.marketplaceReview.count(),
    marketplaceOrders: await postgresClient.marketplaceOrder.count(),
  };
  
  console.log('📊 Migration Statistics:');
  console.log('Table\t\tSQLite\tPostgreSQL');
  console.log('Users\t\t', sqliteStats.users, '\t', postgresStats.users);
  console.log('Marketplace Items\t', sqliteStats.marketplaceItems, '\t', postgresStats.marketplaceItems);
  console.log('Marketplace Reviews\t', sqliteStats.marketplaceReviews, '\t', postgresStats.marketplaceReviews);
  console.log('Marketplace Orders\t', sqliteStats.marketplaceOrders, '\t', postgresStats.marketplaceOrders);
  
  // Check if counts match
  const allMatch = 
    sqliteStats.users === postgresStats.users &&
    sqliteStats.marketplaceItems === postgresStats.marketplaceItems &&
    sqliteStats.marketplaceReviews === postgresStats.marketplaceReviews &&
    sqliteStats.marketplaceOrders === postgresStats.marketplaceOrders;
  
  if (allMatch) {
    console.log('✅ Migration verification successful - all counts match!');
  } else {
    console.log('⚠️  Migration verification failed - counts do not match!');
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting SQLite to Supabase migration...');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase configuration not found. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  
  try {
    // Test Supabase connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Cannot connect to Supabase:', error.message);
      console.log('💡 Please make sure your Supabase project is set up and the database schema is applied.');
      console.log('💡 Run: node setup-supabase.js to configure your environment.');
      process.exit(1);
    }
    
    console.log('✅ Supabase connection successful');
    
    // Export from SQLite
    const migrationData = await exportFromSQLite();
    
    // Import to PostgreSQL
    await importToPostgreSQL(migrationData);
    
    // Verify migration
    await verifyMigration();
    
    console.log('🎉 Migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('1. Update your application to use the new PostgreSQL database');
    console.log('2. Test the application thoroughly');
    console.log('3. Once verified, you can remove the SQLite database file');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

main();