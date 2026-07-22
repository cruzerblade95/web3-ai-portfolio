import type {
  PortfolioData,
} from '../types/portfolio.js';

import type {
  AIAnalysis,
  PortfolioInsight,
} from '../types/ai.js';


export function analyzePortfolio(
  portfolio: PortfolioData,
): AIAnalysis {
  const insights:
    PortfolioInsight[] = [];


  /*
   * 1. Calculate asset allocation
   */

  const totalValue =
    portfolio.summary.totalValueUsd;


  if (
    totalValue === 0
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
   * 2. Find the largest asset
   */

  const largestAsset =
    [...portfolio.assets]
      .sort(
        (
          a,
          b,
        ) =>
          b.valueUsd -
          a.valueUsd,
      )[0];


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
   * 3. Analyze network diversification
   */

  const networkCount =
    portfolio.summary.totalNetworks;


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
  } else {
    insights.push({
      type:
        'diversification',

      title:
        'Limited network diversification',

      description:
        `Your portfolio currently uses ${networkCount} blockchain network(s).`,

      severity:
        'info',
    });
  }


  /*
   * 4. Generate summary
   */

  const summary =
    largestAsset
      ? `Your portfolio is valued at approximately $${totalValue.toLocaleString(
          'en-US',
          {
            maximumFractionDigits: 2,
          },
        )}. Your largest holding is ${largestAsset.symbol}, and your assets are distributed across ${networkCount} blockchain network(s).`
      : 'Your portfolio does not currently contain enough data for analysis.';


  return {
    summary,

    insights,

    generatedAt:
      new Date().toISOString(),
  };
}