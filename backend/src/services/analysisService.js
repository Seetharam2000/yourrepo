import githubService from './githubService.js';
import { validateGitHubUrl } from '../utils/validators.js';
import { analyzeCodeQuality } from './analyzers/codeQualityAnalyzer.js';
import { analyzeStructure } from './analyzers/structureAnalyzer.js';
import { analyzeDocumentation } from './analyzers/documentationAnalyzer.js';
import { analyzeTesting } from './analyzers/testingAnalyzer.js';
import { analyzeGitCollaboration } from './analyzers/gitCollaborationAnalyzer.js';
import { analyzeDevOps } from './analyzers/devOpsAnalyzer.js';
import { calculateScores } from './scoringService.js';
import { generateRoadmap } from './roadmapService.js';
import { generateSummary } from './summaryService.js';

/**
 * Main analysis service - orchestrates all analysis steps
 */
export async function analyzeRepository(repoUrl) {
  // Validate URL
  const validation = validateGitHubUrl(repoUrl);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const { owner, repo } = validation;
  let clonePath = null;

  try {
    // Fetch repository data from GitHub API
    const repoData = await githubService.getRepositoryData(owner, repo);
    clonePath = repoData.clonePath;

    // Run all analyzers
    const [
      codeQualityMetrics,
      structureMetrics,
      documentationMetrics,
      testingMetrics,
      gitMetrics,
      devOpsMetrics
    ] = await Promise.all([
      analyzeCodeQuality(repoData),
      analyzeStructure(repoData),
      analyzeDocumentation(repoData),
      analyzeTesting(repoData),
      analyzeGitCollaboration(repoData),
      analyzeDevOps(repoData)
    ]);

    // Calculate scores
    const scores = calculateScores({
      codeQualityMetrics,
      structureMetrics,
      documentationMetrics,
      testingMetrics,
      gitMetrics,
      devOpsMetrics
    });

    // Generate summary
    const summary = generateSummary(scores, {
      codeQualityMetrics,
      structureMetrics,
      documentationMetrics,
      testingMetrics,
      gitMetrics,
      devOpsMetrics
    });

    // Generate roadmap
    const roadmap = generateRoadmap(scores, {
      codeQualityMetrics,
      structureMetrics,
      documentationMetrics,
      testingMetrics,
      gitMetrics,
      devOpsMetrics
    });

    // Infer developer skill profile
    const skillProfile = inferSkillProfile(scores);

    // Calculate growth projection
    const growthProjection = calculateGrowthProjection(scores, roadmap);

    return {
      repository: {
        url: repoUrl,
        owner,
        name: repo,
        fullName: `${owner}/${repo}`
      },
      scores,
      summary,
      roadmap,
      skillProfile,
      growthProjection,
      analyzedAt: new Date().toISOString()
    };
  } finally {
    // Cleanup cloned repository
    if (clonePath) {
      await githubService.cleanup(clonePath);
    }
  }
}

/**
 * Infer developer skill profile from scores
 */
function inferSkillProfile(scores) {
  const categories = scores.categories;
  const strengths = [];
  const weaknesses = [];
  const areas = {
    'Backend': categories.codeQuality + categories.structure,
    'Frontend': categories.structure + categories.codeQuality,
    'DevOps': categories.devops,
    'Testing': categories.testing,
    'Documentation': categories.documentation,
    'Collaboration': categories.gitCollaboration
  };

  const sorted = Object.entries(areas).sort((a, b) => b[1] - a[1]);
  strengths.push(...sorted.slice(0, 2).map(([area]) => area));
  weaknesses.push(...sorted.slice(-2).map(([area]) => area));

  return { strengths, weaknesses };
}

/**
 * Calculate growth projection based on roadmap
 */
function calculateGrowthProjection(scores, roadmap) {
  const currentScore = scores.overall;
  const shortTermItems = roadmap.filter(item => item.priority === 'short-term').length;
  const midTermItems = roadmap.filter(item => item.priority === 'mid-term').length;

  // Estimate score improvement
  const potentialImprovement = Math.min(
    shortTermItems * 3 + midTermItems * 2,
    30 // Cap at 30 points
  );
  const projectedScore = Math.min(currentScore + potentialImprovement, 100);

  return {
    currentScore,
    projectedScore,
    potentialImprovement,
    message: `If you implement the top ${shortTermItems + midTermItems} roadmap items, your score could move from ${currentScore} to roughly ${projectedScore}.`
  };
}

