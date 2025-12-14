# Architecture Overview

## System Architecture

The YourRepo application follows a clean, modular architecture with clear separation between backend API, frontend UI, and CLI tool.

```
┌─────────────────┐
│   React Frontend │
│   (Port 5173)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Express Backend │
│   (Port 3001)   │
└────────┬────────┘
         │
         ├──► GitHub API
         │    (REST API)
         │
         └──► Git Clone
              (Local Analysis)
```

## Backend Architecture

### Core Components

1. **API Layer** (`routes/analyze.js`)
   - Handles HTTP requests
   - Validates input
   - Returns JSON responses

2. **Service Layer**
   - **githubService.js**: GitHub API integration
     - Fetches repository metadata
     - Retrieves commits, PRs, issues
     - Clones repository for deep analysis
   
   - **analysisService.js**: Orchestrates analysis
     - Coordinates all analyzers
     - Aggregates results
     - Generates final output

3. **Analyzers** (`services/analyzers/`)
   - **codeQualityAnalyzer.js**: Code quality metrics
   - **structureAnalyzer.js**: Project structure analysis
   - **documentationAnalyzer.js**: Documentation assessment
   - **testingAnalyzer.js**: Test coverage and quality
   - **gitCollaborationAnalyzer.js**: Git practices analysis
   - **devOpsAnalyzer.js**: CI/CD and automation checks

4. **Scoring & Generation**
   - **scoringService.js**: Calculates scores (0-100)
   - **summaryService.js**: Generates text summary
   - **roadmapService.js**: Creates improvement roadmap

### Data Flow

```
GitHub URL Input
    │
    ▼
URL Validation
    │
    ▼
GitHub API Fetch
    ├──► Metadata
    ├──► Commits
    ├──► PRs/Issues
    └──► Repository Clone
    │
    ▼
Parallel Analysis
    ├──► Code Quality
    ├──► Structure
    ├──► Documentation
    ├──► Testing
    ├──► Git Practices
    └──► DevOps
    │
    ▼
Score Calculation
    │
    ▼
Summary & Roadmap Generation
    │
    ▼
JSON Response
```

## Frontend Architecture

### Component Structure

```
App
├── RepoInput
│   └── Form (URL input)
│
└── Results Container
    ├── ScoreDisplay
    │   ├── Overall Score Circle
    │   └── Category Breakdown Cards
    │
    ├── SummaryDisplay
    │   └── Text Summary
    │
    └── RoadmapDisplay
        ├── Short-term Items
        ├── Mid-term Items
        └── Long-term Items
```

### State Management

- Uses React hooks (`useState`) for local state
- No external state management library (can be added if needed)
- API calls via `fetch` API

## Scoring Model

### Category Weights

| Category | Max Score | Weight |
|----------|-----------|--------|
| Code Quality | 25 | 25% |
| Structure & Architecture | 15 | 15% |
| Documentation | 15 | 15% |
| Testing & Maintainability | 20 | 20% |
| Git & Collaboration | 15 | 15% |
| DevOps & Automation | 10 | 10% |
| **Total** | **100** | **100%** |

### Skill Levels

- **Beginner**: 0-49 points
- **Intermediate**: 50-74 points
- **Advanced**: 75-100 points

## Analysis Metrics

### Code Quality (0-25)
- Naming conventions consistency
- Code complexity (function length)
- Presence of comments
- Security issues detection
- Code duplication hints

### Structure (0-15)
- Folder organization
- Modularity assessment
- Configuration files presence
- Package manager usage

### Documentation (0-15)
- README quality and completeness
- Documentation folder presence
- Code comments
- Section coverage (installation, usage, etc.)

### Testing (0-20)
- Test files presence
- Test framework detection
- Test folder organization
- Coverage reports

### Git & Collaboration (0-15)
- Commit frequency
- Commit message quality
- Pull request usage
- Issue tracking
- Branching strategy

### DevOps (0-10)
- CI/CD pipeline presence
- Docker configuration
- Deployment configs
- Linting setup
- Pre-commit hooks

## Roadmap Generation

Roadmap items are prioritized by:
1. **Priority**: short-term → mid-term → long-term
2. **Impact**: critical → high → medium → low
3. **Category**: Based on lowest scoring areas

Each roadmap item includes:
- Category
- Priority level
- Concrete task description
- Impact assessment

## Error Handling

### Backend
- URL validation errors (400)
- Repository not found (404)
- Rate limit errors (403)
- Server errors (500)

### Frontend
- Network errors
- Invalid URL format
- Loading states
- Error message display

## Performance Considerations

1. **Parallel Analysis**: All analyzers run in parallel
2. **File Limits**: Analysis limited to first 50 files for performance
3. **Temporary Cleanup**: Cloned repositories are cleaned up after analysis
4. **Caching**: Can be added for frequently analyzed repos

## Security

- GitHub token stored in environment variables
- Temporary files cleaned up after use
- Input validation and sanitization
- CORS configuration for frontend

## Future Enhancements

1. **Caching**: Cache analysis results for popular repos
2. **Database**: Store historical analysis data
3. **Authentication**: User accounts and saved analyses
4. **Advanced Analysis**: Integration with SonarQube, ESLint, etc.
5. **Real-time Updates**: WebSocket for long-running analyses
6. **Export**: PDF/CSV export of reports
7. **Comparisons**: Compare multiple repositories

