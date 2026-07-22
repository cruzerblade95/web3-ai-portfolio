import type {
  Request,
  Response,
} from 'express';

import {
  getPortfolio,
} from '../services/portfolio.service.js';

export async function getPortfolioController(
  req: Request,
  res: Response,
) {
  const { address } = req.params;

  if (
    typeof address !== 'string' ||
    address.length === 0
  ) {
    return res.status(400).json({
      message: 'Wallet address is required',
    });
  }

  try {
    const portfolio =
      await getPortfolio(address);

    return res.json(portfolio);
  } catch (error) {
    console.error(
      'Failed to fetch portfolio:',
      error,
    );

    return res.status(500).json({
      message:
        'Failed to fetch portfolio data',
    });
  }
}