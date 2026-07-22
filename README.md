# Web3 AI Portfolio

An AI-powered Web3 portfolio analytics platform that connects to a user's wallet, retrieves multi-chain blockchain assets, calculates portfolio metrics, and uses AWS Bedrock to generate intelligent portfolio insights.

Built to explore the intersection of:

* Web3
* Blockchain APIs
* Full Stack Development
* AWS Cloud Services
* Generative AI
* AI-powered financial data analysis

---

## 🚀 Project Overview

Web3 AI Portfolio allows users to connect their cryptocurrency wallet and receive an automated analysis of their digital assets.

The platform currently:

1. Connects to a user's Web3 wallet
2. Retrieves blockchain assets using Alchemy
3. Detects ERC-20 token balances
4. Retrieves token market prices
5. Calculates portfolio value and allocation
6. Analyzes portfolio concentration and diversification
7. Uses Amazon Bedrock to generate AI-powered insights
8. Stores AI analysis history in Amazon DynamoDB
9. Displays portfolio data through a modern React dashboard

---

## 🏗️ Current Architecture

```text
┌───────────────────────┐
│      React Frontend   │
│                       │
│  Wallet Connection    │
│  Portfolio Dashboard  │
│  AI Insights UI       │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     Node.js API       │
│       Express         │
│                       │
│ Portfolio Services    │
│ AI Analysis Services  │
│ History Services      │
└───────────┬───────────┘
            │
     ┌──────┼──────────┐
     │      │          │
     ▼      ▼          ▼
┌────────┐ ┌────────┐ ┌──────────────┐
│Alchemy │ │Market  │ │AWS Bedrock  │
│        │ │Prices  │ │              │
│Web3    │ │        │ │Generative AI │
│Data    │ │Pricing │ │Analysis      │
└────────┘ └────────┘ └──────┬───────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Amazon DynamoDB  │
                    │                  │
                    │ Analysis History │
                    └──────────────────┘
```

---

# ✨ Features

## 🔗 Web3 Wallet Integration

Users can connect their Web3 wallet and use their wallet address as the source of portfolio data.

The application supports:

* Wallet connection
* Wallet address detection
* Connected/disconnected states
* Automatic portfolio loading

---

## 📊 Multi-Chain Portfolio Tracking

The backend retrieves blockchain portfolio information and transforms raw blockchain data into structured portfolio data.

The system tracks:

* Native blockchain assets
* ERC-20 tokens
* Token balances
* Token prices
* Asset values
* Portfolio allocation
* Blockchain networks

---

## 💰 Portfolio Valuation

The system calculates:

```text
Token Balance
      ×
Token Price
      =
Asset Value
```

Example:

```text
TRU
Balance: 11,000

Price:
$0.01

Value:
$110
```

The portfolio summary includes:

```text
Total Portfolio Value
Total Assets
Total Blockchain Networks
24-Hour Change
```

---

## 🤖 AI-Powered Portfolio Analysis

Amazon Bedrock is used to generate intelligent explanations of the portfolio.

The AI analyzes:

* Asset concentration
* Portfolio diversification
* Blockchain network exposure
* Portfolio composition
* Performance changes
* Potential risk patterns

Example:

```json
{
  "summary": "The portfolio is highly concentrated in a single asset and blockchain network.",

  "riskLevel": "high",

  "insights": [
    {
      "type": "risk",
      "title": "High Asset Concentration",
      "description": "A single asset represents the majority of the portfolio value.",
      "severity": "warning"
    }
  ]
}
```

The system is designed to provide analytical information rather than direct financial advice.

---

## 🧠 Structured AI Responses

Instead of returning plain text, the AI generates structured data:

```text
AWS Bedrock
     ↓
AI Response
     ↓
JSON Parsing
     ↓
Validation
     ↓
React UI
```

This allows the frontend to dynamically render:

* Risk levels
* Insight categories
* Severity indicators
* Portfolio summaries

---

## ☁️ AWS Cloud Integration

The project currently uses:

### Amazon Bedrock

Used for:

* Generative AI portfolio analysis
* Structured AI insight generation
* Portfolio explanation

### Amazon DynamoDB

Used for:

* Saving AI analysis history
* Retrieving historical analyses
* Tracking portfolio analysis over time

Current DynamoDB data model:

```text
Partition Key:
walletAddress

Attributes:
analyzedAt
summary
riskLevel
insights
generatedAt
```

---

## ⚡ AI Analysis Caching

The backend currently includes an in-memory cache to avoid unnecessary repeated AI requests.

```text
Request
   ↓
Check Cache
   ↓
┌──────────────┐
│ Cache Exists │
└──────┬───────┘
       │
   Yes │ No
       │
Return  Call
Cache   Bedrock
          ↓
       Save Cache
```

This reduces:

* AI API calls
* Response time
* Unnecessary processing

The current cache is in-memory and is planned to be replaced with a persistent distributed cache in the future.

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* React Query
* Wagmi
* Viem
* CSS

## Backend

* Node.js
* TypeScript
* Express
* REST API

## Web3

* Ethereum-compatible networks
* ERC-20 token standards
* Alchemy APIs
* Wallet integration

## AI

* Amazon Bedrock
* Amazon Nova Lite
* Structured LLM responses
* AI portfolio analysis

## AWS

* Amazon Bedrock
* Amazon DynamoDB
* IAM
* AWS SDK for JavaScript v3

## Development Tools

* Git
* GitHub
* npm
* Postman
* VS Code

---

# 📁 Project Structure

```text
web3-ai-portfolio/
│
├── apps/
│   │
│   ├── api/
│   │   ├── src/
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── bedrock.ts
│   │   │   │   └── dynamodb.ts
│   │   │   │
│   │   │   ├── controllers/
│   │   │   │   └── portfolio.controller.ts
│   │   │   │
│   │   │   ├── routes/
│   │   │   │   └── ai.routes.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── portfolio.service.ts
│   │   │   │   ├── ai.service.ts
│   │   │   │   ├── llm.service.ts
│   │   │   │   ├── ai-cache.service.ts
│   │   │   │   └── analysis-history.service.ts
│   │   │   │
│   │   │   └── types/
│   │   │       └── ai.ts
│   │   │
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── web/
│       │
│       ├── src/
│       │   ├── components/
│       │   │   └── portfolio/
│       │   │       ├── PortfolioSummary.tsx
│       │   │       ├── AssetTable.tsx
│       │   │       ├── AllocationChart.tsx
│       │   │       └── AIInsights.tsx
│       │   │
│       │   ├── pages/
│       │   │   └── Dashboard.tsx
│       │   │
│       │   └── lib/
│       │       └── api.ts
│       │
│       └── package.json
│
├── README.md
└── package.json
```

---

# 🔌 API Endpoints

## Get Portfolio

```http
GET /api/portfolio/:address
```

Returns:

```json
{
  "address": "0x...",

  "summary": {
    "totalValueUsd": 0,
    "totalAssets": 1,
    "totalNetworks": 1,
    "change24h": 0
  },

  "assets": []
}
```

---

## Generate AI Portfolio Analysis

```http
GET /api/ai/portfolio/:address
```

Returns:

```json
{
  "summary": "...",

  "riskLevel": "medium",

  "insights": [],

  "generatedAt": "2026-07-22T..."
}
```

---

## Get Analysis History

```http
GET /api/ai/portfolio/:address/history
```

Returns previous AI analyses stored in DynamoDB.

---

## Portfolio Update Stream

```http
GET /api/portfolio/:address/stream
```

Sends a real-time server-sent event stream of portfolio updates.

Each event includes the latest portfolio data for the requested wallet address.

---

# 🔐 Environment Variables

Create:

```text
apps/api/.env
```

Example:

```env
ALCHEMY_API_KEY=

COINGECKO_API_KEY=

AWS_REGION=us-east-1

AWS_ACCESS_KEY_ID=

AWS_SECRET_ACCESS_KEY=

BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

Never commit real credentials.

---

# ▶️ Running Locally

## Clone the Repository

```bash
git clone https://github.com/cruzerblade95/web3-ai-portfolio.git
cd web3-ai-portfolio
```

## Install Dependencies

```bash
npm install
```

Install backend dependencies:

```bash
cd apps/api
npm install
```

Install frontend dependencies:

```bash
cd ../web
npm install
```

---

## Start the API

```bash
cd apps/api
npm run dev
```

API:

```text
http://localhost:3001
```

---

## Start the Frontend

```bash
cd apps/web
npm run dev
```

---

# 📈 Development Progress

## Phase 1 — Foundation

* [x] Project structure
* [x] React frontend
* [x] Node.js API
* [x] TypeScript configuration
* [x] REST API foundation

## Phase 2 — Web3 Integration

* [x] Wallet connection
* [x] Wallet address detection
* [x] Blockchain balance retrieval
* [x] ERC-20 token detection
* [x] Multi-chain portfolio structure

## Phase 3 — Portfolio Analytics

* [x] Asset normalization
* [x] Token balance calculation
* [x] Token price retrieval
* [x] Portfolio value calculation
* [x] Portfolio summary
* [x] Allocation visualization
* [x] Asset table

## Phase 4 — AI Integration

* [x] AWS IAM configuration
* [x] Amazon Bedrock integration
* [x] Amazon Nova Lite integration
* [x] AI portfolio summaries
* [x] Structured JSON AI responses
* [x] Risk-level generation
* [x] Dynamic portfolio insights

## Phase 5 — Data Persistence

* [x] DynamoDB table
* [x] Save AI analysis history
* [x] Retrieve analysis history
* [x] Wallet-based history queries

## Phase 6 — Performance

* [x] In-memory AI caching
* [x] React Query caching
* [x] Manual AI refresh

---

# 🗺️ Future Roadmap

## Phase 7 — Production Caching

* [x] Redis / ElastiCache production cache support implemented

Replace the current in-memory cache:

```text
Current:

Node.js Memory
      ↓
Cache
```

With:

```text
Production:

Node.js
   ↓
Redis / ElastiCache
   ↓
Shared Cache
```

This repository now includes optional Redis caching for AI analysis using `REDIS_URL`.
If Redis is unavailable, the backend falls back to the existing in-memory cache.

Benefits:

* Shared cache across multiple API servers
* Persistent cache
* Better scalability
* Reduced Bedrock costs

---

## Phase 8 — Real-Time Portfolio Updates

* [x] Server-Sent Events portfolio streaming implemented

Add:

* WebSocket support
* Server-Sent Events
* Blockchain event monitoring

Architecture:

```text
Blockchain Events
       ↓
Event Listener
       ↓
Backend
       ↓
WebSocket / SSE
       ↓
React Dashboard
```

The portfolio could update automatically when users:

* Receive tokens
* Transfer tokens
* Swap assets
* Interact with DeFi protocols

---

## Phase 9 — DeFi Analytics

Add support for:

* Liquidity pools
* Staking
* Lending
* Borrowing
* Yield farming
* LP positions

Potential analysis:

```text
Total Portfolio
      │
      ├── Wallet Assets
      ├── DeFi Positions
      ├── Staking
      └── Liquidity Pools
```

---

## Phase 10 — RAG-Powered AI

Introduce a Retrieval-Augmented Generation architecture:

```text
Blockchain Data
       ↓
Portfolio Data
       ↓
Embeddings
       ↓
Vector Database
       ↓
Relevant Context
       ↓
AWS Bedrock
       ↓
AI Analysis
```

Potential knowledge sources:

* Token documentation
* Protocol documentation
* Smart contract information
* DeFi protocol data
* Historical portfolio analysis

---

## Phase 11 — AI Agent Architecture

Transform the AI assistant into an agentic system.

Example:

```text
User
 ↓
AI Agent
 ↓
┌────────────────────┐
│ Portfolio Tool     │
│ Price Tool         │
│ Blockchain Tool    │
│ History Tool       │
│ Risk Tool          │
└────────────────────┘
 ↓
AI Response
```

The AI agent could:

* Retrieve wallet balances
* Analyze portfolio changes
* Compare historical snapshots
* Explain token movements
* Identify concentration risks
* Answer questions about portfolio data

Example:

```text
User:
"Why did my portfolio value change this week?"

AI Agent:
1. Retrieves historical portfolio data
2. Compares asset prices
3. Calculates value changes
4. Identifies the main contributor
5. Explains the result
```

---

## Phase 12 — Infrastructure as Code

Add:

* AWS CDK
* AWS SAM
* Terraform

The entire infrastructure should eventually be deployable using:

```bash
npm run deploy
```

Infrastructure could include:

```text
AWS CDK
  │
  ├── Lambda
  ├── API Gateway
  ├── DynamoDB
  ├── Bedrock Permissions
  ├── CloudWatch
  └── IAM
```

---

## Phase 13 — Serverless Architecture

The current architecture:

```text
React
  ↓
Express API
  ↓
Node.js Server
```

Future architecture:

```text
React
  ↓
API Gateway
  ↓
AWS Lambda
  ↓
┌───────────────┐
│ DynamoDB      │
│ Bedrock       │
│ Alchemy       │
└───────────────┘
```

Benefits:

* Auto-scaling
* Pay-per-use
* Reduced infrastructure management
* AWS-native architecture

---

## Phase 14 — Security Improvements

Future security improvements:

* IAM least-privilege policies
* AWS Secrets Manager
* API rate limiting
* Request validation
* Input sanitization
* CORS restrictions
* API authentication
* Wallet signature verification
* CloudWatch monitoring
* AWS WAF

---

## Phase 15 — Testing

Add automated testing:

### Backend

* Unit tests
* Integration tests
* API tests

### Frontend

* Component tests
* React Testing Library
* End-to-end testing

Potential tools:

```text
Jest
Vitest
Playwright
Cypress
Postman
```

---

# 🎯 Project Goals

The long-term goal is to build a production-ready AI-powered Web3 analytics platform that combines:

```text
Web3
 +
Cloud Computing
 +
Generative AI
 +
Data Engineering
 +
Full Stack Development
```

The project is being developed incrementally to demonstrate real-world engineering practices including:

* API design
* Cloud architecture
* IAM security
* Blockchain data integration
* AI integration
* Data persistence
* Caching
* Scalable system design

---

# 👨‍💻 Developer

Built by **Nabil Ajwad**.

Full Stack Software Engineer interested in:

* Full Stack Development
* React
* TypeScript
* Node.js
* AWS
* Generative AI
* Blockchain
* Web3
* Flutter

---

## 📫 Connect

* GitHub: https://github.com/cruzerblade95
* Portfolio: https://mybc.tech/cruzerblade95

---

## ⭐ Project Status

🚧 **Active Development**

This project is continuously evolving with new Web3, AWS, AI, and full-stack capabilities.

More features are planned as the architecture progresses toward a scalable production-ready platform.
