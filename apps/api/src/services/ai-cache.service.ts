import type {
  AIAnalysis,
} from '../types/ai.js';


interface CacheEntry {
  analysis: AIAnalysis;

  expiresAt: number;
}


const cache =
  new Map<
    string,
    CacheEntry
  >();


const CACHE_DURATION =
  1000 * 60 * 5;

export function getCachedAnalysis(
  address: string,
): AIAnalysis | null {
  const entry =
    cache.get(
      address.toLowerCase(),
    );


  if (
    !entry
  ) {
    return null;
  }


  if (
    Date.now() >
    entry.expiresAt
  ) {
    cache.delete(
      address.toLowerCase(),
    );

    return null;
  }


  return entry.analysis;
}

export function setCachedAnalysis(
  address: string,
  analysis: AIAnalysis,
): void {
  cache.set(
    address.toLowerCase(),
    {
      analysis,

      expiresAt:
        Date.now() +
        CACHE_DURATION,
    },
  );
}