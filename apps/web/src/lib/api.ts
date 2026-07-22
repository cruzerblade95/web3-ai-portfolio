import type { PortfolioData } from '../types/portfolio';

const API_BASE_URL = 'http://localhost:3001';

export async function fetchPortfolio(
  address: string,
): Promise<PortfolioData> {
  const response = await fetch(
    `${API_BASE_URL}/api/portfolio/${address}`,
  );

  if (!response.ok) {
    throw new Error(
      'Failed to fetch portfolio data',
    );
  }

  return response.json();
}