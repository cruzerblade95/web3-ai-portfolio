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
  const address = req.params.address;

  if (
    Array.isArray(address) ||
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

export async function subscribePortfolioUpdatesController(
  req: Request,
  res: Response,
) {
  const maybeAddress = req.params.address;

  if (
    Array.isArray(maybeAddress) ||
    typeof maybeAddress !== 'string' ||
    maybeAddress.length === 0
  ) {
    return res.status(400).json({
      message: 'Wallet address is required',
    });
  }

  const address = maybeAddress;

  res.setHeader(
    'Content-Type',
    'text/event-stream',
  );
  res.setHeader(
    'Cache-Control',
    'no-cache',
  );
  res.setHeader(
    'Connection',
    'keep-alive',
  );

  res.flushHeaders?.();

  let isOpen = true;

  async function sendPortfolioUpdate() {
    if (!isOpen) {
      return;
    }

    try {
      const portfolio =
        await getPortfolio(address);

      res.write(
        `event: portfolio-update\n` +
          `data: ${JSON.stringify(
            portfolio,
          )}\n\n`,
      );
    } catch (error) {
      console.error(
        'Portfolio stream error:',
        error,
      );

      res.write(
        `event: error\n` +
          `data: ${JSON.stringify({
            message:
              'Unable to fetch portfolio updates',
          })}\n\n`,
      );
    }
  }

  const interval = setInterval(
    sendPortfolioUpdate,
    10000,
  );

  req.on('close', () => {
    isOpen = false;
    clearInterval(interval);
    res.end();
  });

  await sendPortfolioUpdate();
}