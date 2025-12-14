# Push YourRepo to GitHub - Step by Step Guide

## Prerequisites
- Git installed on your system
- GitHub account
- GitHub Personal Access Token (if using HTTPS)

## Step 1: Navigate to Project Directory

Open PowerShell and navigate to your project:

```powershell
cd "C:\Users\Hp\OneDrive\Desktop\SRM\3rd Sem\Projects\github mirror"
```

## Step 2: Initialize Git (if not already done)

```powershell
git init
```

## Step 3: Check Current Status

```powershell
git status
```

## Step 4: Add All Files

```powershell
git add .
```

## Step 5: Create Initial Commit

```powershell
git commit -m "Initial commit: YourRepo - GitHub Repository Analyzer with modern UI"
```

## Step 6: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `yourrepo` (or any name you prefer)
3. Description: "A full-stack web application that evaluates GitHub repositories and provides scores, summaries, and improvement roadmaps"
4. Choose Public or Private
5. **DO NOT** check "Add a README file" (we already have one)
6. **DO NOT** check "Add .gitignore" (we already have one)
7. Click "Create repository"

## Step 7: Add Remote Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```powershell
git remote add origin https://github.com/seetharamh/yourrepo.git
```

## Step 8: Rename Branch to Main (if needed)

```powershell
git branch -M main
```

## Step 9: Push to GitHub

```powershell
git push -u origin main
```

**Note:** If prompted for credentials:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Create one at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)

## Alternative: Using SSH (if you have SSH keys set up)

If you prefer SSH:

```powershell
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Troubleshooting

### If remote already exists:
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you need to update existing remote:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Check current remotes:
```powershell
git remote -v
```

### If you have uncommitted changes:
```powershell
git add .
git commit -m "Your commit message"
git push -u origin main
```

## Quick Command Sequence (Copy & Paste)

```powershell
# Navigate to project
cd "C:\Users\Hp\OneDrive\Desktop\SRM\3rd Sem\Projects\github mirror"

# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: YourRepo - GitHub Repository Analyzer"

# Add remote (REPLACE WITH YOUR REPO URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push
git branch -M main
git push -u origin main
```

## After Pushing

Your repository will be available at:
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

You can share this URL with others or use it for deployment!

