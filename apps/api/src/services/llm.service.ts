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
): Promise<string> {
  const portfolioData =
    JSON.stringify(
      portfolio,
      null,
      2,
    );


  const prompt = `
You are a Web3 portfolio analysis assistant.

Analyze the following cryptocurrency portfolio data.

Portfolio data:

${portfolioData}

Provide a concise and professional explanation.

Your response should:

1. Summarize the overall portfolio.
2. Identify the largest holdings.
3. Mention portfolio concentration.
4. Mention blockchain network diversification.
5. Highlight notable changes or observations.

Do not invent data.

Do not provide direct financial advice.

Do not tell the user to buy or sell any asset.

Keep the response under 250 words.
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


  return extractNovaText(
    responseBody,
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