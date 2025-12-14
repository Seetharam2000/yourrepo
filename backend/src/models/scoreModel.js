/**
 * Score model and types
 */

export const SCORE_CATEGORIES = {
  CODE_QUALITY: 'codeQuality',
  STRUCTURE: 'structure',
  DOCUMENTATION: 'documentation',
  TESTING: 'testing',
  GIT_COLLABORATION: 'gitCollaboration',
  DEVOPS: 'devops'
};

export const SKILL_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};

/**
 * Calculate skill level from overall score
 * @param {number} score - Overall score (0-100)
 * @returns {string} Skill level
 */
export function getSkillLevel(score) {
  if (score >= 75) return SKILL_LEVELS.ADVANCED;
  if (score >= 50) return SKILL_LEVELS.INTERMEDIATE;
  return SKILL_LEVELS.BEGINNER;
}

/**
 * Create initial score object
 * @returns {Object} Score object with all categories
 */
export function createScoreObject() {
  return {
    overall: 0,
    categories: {
      [SCORE_CATEGORIES.CODE_QUALITY]: 0,
      [SCORE_CATEGORIES.STRUCTURE]: 0,
      [SCORE_CATEGORIES.DOCUMENTATION]: 0,
      [SCORE_CATEGORIES.TESTING]: 0,
      [SCORE_CATEGORIES.GIT_COLLABORATION]: 0,
      [SCORE_CATEGORIES.DEVOPS]: 0
    },
    maxScores: {
      [SCORE_CATEGORIES.CODE_QUALITY]: 25,
      [SCORE_CATEGORIES.STRUCTURE]: 15,
      [SCORE_CATEGORIES.DOCUMENTATION]: 15,
      [SCORE_CATEGORIES.TESTING]: 20,
      [SCORE_CATEGORIES.GIT_COLLABORATION]: 15,
      [SCORE_CATEGORIES.DEVOPS]: 10
    }
  };
}

