import type {
  PortfolioData,
} from '../types/portfolio.js';

export function getPortfolio(
  address: string,
): PortfolioData {
  return {
    address,

    summary: {
      totalValueUsd: 12450.23,
      totalAssets: 3,
      totalNetworks: 3,
      change24h: 3.42,
    },

    assets: [
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        network: 'Ethereum',
        balance: 1.25,
        priceUsd: 3200,
        valueUsd: 4000,
        change24h: 2.45,
      },

      {
        id: 'usdc',
        symbol: 'USDC',
        name: 'USD Coin',
        network: 'Base',
        balance: 2500,
        priceUsd: 1,
        valueUsd: 2500,
        change24h: 0.01,
      },

      {
        id: 'polygon',
        symbol: 'POL',
        name: 'Polygon',
        network: 'Polygon',
        balance: 1200,
        priceUsd: 0.5,
        valueUsd: 600,
        change24h: -1.23,
      },
    ],
  };
}