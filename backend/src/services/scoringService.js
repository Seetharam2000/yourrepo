import { createScoreObject, getSkillLevel, SCORE_CATEGORIES } from '../models/scoreModel.js';

/**
 * Calculate scores from all metrics
 */
export function calculateScores(allMetrics) {
  const scores = createScoreObject();

  // Code Quality (0-25)
  scores.categories[SCORE_CATEGORIES.CODE_QUALITY] = calculateCodeQualityScore(
    allMetrics.codeQualityMetrics
  );

  // Structure & Architecture (0-15)
  scores.categories[SCORE_CATEGORIES.STRUCTURE] = calculateStructureScore(
    allMetrics.structureMetrics
  );

  // Documentation (0-15)
  scores.categories[SCORE_CATEGORIES.DOCUMENTATION] = calculateDocumentationScore(
    allMetrics.documentationMetrics
  );

  // Testing & Maintainability (0-20)
  scores.categories[SCORE_CATEGORIES.TESTING] = calculateTestingScore(
    allMetrics.testingMetrics
  );

  // Git & Collaboration (0-15)
  scores.categories[SCORE_CATEGORIES.GIT_COLLABORATION] = calculateGitCollaborationScore(
    allMetrics.gitMetrics
  );

  // DevOps & Automation (0-10)
  scores.categories[SCORE_CATEGORIES.DEVOPS] = calculateDevOpsScore(
    allMetrics.devOpsMetrics
  );

  // Calculate overall score
  scores.overall = Math.round(
    Object.values(scores.categories).reduce((sum, score) => sum + score, 0)
  );

  // Add skill level
  scores.level = getSkillLevel(scores.overall);

  return scores;
}

/**
 * Calculate Code Quality score (0-25)
 */
function calculateCodeQualityScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // Base score for having code
  if (metrics.totalFiles > 0) score += 5;

  // Naming conventions
  if (metrics.hasNamingConventions) score += 4;

  // Code complexity
  const complexityScores = {
    'low': 5,
    'medium': 3,
    'high': 1,
    'unknown': 2
  };
  score += complexityScores[metrics.codeComplexity] || 0;

  // Comments
  if (metrics.hasComments) score += 3;

  // Function length (penalize very long functions)
  if (metrics.averageFunctionLength > 0) {
    if (metrics.averageFunctionLength <= 30) score += 4;
    else if (metrics.averageFunctionLength <= 50) score += 2;
    else score += 1;
  }

  // Security issues (penalize)
  const securityPenalty = Math.min(metrics.securityIssues?.length || 0, 5) * 0.5;
  score = Math.max(0, score - securityPenalty);

  return Math.min(Math.round(score), 25);
}

/**
 * Calculate Structure score (0-15)
 */
function calculateStructureScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // Organized folders
  if (metrics.hasOrganizedFolders) score += 5;

  // Modularity
  const modularityScores = {
    'high': 5,
    'medium': 3,
    'low': 1,
    'unknown': 0
  };
  score += modularityScores[metrics.modularity] || 0;

  // Config files
  if (metrics.hasConfigFiles) score += 2;

  // Package manager
  if (metrics.hasPackageManager) score += 3;

  return Math.min(Math.round(score), 15);
}

/**
 * Calculate Documentation score (0-15)
 */
function calculateDocumentationScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // Has README
  if (metrics.hasReadme) {
    score += 3;

    // README length
    if (metrics.readmeLength > 2000) score += 3;
    else if (metrics.readmeLength > 1000) score += 2;
    else if (metrics.readmeLength > 500) score += 1;

    // README sections
    const sectionScore = Math.min(metrics.readmeSections?.length || 0, 5);
    score += sectionScore;
  }

  // Docs folder
  if (metrics.hasDocsFolder) score += 2;

  // Use the documentationScore from analyzer if available
  if (metrics.documentationScore) {
    score = Math.max(score, metrics.documentationScore);
  }

  return Math.min(Math.round(score), 15);
}

/**
 * Calculate Testing score (0-20)
 */
function calculateTestingScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // Has test files
  if (metrics.hasTestFiles) {
    score += 8;

    // Test file count
    if (metrics.testFileCount > 10) score += 4;
    else if (metrics.testFileCount > 5) score += 3;
    else if (metrics.testFileCount > 2) score += 2;
  }

  // Test folder organization
  if (metrics.hasTestFolder) score += 2;

  // Test framework
  if (metrics.testFramework && metrics.testFramework !== 'Unknown') {
    score += 2;
  }

  // Coverage reports
  if (metrics.hasCoverageReports) score += 4;

  return Math.min(Math.round(score), 20);
}

/**
 * Calculate Git Collaboration score (0-15)
 */
function calculateGitCollaborationScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // Commit frequency
  const frequencyScores = {
    'very_active': 4,
    'active': 3,
    'moderate': 2,
    'low': 1,
    'recent': 2,
    'none': 0,
    'unknown': 0
  };
  score += frequencyScores[metrics.commitFrequency] || 0;

  // Commit message quality
  const messageScores = {
    'good': 3,
    'moderate': 2,
    'poor': 1,
    'very_poor': 0,
    'unknown': 0
  };
  score += messageScores[metrics.commitMessageQuality] || 0;

  // Pull requests
  if (metrics.hasPullRequests) {
    score += 3;
    if (metrics.pullRequestCount > 5) score += 1;
  }

  // Issues
  if (metrics.hasIssues) score += 2;

  // Branching
  if (metrics.branchCount > 1) score += 2;

  // Use collaborationScore if available
  if (metrics.collaborationScore) {
    score = Math.max(score, metrics.collaborationScore);
  }

  return Math.min(Math.round(score), 15);
}

/**
 * Calculate DevOps score (0-10)
 */
function calculateDevOpsScore(metrics) {
  if (!metrics) return 0;

  let score = 0;

  // CI/CD
  if (metrics.hasCI) score += 4;

  // Docker
  if (metrics.hasDockerfile) score += 2;
  if (metrics.hasDockerCompose) score += 1;

  // Deployment configs
  if (metrics.hasDeploymentConfig) score += 1;

  // Linting
  if (metrics.hasLinting) score += 1;

  // Pre-commit hooks
  if (metrics.hasPreCommitHooks) score += 1;

  // Use devOpsScore if available
  if (metrics.devOpsScore) {
    score = Math.max(score, metrics.devOpsScore);
  }

  return Math.min(Math.round(score), 10);
}

