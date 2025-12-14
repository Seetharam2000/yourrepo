import fs from 'fs/promises';
import path from 'path';

/**
 * Analyze DevOps and automation
 */
export async function analyzeDevOps(repoData) {
  const { clonePath } = repoData;
  const metrics = {
    hasCI: false,
    ciProvider: null,
    hasDocker: false,
    hasDockerfile: false,
    hasDockerCompose: false,
    hasDeploymentConfig: false,
    hasLinting: false,
    hasPreCommitHooks: false,
    devOpsScore: 0
  };

  if (!clonePath) {
    return metrics;
  }

  try {
    // Check for CI/CD
    const ciCheck = await checkCI(clonePath);
    metrics.hasCI = ciCheck.hasCI;
    metrics.ciProvider = ciCheck.provider;

    // Check for Docker
    const dockerCheck = await checkDocker(clonePath);
    metrics.hasDocker = dockerCheck.hasDocker;
    metrics.hasDockerfile = dockerCheck.hasDockerfile;
    metrics.hasDockerCompose = dockerCheck.hasDockerCompose;

    // Check for deployment configs
    metrics.hasDeploymentConfig = await checkDeploymentConfigs(clonePath);

    // Check for linting configs
    metrics.hasLinting = await checkLintingConfigs(clonePath);

    // Check for pre-commit hooks
    metrics.hasPreCommitHooks = await checkPreCommitHooks(clonePath);

    // Calculate DevOps score
    metrics.devOpsScore = calculateDevOpsScore(metrics);
  } catch (error) {
    console.warn('DevOps analysis error:', error.message);
  }

  return metrics;
}

/**
 * Check for CI/CD configuration
 */
async function checkCI(clonePath) {
  const ciConfigs = {
    'GitHub Actions': '.github/workflows',
    'GitLab CI': '.gitlab-ci.yml',
    'Jenkins': 'Jenkinsfile',
    'CircleCI': '.circleci',
    'Travis CI': '.travis.yml',
    'Azure Pipelines': 'azure-pipelines.yml',
    'Bitbucket Pipelines': 'bitbucket-pipelines.yml'
  };

  try {
    const entries = await fs.readdir(clonePath);
    
    for (const [provider, config] of Object.entries(ciConfigs)) {
      if (config.includes('.')) {
        // File-based config
        if (entries.includes(config)) {
          return { hasCI: true, provider };
        }
      } else {
        // Directory-based config
        if (entries.includes(config)) {
          return { hasCI: true, provider };
        }
      }
    }

    // Check for GitHub Actions specifically (nested)
    try {
      const githubWorkflows = path.join(clonePath, '.github', 'workflows');
      await fs.access(githubWorkflows);
      const workflowFiles = await fs.readdir(githubWorkflows);
      if (workflowFiles.length > 0) {
        return { hasCI: true, provider: 'GitHub Actions' };
      }
    } catch (error) {
      // GitHub Actions not found
    }

    return { hasCI: false, provider: null };
  } catch (error) {
    return { hasCI: false, provider: null };
  }
}

/**
 * Check for Docker files
 */
async function checkDocker(clonePath) {
  try {
    const entries = await fs.readdir(clonePath);
    const hasDockerfile = entries.includes('Dockerfile') || 
                         entries.some(e => e.startsWith('Dockerfile.'));
    const hasDockerCompose = entries.includes('docker-compose.yml') ||
                            entries.includes('docker-compose.yaml') ||
                            entries.some(e => e.includes('docker-compose'));

    return {
      hasDocker: hasDockerfile || hasDockerCompose,
      hasDockerfile,
      hasDockerCompose
    };
  } catch (error) {
    return { hasDocker: false, hasDockerfile: false, hasDockerCompose: false };
  }
}

/**
 * Check for deployment configurations
 */
async function checkDeploymentConfigs(clonePath) {
  const deploymentFiles = [
    'vercel.json',
    'netlify.toml',
    'serverless.yml',
    'serverless.yaml',
    '.deploy',
    'deploy.sh',
    'deploy.yml',
    'kubernetes.yaml',
    'k8s.yaml',
    'helm',
    'terraform',
    '.terraform'
  ];

  try {
    const entries = await fs.readdir(clonePath);
    return deploymentFiles.some(file => entries.includes(file));
  } catch (error) {
    return false;
  }
}

/**
 * Check for linting configurations
 */
async function checkLintingConfigs(clonePath) {
  const lintingFiles = [
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.json',
    '.eslintrc.yml',
    '.prettierrc',
    '.prettierrc.js',
    '.prettierrc.json',
    'pylintrc',
    '.pylintrc',
    'rubocop.yml',
    '.rubocop.yml',
    'golangci.yml',
    '.golangci.yml'
  ];

  try {
    const entries = await fs.readdir(clonePath);
    return lintingFiles.some(file => entries.includes(file));
  } catch (error) {
    return false;
  }
}

/**
 * Check for pre-commit hooks
 */
async function checkPreCommitHooks(clonePath) {
  try {
    const gitHooksPath = path.join(clonePath, '.git', 'hooks');
    await fs.access(gitHooksPath);
    const hooks = await fs.readdir(gitHooksPath);
    return hooks.some(hook => hook !== 'sample' && !hook.endsWith('.sample'));
  } catch (error) {
    // Check for pre-commit config in root
    try {
      const entries = await fs.readdir(clonePath);
      return entries.includes('.pre-commit-config.yaml') || 
             entries.includes('.pre-commit-config.yml');
    } catch (error) {
      return false;
    }
  }
}

/**
 * Calculate DevOps score
 */
function calculateDevOpsScore(metrics) {
  let score = 0;

  if (metrics.hasCI) score += 4;
  if (metrics.hasDockerfile) score += 2;
  if (metrics.hasDockerCompose) score += 1;
  if (metrics.hasDeploymentConfig) score += 1;
  if (metrics.hasLinting) score += 1;
  if (metrics.hasPreCommitHooks) score += 1;

  return Math.min(score, 10);
}

