import {
  alchemy,
} from '../config/alchemy.js';

import type {
  PortfolioData,
  PortfolioAsset,
} from '../types/portfolio.js';

import {
  getTokenPrices,
} from './price.service.js';

import {
  tokenPriceMap,
} from './token-price-map.js';

function formatTokenBalance(
  rawBalance: string,
  decimals: number,
): number {
  const balance =
    BigInt(rawBalance);

  const divisor =
    10n ** BigInt(decimals);

  const wholePart =
    balance / divisor;

  const fractionalPart =
    balance % divisor;

  const fractionalString =
    fractionalPart
      .toString()
      .padStart(decimals, '0');

  return Number(
    `${wholePart}.${fractionalString}`,
  );
}

export async function getPortfolio(
  address: string,
): Promise<PortfolioData> {
  const assets: PortfolioAsset[] = [];

  /*
   * Fetch native ETH balance
   */

  const nativeBalance =
    await alchemy.core.getBalance(address);

  const ethBalance =
    Number(
      nativeBalance.toString(),
    ) / 1e18;

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

  /*
   * Fetch ERC-20 token balances
   */

  const balances =
    await alchemy.core.getTokenBalances(
      address,
    );

  const tokenBalances =
  balances.tokenBalances.filter(
    (
      token,
    ): token is typeof token & {
      tokenBalance: string;
    } =>
      typeof token.tokenBalance === 'string' &&
      token.tokenBalance !==
        '0x0000000000000000000000000000000000000000000000000000000000000000',
  );

  /*
   * Fetch metadata for each token
   */

  for (
    const token of tokenBalances
  ) {
    try {
      const metadata =
        await alchemy.core.getTokenMetadata(
          token.contractAddress,
        );

      const decimals =
        metadata.decimals ?? 18;

      const balance =
        formatTokenBalance(
          token.tokenBalance,
          decimals,
        );

      assets.push({
        id: token.contractAddress,

        symbol:
          metadata.symbol ??
          'UNKNOWN',

        name:
          metadata.name ??
          'Unknown Token',

        network: 'Ethereum',

        balance,

        priceUsd: 0,

        valueUsd: 0,

        change24h: 0,
      });
    } catch (error) {
      console.error(
        `Failed to fetch metadata for ${token.contractAddress}`,
        error,
      );
    }
  }

  const priceIds = assets
    .map(
        (asset) =>
        tokenPriceMap[asset.symbol],
    )
    .filter(
        (
        id,
        ): id is string =>
        Boolean(id),
    );

    const prices =
    await getTokenPrices(priceIds);

    const pricedAssets =
    assets.map((asset) => {
        const priceId =
        tokenPriceMap[asset.symbol];

        const priceData =
        priceId
            ? prices[priceId]
            : undefined;

        const priceUsd =
        priceData?.usd ?? 0;

        const valueUsd =
        asset.balance * priceUsd;

        return {
        ...asset,

        priceUsd,

        valueUsd,

        change24h:
            priceData?.usd_24h_change ?? 0,
        };
    });

    const totalValueUsd =
    pricedAssets.reduce(
        (
        total,
        asset,
        ) =>
        total + asset.valueUsd,

        0,
    );

  return {
    address,

    summary: {
      totalValueUsd,

      totalAssets:
        pricedAssets.length,

      totalNetworks:
        pricedAssets.length > 0
          ? 1
          : 0,

      change24h: 0,
    },

    assets: pricedAssets,
  };
}