# 🚀 EDN Platform Setup Guide

This guide will help you set up the Erotic Digital Nexus (EDN) platform with Supabase integration.

## 📋 Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- A Supabase account (create one at [supabase.com](https://supabase.com))
- A Z-AI API key (get one from the Z-AI platform)
- Basic knowledge of command line operations

## 🔧 Step 1: Install Dependencies

```bash
npm install
```

## 🔐 Step 2: Set Up Supabase

### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project" to create a new project
3. Choose a name for your project (e.g., "edn-platform")
4. Select a database password (remember this for the DATABASE_URL)
5. Choose a region close to your users
6. Click "Create new project"

### Get Your Supabase Credentials

Once your project is created:

1. Go to your project's **Settings** → **API**
2. Copy the **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon** public key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy the **service_role** secret key → This is your `SUPABASE_SERVICE_ROLE_KEY`

### Get Database URL

1. Go to your project's **Settings** → **Database**
2. Under **Connection string**, copy the **URI** string
3. Replace `[YOUR-PASSWORD]` with your actual database password
4. This is your `DATABASE_URL`

## 🔑 Step 3: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```bash
touch .env.local
```

Add the following configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres

# AI SDK Configuration
ZAI_API_KEY=your-zai-api-key-here

# Payment Configuration (Optional - for production)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## 🗄️ Step 4: Set Up Database

### Push Database Schema

```bash
npm run db:push
```

This will create all the necessary tables in your Supabase database.

### Generate Prisma Client

```bash
npm run db:generate
```

### Seed Database with Platforms

```bash
npx tsx scripts/seed-database.ts
```

This will populate your database with the 14 supported platforms.

## 🚀 Step 5: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your EDN platform running!

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid URL" Error
If you see an error like:
```
TypeError: Invalid URL
at createClient (src/lib/supabase-client.ts:4:36)
```

**Solution**: Make sure your `.env.local` file has the correct Supabase URL without any extra characters.

#### 2. Database Connection Issues
If you see database connection errors:

**Solution**: 
- Verify your `DATABASE_URL` is correct
- Make sure your Supabase project is active
- Check that your database password is correct

#### 3. Authentication Issues
If authentication isn't working:

**Solution**:
- Verify your Supabase keys are correct
- Make sure email confirmation is enabled in Supabase Auth settings
- Check that your redirect URLs are configured in Supabase

#### 4. Build Errors
If you encounter TypeScript errors:

**Solution**:
```bash
npm run lint
npm run build
```

Fix any reported errors before continuing.

## 🧪 Testing the Setup

### Test Authentication

1. Navigate to `/auth/signin`
2. Try to sign up with a new email
3. Check your email for the confirmation link
4. Verify you can sign in successfully

### Test Content Creation

1. Sign in to your account
2. Navigate to `/create`
3. Try generating some text content (doesn't require subscription)
4. Verify the content appears in your dashboard

### Test Platform Connections

1. Navigate to `/distribute`
2. Try connecting to a platform (e.g., Instagram)
3. Verify the connection appears in your dashboard

## 🌐 Production Deployment

### Environment Variables for Production

Make sure to set all environment variables in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `ZAI_API_KEY`
- `STRIPE_SECRET_KEY` (if using payments)
- `STRIPE_PUBLISHABLE_KEY` (if using payments)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)

### Build and Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Z-AI SDK Documentation](https://z-ai-web-dev-sdk.docs)

## 🆘 Getting Help

If you run into issues:

1. Check the error messages in your terminal
2. Review this setup guide
3. Check the [README.md](README.md) for additional information
4. Verify your environment variables are correct
5. Make sure all dependencies are installed

---

Happy building! 🚀