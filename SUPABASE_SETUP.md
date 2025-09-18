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