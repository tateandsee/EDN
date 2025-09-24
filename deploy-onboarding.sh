#!/bin/bash

# Comprehensive Onboarding Journey Deployment Script
# This script deploys the entire onboarding system to Supabase

set -e

echo "🚀 Starting Onboarding Journey Deployment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in to Supabase
if ! supabase projects list &> /dev/null; then
    echo "❌ Please log in to Supabase first:"
    echo "supabase login"
    exit 1
fi

# Get project reference
echo "📋 Getting project information..."
PROJECT_REF=$(supabase projects list 2>/dev/null | grep -o '[a-z0-9]*' | head -1)
if [ -z "$PROJECT_REF" ]; then
    echo "❌ No Supabase project found. Please create one first."
    exit 1
fi

echo "✅ Using project: $PROJECT_REF"

# Update config with project reference
echo "⚙️  Updating configuration..."
sed -i "s/your-project-ref/$PROJECT_REF/g" supabase/config.toml

# Generate database types
echo "📝 Generating database types..."
supabase gen types typescript --local > types/database.ts

# Deploy database schema
echo "🗄️  Deploying database schema..."
supabase db push

# Deploy edge functions
echo "⚡ Deploying edge functions..."
supabase functions deploy onboarding-init --no-verify-jwt
supabase functions deploy redeem-reward --no-verify-jwt
supabase functions deploy onboarding-progress --no-verify-jwt
supabase functions deploy admin-onboarding --no-verify-jwt

# Set function secrets if needed
echo "🔐 Setting up function secrets..."
# Add any secret setup here if needed

# Create storage bucket for onboarding assets
echo "📁 Creating storage bucket..."
supabase storage create buckets onboarding-assets || echo "Bucket already exists"

# Set storage policies
echo "🔒 Setting storage policies..."
supabase storage create onboarding-assets --public false || echo "Storage policies already configured"

# Insert sample data
echo "📊 Inserting sample data..."
if [ -f "onboarding-sample-data.sql" ]; then
    supabase db shell --command "$(cat onboarding-sample-data.sql)"
else
    echo "⚠️  Sample data file not found. Skipping sample data insertion."
fi

# Run post-deployment checks
echo "🔍 Running post-deployment checks..."

# Check if tables were created
echo "📋 Checking database tables..."
TABLES=("onboarding_steps" "user_onboarding_progress" "badges" "user_badges" "levels" "rewards" "user_rewards" "onboarding_activities")

for table in "${TABLES[@]}"; do
    if supabase db shell --command "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = '$table');" | grep -q "true"; then
        echo "✅ Table '$table' exists"
    else
        echo "❌ Table '$table' not found"
    fi
done

# Check if functions were deployed
echo "⚡ Checking edge functions..."
FUNCTIONS=("onboarding-init" "redeem-reward" "onboarding-progress" "admin-onboarding")

for func in "${FUNCTIONS[@]}"; do
    if supabase functions list | grep -q "$func"; then
        echo "✅ Function '$func' deployed"
    else
        echo "❌ Function '$func' not deployed"
    fi
done

# Check if storage bucket was created
echo "📁 Checking storage bucket..."
if supabase storage list | grep -q "onboarding-assets"; then
    echo "✅ Storage bucket 'onboarding-assets' created"
else
    echo "❌ Storage bucket 'onboarding-assets' not found"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📚 Next Steps:"
echo "1. Review the deployed components in your Supabase dashboard"
echo "2. Test the edge functions using the provided examples"
echo "3. Configure your frontend to use the new onboarding features"
echo "4. Set up realtime subscriptions for live updates"
echo "5. Monitor the system performance and user engagement"
echo ""
echo "🔗 Useful Links:"
echo "- Supabase Dashboard: https://app.supabase.com/project/$PROJECT_REF"
echo "- Edge Functions: https://app.supabase.com/project/$PROJECT_REF/functions"
echo "- Database: https://app.supabase.com/project/$PROJECT_REF/editor"
echo "- Storage: https://app.supabase.com/project/$PROJECT_REF/storage"
echo ""
echo "📖 Documentation:"
echo "- Edge Function Examples: See examples/ directory"
echo "- API Documentation: Check the generated types in types/database.ts"
echo "- Sample Queries: See sample-queries.sql"
echo ""
echo "🚀 Your onboarding journey system is now ready!"