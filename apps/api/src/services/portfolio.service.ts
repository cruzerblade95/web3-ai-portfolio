import {
  networks,
} from '../config/networks.js';

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


/**
 * Convert raw blockchain token balance
 * into a human-readable balance.
 *
 * Example:
 *
 * Raw balance: 2500000000
 * Decimals: 6
 *
 * Result:
 * 2500
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
      .padStart(
        decimals,
        '0',
      );

  return Number(
    `${wholePart}.${fractionalString}`,
  );
}


/**
 * Fetch all assets from one blockchain network.
 */
async function getChainAssets(
  client: typeof networks[number]['client'],
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
    await client.core.getBalance(
      address,
    );

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
   * 3. Filter out tokens with no balance
   *
   * We explicitly check the type of
   * tokenBalance to avoid TypeScript
   * implicit any/null errors.
   */

  const tokenBalances =
    balances.tokenBalances.filter(
      (token) =>
        typeof token.tokenBalance ===
          'string' &&
        token.tokenBalance !==
          '0x0000000000000000000000000000000000000000000000000000000000000000',
    );


  /*
   * 4. Fetch metadata for every token
   */

  for (
    const token of tokenBalances
  ) {
    /*
     * TypeScript safety check.
     *
     * Alchemy can technically return
     * tokenBalance as null.
     */

    if (
      typeof token.tokenBalance !==
      'string'
    ) {
      continue;
    }


    try {
      const metadata =
        await client.core.getTokenMetadata(
          token.contractAddress,
        );


      const decimals =
        metadata.decimals ??
        18;


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
    } catch (
      error
    ) {
      console.error(
        `Failed to fetch metadata for ${token.contractAddress}`,
        error,
      );
    }
  }


  return assets;
}


/**
 * Fetch the complete portfolio
 * across all configured networks.
 */
export async function getPortfolio(
  address: string,
): Promise<PortfolioData> {


  /*
   * 1. Fetch assets from all networks
   *
   * Promise.all() allows Ethereum,
   * Base, and Polygon to be queried
   * concurrently.
   */

  const chainAssets =
    await Promise.all(
      networks.map(
        (
          network,
        ) =>
          getChainAssets(
            network.client,
            network.name,
            network.nativeSymbol,
            address,
          ),
      ),
    );


  /*
   * 2. Flatten all network assets
   *
   * Before:
   *
   * [
   *   [Ethereum assets],
   *   [Base assets],
   *   [Polygon assets]
   * ]
   *
   * After:
   *
   * [
   *   Ethereum asset,
   *   Base asset,
   *   Polygon asset
   * ]
   */

  const assets =
    chainAssets.flat();


  /*
   * 3. Find CoinGecko price IDs
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
   * 4. Fetch prices
   */

  const prices =
    await getTokenPrices(
      priceIds,
    );


  /*
   * 5. Add prices and calculate
   *    individual asset values
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
   * 6. Calculate total portfolio value
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
   * 7. Count unique networks
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
   * 8. Calculate average 24-hour change
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
   * 9. Return final portfolio
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