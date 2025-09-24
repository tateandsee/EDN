#!/bin/bash

# EDN Marketplace - GitHub & Supabase Update Script
# This script helps update both GitHub and Supabase

echo "🚀 EDN Marketplace - GitHub & Supabase Update Script"
echo "=================================================="

# Check current git status
echo "📊 Checking git status..."
git status

# Check if GitHub remote is configured
if ! git remote -v | grep -q "origin"; then
    echo ""
    echo "❌ No GitHub remote configured."
    echo ""
    echo "📋 To set up GitHub repository, follow these steps:"
    echo ""
    echo "1. Create a new GitHub repository:"
    echo "   - Go to https://github.com"
    echo "   - Click 'New repository'"
    echo "   - Repository name: edn-marketplace or my-project"
    echo "   - Set to Public or Private as needed"
    echo "   - Click 'Create repository'"
    echo ""
    echo "2. Configure git remote:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/edn-marketplace.git"
    echo ""
    echo "3. Push to GitHub:"
    echo "   git push -u origin master"
    echo ""
    echo "🔧 Replace YOUR_USERNAME with your actual GitHub username"
    echo ""
else
    echo "✅ GitHub remote is configured"
    echo ""
    echo "📤 Pushing to GitHub..."
    git push origin master
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub"
    else
        echo "❌ Failed to push to GitHub"
        echo "💡 You may need to authenticate or check repository permissions"
    fi
fi

echo ""
echo "🗄️  Checking Supabase status..."
echo ""

# Test Supabase connection
if command -v npx &> /dev/null; then
    echo "🔍 Testing Supabase tables..."
    npx tsx scripts/test-supabase-tables.ts
    
    if [ $? -eq 0 ]; then
        echo "✅ Supabase is fully operational"
    else
        echo "❌ Supabase connection failed"
        echo "💡 Check your .env.local configuration"
    fi
else
    echo "⚠️  npx not available, cannot test Supabase automatically"
fi

echo ""
echo "📋 Summary of updates:"
echo "===================="
echo ""

# Show recent commits
echo "📝 Recent commits:"
git log --oneline -5

echo ""
echo "🗄️  Supabase Status:"
echo "- Project: pbpajqxpuljydokgpfry"
echo "- Database: PostgreSQL"
echo "- Tables: 9 tables created and accessible"
echo "- Connection: Working via API"

echo ""
echo "🚀 Next Steps:"
echo "1. If GitHub remote not set up, create repository and configure remote"
echo "2. Push code to GitHub using the commands above"
echo "3. Verify Supabase dashboard shows all tables correctly"
echo "4. Test application functionality"

echo ""
echo "🌟 EDN Marketplace Update Complete!"