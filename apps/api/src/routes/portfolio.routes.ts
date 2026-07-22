import {
  Router,
} from 'express';

import {
  getPortfolioController,
  subscribePortfolioUpdatesController,
} from '../controllers/portfolio.controller.js';

const router = Router();

router.get(
  '/:address',
  getPortfolioController,
);

router.get(
  '/:address/stream',
  subscribePortfolioUpdatesController,
);

export default router;