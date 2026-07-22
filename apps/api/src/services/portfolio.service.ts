import {
  ethereumAlchemy,
  baseAlchemy,
  polygonAlchemy,
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

type BlockchainClient =
  typeof ethereumAlchemy;

/**
 * Convert raw blockchain token balance
 * into a human-readable token balance.
 *
 * Example:
 *
 * Raw balance: 2500000000
 * Decimals: 6
 *
 * Result: 2500
 */
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

/**
 * Get all assets from one blockchain network.
 */
async function getChainAssets(
  client: BlockchainClient,
  networkName: string,
  nativeSymbol: string,
  address: string,
): Promise<PortfolioAsset[]> {
  const assets: PortfolioAsset[] = [];

  /*
   * 1. Get native token balance
   *
   * Ethereum → ETH
   * Base → ETH
   * Polygon → POL
   */

  const nativeBalance =
    await client.core.getBalance(address);

  const nativeBalanceFormatted =
    Number(
      nativeBalance.toString(),
    ) / 1e18;

  if (
    nativeBalanceFormatted > 0
  ) {
    assets.push({
      id:
        `${networkName}-native`,

      symbol:
        nativeSymbol,

      name:
        nativeSymbol === 'POL'
          ? 'Polygon'
          : 'Ethereum',

      network:
        networkName,

      balance:
        nativeBalanceFormatted,

      priceUsd:
        0,

      valueUsd:
        0,

      change24h:
        0,
    });
  }

  /*
   * 2. Get ERC-20 token balances
   */

  const balances =
    await client.core.getTokenBalances(
      address,
    );

  /*
   * 3. Remove tokens with zero/null balance
   */

  const tokenBalances =
    balances.tokenBalances.filter(
      (
        token,
      ): token is typeof token & {
        tokenBalance: string;
      } =>
        typeof token.tokenBalance ===
          'string' &&
        token.tokenBalance !==
          '0x0000000000000000000000000000000000000000000000000000000000000000',
    );

  /*
   * 4. Get metadata for each token
   */

  for (
    const token of tokenBalances
  ) {
    try {
      const metadata =
        await client.core.getTokenMetadata(
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
        id:
          `${networkName}-${token.contractAddress}`,

        symbol:
          metadata.symbol ??
          'UNKNOWN',

        name:
          metadata.name ??
          'Unknown Token',

        network:
          networkName,

        balance,

        priceUsd:
          0,

        valueUsd:
          0,

        change24h:
          0,
      });
    } catch (error) {
      console.error(
        `Failed to fetch metadata for ${token.contractAddress}`,
        error,
      );
    }
  }

  return assets;
}

/**
 * Get the complete multi-chain portfolio.
 */
export async function getPortfolio(
  address: string,
): Promise<PortfolioData> {
  /*
   * 1. Fetch Ethereum assets
   */

  const ethereumAssets =
    await getChainAssets(
      ethereumAlchemy,
      'Ethereum',
      'ETH',
      address,
    );

  /*
   * 2. Fetch Base assets
   */

  const baseAssets =
    await getChainAssets(
      baseAlchemy,
      'Base',
      'ETH',
      address,
    );

  /*
   * 3. Fetch Polygon assets
   */

  const polygonAssets =
    await getChainAssets(
      polygonAlchemy,
      'Polygon',
      'POL',
      address,
    );

  /*
   * 4. Combine all blockchain assets
   */

  const assets = [
    ...ethereumAssets,
    ...baseAssets,
    ...polygonAssets,
  ];

  /*
   * 5. Find CoinGecko IDs
   *
   * ETH → ethereum
   * USDC → usd-coin
   * POL → matic-network
   */

  const priceIds =
    assets
      .map(
        (
          asset,
        ) =>
          tokenPriceMap[
            asset.symbol
          ],
      )
      .filter(
        (
          id,
        ): id is string =>
          Boolean(id),
      );

  /*
   * 6. Fetch token prices
   */

  const prices =
    await getTokenPrices(
      priceIds,
    );

  /*
   * 7. Add prices and calculate values
   */

  const pricedAssets =
    assets.map(
      (
        asset,
      ) => {
        const priceId =
          tokenPriceMap[
            asset.symbol
          ];

        const priceData =
          priceId
            ? prices[priceId]
            : undefined;

        const priceUsd =
          priceData?.usd ??
          0;

        const valueUsd =
          asset.balance *
          priceUsd;

        return {
          ...asset,

          priceUsd,

          valueUsd,

          change24h:
            priceData
              ?.usd_24h_change ??
            0,
        };
      },
    );

  /*
   * 8. Calculate total portfolio value
   */

  const totalValueUsd =
    pricedAssets.reduce(
      (
        total,
        asset,
      ) =>
        total +
        asset.valueUsd,

      0,
    );

  /*
   * 9. Count unique networks
   */

  const totalNetworks =
    new Set(
      pricedAssets.map(
        (
          asset,
        ) =>
          asset.network,
      ),
    ).size;

  /*
   * 10. Calculate overall 24-hour change
   *
   * For now, we calculate the average
   * change of all assets.
   */

  const change24h =
    pricedAssets.length > 0
      ? pricedAssets.reduce(
          (
            total,
            asset,
          ) =>
            total +
            asset.change24h,

          0,
        ) /
        pricedAssets.length
      : 0;

  /*
   * 11. Return final portfolio
   */

  return {
    address,

    summary: {
      totalValueUsd,

      totalAssets:
        pricedAssets.length,

      totalNetworks,

      change24h,
    },

    assets:
      pricedAssets,
  };
}