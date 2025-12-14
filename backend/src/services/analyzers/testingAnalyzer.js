import fs from 'fs/promises';
import path from 'path';

/**
 * Analyze testing and maintainability
 */
export async function analyzeTesting(repoData) {
  const { clonePath, metadata } = repoData;
  const metrics = {
    hasTestFiles: false,
    testFileCount: 0,
    testFramework: null,
    hasTestFolder: false,
    hasCoverageReports: false,
    testCoverage: null,
    maintainabilityScore: 0
  };

  if (!clonePath) {
    return metrics;
  }

  try {
    const testAnalysis = await findTestFiles(clonePath);
    metrics.hasTestFiles = testAnalysis.files.length > 0;
    metrics.testFileCount = testAnalysis.files.length;
    metrics.testFramework = testAnalysis.framework;
    metrics.hasTestFolder = testAnalysis.hasTestFolder;

    // Check for coverage reports
    metrics.hasCoverageReports = await checkCoverageReports(clonePath);
    if (metrics.hasCoverageReports) {
      metrics.testCoverage = await parseCoverage(clonePath);
    }

    // Calculate maintainability score
    metrics.maintainabilityScore = calculateMaintainabilityScore(metrics);
  } catch (error) {
    console.warn('Testing analysis error:', error.message);
  }

  return metrics;
}

/**
 * Find test files in repository
 */
async function findTestFiles(dir) {
  const testFiles = [];
  const testPatterns = [
    /\.test\./i,
    /\.spec\./i,
    /test\./i,
    /_test\./i,
    /_spec\./i
  ];

  const testFolders = ['test', 'tests', '__tests__', 'spec', 'specs'];
  let hasTestFolder = false;
  let framework = null;

  await walkDirectory(dir, (filePath) => {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(dir, filePath);

    // Check if in test folder
    const pathParts = relativePath.split(path.sep);
    if (pathParts.some(part => testFolders.includes(part.toLowerCase()))) {
      hasTestFolder = true;
    }

    // Check if file matches test patterns
    if (testPatterns.some(pattern => pattern.test(fileName))) {
      testFiles.push(filePath);
      
      // Detect framework
      if (!framework) {
        framework = detectTestFramework(filePath);
      }
    }
  });

  return { files: testFiles, hasTestFolder, framework };
}

/**
 * Walk directory recursively
 */
async function walkDirectory(dir, callback, visited = new Set()) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip common ignore directories
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === 'vendor' ||
          entry.name === 'dist' ||
          entry.name === 'build') {
        continue;
      }

      if (entry.isDirectory()) {
        await walkDirectory(fullPath, callback, visited);
      } else if (entry.isFile()) {
        callback(fullPath);
      }
    }
  } catch (error) {
    // Skip directories we can't access
  }
}

/**
 * Detect test framework
 */
function detectTestFramework(filePath) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath);

  // Framework detection based on file patterns and content
  if (fileName.includes('jest') || fileName.includes('jest.config')) {
    return 'Jest';
  }
  if (fileName.includes('mocha') || fileName.includes('mocha.opts')) {
    return 'Mocha';
  }
  if (fileName.includes('pytest') || fileName.includes('pytest.ini')) {
    return 'pytest';
  }
  if (fileName.includes('unittest') || fileName.includes('test_')) {
    return 'unittest';
  }
  if (fileName.includes('junit') || fileName.includes('Test.java')) {
    return 'JUnit';
  }

  // Try to read content if possible (for future enhancement)
  // For now, infer from extension
  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
    return 'JavaScript/TypeScript Testing';
  }
  if (ext === '.py') {
    return 'Python Testing';
  }
  if (ext === '.java') {
    return 'Java Testing';
  }

  return 'Unknown';
}

/**
 * Check for coverage reports
 */
async function checkCoverageReports(dir) {
  const coverageFolders = ['coverage', '.coverage', 'htmlcov'];
  const coverageFiles = ['coverage.json', 'coverage.xml', '.coverage', 'lcov.info'];

  try {
    const entries = await fs.readdir(dir);
    
    // Check for coverage folders
    if (coverageFolders.some(folder => entries.includes(folder))) {
      return true;
    }

    // Check for coverage files
    if (coverageFiles.some(file => entries.includes(file))) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Parse coverage (basic - can be enhanced)
 */
async function parseCoverage(dir) {
  // This is a placeholder - real implementation would parse coverage.json or lcov.info
  // For now, just return that coverage exists
  return { exists: true, percentage: null };
}

/**
 * Calculate maintainability score
 */
function calculateMaintainabilityScore(metrics) {
  let score = 0;

  if (metrics.hasTestFiles) score += 5;
  if (metrics.testFileCount > 5) score += 3;
  if (metrics.hasTestFolder) score += 2;
  if (metrics.testFramework) score += 2;
  if (metrics.hasCoverageReports) score += 3;

  return Math.min(score, 15);
}

