# Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory:

**PowerShell (Windows):**
```powershell
cd backend
Copy-Item env.example .env
```

**Bash/Linux/Mac:**
```bash
cd backend
cp env.example .env
```

Edit `.env` and add your GitHub token (optional but recommended for higher rate limits):

```
GITHUB_TOKEN=your_github_token_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Getting a GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (for public repositories)
4. Copy the token and paste it in `.env`

## Running the Application

### Development Mode

**PowerShell (Windows):**

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Bash/Linux/Mac:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Using the CLI Tool

```bash
# Make sure backend server is running first
node cli/repo-mirror.js analyze https://github.com/owner/repo

# With JSON output
node cli/repo-mirror.js analyze https://github.com/owner/repo --json
```

## Project Structure

```
.
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── server.js    # Main server file
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   │   ├── analyzers/  # Analysis modules
│   │   │   ├── githubService.js
│   │   │   ├── scoringService.js
│   │   │   └── roadmapService.js
│   │   └── utils/       # Utilities
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   └── styles/      # CSS files
│   └── package.json
└── cli/                 # CLI tool
    └── repo-mirror.js
```

## Troubleshooting

### Rate Limit Errors

If you see rate limit errors:
1. Add a GitHub token to `.env`
2. Wait for the rate limit to reset (usually 1 hour)

### Repository Not Found

- Ensure the repository is public
- Check the URL format: `https://github.com/owner/repo`

### Port Already in Use

Change the port in `backend/.env`:
```
PORT=3002
```

And update `frontend/vite.config.js` proxy target accordingly.

## Next Steps

1. Test with a public repository
2. Review the analysis results
3. Implement improvements from the roadmap
4. Re-analyze to see score improvements!

