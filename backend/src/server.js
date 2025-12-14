import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRoutes from './routes/analyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'YourRepo API',
    version: '1.0.0',
    endpoints: {
      'POST /api/analyze': 'Analyze a GitHub repository',
      'GET /health': 'Health check endpoint'
    },
    usage: {
      analyze: {
        method: 'POST',
        url: '/api/analyze',
        body: {
          repoUrl: 'https://github.com/owner/repo'
        }
      }
    }
  });
});

// Routes
app.use('/api/analyze', analyzeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

