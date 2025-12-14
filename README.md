# YourRepo

A full-stack web application that evaluates public GitHub repositories and provides:
- Numerical score (0-100) and skill level (Beginner/Intermediate/Advanced)
- Written summary of repository quality
- Personalized, actionable roadmap for improvement

## Architecture

### Backend (Node.js/Express)
- **API Server**: Express.js REST API
- **Services**:
  - `githubService`: GitHub API integration
  - `analysisService`: Code analysis and metrics
  - `scoringService`: Score calculation (0-100)
  - `roadmapService`: Roadmap generation

### Frontend (React)
- Simple SPA with URL input form
- Results display with scores, summary, and roadmap

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── server.js              # Express server
│   │   ├── routes/
│   │   │   └── analyze.js         # /analyze endpoint
│   │   ├── services/
│   │   │   ├── githubService.js   # GitHub API integration
│   │   │   ├── analysisService.js # Code analysis
│   │   │   ├── scoringService.js  # Score calculation
│   │   │   └── roadmapService.js  # Roadmap generation
│   │   ├── utils/
│   │   │   └── validators.js      # URL validation
│   │   └── models/
│   │       └── scoreModel.js      # Data models
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── RepoInput.jsx
│   │   │   ├── ScoreDisplay.jsx
│   │   │   ├── SummaryDisplay.jsx
│   │   │   └── RoadmapDisplay.jsx
│   │   └── styles/
│   ├── package.json
│   └── vite.config.js
├── cli/
│   └── repo-mirror.js            # CLI tool
└── package.json                  # Root package.json

```

## Getting Started

See [SETUP.md](./SETUP.md) for detailed installation and setup instructions.

### Quick Start

1. **Install dependencies:**
   
   **PowerShell (Windows):**
   ```powershell
   cd backend; npm install
   cd ../frontend; npm install
   ```
   
   **Bash/Linux/Mac:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure backend:**
   ```bash
   cd backend
   # PowerShell: Copy-Item env.example .env
   # Bash: cp env.example .env
   # Add GITHUB_TOKEN to .env (optional but recommended)
   ```

3. **Run the application:**
   
   **PowerShell (Windows):**
   ```powershell
   # Terminal 1 - Backend
   cd backend; npm run dev
   
   # Terminal 2 - Frontend
   cd frontend; npm run dev
   ```
   
   **Bash/Linux/Mac:**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

4. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### CLI Usage
```bash
node cli/repo-mirror.js analyze <github_url>
```

## Scoring Categories

- **Code Quality** (0-25): Naming, structure, complexity
- **Structure & Architecture** (0-15): Modularity, organization
- **Documentation** (0-15): README, comments, docs folder
- **Testing & Maintainability** (0-20): Tests, coverage, maintainability
- **Git & Collaboration** (0-15): Commit history, PRs, branching
- **DevOps & Automation** (0-10): CI/CD, Docker, deployment

## License

MIT

