import fetch from 'node-fetch';
import simpleGit from 'simple-git';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub API service for fetching repository data
 */
class GitHubService {
  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.tempDir = path.join(os.tmpdir(), 'repo-mirror');
  }

  /**
   * Get GitHub API headers
   */
  getHeaders() {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'YourRepo/1.0'
    };
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`;
    }
    return headers;
  }

  /**
   * Fetch repository metadata from GitHub API
   */
  async fetchRepoMetadata(owner, repo) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (response.status === 404) {
      throw { status: 404, message: 'Repository not found' };
    }
    if (response.status === 403) {
      throw { status: 403, message: 'Rate limit exceeded' };
    }
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetch repository contents (files and folders)
   */
  async fetchRepoContents(owner, repo, path = '') {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Failed to fetch contents: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Fetch README content
   */
  async fetchReadme(owner, repo) {
    try {
      const readmeFiles = ['README.md', 'README.txt', 'README', 'readme.md'];
      for (const filename of readmeFiles) {
        const contents = await this.fetchRepoContents(owner, repo, filename);
        if (contents && contents.content) {
          return Buffer.from(contents.content, 'base64').toString('utf-8');
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Fetch commit history
   */
  async fetchCommits(owner, repo, perPage = 30) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=${perPage}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  }

  /**
   * Fetch pull requests
   */
  async fetchPullRequests(owner, repo, state = 'all', perPage = 30) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  }

  /**
   * Fetch issues
   */
  async fetchIssues(owner, repo, state = 'all', perPage = 30) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  }

  /**
   * Fetch languages used in repository
   */
  async fetchLanguages(owner, repo) {
    const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`;
    const response = await fetch(url, { headers: this.getHeaders() });

    if (!response.ok) {
      return {};
    }

    return await response.json();
  }

  /**
   * Clone repository to temporary directory for analysis
   */
  async cloneRepository(owner, repo) {
    const repoUrl = `https://github.com/${owner}/${repo}.git`;
    const clonePath = path.join(this.tempDir, `${owner}-${repo}-${Date.now()}`);

    try {
      await fs.mkdir(clonePath, { recursive: true });
      const git = simpleGit();
      await git.clone(repoUrl, clonePath);
      return clonePath;
    } catch (error) {
      throw new Error(`Failed to clone repository: ${error.message}`);
    }
  }

  /**
   * Clean up temporary directory
   */
  async cleanup(clonePath) {
    try {
      if (clonePath && clonePath.startsWith(this.tempDir)) {
        await fs.rm(clonePath, { recursive: true, force: true });
      }
    } catch (error) {
      console.warn('Failed to cleanup temp directory:', error.message);
    }
  }

  /**
   * Get all repository data needed for analysis
   */
  async getRepositoryData(owner, repo) {
    const [
      metadata,
      languages,
      readme,
      commits,
      pullRequests,
      issues
    ] = await Promise.all([
      this.fetchRepoMetadata(owner, repo),
      this.fetchLanguages(owner, repo),
      this.fetchReadme(owner, repo),
      this.fetchCommits(owner, repo),
      this.fetchPullRequests(owner, repo),
      this.fetchIssues(owner, repo)
    ]);

    // Clone repo for deeper analysis
    let clonePath = null;
    try {
      clonePath = await this.cloneRepository(owner, repo);
    } catch (error) {
      console.warn('Failed to clone repository:', error.message);
    }

    return {
      metadata,
      languages,
      readme,
      commits,
      pullRequests,
      issues,
      clonePath,
      owner,
      repo
    };
  }
}

export default new GitHubService();

