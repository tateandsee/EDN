#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌟 Erotic Digital Nexus - Supabase Production Setup');
console.log('===================================================\n');

const questions = [
  {
    name: 'supabaseUrl',
    question: 'Enter your Supabase Project URL: ',
    default: 'https://your-project.supabase.co',
    validate: (value) => value.startsWith('https://') && value.includes('.supabase.co')
  },
  {
    name: 'supabaseAnonKey',
    question: 'Enter your Supabase Anon Key: ',
    default: 'your-anon-key',
    validate: (value) => value.length > 10
  },
  {
    name: 'supabaseServiceRoleKey',
    question: 'Enter your Supabase Service Role Key: ',
    default: 'your-service-role-key',
    validate: (value) => value.length > 10
  },
  {
    name: 'databaseUrl',
    question: 'Enter your PostgreSQL Database URL: ',
    default: 'postgresql://postgres:password@localhost:5432/postgres',
    validate: (value) => value.startsWith('postgresql://')
  },
  {
    name: 'zaiApiKey',
    question: 'Enter your Z-AI API Key: ',
    default: 'your-zai-api-key',
    validate: (value) => value.length > 5
  }
];

const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL={supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY={supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY={supabaseServiceRoleKey}

# Database Configuration
DATABASE_URL={databaseUrl}

# AI SDK Configuration
ZAI_API_KEY={zaiApiKey}

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000`;

let answers = {};
let currentQuestion = 0;

function askQuestion() {
  if (currentQuestion >= questions.length) {
    generateEnvFile();
    return;
  }

  const q = questions[currentQuestion];
  rl.question(`${q.question} (default: ${q.default}): `, (answer) => {
    const value = answer.trim() || q.default;
    
    if (q.validate && !q.validate(value)) {
      console.log(`❌ Invalid value for ${q.name}. Please try again.`);
      askQuestion();
      return;
    }
    
    answers[q.name] = value;
    currentQuestion++;
    askQuestion();
  });
}

function generateEnvFile() {
  let envContent = envTemplate;
  
  Object.keys(answers).forEach(key => {
    envContent = envContent.replace(`{${key}}`, answers[key]);
  });

  const envPath = path.join(__dirname, '..', '.env.local');
  
  fs.writeFile(envPath, envContent, (err) => {
    if (err) {
      console.error('❌ Error creating .env.local file:', err);
      rl.close();
      return;
    }
    
    console.log('\n✅ .env.local file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Apply database schema to Supabase');
    console.log('2. Generate Prisma client');
    console.log('3. Migrate existing data');
    console.log('4. Test the connection');
    console.log('5. Start development server');
    
    askForNextSteps();
  });
}

function askForNextSteps() {
  console.log('\n🚀 Would you like to perform these steps now? (y/n)');
  rl.question('> ', async (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await performSetupSteps();
    } else {
      console.log('\n📝 Manual setup instructions:');
      console.log('1. Apply schema: psql ' + answers.databaseUrl + ' < supabase-schema.sql');
      console.log('2. Generate client: npm run db:generate');
      console.log('3. Migrate data: npx tsx scripts/migrate-to-supabase.ts');
      console.log('4. Test connection: npx tsx scripts/test-supabase-connection.ts');
      console.log('5. Start server: npm run dev');
      rl.close();
    }
  });
}

async function performSetupSteps() {
  console.log('\n🔧 Performing automatic setup...\n');
  
  try {
    // Step 1: Apply database schema
    console.log('1️⃣  Applying database schema to Supabase...');
    try {
      execSync(`psql "${answers.databaseUrl}" < supabase-schema.sql`, { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Database schema applied successfully');
    } catch (error) {
      console.log('⚠️  Could not apply schema automatically. Please run manually:');
      console.log(`   psql "${answers.databaseUrl}" < supabase-schema.sql`);
    }
    
    // Step 2: Generate Prisma client
    console.log('\n2️⃣  Generating Prisma client...');
    try {
      execSync('npm run db:generate', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ Prisma client generated successfully');
    } catch (error) {
      console.log('❌ Failed to generate Prisma client');
      return;
    }
    
    // Step 3: Test connection
    console.log('\n3️⃣  Testing database connection...');
    try {
      execSync('npx tsx scripts/test-supabase-connection.ts', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, ...answers }
      });
      console.log('✅ Database connection test passed');
    } catch (error) {
      console.log('❌ Database connection test failed');
      return;
    }
    
    // Step 4: Ask about data migration
    console.log('\n4️⃣  Data migration:');
    console.log('Do you want to migrate existing data from SQLite to Supabase? (y/n)');
    rl.question('> ', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\n🔄 Migrating data from SQLite to Supabase...');
        try {
          execSync('npx tsx scripts/migrate-to-supabase.ts', { 
            stdio: 'inherit',
            cwd: path.join(__dirname, '..'),
            env: { ...process.env, ...answers }
          });
          console.log('✅ Data migration completed successfully');
        } catch (error) {
          console.log('❌ Data migration failed');
        }
      }
      
      console.log('\n🎉 Setup completed successfully!');
      console.log('\n🚀 You can now start your development server:');
      console.log('   npm run dev');
      console.log('\n🌟 Your EDN Marketplace is now running on Supabase!');
      rl.close();
    });
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    rl.close();
  }
}

askQuestion();