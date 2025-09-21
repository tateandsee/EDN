#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌟 Erotic Digital Nexus - Supabase Setup');
console.log('=====================================\n');

const questions = [
  {
    name: 'supabaseUrl',
    question: 'Enter your Supabase Project URL: ',
    default: 'https://your-project.supabase.co'
  },
  {
    name: 'supabaseAnonKey',
    question: 'Enter your Supabase Anon Key: ',
    default: 'your-anon-key'
  },
  {
    name: 'supabaseServiceRoleKey',
    question: 'Enter your Supabase Service Role Key: ',
    default: 'your-service-role-key'
  },
  {
    name: 'databaseUrl',
    question: 'Enter your Database URL: ',
    default: 'postgresql://postgres:password@localhost:5432/postgres'
  },
  {
    name: 'zaiApiKey',
    question: 'Enter your Z-AI API Key: ',
    default: 'your-zai-api-key'
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
    answers[q.name] = answer.trim() || q.default;
    currentQuestion++;
    askQuestion();
  });
}

function generateEnvFile() {
  let envContent = envTemplate;
  
  Object.keys(answers).forEach(key => {
    envContent = envContent.replace(`{${key}}`, answers[key]);
  });

  const envPath = path.join(__dirname, '.env.local');
  
  fs.writeFile(envPath, envContent, (err) => {
    if (err) {
      console.error('❌ Error creating .env.local file:', err);
      rl.close();
      return;
    }
    
    console.log('\n✅ .env.local file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Set up your Supabase database');
    console.log('3. Run database migration: npm run db:push');
    console.log('4. Seed database: npx tsx scripts/seed-database.ts');
    console.log('5. Start development server: npm run dev');
    console.log('\n🌟 Your EDN platform is ready to configure!');
    
    rl.close();
  });
}

askQuestion();