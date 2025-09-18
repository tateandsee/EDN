# GitHub Repository Setup Guide for EDN Project

This guide will help you create a GitHub repository for your EDN (Erotic Digital Nexus) project and push all your code.

## Prerequisites

- Git installed and configured
- GitHub account
- All project changes committed (already done)

## Method 1: Using GitHub Web Interface (Recommended)

### Step 1: Create GitHub Repository

1. Go to [https://github.com](https://github.com)
2. Click the "+" icon in the top-right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `edn`
   - **Description**: `Erotic Digital Nexus - AI Content Creation Platform`
   - **Visibility**: **Public** (or Private if you prefer)
   - **Don't** check "Add a README file" (we already have one)
   - **Don't** check "Add .gitignore" (we already have one)
   - **Don't** check "Add a license" (we already have one)

5. Click "Create repository"

### Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you a page with commands. Run these commands in your terminal:

```bash
# Change to the EDN directory if you're not already there
cd /home/z/my-project

# Add the GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/edn.git

# Rename the branch to 'main' (GitHub's default)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

**Example with actual username:**
```bash
git remote add origin https://github.com/johnsmith/edn.git
git branch -M main
git push -u origin main
```

### Step 3: Verify the Upload

1. Go to your GitHub repository page
2. You should see all your files and folders
3. Check that the latest commit is displayed

## Method 2: Using GitHub API with curl

If you prefer to use the command line, you can create the repository using GitHub's API:

### Step 1: Create a Personal Access Token

1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Fill in the details:
   - **Note**: `EDN Repository Setup`
   - **Expiration**: Choose an expiration date
   - **Scopes**: Check `repo` (full control of private repositories)
4. Click "Generate token"
5. **Copy the token immediately** (you won't be able to see it again)

### Step 2: Create Repository using API

```bash
# Replace YOUR_USERNAME and YOUR_TOKEN with your actual values
YOUR_USERNAME="your_github_username"
YOUR_TOKEN="your_personal_access_token"

# Create the repository
curl -H "Authorization: token $YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     -d '{"name":"edn","description":"Erotic Digital Nexus - AI Content Creation Platform","private":false}' \
     https://api.github.com/user/repos
```

### Step 3: Push Your Code

```bash
# Add remote
git remote add origin https://github.com/$YOUR_USERNAME/edn.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Method 3: Install GitHub CLI (Recommended for Future Use)

For easier GitHub management in the future, install the GitHub CLI:

### Install GitHub CLI

```bash
# For Debian/Ubuntu
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

### Login and Create Repository

```bash
# Login to GitHub
gh auth login

# Create repository
gh repo create edn --public --source=. --remote=origin --push
```

## Post-Setup Configuration

### 1. Repository Settings

After creating the repository, consider these settings:

1. **Go to Repository Settings** → **Options**
   - **Repository name**: `edn`
   - **Description**: `Erotic Digital Nexus - AI Content Creation Platform`
   - **Website**: Add your project website if available
   - **Default branch**: `main`

2. **Features**:
   - **Issues**: Enable for bug tracking
   - **Projects**: Enable for project management
   - **Wiki**: Enable for documentation
   - **Discussions**: Enable for community discussions

### 2. Add .gitignore (if needed)

Create a `.gitignore` file in your repository root:

```bash
# Create .gitignore file
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db

# Database
*.db
*.sqlite
*.sqlite3

# Logs
*.log
logs/

# Temporary files
temp/
tmp/

# Generated files
dist/
public/generated/
EOF

# Add and commit .gitignore
git add .gitignore
git commit -m "Add .gitignore file"

# Push to GitHub
git push origin main
```

### 3. Create README Badge (Optional)

Add a badge to your README to show build status:

```markdown
![GitHub commit activity](https://img.shields.io/github/commit-activity/YOUR_USERNAME/edn)
![GitHub last commit](https://img.shields.io/github/last-commit/YOUR_USERNAME/edn)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/edn)
```

### 4. Set Up GitHub Pages (Optional)

If you want to host documentation:

1. Go to repository **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`
4. **Folder**: `/root`
5. Click **Save**

## Troubleshooting

### Common Issues

1. **Authentication Failed**:
   ```bash
   # If you get authentication errors, try:
   git remote set-url origin https://YOUR_USERNAME@github.com/YOUR_USERNAME/edn.git
   ```

2. **Branch Name Issues**:
   ```bash
   # If you have branch naming issues:
   git branch -m master main
   git push -u origin main
   ```

3. **Permission Denied**:
   - Check your GitHub token permissions
   - Ensure you have write access to the repository
   - Verify your GitHub username is correct

### Verify Setup

After pushing, verify everything is working:

```bash
# Check remote configuration
git remote -v

# Check branch tracking
git branch -vv

# Check if push was successful
git log --oneline -5
```

## Next Steps

After successfully setting up your GitHub repository:

1. **Add Collaborators**: Go to Settings → Collaborators
2. **Set Up Issues**: Create labels and milestones
3. **Configure Pull Requests**: Set up PR templates
4. **Add GitHub Actions**: Set up CI/CD pipelines
5. **Enable Dependabot**: For automated dependency updates

## Repository URL

Once set up, your repository will be available at:
```
https://github.com/YOUR_USERNAME/edn
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

**Note**: Make sure to never commit sensitive information like API keys, passwords, or personal access tokens to your repository. Use environment variables and secrets for sensitive data.