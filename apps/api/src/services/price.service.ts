import {
  coinGeckoApi,
} from '../config/coingecko.js';

interface CoinGeckoPriceResponse {
  [key: string]: {
    usd?: number;
    usd_24h_change?: number;
  };
}

export async function getTokenPrices(
  tokenIds: string[],
): Promise<CoinGeckoPriceResponse> {
  if (tokenIds.length === 0) {
    return {};
  }

  const response =
    await coinGeckoApi.get<CoinGeckoPriceResponse>(
      '/simple/price',
      {
        params: {
          ids: tokenIds.join(','),
          vs_currencies: 'usd',
          include_24hr_change: true,
        },
      },
    );

  return response.data;
}