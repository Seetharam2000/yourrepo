#!/usr/bin/env node

/**
 * CLI tool for YourRepo
 * Usage: node cli/repo-mirror.js analyze <github_url>
 */

import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:3001';

async function analyzeRepository(repoUrl) {
  try {
    console.log(`\n🔍 Analyzing repository: ${repoUrl}\n`);
    
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }

    const result = await response.json();

    // Display results
    console.log('='.repeat(60));
    console.log('ANALYSIS RESULTS');
    console.log('='.repeat(60));
    console.log(`\nRepository: ${result.repository.fullName}`);
    console.log(`Overall Score: ${result.scores.overall}/100`);
    console.log(`Level: ${result.scores.level}\n`);

    console.log('Category Scores:');
    console.log('-'.repeat(60));
    Object.entries(result.scores.categories).forEach(([key, score]) => {
      const maxScore = result.scores.maxScores[key];
      const categoryName = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      console.log(`${categoryName.padEnd(30)} ${score}/${maxScore}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`\n${result.summary}\n`);

    console.log('='.repeat(60));
    console.log('ROADMAP');
    console.log('='.repeat(60));
    
    const grouped = {
      'short-term': [],
      'mid-term': [],
      'long-term': []
    };

    result.roadmap.forEach(item => {
      if (grouped[item.priority]) {
        grouped[item.priority].push(item);
      }
    });

    Object.entries(grouped).forEach(([priority, items]) => {
      if (items.length > 0) {
        const label = priority === 'short-term' ? 'Short-term (1-3 days)' :
                      priority === 'mid-term' ? 'Mid-term (1-2 weeks)' :
                      'Long-term (1-2 months)';
        console.log(`\n${label}:`);
        items.forEach((item, index) => {
          console.log(`  ${index + 1}. [${item.category}] ${item.task} (${item.impact} impact)`);
        });
      }
    });

    if (result.growthProjection) {
      console.log('\n' + '='.repeat(60));
      console.log('GROWTH PROJECTION');
      console.log('='.repeat(60));
      console.log(`\n${result.growthProjection.message}\n`);
    }

    // Output JSON if requested
    if (process.argv.includes('--json')) {
      console.log('\n' + '='.repeat(60));
      console.log('JSON OUTPUT');
      console.log('='.repeat(60));
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Main CLI logic
const command = process.argv[2];
const repoUrl = process.argv[3];

if (command === 'analyze' && repoUrl) {
  analyzeRepository(repoUrl);
} else {
  console.log('Usage: node cli/repo-mirror.js analyze <github_url>');
  console.log('Example: node cli/repo-mirror.js analyze https://github.com/owner/repo');
  console.log('\nOptions:');
  console.log('  --json    Output full JSON result');
  process.exit(1);
}

