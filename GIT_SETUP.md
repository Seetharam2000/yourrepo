# Git Setup and Push to GitHub

## Step 1: Initialize Git (if not already initialized)

```powershell
cd "C:\Users\Hp\OneDrive\Desktop\SRM\3rd Sem\Projects\github mirror"
git init
```

## Step 2: Check Git Status

```powershell
git status
```

## Step 3: Add All Files

```powershell
git add .
```

## Step 4: Commit Changes

```powershell
git commit -m "Initial commit: YourRepo - GitHub Repository Analyzer"
```

## Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `yourrepo` or `github-repository-analyzer`)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL (e.g., `https://github.com/yourusername/yourrepo.git`)

## Step 6: Add Remote Repository

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 7: Push to GitHub

```powershell
git branch -M main
git push -u origin main
```

## Alternative: If you already have a remote

If you already have a remote configured, check it with:

```powershell
git remote -v
```

Then push with:

```powershell
git push -u origin main
```

## Troubleshooting

### If you get authentication errors:
- Use GitHub Personal Access Token instead of password
- Or use GitHub CLI: `gh auth login`

### If you need to update remote URL:
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you need to force push (use with caution):
```powershell
git push -u origin main --force
```

