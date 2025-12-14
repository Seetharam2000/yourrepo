/**
 * Analyze Git collaboration and practices
 */
export async function analyzeGitCollaboration(repoData) {
  const { commits, pullRequests, issues, metadata } = repoData;
  const metrics = {
    commitCount: commits?.length || 0,
    commitFrequency: 'unknown',
    commitMessageQuality: 'unknown',
    hasPullRequests: false,
    pullRequestCount: 0,
    hasIssues: false,
    issueCount: 0,
    branchCount: 0,
    collaborationScore: 0
  };

  // Analyze commits
  if (commits && commits.length > 0) {
    metrics.commitFrequency = analyzeCommitFrequency(commits);
    metrics.commitMessageQuality = analyzeCommitMessages(commits);
  }

  // Analyze pull requests
  if (pullRequests && pullRequests.length > 0) {
    metrics.hasPullRequests = true;
    metrics.pullRequestCount = pullRequests.length;
  }

  // Analyze issues
  if (issues && issues.length > 0) {
    metrics.hasIssues = true;
    metrics.issueCount = issues.length;
  }

  // Estimate branch count (if we have PRs, likely multiple branches)
  if (metrics.hasPullRequests) {
    metrics.branchCount = Math.max(2, Math.min(metrics.pullRequestCount, 10));
  } else {
    metrics.branchCount = 1; // Likely just main/master
  }

  // Calculate collaboration score
  metrics.collaborationScore = calculateCollaborationScore(metrics);

  return metrics;
}

/**
 * Analyze commit frequency
 */
function analyzeCommitFrequency(commits) {
  if (commits.length === 0) return 'none';

  // Get commit dates
  const dates = commits
    .map(c => new Date(c.commit?.author?.date || c.commit?.committer?.date))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => b - a);

  if (dates.length === 0) return 'unknown';

  // Calculate time span
  const oldest = dates[dates.length - 1];
  const newest = dates[0];
  const daysDiff = (newest - oldest) / (1000 * 60 * 60 * 24);

  if (daysDiff === 0) return 'recent';

  const commitsPerDay = commits.length / daysDiff;

  if (commitsPerDay > 1) return 'very_active';
  if (commitsPerDay > 0.3) return 'active';
  if (commitsPerDay > 0.1) return 'moderate';
  return 'low';
}

/**
 * Analyze commit message quality
 */
function analyzeCommitMessages(commits) {
  if (commits.length === 0) return 'unknown';

  const messages = commits
    .map(c => c.commit?.message || '')
    .filter(m => m.length > 0);

  if (messages.length === 0) return 'unknown';

  let goodMessages = 0;
  let totalLength = 0;

  for (const msg of messages) {
    const firstLine = msg.split('\n')[0];
    totalLength += firstLine.length;

    // Good commit message indicators:
    // - Not too short (at least 10 chars)
    // - Not too long (under 72 chars is ideal)
    // - Starts with capital letter or verb
    // - Not just "update", "fix", "change" without context
    if (firstLine.length >= 10 && 
        firstLine.length <= 72 &&
        !/^(update|fix|change|modify)$/i.test(firstLine.trim())) {
      goodMessages++;
    }
  }

  const qualityRatio = goodMessages / messages.length;
  const avgLength = totalLength / messages.length;

  if (qualityRatio > 0.7 && avgLength > 20) return 'good';
  if (qualityRatio > 0.5) return 'moderate';
  if (qualityRatio > 0.3) return 'poor';
  return 'very_poor';
}

/**
 * Calculate collaboration score
 */
function calculateCollaborationScore(metrics) {
  let score = 0;

  // Commit frequency
  const frequencyScores = {
    'very_active': 3,
    'active': 2,
    'moderate': 1,
    'low': 0.5,
    'recent': 1,
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
    if (metrics.pullRequestCount > 5) score += 2;
  }

  // Issues
  if (metrics.hasIssues) {
    score += 2;
  }

  // Branching
  if (metrics.branchCount > 1) {
    score += 2;
  }

  return Math.min(score, 15);
}

