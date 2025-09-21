#!/bin/bash

# Simple GitHub Setup Helper for EDN Project
# This script provides the exact commands needed to set up GitHub repository

echo "🚀 EDN GitHub Repository Setup Helper"
echo "====================================="
echo ""

# Get current git status
echo "📋 Current Git Status:"
git status --porcelain
echo ""

# Show recent commits
echo "📝 Recent Commits:"
git log --oneline -5
echo ""

# Get current directory
CURRENT_DIR=$(basename $(pwd))
echo "📁 Current Directory: $CURRENT_DIR"
echo ""

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    echo "🔗 Remote 'origin' already configured:"
    git remote get-url origin
    echo ""
    echo "✅ Your repository is already connected to GitHub!"
    echo "   To push changes: git push origin main"
else
    echo "🔗 No remote 'origin' found."
    echo ""
    echo "📋 To set up GitHub repository, follow these steps:"
    echo ""
    echo "1. Create a new repository on GitHub:"
    echo "   - Go to: https://github.com"
    echo "   - Click '+' → 'New repository'"
    echo "   - Repository name: edn"
    echo "   - Description: Erotic Digital Nexus - AI Content Creation Platform"
    echo "   - Set to Public or Private as preferred"
    echo "   - Don't initialize with README (we already have one)"
    echo "   - Click 'Create repository'"
    echo ""
    echo "2. After creating, run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/edn.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "   Replace YOUR_USERNAME with your actual GitHub username"
    echo ""
    
    # Ask if user wants to proceed
    read -p "Have you created the GitHub repository? (y/n): " created
    
    if [[ $created == "y" || $created == "Y" ]]; then
        read -p "Enter your GitHub username: " username
        
        if [[ -n "$username" ]]; then
            echo ""
            echo "🔧 Setting up remote..."
            git remote add origin "https://github.com/$username/edn.git"
            
            echo "📝 Renaming branch to main..."
            git branch -M main
            
            echo "📤 Pushing to GitHub..."
            if git push -u origin main; then
                echo ""
                echo "✅ Successfully pushed to GitHub!"
                echo "🌐 Repository URL: https://github.com/$username/edn"
                echo ""
                echo "🎉 Your EDN project is now on GitHub!"
            else
                echo ""
                echo "❌ Failed to push to GitHub."
                echo "   Possible reasons:"
                echo "   - Incorrect username"
                echo "   - Repository doesn't exist"
                echo "   - Authentication issues"
                echo ""
                echo "   Please check and try again."
            fi
        else
            echo "❌ No username provided."
            echo "   Please run the commands manually:"
            echo "   git remote add origin https://github.com/YOUR_USERNAME/edn.git"
            echo "   git branch -M main"
            echo "   git push -u origin main"
        fi
    else
        echo ""
        echo "📋 Please create the repository first, then run this script again."
        echo "   Or run the commands manually:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/edn.git"
        echo "   git branch -M main"
        echo "   git push -u origin main"
    fi
fi

echo ""
echo "📚 For detailed instructions, see: GITHUB_SETUP.md"
echo "🔧 For GitHub CLI setup, see: scripts/setup-github-repo.sh"