import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';


import {
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';


const client =
  new DynamoDBClient({
    region:
      process.env.AWS_REGION ??
      'us-east-1',
  });


export const dynamoDb =
  DynamoDBDocumentClient.from(
    client,
  );


export const ANALYSIS_TABLE_NAME =
  'web3-ai-portfolio-analysis';