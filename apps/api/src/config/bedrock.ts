import {
  BedrockRuntimeClient,
} from '@aws-sdk/client-bedrock-runtime';

const region =
  process.env.AWS_REGION ??
  'us-east-1';

export const bedrockClient =
  new BedrockRuntimeClient({
    region,
  });

export const bedrockModelId =
  process.env.BEDROCK_MODEL_ID ??
  'amazon.nova-lite-v1:0';