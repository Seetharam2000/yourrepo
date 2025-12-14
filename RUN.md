# How to Run the Application

## Quick Start Commands

### Step 1: Install Dependencies (First Time Only)

**Open PowerShell in the project root directory:**

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install
```

---

### Step 2: Configure Environment (Optional but Recommended)

```powershell
# Navigate to backend directory
cd ..\backend

# Copy environment template
Copy-Item env.example .env

# Edit .env file and add your GitHub token
# Use any text editor: notepad .env
```

**Edit `.env` file:**
```
GITHUB_TOKEN=your_github_token_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Get GitHub Token:**
1. Visit: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scope: `public_repo`
4. Copy token and paste in `.env`

---

### Step 3: Run the Application

**You need TWO terminal windows open:**

#### Terminal 1 - Backend Server

```powershell
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on http://localhost:3001
```

#### Terminal 2 - Frontend Server

```powershell
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Access the Application

1. **Open your browser**
2. **Navigate to:** http://localhost:5173
3. **Enter a GitHub repository URL** (e.g., `https://github.com/facebook/react`)
4. **Click "Analyze Repository"**

---

## Alternative: Run Both Servers in One Terminal (PowerShell)

If you want to run both in one terminal window:

```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend
cd frontend
npm run dev
```

---

## Troubleshooting

### Port Already in Use

**Backend (port 3001):**
```powershell
# Change PORT in backend/.env to another port (e.g., 3002)
# Then restart backend server
```

**Frontend (port 5173):**
```powershell
# Vite will automatically use next available port
# Or specify: npm run dev -- --port 5174
```

### Module Not Found Error

```powershell
# Delete node_modules and reinstall
cd backend
Remove-Item -Recurse -Force node_modules
npm install

cd ..\frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Backend Shows "Cannot GET"

This is normal! The backend API doesn't have a root page. Use the frontend at http://localhost:5173 instead.

To test backend directly:
```powershell
# Test health endpoint
curl http://localhost:3001/health

# Or visit in browser:
# http://localhost:3001/health
```

---

## Stop the Servers

Press `Ctrl + C` in each terminal window to stop the servers.

---

## Production Build

### Build Frontend

```powershell
cd frontend
npm run build
```

### Run Production Backend

```powershell
cd backend
npm start
```

---

## Command Reference

| Task | Command |
|------|---------|
| Install backend deps | `cd backend; npm install` |
| Install frontend deps | `cd frontend; npm install` |
| Run backend (dev) | `cd backend; npm run dev` |
| Run frontend (dev) | `cd frontend; npm run dev` |
| Run backend (prod) | `cd backend; npm start` |
| Build frontend | `cd frontend; npm run build` |

