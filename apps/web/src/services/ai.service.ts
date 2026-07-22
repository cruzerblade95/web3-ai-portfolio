import axios from 'axios';

const API_URL =
  'http://localhost:3001';


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

  insights:
    PortfolioInsight[];

  generatedAt: string;
}


export async function getAIAnalysis(
  address: string,
): Promise<AIAnalysis> {
  const response =
    await axios.get<AIAnalysis>(
      `${API_URL}/api/ai/portfolio/${address}`,
    );

  return response.data;
}