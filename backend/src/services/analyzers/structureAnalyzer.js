import fs from 'fs/promises';
import path from 'path';

/**
 * Analyze project structure and architecture
 */
export async function analyzeStructure(repoData) {
  const { clonePath, metadata } = repoData;
  const metrics = {
    hasOrganizedFolders: false,
    modularity: 'unknown',
    hasConfigFiles: false,
    hasPackageManager: false,
    folderStructure: [],
    depth: 0
  };

  if (!clonePath) {
    return metrics;
  }

  try {
    const structure = await analyzeFolderStructure(clonePath);
    metrics.folderStructure = structure.folders;
    metrics.depth = structure.maxDepth;
    metrics.hasOrganizedFolders = structure.folders.length > 3;
    metrics.modularity = assessModularity(structure);
    metrics.hasConfigFiles = await checkConfigFiles(clonePath);
    metrics.hasPackageManager = await checkPackageManager(clonePath);
  } catch (error) {
    console.warn('Structure analysis error:', error.message);
  }

  return metrics;
}

/**
 * Analyze folder structure
 */
async function analyzeFolderStructure(dir, depth = 0, maxDepth = 0, folders = []) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const currentFolders = [];

    for (const entry of entries) {
      // Skip hidden and common ignore directories
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === 'vendor' ||
          entry.name === 'dist' ||
          entry.name === 'build') {
        continue;
      }

      if (entry.isDirectory()) {
        currentFolders.push(entry.name);
        const subPath = path.join(dir, entry.name);
        const subStructure = await analyzeFolderStructure(subPath, depth + 1, maxDepth, folders);
        maxDepth = Math.max(maxDepth, subStructure.maxDepth);
      }
    }

    if (currentFolders.length > 0) {
      folders.push({
        path: path.relative(dir, dir) || '.',
        folders: currentFolders,
        depth
      });
    }

    return { folders, maxDepth: Math.max(maxDepth, depth) };
  } catch (error) {
    return { folders, maxDepth };
  }
}

/**
 * Assess modularity based on structure
 */
function assessModularity(structure) {
  const { folders, maxDepth } = structure;
  
  // Good modularity indicators:
  // - Multiple organized folders
  // - Reasonable depth (not too flat, not too deep)
  // - Common patterns like src/, lib/, components/, etc.
  
  const commonPatterns = ['src', 'lib', 'components', 'utils', 'services', 'models', 'controllers', 'routes'];
  const hasCommonPatterns = folders.some(f => 
    f.folders.some(name => commonPatterns.includes(name.toLowerCase()))
  );

  if (folders.length >= 5 && hasCommonPatterns && maxDepth >= 2 && maxDepth <= 4) {
    return 'high';
  } else if (folders.length >= 3 && maxDepth >= 1) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Check for configuration files
 */
async function checkConfigFiles(dir) {
  const configFiles = [
    '.gitignore',
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.json',
    '.prettierrc',
    '.prettierrc.js',
    'tsconfig.json',
    'pyproject.toml',
    'setup.py',
    'requirements.txt',
    'package.json',
    'pom.xml',
    'build.gradle',
    'Cargo.toml',
    'go.mod'
  ];

  try {
    const entries = await fs.readdir(dir);
    return configFiles.some(file => entries.includes(file));
  } catch (error) {
    return false;
  }
}

/**
 * Check for package manager files
 */
async function checkPackageManager(dir) {
  const packageFiles = [
    'package.json',      // npm/yarn
    'requirements.txt',  // pip
    'Pipfile',          // pipenv
    'poetry.lock',      // poetry
    'pom.xml',         // maven
    'build.gradle',     // gradle
    'Cargo.toml',      // cargo
    'go.mod',          // go modules
    'composer.json',   // composer
    'Gemfile'          // bundler
  ];

  try {
    const entries = await fs.readdir(dir);
    return packageFiles.some(file => entries.includes(file));
  } catch (error) {
    return false;
  }
}

