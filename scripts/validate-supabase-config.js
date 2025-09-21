#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found.');
  console.log('Please copy .env.example to .env.local and fill in your credentials.');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !key.startsWith('#')) {
    envVars[key.trim()] = value.trim();
  }
});

// Required variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

console.log('🔍 Validating Supabase configuration...\n');

let allValid = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (!value || value === '' || value.includes('your_')) {
    console.log(`❌ ${varName}: Not configured`);
    allValid = false;
  } else {
    console.log(`✅ ${varName}: Configured`);
  }
});

// Check URL format
if (envVars.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    new URL(envVars.NEXT_PUBLIC_SUPABASE_URL);
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL: Valid URL format');
  } catch {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL: Invalid URL format');
    allValid = false;
  }
}

// Check database URL format
if (envVars.DATABASE_URL) {
  if (envVars.DATABASE_URL.includes('postgresql://')) {
    console.log('✅ DATABASE_URL: Valid PostgreSQL URL format');
  } else {
    console.log('❌ DATABASE_URL: Invalid PostgreSQL URL format');
    allValid = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 All required variables are configured!');
  console.log('\nNext steps:');
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Test authentication by visiting /auth/signin');
  console.log('3. Check browser console for any errors');
} else {
  console.log('❌ Configuration incomplete!');
  console.log('\nPlease fix the issues above and run this script again.');
  console.log('\nTo get your Supabase credentials:');
  console.log('1. Go to https://supabase.com');
  console.log('2. Create a new project or select existing one');
  console.log('3. Go to Settings → API to get your URL and keys');
  console.log('4. Update your .env.local file with the actual values');
}

console.log('\nFor detailed setup instructions, see SUPABASE_SETUP.md');