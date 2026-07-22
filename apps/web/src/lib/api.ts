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

export interface PortfolioInsight {
  type:
    | 'allocation'
    | 'diversification'
    | 'risk'
    | 'general';

  title: string;

  description: string;

  severity:
    | 'info'
    | 'warning'
    | 'positive';
}


export interface AIAnalysis {
  summary: string;

  insights: PortfolioInsight[];

  generatedAt: string;
}


export async function fetchAIAnalysis(
  address: string,
): Promise<AIAnalysis> {
  const response =
    await fetch(
      `http://localhost:3001/api/ai/portfolio/${address}`,
    );


  if (!response.ok) {
    throw new Error(
      'Failed to fetch AI analysis',
    );
  }


  return response.json();
}