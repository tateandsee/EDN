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