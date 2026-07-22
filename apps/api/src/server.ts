import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js';

import portfolioRoutes from './routes/portfolio.routes.js';

const app = express();

const PORT = 3001;

app.use(cors());

app.use(express.json());

app.get(
  '/health',
  (_req, res) => {
    res.json({
      status: 'ok',
      service: 'web3-ai-portfolio-api',
    });
  },
);

app.use(
  '/api/portfolio',
  portfolioRoutes,
);

app.use(
  '/api/ai',
  aiRoutes,
);

app.listen(
  PORT,
  () => {
    console.log(
      `API server running on http://localhost:${PORT}`,
    );
  },
);