import type {
  PortfolioData,
} from '../types/portfolio.js';

import type {
  AIAnalysis,
  PortfolioInsight,
} from '../types/ai.js';

import {
  generatePortfolioExplanation,
} from './llm.service.js';

export async function analyzePortfolio(
  portfolio: PortfolioData,
): Promise<AIAnalysis> {
  const insights:
    PortfolioInsight[] = [];


  const totalValue =
    portfolio.summary.totalValueUsd;


  /*
   * No portfolio value
   */

  if (
    totalValue <= 0
  ) {
    return {
      summary:
        'There is not enough portfolio value data to generate an analysis.',

      insights: [],

      generatedAt:
        new Date().toISOString(),
    };
  }


  /*
   * Sort assets by value
   */

  const sortedAssets =
    [...portfolio.assets]
      .sort(
        (
          a,
          b,
        ) =>
          b.valueUsd -
          a.valueUsd,
      );


  const largestAsset =
    sortedAssets[0];


  /*
   * Calculate largest asset allocation
   */

  if (
    largestAsset
  ) {
    const allocation =
      (
        largestAsset.valueUsd /
        totalValue
      ) * 100;


    if (
      allocation >= 70
    ) {
      insights.push({
        type:
          'risk',

        title:
          'High asset concentration',

        description:
          `${largestAsset.symbol} represents ${allocation.toFixed(1)}% of your portfolio value.`,

        severity:
          'warning',
      });
    } else {
      insights.push({
        type:
          'allocation',

        title:
          'Largest portfolio asset',

        description:
          `${largestAsset.symbol} represents ${allocation.toFixed(1)}% of your portfolio value.`,

        severity:
          'info',
      });
    }
  }


  /*
   * Analyze network diversification
   */

  const networkCount =
    new Set(
      portfolio.assets.map(
        (
          asset,
        ) =>
          asset.network,
      ),
    ).size;


  if (
    networkCount >= 3
  ) {
    insights.push({
      type:
        'diversification',

      title:
        'Multi-chain portfolio',

      description:
        `Your portfolio is distributed across ${networkCount} blockchain networks.`,

      severity:
        'positive',
    });
  } else if (
    networkCount === 1
  ) {
    insights.push({
      type:
        'diversification',

      title:
        'Single-network portfolio',

      description:
        'All tracked assets are currently held on a single blockchain network.',

      severity:
        'info',
    });
  } else {
    insights.push({
      type:
        'diversification',

      title:
        'Multi-network portfolio',

      description:
        `Your portfolio is distributed across ${networkCount} blockchain networks.`,

      severity:
        'positive',
    });
  }


  /*
   * Detect stablecoins
   */

  const stablecoinSymbols =
    [
      'USDC',
      'USDT',
      'DAI',
      'BUSD',
      'FDUSD',
      'TUSD',
    ];


  const stablecoinValue =
    portfolio.assets
      .filter(
        (
          asset,
        ) =>
          stablecoinSymbols.includes(
            asset.symbol.toUpperCase(),
          ),
      )
      .reduce(
        (
          total,
          asset,
        ) =>
          total +
          asset.valueUsd,

        0,
      );


  const stablecoinAllocation =
    (
      stablecoinValue /
      totalValue
    ) * 100;


  if (
    stablecoinAllocation > 0
  ) {
    insights.push({
      type:
        'allocation',

      title:
        'Stablecoin allocation',

      description:
        `Stablecoins represent ${stablecoinAllocation.toFixed(1)}% of your portfolio value.`,

      severity:
        'info',
    });
  }


  /*
   * Generate portfolio summary
   */

  const summary =
    largestAsset
      ? `Your portfolio is valued at approximately $${totalValue.toLocaleString(
          'en-US',
          {
            maximumFractionDigits: 2,
          },
        )}. Your largest holding is ${largestAsset.symbol}, representing ${(
          (largestAsset.valueUsd /
            totalValue) *
          100
        ).toFixed(1)}% of your total portfolio.`
      : 'Your portfolio does not currently contain enough data for analysis.';


      const aiSummary =
  await generatePortfolioExplanation(
    portfolio,
  );

  return {
    summary:
        aiSummary,

    insights,

    generatedAt:
      new Date().toISOString(),
  };
}