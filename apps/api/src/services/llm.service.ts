import {
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

import {
  bedrockClient,
  bedrockModelId,
} from '../config/bedrock.js';

interface PortfolioPromptData {
  summary: {
    totalValueUsd: number;
    totalAssets: number;
    totalNetworks: number;
    change24h: number;
  };

  assets: {
    symbol: string;
    name: string;
    network: string;
    balance: number;
    priceUsd: number;
    valueUsd: number;
    change24h: number;
  }[];
}

export async function generatePortfolioExplanation(
  portfolio: PortfolioPromptData,
): Promise<{
  summary: string;

  riskLevel:
    | 'low'
    | 'medium'
    | 'high';

  insights: {
    type:
      | 'allocation'
      | 'diversification'
      | 'risk'
      | 'performance'
      | 'general';

    title: string;

    description: string;

    severity:
      | 'info'
      | 'warning'
      | 'positive';
  }[];
}> {
  const portfolioData =
    JSON.stringify(
      portfolio,
      null,
      2,
    );


  const prompt = `
    You are a Web3 portfolio analysis assistant.

    Analyze the following cryptocurrency portfolio data.

    PORTFOLIO DATA:
    ${portfolioData}

    Return ONLY valid JSON.

    The JSON must follow this exact structure:

    {
    "summary": "A concise summary of the portfolio.",
    "riskLevel": "low",
    "insights": [
        {
        "type": "allocation",
        "title": "Short insight title",
        "description": "Detailed explanation.",
        "severity": "info"
        }
    ]
    }

    Rules:

    1. riskLevel must be exactly one of:
    "low", "medium", or "high".

    2. type must be exactly one of:
    "allocation",
    "diversification",
    "risk",
    "performance",
    "general".

    3. severity must be exactly one of:
    "info",
    "warning",
    "positive".

    4. Do not invent assets or values.

    5. Do not provide direct financial advice.

    6. Do not tell the user to buy or sell assets.

    7. Keep the summary under 100 words.

    8. Generate between 2 and 5 useful insights.

    Return JSON only.
    `;


  const requestBody = {
    messages: [
      {
        role: 'user',

        content: [
          {
            text: prompt,
          },
        ],
      },
    ],

    inferenceConfig: {
      maxTokens: 500,

      temperature: 0.3,
    },
  };


  const command =
    new InvokeModelCommand({
      modelId:
        bedrockModelId,

      contentType:
        'application/json',

      accept:
        'application/json',

      body:
        JSON.stringify(
          requestBody,
        ),
    });


  const response =
    await bedrockClient.send(
      command,
    );


  const responseBody =
    JSON.parse(
      new TextDecoder().decode(
        response.body,
      ),
    );


  const text =
    extractNovaText(
        responseBody,
    );

    return parseAIResponse(
    text,
    );
}

function extractNovaText(
  response: any,
): string {
  return (
    response.output
      ?.message
      ?.content
      ?.map(
        (
          item: {
            text?: string;
          },
        ) =>
          item.text ?? '',
      )
      .join(' ')
      .trim() ??
    'Unable to generate AI explanation.'
  );
}

function parseAIResponse(
  text: string,
): {
  summary: string;

  riskLevel:
    | 'low'
    | 'medium'
    | 'high';

  insights: {
    type:
      | 'allocation'
      | 'diversification'
      | 'risk'
      | 'performance'
      | 'general';

    title: string;

    description: string;

    severity:
      | 'info'
      | 'warning'
      | 'positive';
  }[];
} {
  const cleanedText =
    text
      .replace(
        /```json/g,
        '',
      )
      .replace(
        /```/g,
        '',
      )
      .trim();


  const parsed =
    JSON.parse(
      cleanedText,
    );


  return parsed;
}