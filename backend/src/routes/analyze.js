import express from 'express';
import { analyzeRepository } from '../services/analysisService.js';
import { validateGitHubUrl } from '../utils/validators.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { repoUrl } = req.body;

    if (!repoUrl) {
      return res.status(400).json({ error: 'repoUrl is required' });
    }

    // Validate GitHub URL
    const validation = validateGitHubUrl(repoUrl);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Analyze repository
    const result = await analyzeRepository(repoUrl);

    res.json(result);
  } catch (error) {
    // Handle specific error types
    if (error.status === 404) {
      return res.status(404).json({ error: 'Repository not found or is private' });
    }
    if (error.status === 403) {
      return res.status(403).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    next(error);
  }
});

export default router;

