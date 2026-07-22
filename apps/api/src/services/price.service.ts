import axios from 'axios';
import {
  coinGeckoApi,
} from '../config/coingecko.js';

interface CoinGeckoPriceResponse {
  [key: string]: {
    usd?: number;
    usd_24h_change?: number;
  };
}

interface PriceCacheEntry {
  expiresAt: number;
  data: CoinGeckoPriceResponse;
}

const PRICE_CACHE_TTL_MS =
  Number(
    process.env.COINGECKO_PRICE_CACHE_TTL_MS ??
      '60000',
  );
const MAX_RETRY_ATTEMPTS =
  Number(
    process.env.COINGECKO_RETRY_ATTEMPTS ??
      '3',
  );
const INITIAL_RETRY_DELAY_MS = 500;

const priceCache =
  new Map<string, PriceCacheEntry>();

function getCacheKey(
  tokenIds: string[],
): string {
  return [...new Set(tokenIds)]
    .sort()
    .join(',');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

function isRetryableError(
  error: unknown,
): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (!status) {
      return true;
    }

    return (
      status === 429 ||
      (status >= 500 && status < 600)
    );
  }

  return false;
}

export async function getTokenPrices(
  tokenIds: string[],
): Promise<CoinGeckoPriceResponse> {
  if (tokenIds.length === 0) {
    return {};
  }

  const cacheKey = getCacheKey(tokenIds);
  const cached = priceCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  let attempt = 0;

  while (true) {
    try {
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

      const data = response.data;

      priceCache.set(cacheKey, {
        expiresAt: Date.now() + PRICE_CACHE_TTL_MS,
        data,
      });

      return data;
    } catch (error) {
      attempt += 1;

      if (attempt >= MAX_RETRY_ATTEMPTS || !isRetryableError(error)) {
        console.error('CoinGecko price fetch failed:', error);
        return {};
      }

      const delay = INITIAL_RETRY_DELAY_MS * 2 ** (attempt - 1);

      console.warn(
        `CoinGecko rate limit or server error, retrying (${attempt}/${MAX_RETRY_ATTEMPTS}) in ${delay}ms`,
        axios.isAxiosError(error) ? error.response?.status : undefined,
      );

      await sleep(delay);
    }
  }
}