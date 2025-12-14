import { SCORE_CATEGORIES } from '../models/scoreModel.js';

/**
 * Generate prioritized roadmap from scores and metrics
 */
export function generateRoadmap(scores, allMetrics) {
  const roadmap = [];
  const { categories } = scores;

  // Code Quality improvements
  if (categories[SCORE_CATEGORIES.CODE_QUALITY] < 20) {
    if (!allMetrics.codeQualityMetrics?.hasComments) {
      roadmap.push({
        category: 'Code Quality',
        priority: 'short-term',
        task: 'Add inline comments to complex functions and algorithms to improve code readability.',
        impact: 'high'
      });
    }

    if (allMetrics.codeQualityMetrics?.securityIssues?.length > 0) {
      roadmap.push({
        category: 'Security',
        priority: 'short-term',
        task: `Address ${allMetrics.codeQualityMetrics.securityIssues.length} security issue(s) detected in the codebase, particularly removing any hardcoded secrets.`,
        impact: 'critical'
      });
    }

    if (allMetrics.codeQualityMetrics?.averageFunctionLength > 50) {
      roadmap.push({
        category: 'Code Quality',
        priority: 'mid-term',
        task: 'Refactor functions longer than 50 lines into smaller, reusable helper functions.',
        impact: 'high'
      });
    }

    if (!allMetrics.codeQualityMetrics?.hasNamingConventions) {
      roadmap.push({
        category: 'Code Quality',
        priority: 'short-term',
        task: 'Establish and follow consistent naming conventions (camelCase, snake_case, or kebab-case) throughout the codebase.',
        impact: 'medium'
      });
    }
  }

  // Structure improvements
  if (categories[SCORE_CATEGORIES.STRUCTURE] < 10) {
    if (!allMetrics.structureMetrics?.hasOrganizedFolders) {
      roadmap.push({
        category: 'Structure',
        priority: 'short-term',
        task: 'Organize code into logical folders (e.g., src/, lib/, components/, utils/) to improve project structure.',
        impact: 'high'
      });
    }

    if (!allMetrics.structureMetrics?.hasConfigFiles) {
      roadmap.push({
        category: 'Structure',
        priority: 'short-term',
        task: 'Add configuration files (.gitignore, linting configs) to standardize development practices.',
        impact: 'medium'
      });
    }
  }

  // Documentation improvements
  if (categories[SCORE_CATEGORIES.DOCUMENTATION] < 10) {
    if (!allMetrics.documentationMetrics?.hasReadme) {
      roadmap.push({
        category: 'Documentation',
        priority: 'short-term',
        task: 'Create a comprehensive README.md with project overview, tech stack, installation instructions, usage examples, and contribution guidelines.',
        impact: 'critical'
      });
    } else {
      const missingSections = [];
      const requiredSections = ['Installation', 'Usage', 'Features'];
      const existingSections = allMetrics.documentationMetrics.readmeSections || [];

      requiredSections.forEach(section => {
        if (!existingSections.includes(section)) {
          missingSections.push(section.toLowerCase());
        }
      });

      if (missingSections.length > 0) {
        roadmap.push({
          category: 'Documentation',
          priority: 'short-term',
          task: `Enhance README.md by adding sections for: ${missingSections.join(', ')}.`,
          impact: 'high'
        });
      }
    }

    if (!allMetrics.documentationMetrics?.hasDocsFolder) {
      roadmap.push({
        category: 'Documentation',
        priority: 'mid-term',
        task: 'Create a docs/ folder with detailed documentation for API endpoints, architecture decisions, and advanced usage.',
        impact: 'medium'
      });
    }
  }

  // Testing improvements
  if (categories[SCORE_CATEGORIES.TESTING] < 15) {
    if (!allMetrics.testingMetrics?.hasTestFiles) {
      roadmap.push({
        category: 'Testing',
        priority: 'short-term',
        task: `Introduce unit tests for core modules using ${allMetrics.testingMetrics?.testFramework || 'an appropriate testing framework'} for the project's primary language.`,
        impact: 'critical'
      });
    } else if (allMetrics.testingMetrics?.testFileCount < 5) {
      roadmap.push({
        category: 'Testing',
        priority: 'mid-term',
        task: 'Expand test coverage by adding tests for edge cases, error handling, and integration scenarios.',
        impact: 'high'
      });
    }

    if (!allMetrics.testingMetrics?.hasTestFolder) {
      roadmap.push({
        category: 'Testing',
        priority: 'short-term',
        task: 'Organize tests into a dedicated test/ or __tests__/ folder following best practices.',
        impact: 'medium'
      });
    }

    if (!allMetrics.testingMetrics?.hasCoverageReports) {
      roadmap.push({
        category: 'Testing',
        priority: 'mid-term',
        task: 'Set up code coverage reporting (e.g., Jest coverage, pytest-cov) and aim for at least 70% coverage.',
        impact: 'high'
      });
    }
  }

  // Git & Collaboration improvements
  if (categories[SCORE_CATEGORIES.GIT_COLLABORATION] < 10) {
    if (allMetrics.gitMetrics?.commitMessageQuality === 'very_poor' || 
        allMetrics.gitMetrics?.commitMessageQuality === 'poor') {
      roadmap.push({
        category: 'Git Practices',
        priority: 'short-term',
        task: 'Improve commit message quality by using descriptive messages (e.g., "Add user authentication feature" instead of "update").',
        impact: 'medium'
      });
    }

    if (!allMetrics.gitMetrics?.hasPullRequests) {
      roadmap.push({
        category: 'Collaboration',
        priority: 'mid-term',
        task: 'Use pull requests for code reviews and collaboration, even for solo projects, to maintain a clean git history.',
        impact: 'medium'
      });
    }

    if (allMetrics.gitMetrics?.commitFrequency === 'low' || 
        allMetrics.gitMetrics?.commitFrequency === 'none') {
      roadmap.push({
        category: 'Git Practices',
        priority: 'short-term',
        task: 'Commit changes more frequently with smaller, focused commits rather than large batch commits.',
        impact: 'medium'
      });
    }
  }

  // DevOps improvements
  if (categories[SCORE_CATEGORIES.DEVOPS] < 7) {
    if (!allMetrics.devOpsMetrics?.hasCI) {
      roadmap.push({
        category: 'DevOps',
        priority: 'short-term',
        task: 'Add a GitHub Actions workflow (or other CI/CD) to run linting and tests on every push and pull request.',
        impact: 'high'
      });
    }

    if (!allMetrics.devOpsMetrics?.hasDockerfile) {
      roadmap.push({
        category: 'DevOps',
        priority: 'mid-term',
        task: 'Create a Dockerfile to containerize the application for consistent deployment across environments.',
        impact: 'medium'
      });
    }

    if (!allMetrics.devOpsMetrics?.hasLinting) {
      roadmap.push({
        category: 'Code Quality',
        priority: 'short-term',
        task: 'Set up linting (ESLint, Pylint, etc.) and configure it to run automatically.',
        impact: 'medium'
      });
    }

    if (!allMetrics.devOpsMetrics?.hasPreCommitHooks) {
      roadmap.push({
        category: 'DevOps',
        priority: 'long-term',
        task: 'Configure pre-commit hooks to run linting and tests before commits are accepted.',
        impact: 'low'
      });
    }
  }

  // Sort by priority and impact
  const priorityOrder = { 'short-term': 1, 'mid-term': 2, 'long-term': 3 };
  const impactOrder = { 'critical': 1, 'high': 2, 'medium': 3, 'low': 4 };

  roadmap.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return impactOrder[a.impact] - impactOrder[b.impact];
  });

  return roadmap;
}

