import {
  PutCommand,

  QueryCommand,
} from '@aws-sdk/lib-dynamodb';


import {
  dynamoDb,

  ANALYSIS_TABLE_NAME,
} from '../config/dynamodb.js';


import type {
  AIAnalysis,
} from '../types/ai.js';

export interface AnalysisHistoryRecord
  extends AIAnalysis {
  walletAddress: string;

  analyzedAt: string;
}

export async function saveAnalysisHistory(
  walletAddress: string,

  analysis: AIAnalysis,
): Promise<void> {
  const record:
    AnalysisHistoryRecord = {
      walletAddress:
        walletAddress.toLowerCase(),

      analyzedAt:
        new Date().toISOString(),

      ...analysis,
    };


  await dynamoDb.send(
    new PutCommand({
      TableName:
        ANALYSIS_TABLE_NAME,

      Item:
        record,
    }),
  );
}

export async function getAnalysisHistory(
  walletAddress: string,
): Promise<
  AnalysisHistoryRecord[]
> {
  const response =
    await dynamoDb.send(
      new QueryCommand({
        TableName:
          ANALYSIS_TABLE_NAME,

        KeyConditionExpression:
          'walletAddress = :walletAddress',

        ExpressionAttributeValues: {
          ':walletAddress':
            walletAddress.toLowerCase(),
        },

        ScanIndexForward:
          false,
      }),
    );


  return (
    response.Items as
      AnalysisHistoryRecord[]
  ) ?? [];
}