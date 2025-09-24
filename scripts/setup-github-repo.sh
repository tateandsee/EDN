#!/bin/bash

# GitHub Repository Setup Script for EDN Project
# This script helps you create a GitHub repository and push your project

echo "🚀 Setting up GitHub repository for EDN project..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run this from the project root."
    exit 1
fi

# Check if user is logged in to GitHub (if gh CLI is available)
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    if ! gh auth status &> /dev/null; then
        echo "❌ Please login to GitHub first:"
        echo "   gh auth login"
        exit 1
    fi
    USE_GH_CLI=true
else
    echo "⚠️  GitHub CLI not found. Will provide manual instructions."
    USE_GH_CLI=false
fi

# Get repository name
REPO_NAME="edn"
echo "📁 Repository name: $REPO_NAME"

# Get current directory name
CURRENT_DIR=$(basename $(pwd))
echo "📂 Current directory: $CURRENT_DIR"

if [ "$USE_GH_CLI" = true ]; then
    echo "🔧 Creating GitHub repository using GitHub CLI..."
    
    # Create repository
    gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository created successfully!"
        echo "🌐 Repository URL: https://github.com/$(gh api user | jq -r '.login')/$REPO_NAME"
    else
        echo "❌ Failed to create repository. Please check your GitHub permissions."
        exit 1
    fi
else
    echo "📋 Manual GitHub setup instructions:"
    echo ""
    echo "1. Go to https://github.com"
    echo "2. Click 'New repository' or '+' → 'New repository'"
    echo "3. Repository name: $REPO_NAME"
    echo "4. Description: Erotic Digital Nexus - AI Content Creation Platform"
    echo "5. Set to Public"
    echo "6. Don't initialize with README (we already have one)"
    echo "7. Click 'Create repository'"
    echo ""
    echo "8. After creating, run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "9. Replace YOUR_USERNAME with your actual GitHub username"
    echo ""
    read -p "Press Enter after you've created the repository on GitHub..."
    
    # Get GitHub username
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    
    if [ -n "$GITHUB_USERNAME" ]; then
        echo "🔧 Setting up remote..."
        git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
        git branch -M main
        echo "📤 Pushing to GitHub..."
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully pushed to GitHub!"
            echo "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
        else
            echo "❌ Failed to push to GitHub. Please check your credentials."
            exit 1
        fi
    else
        echo "❌ No username provided. Please run the commands manually:"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
        echo "   git branch -M main"
        echo "   git push -u origin main"
    fi
fi

echo ""
echo "🎉 GitHub repository setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Configure repository settings (if needed)"
echo "3. Set up GitHub Actions for CI/CD (optional)"
echo "4. Add collaborators (if needed)"
echo ""
echo "🔗 Repository URL: https://github.com/$(if [ "$USE_GH_CLI" = true ]; then gh api user | jq -r '.login'; else echo "YOUR_USERNAME"; fi)/$REPO_NAME"