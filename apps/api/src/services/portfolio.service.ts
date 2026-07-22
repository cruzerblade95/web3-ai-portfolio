import {
  alchemy,
} from '../config/alchemy.js';

import type {
  PortfolioData,
  PortfolioAsset,
} from '../types/portfolio.js';

export async function getPortfolio(
  address: string,
): Promise<PortfolioData> {
  const balances =
    await alchemy.core.getTokenBalances(
      address,
    );

  const nativeBalance =
    await alchemy.core.getBalance(address);

  const ethBalance = Number(
    nativeBalance.toString(),
  ) / 1e18;

  const assets: PortfolioAsset[] = [];

  if (ethBalance > 0) {
    assets.push({
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      network: 'Ethereum',
      balance: ethBalance,
      priceUsd: 0,
      valueUsd: 0,
      change24h: 0,
    });
  }

  const tokenBalances =
    balances.tokenBalances.filter(
      (token) =>
        token.tokenBalance !==
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    );

  for (
    const token of tokenBalances
  ) {
    assets.push({
      id: token.contractAddress,
      symbol: 'TOKEN',
      name: 'ERC-20 Token',
      network: 'Ethereum',
      balance: 0,
      priceUsd: 0,
      valueUsd: 0,
      change24h: 0,
    });
  }

  return {
    address,

    summary: {
      totalValueUsd: 0,
      totalAssets: assets.length,
      totalNetworks: assets.length > 0 ? 1 : 0,
      change24h: 0,
    },

    assets,
  };
}