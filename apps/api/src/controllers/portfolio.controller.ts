import type {
  Request,
  Response,
} from 'express';

import { getPortfolio } from '../services/portfolio.service.js';

export function getPortfolioController(
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

  const portfolio = getPortfolio(address);

  return res.json(portfolio);
}