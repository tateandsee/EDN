<<<<<<< HEAD
# Supabase Production Setup Guide

This guide will help you migrate your EDN Marketplace from SQLite to Supabase for production deployment.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed
3. Your existing EDN Marketplace codebase

## Quick Setup

### Automated Setup (Recommended)

Run the automated setup script:

```bash
node scripts/setup-supabase-production.js
```

This script will:
- Guide you through entering your Supabase credentials
- Create the `.env.local` file
- Apply the database schema
- Generate the Prisma client
- Test the connection
- Optionally migrate existing data

### Manual Setup

If you prefer manual setup, follow these steps:

#### 1. Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL
   - anon public key
   - service_role key

#### 2. Configure Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres

# AI SDK Configuration
ZAI_API_KEY=your-zai-api-key

# Payment Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

#### 3. Apply Database Schema

Apply the Supabase schema to your database:

```bash
psql "postgresql://postgres:password@localhost:5432/postgres" < supabase-schema.sql
```

#### 4. Update Prisma Configuration

The Prisma schema has already been updated to use PostgreSQL. Generate the client:

```bash
npm run db:generate
```

#### 5. Migrate Existing Data (Optional)

If you have existing data in SQLite that you want to migrate:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

#### 6. Test Connection

Verify that everything is working:

```bash
npx tsx scripts/test-supabase-connection.ts
```

## Configuration Files

### Prisma Schema (`prisma/schema.prisma`)

Updated to use PostgreSQL instead of SQLite:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Database Client (`src/lib/db.ts`)

Enhanced to support both SQLite and PostgreSQL:

```typescript
const useSupabase = process.env.DATABASE_URL?.startsWith('postgresql://')

export const db = new PrismaClient({
  log: ['query'],
  datasources: {
    db: {
      url: useSupabase 
        ? process.env.DATABASE_URL!
        : 'file:/home/z/my-project/db/custom.db'
    }
  }
})
```

### Supabase Client (`src/lib/supabase.ts`)

Configured for both client and server-side usage:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Testing

### Connection Test

Run the connection test script:

```bash
npx tsx scripts/test-supabase-connection.ts
```

This will verify:
- Supabase connection
- Prisma client connection
- Database schema
- Marketplace data integrity

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000

3. Test key functionality:
   - User authentication
   - Marketplace browsing
   - Image loading
   - Data operations

## Troubleshooting

### Common Issues

#### 1. "Supabase is not configured" Error

**Solution**: Check your `.env.local` file and ensure all Supabase variables are set correctly.

#### 2. Database Connection Failed

**Solution**: Verify your `DATABASE_URL` is correct and your PostgreSQL server is running.

#### 3. Migration Errors

**Solution**: Ensure your Supabase database schema matches the expected structure. You may need to manually apply the schema.

#### 4. Placeholder Images Still Showing

**Solution**: Run the data migration script to ensure all marketplace items have proper base64 images:

```bash
npx tsx scripts/migrate-to-supabase.ts
```

### Debug Commands

#### Check Environment Variables

```bash
npx tsx -e "console.log(process.env)"
```

#### Test Database Connection

```bash
npx tsx scripts/test-supabase-connection.ts
```

#### View Database Schema

```bash
npx prisma db pull
```

## Production Deployment

### Environment Variables for Production

For production, ensure you set all required environment variables in your hosting platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `ZAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### Security Considerations

1. **Never commit `.env.local` to version control**
2. **Use strong secrets for `NEXTAUTH_SECRET`**
3. **Restrict database access to your application**
4. **Enable Row Level Security (RLS) in Supabase**
5. **Use environment-specific configurations**

### Performance Optimization

1. **Enable connection pooling** in Supabase
2. **Use CDN** for static assets
3. **Implement caching** strategies
4. **Monitor database performance** using Supabase dashboard

## Support

If you encounter any issues during setup:

1. Check the troubleshooting section above
2. Verify your Supabase project settings
3. Ensure all environment variables are correctly set
4. Run the test scripts to identify specific issues

For additional support, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
=======
# Supabase Configuration Guide

This guide will help you set up Supabase for your EDN (Erotic Digital Nexus) project.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project" to create a new project
4. Fill in the project details:
   - **Organization**: Your organization name
   - **Project Name**: `edn-project` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to your users
5. Click "Create new project"

## Step 2: Get Your Supabase Credentials

Once your project is created, you'll need to get your credentials:

1. In your Supabase project dashboard, go to **Settings** → **API**
2. You'll find your credentials under:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon** **public** key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key: `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

## Step 3: Configure Environment Variables

Copy the `.env.example` file to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Configuration (for Prisma)
DATABASE_URL="postgresql://postgres.your-project-id:your-password@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-string

# Optional: Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 4: Set Up Authentication

### Enable Google OAuth (Optional but recommended):

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find "Google" and enable it
3. Get your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable "Google+ API"
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://your-domain.com/auth/callback` (for production)

### Configure Authentication Settings:

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `http://localhost:3000` (development) or `https://your-domain.com` (production)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

## Step 5: Set Up Database Schema

The project uses Prisma for database management. The schema is defined in `prisma/schema.prisma`. To set up the database:

1. Install Prisma CLI if not already installed:
   ```bash
   npm install -g prisma
   ```

2. Push the schema to your Supabase database:
   ```bash
   npm run db:push
   ```

3. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

## Step 6: Set Up Storage (Optional)

If you need file storage for user avatars or other files:

1. In Supabase dashboard, go to **Storage**
2. Create a new bucket:
   - **Name**: `avatars`
   - **Public bucket**: Yes (for avatars) or No (for private files)
3. Set up storage policies if needed

## Step 7: Set Up Row Level Security (RLS)

For production, you should enable Row Level Security:

1. In Supabase dashboard, go to **Authentication** → **Policies**
2. Enable RLS on all tables
3. Create appropriate policies for your tables

Example policy for users table:
```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## Step 8: Test the Configuration

Restart your development server:

```bash
npm run dev
```

Check the browser console for any Supabase configuration errors. If everything is set up correctly, you should see the authentication system working.

## Step 9: Deploy to Production

When deploying to production:

1. Update all environment variables in your hosting platform
2. Update the `NEXTAUTH_URL` to your production domain
3. Update the Supabase redirect URLs to your production domain
4. Update Google OAuth redirect URIs to your production domain

## Troubleshooting

### Common Issues:

1. **"Supabase is not configured" error**:
   - Check that your `.env.local` file has the correct values
   - Make sure you've restarted the development server after updating environment variables

2. **Authentication not working**:
   - Verify your Supabase URL and anon key are correct
   - Check that redirect URLs are properly configured in Supabase
   - Ensure your Google OAuth credentials are correct

3. **Database connection issues**:
   - Verify your DATABASE_URL is correct
   - Check that your database is running and accessible
   - Ensure Prisma schema is properly pushed to the database

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## Security Best Practices

1. Never commit your `.env.local` file to version control
2. Use strong passwords and secrets
3. Enable Row Level Security in production
4. Regularly rotate your service role keys
5. Use environment-specific configurations
6. Keep your dependencies updated
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
