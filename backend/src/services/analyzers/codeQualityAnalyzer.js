import fs from 'fs/promises';
import path from 'path';

/**
 * Analyze code quality metrics
 */
export async function analyzeCodeQuality(repoData) {
  const { clonePath, languages } = repoData;
  const metrics = {
    hasNamingConventions: false,
    codeComplexity: 'unknown',
    codeDuplication: 'unknown',
    averageFunctionLength: 0,
    hasComments: false,
    securityIssues: [],
    totalFiles: 0,
    totalLines: 0
  };

  if (!clonePath) {
    return metrics;
  }

  try {
    const files = await getAllCodeFiles(clonePath, languages);
    metrics.totalFiles = files.length;

    // Analyze files
    let totalLines = 0;
    let functionsFound = 0;
    let totalFunctionLines = 0;
    let hasComments = false;

    for (const file of files.slice(0, 50)) { // Limit to first 50 files for performance
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');
        totalLines += lines.length;

        // Check for comments
        if (!hasComments) {
          hasComments = detectComments(content, file);
        }

        // Analyze function length (basic heuristic)
        const functionMetrics = analyzeFunctions(content, file);
        functionsFound += functionMetrics.count;
        totalFunctionLines += functionMetrics.totalLines;

        // Basic security checks
        const securityIssues = detectSecurityIssues(content, file);
        metrics.securityIssues.push(...securityIssues);
      } catch (error) {
        // Skip files that can't be read
        continue;
      }
    }

    metrics.totalLines = totalLines;
    metrics.hasComments = hasComments;
    metrics.averageFunctionLength = functionsFound > 0 
      ? Math.round(totalFunctionLines / functionsFound) 
      : 0;

    // Check naming conventions (basic heuristic)
    metrics.hasNamingConventions = checkNamingConventions(files);

    // Assess complexity (simplified)
    if (metrics.averageFunctionLength > 50) {
      metrics.codeComplexity = 'high';
    } else if (metrics.averageFunctionLength > 30) {
      metrics.codeComplexity = 'medium';
    } else {
      metrics.codeComplexity = 'low';
    }

  } catch (error) {
    console.warn('Code quality analysis error:', error.message);
  }

  return metrics;
}

/**
 * Get all code files from repository
 */
async function getAllCodeFiles(dir, languages) {
  const codeExtensions = {
    'JavaScript': ['.js', '.jsx', '.ts', '.tsx'],
    'TypeScript': ['.ts', '.tsx'],
    'Python': ['.py'],
    'Java': ['.java'],
    'C++': ['.cpp', '.cc', '.cxx', '.hpp'],
    'C': ['.c', '.h'],
    'Go': ['.go'],
    'Rust': ['.rs'],
    'Ruby': ['.rb'],
    'PHP': ['.php']
  };

  const extensions = new Set();
  Object.entries(languages || {}).forEach(([lang, _]) => {
    (codeExtensions[lang] || []).forEach(ext => extensions.add(ext));
  });

  if (extensions.size === 0) {
    // Default to common extensions
    ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.go', '.rs'].forEach(ext => extensions.add(ext));
  }

  const files = [];
  await walkDirectory(dir, (filePath) => {
    const ext = path.extname(filePath);
    if (extensions.has(ext)) {
      files.push(filePath);
    }
  });

  return files;
}

/**
 * Walk directory recursively
 */
async function walkDirectory(dir, callback, visited = new Set()) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      // Skip node_modules, .git, and other common ignore directories
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
 * Detect comments in code
 */
function detectComments(content, filePath) {
  const ext = path.extname(filePath);
  const commentPatterns = {
    '.js': /\/\/|\/\*/,
    '.jsx': /\/\/|\/\*/,
    '.ts': /\/\/|\/\*/,
    '.tsx': /\/\/|\/\*/,
    '.py': /#/,
    '.java': /\/\/|\/\*/,
    '.cpp': /\/\/|\/\*/,
    '.c': /\/\/|\/\*/,
    '.go': /\/\/|\/\*/,
    '.rs': /\/\/|\/\*/
  };

  const pattern = commentPatterns[ext];
  if (!pattern) return false;

  return pattern.test(content);
}

/**
 * Analyze functions in code (basic heuristic)
 */
function analyzeFunctions(content, filePath) {
  const ext = path.extname(filePath);
  let count = 0;
  let totalLines = 0;

  // Basic function detection patterns
  const functionPatterns = {
    '.js': /function\s+\w+\s*\([^)]*\)\s*\{/g,
    '.jsx': /function\s+\w+\s*\([^)]*\)\s*\{/g,
    '.ts': /function\s+\w+\s*\([^)]*\)\s*\{/g,
    '.tsx': /function\s+\w+\s*\([^)]*\)\s*\{/g,
    '.py': /def\s+\w+\s*\([^)]*\)\s*:/g,
    '.java': /(?:public|private|protected)?\s*\w+\s+\w+\s*\([^)]*\)\s*\{/g,
    '.go': /func\s+\w+\s*\([^)]*\)\s*\{/g
  };

  const pattern = functionPatterns[ext];
  if (pattern) {
    const matches = content.match(pattern);
    if (matches) {
      count = matches.length;
      // Estimate function length (very rough)
      totalLines = count * 15; // Average estimate
    }
  }

  return { count, totalLines };
}

/**
 * Check naming conventions
 */
function checkNamingConventions(files) {
  // Basic check: if files use consistent naming (camelCase, snake_case, kebab-case)
  if (files.length === 0) return false;
  
  const sample = files.slice(0, 20);
  const namingPatterns = {
    camelCase: /^[a-z][a-zA-Z0-9]*$/,
    snake_case: /^[a-z][a-z0-9_]*$/,
    kebabCase: /^[a-z][a-z0-9-]*$/
  };

  let consistent = true;
  const firstPattern = detectNamingPattern(sample[0]);
  
  for (const file of sample.slice(1)) {
    const pattern = detectNamingPattern(file);
    if (pattern !== firstPattern) {
      consistent = false;
      break;
    }
  }

  return consistent;
}

function detectNamingPattern(filename) {
  const baseName = path.basename(filename, path.extname(filename));
  if (/^[a-z][a-zA-Z0-9]*$/.test(baseName)) return 'camelCase';
  if (/^[a-z][a-z0-9_]*$/.test(baseName)) return 'snake_case';
  if (/^[a-z][a-z0-9-]*$/.test(baseName)) return 'kebab-case';
  return 'mixed';
}

/**
 * Detect basic security issues
 */
function detectSecurityIssues(content, filePath) {
  const issues = [];

  // Check for hardcoded secrets (basic patterns)
  const secretPatterns = [
    /password\s*=\s*['"][^'"]+['"]/i,
    /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
    /secret\s*=\s*['"][^'"]+['"]/i,
    /token\s*=\s*['"][^'"]+['"]/i,
    /aws[_-]?access[_-]?key/i,
    /private[_-]?key/i
  ];

  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      issues.push({
        type: 'potential_secret',
        file: path.basename(filePath),
        severity: 'high',
        message: 'Potential hardcoded secret detected'
      });
      break; // Only report once per file
    }
  }

  // Check for dangerous patterns
  if (/eval\s*\(/i.test(content)) {
    issues.push({
      type: 'dangerous_pattern',
      file: path.basename(filePath),
      severity: 'medium',
      message: 'Use of eval() detected'
    });
  }

  return issues;
}

