import {
  Router,
} from 'express';

import {
  analyzePortfolioController,
} from '../controllers/ai.controller.js';


const router =
  Router();


router.get(
  '/portfolio/:address',
  analyzePortfolioController,
);


export default router;