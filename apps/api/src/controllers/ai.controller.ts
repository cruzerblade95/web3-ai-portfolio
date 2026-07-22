import type {
  Request,
  Response,
} from 'express';

import {
  getPortfolio,
} from '../services/portfolio.service.js';

import {
  analyzePortfolio,
} from '../services/ai.service.js';

import {
  getCachedAnalysis,
  setCachedAnalysis,
} from '../services/ai-cache.service.js';

import {
  saveAnalysisHistory,
} from '../services/analysis-history.service.js';


export async function analyzePortfolioController(
  req: Request,
  res: Response,
) {
  const {
    address,
  } = req.params;


  if (
    typeof address !==
    'string'
  ) {
    return res.status(400).json({
      message:
        'Wallet address is required',
    });
  }


  try {
    const cachedAnalysis =
        getCachedAnalysis(
            address,
        );


        if (
        cachedAnalysis
        ) {
        return res.json(
            cachedAnalysis,
        );
        }


        const portfolio =
        await getPortfolio(
            address,
        );


        const analysis =
        await analyzePortfolio(
            portfolio,
        );

        await saveAnalysisHistory(
            address,

            analysis,
        );


        setCachedAnalysis(
        address,
        analysis,
        );


        return res.json(
        analysis,
        );
  } catch (
    error
  ) {
    console.error(
      'Failed to analyze portfolio:',
      error,
    );


    return res.status(500).json({
      message:
        'Failed to analyze portfolio',
    });
  }
}