import { SCORE_CATEGORIES, SKILL_LEVELS } from '../models/scoreModel.js';

/**
 * Generate summary text from scores and metrics
 */
export function generateSummary(scores, allMetrics) {
  const { overall, level, categories } = scores;
  const strengths = [];
  const weaknesses = [];

  // Identify strengths (categories scoring above 70% of max)
  const categoryNames = {
    [SCORE_CATEGORIES.CODE_QUALITY]: 'Code Quality',
    [SCORE_CATEGORIES.STRUCTURE]: 'Structure & Architecture',
    [SCORE_CATEGORIES.DOCUMENTATION]: 'Documentation',
    [SCORE_CATEGORIES.TESTING]: 'Testing & Maintainability',
    [SCORE_CATEGORIES.GIT_COLLABORATION]: 'Git & Collaboration',
    [SCORE_CATEGORIES.DEVOPS]: 'DevOps & Automation'
  };

  Object.entries(categories).forEach(([key, score]) => {
    const maxScore = scores.maxScores[key];
    const percentage = (score / maxScore) * 100;
    const name = categoryNames[key];

    if (percentage >= 70) {
      strengths.push(name.toLowerCase());
    } else if (percentage < 40) {
      weaknesses.push(name.toLowerCase());
    }
  });

  // Build summary sentences
  const sentences = [];

  // Opening sentence
  sentences.push(
    `This repository receives an overall score of ${overall}/100, indicating a ${level.toLowerCase()} skill level.`
  );

  // Strengths
  if (strengths.length > 0) {
    const strengthText = strengths.length === 1 
      ? strengths[0]
      : strengths.slice(0, -1).join(', ') + ', and ' + strengths[strengths.length - 1];
    sentences.push(
      `The repository demonstrates strong performance in ${strengthText}.`
    );
  }

  // Weaknesses
  if (weaknesses.length > 0) {
    const weaknessText = weaknesses.length === 1
      ? weaknesses[0]
      : weaknesses.slice(0, -1).join(', ') + ', and ' + weaknesses[weaknesses.length - 1];
    sentences.push(
      `Areas that need improvement include ${weaknessText}.`
    );
  }

  // Specific insights
  const insights = generateInsights(allMetrics, categories);
  if (insights.length > 0) {
    sentences.push(insights[0]); // Add one key insight
  }

  // Closing sentence
  if (overall >= 75) {
    sentences.push('The repository shows professional-grade development practices.');
  } else if (overall >= 50) {
    sentences.push('With focused improvements, this repository can reach an advanced level.');
  } else {
    sentences.push('Implementing the recommended improvements will significantly enhance the repository quality.');
  }

  return sentences.join(' ');
}

/**
 * Generate specific insights from metrics
 */
function generateInsights(allMetrics, categories) {
  const insights = [];

  // Code Quality insights
  if (categories[SCORE_CATEGORIES.CODE_QUALITY] < 15) {
    if (allMetrics.codeQualityMetrics?.securityIssues?.length > 0) {
      insights.push('Security concerns were detected in the codebase that should be addressed.');
    } else if (!allMetrics.codeQualityMetrics?.hasComments) {
      insights.push('The codebase would benefit from more inline comments and documentation.');
    }
  }

  // Testing insights
  if (categories[SCORE_CATEGORIES.TESTING] < 10) {
    if (!allMetrics.testingMetrics?.hasTestFiles) {
      insights.push('No test files were found, which significantly impacts maintainability.');
    }
  }

  // Documentation insights
  if (categories[SCORE_CATEGORIES.DOCUMENTATION] < 8) {
    if (!allMetrics.documentationMetrics?.hasReadme) {
      insights.push('A comprehensive README file is missing, which is essential for project understanding.');
    } else if (allMetrics.documentationMetrics?.readmeSections?.length < 3) {
      insights.push('The README could be enhanced with more sections like installation, usage, and contributing guidelines.');
    }
  }

  // DevOps insights
  if (categories[SCORE_CATEGORIES.DEVOPS] < 5) {
    if (!allMetrics.devOpsMetrics?.hasCI) {
      insights.push('No CI/CD pipeline was detected, which is crucial for automated testing and deployment.');
    }
  }

  return insights;
}

