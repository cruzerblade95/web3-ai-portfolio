import axios from 'axios';

const coingeckoHeaders =
  process.env.COINGECKO_API_KEY
    ? {
        'x-cg-pro-api-key':
          process.env.COINGECKO_API_KEY,
      }
    : undefined;

export const coinGeckoApi =
  axios.create({
    baseURL:
      'https://api.coingecko.com/api/v3',

    timeout: 10000,
    headers: coingeckoHeaders,
  });