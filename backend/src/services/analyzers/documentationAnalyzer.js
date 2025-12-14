import fs from 'fs/promises';
import path from 'path';

/**
 * Analyze documentation quality
 */
export async function analyzeDocumentation(repoData) {
  const { readme, clonePath } = repoData;
  const metrics = {
    hasReadme: !!readme,
    readmeLength: readme ? readme.length : 0,
    readmeSections: [],
    hasDocsFolder: false,
    hasCodeComments: false,
    documentationScore: 0
  };

  // Analyze README
  if (readme) {
    metrics.readmeSections = analyzeReadmeSections(readme);
    metrics.documentationScore += 5; // Base score for having README
  }

  // Check for docs folder
  if (clonePath) {
    try {
      metrics.hasDocsFolder = await checkDocsFolder(clonePath);
      if (metrics.hasDocsFolder) {
        metrics.documentationScore += 3;
      }
    } catch (error) {
      // Ignore
    }
  }

  // Assess README quality
  if (readme) {
    const qualityScore = assessReadmeQuality(readme);
    metrics.documentationScore += qualityScore;
  }

  return metrics;
}

/**
 * Analyze README sections
 */
function analyzeReadmeSections(readme) {
  const sections = [];
  const commonSections = [
    { pattern: /#+\s*(description|about|overview)/i, name: 'Description' },
    { pattern: /#+\s*(installation|setup|getting started)/i, name: 'Installation' },
    { pattern: /#+\s*(usage|examples?|how to use)/i, name: 'Usage' },
    { pattern: /#+\s*(features?)/i, name: 'Features' },
    { pattern: /#+\s*(contributing|contribution)/i, name: 'Contributing' },
    { pattern: /#+\s*(license)/i, name: 'License' },
    { pattern: /#+\s*(tech stack|technologies?|built with)/i, name: 'Tech Stack' },
    { pattern: /#+\s*(api|endpoints?)/i, name: 'API' },
    { pattern: /#+\s*(tests?|testing)/i, name: 'Testing' },
    { pattern: /#+\s*(deployment|deploy)/i, name: 'Deployment' }
  ];

  for (const section of commonSections) {
    if (section.pattern.test(readme)) {
      sections.push(section.name);
    }
  }

  return sections;
}

/**
 * Assess README quality
 */
function assessReadmeQuality(readme) {
  let score = 0;
  const length = readme.length;

  // Length check
  if (length > 2000) score += 2;
  else if (length > 1000) score += 1;

  // Check for code blocks
  if (/```/.test(readme)) score += 1;

  // Check for links
  const linkCount = (readme.match(/\[.*?\]\(.*?\)/g) || []).length;
  if (linkCount > 5) score += 1;
  else if (linkCount > 2) score += 0.5;

  // Check for images/screenshots
  if (/!\[.*?\]\(.*?\)/.test(readme)) score += 1;

  // Check for badges
  if (/\[!\[.*?\]\(.*?\)\]\(.*?\)/.test(readme)) score += 0.5;

  return Math.min(score, 7); // Cap at 7 points
}

/**
 * Check for docs folder
 */
async function checkDocsFolder(clonePath) {
  try {
    const entries = await fs.readdir(clonePath);
    const docsFolders = ['docs', 'documentation', 'doc', 'wiki'];
    return docsFolders.some(folder => entries.includes(folder));
  } catch (error) {
    return false;
  }
}

