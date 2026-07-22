import {
  Router,
} from 'express';

import {
  getPortfolioController,
} from '../controllers/portfolio.controller.js';

const router = Router();

router.get(
  '/:address',
  getPortfolioController,
);

export default router;