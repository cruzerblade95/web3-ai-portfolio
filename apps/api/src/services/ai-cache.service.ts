import { createClient, type RedisClientType } from 'redis';
import type {
  AIAnalysis,
} from '../types/ai.js';


interface CacheEntry {
  analysis: AIAnalysis;

  expiresAt: number;
}


const inMemoryCache =
  new Map<
    string,
    CacheEntry
  >();

const REDIS_URL =
  process.env.REDIS_URL;

const CACHE_DURATION_SECONDS =
  Number(
    process.env.REDIS_CACHE_TTL_SECONDS ??
      300,
  );

const CACHE_DURATION_MS =
  CACHE_DURATION_SECONDS *
  1000;

let redisClient: RedisClientType | null =
  null;
let redisAvailable =
  Boolean(REDIS_URL);

async function getRedisClient(): Promise<RedisClientType | null> {
  if (
    !redisAvailable ||
    !REDIS_URL
  ) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({
      url: REDIS_URL,
    });

    redisClient.on(
      'error',
      (error) => {
        console.error(
          'Redis cache error:',
          error,
        );
        redisAvailable = false;
      },
    );

    await redisClient.connect();

    console.log(
      'AI cache: connected to Redis',
    );

    return redisClient;
  } catch (error) {
    console.error(
      'AI cache: failed to connect to Redis, falling back to in-memory cache',
      error,
    );
    redisAvailable = false;

    return null;
  }
}

export async function getCachedAnalysis(
  address: string,
): Promise<AIAnalysis | null> {
  const key = address.toLowerCase();

  const redis = await getRedisClient();

  if (redis) {
    try {
      const cached = await redis.get(key);

      if (
        !cached
      ) {
        return null;
      }

      return JSON.parse(
        cached,
      ) as AIAnalysis;
    } catch (error) {
      console.error(
        'AI cache: failed to read from Redis, falling back to memory cache',
        error,
      );
      redisAvailable = false;
    }
  }

  const entry =
    inMemoryCache.get(
      key,
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
    inMemoryCache.delete(
      key,
    );

    return null;
  }

  return entry.analysis;
}

export async function setCachedAnalysis(
  address: string,
  analysis: AIAnalysis,
): Promise<void> {
  const key = address.toLowerCase();

  const redis = await getRedisClient();

  if (redis) {
    try {
      await redis.set(
        key,
        JSON.stringify(
          analysis,
        ),
        {
          EX:
            CACHE_DURATION_SECONDS,
        },
      );

      return;
    } catch (error) {
      console.error(
        'AI cache: failed to write to Redis, falling back to memory cache',
        error,
      );
      redisAvailable = false;
    }
  }

  inMemoryCache.set(
    key,
    {
      analysis,

      expiresAt:
        Date.now() +
        CACHE_DURATION_MS,
    },
  );
}