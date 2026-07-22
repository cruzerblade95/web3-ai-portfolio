import {
  Router,
} from 'express';

import {
  analyzePortfolioController,
} from '../controllers/ai.controller.js';

import {
  saveAnalysisHistory,
  getAnalysisHistory,
} from '../services/analysis-history.service.js';

const router =
  Router();


router.get(
  '/portfolio/:address',
  analyzePortfolioController,
);

router.get(
  '/portfolio/:address/history',

  async (
    req,

    res,
  ) => {
    try {
      const {
        address,
      } =
        req.params;


      const history =
        await getAnalysisHistory(
          address,
        );


      return res.json(
        history,
      );
    } catch (
      error
    ) {
      console.error(
        error,
      );


      return res
        .status(500)
        .json({
          message:
            'Failed to fetch analysis history',
        });
    }
  },
);


export default router;
