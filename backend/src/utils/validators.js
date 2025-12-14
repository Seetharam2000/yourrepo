/**
 * Validates a GitHub repository URL
 * @param {string} url - The URL to validate
 * @returns {{isValid: boolean, error?: string, owner?: string, repo?: string}}
 */
export function validateGitHubUrl(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL must be a non-empty string' };
  }

  // Match GitHub repository URLs
  // Examples:
  // - https://github.com/owner/repo
  // - https://github.com/owner/repo.git
  // - github.com/owner/repo
  const githubUrlPattern = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^\/]+)\/([^\/\s]+)(?:\.git)?(?:\/)?$/i;
  const match = url.trim().match(githubUrlPattern);

  if (!match) {
    return { isValid: false, error: 'Invalid GitHub repository URL format' };
  }

  const [, owner, repo] = match;
  const repoName = repo.replace(/\.git$/, '');

  return {
    isValid: true,
    owner,
    repo: repoName,
    fullName: `${owner}/${repoName}`
  };
}

