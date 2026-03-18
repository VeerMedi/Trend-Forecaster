# Trend Forecaster AI

An AI-powered fashion trend forecasting platform that combines real-time market intelligence, multi-source data aggregation, and statistical forecasting to predict emerging fashion trends 1–6 months in advance.

## 📌 Project Overview

Trend Forecaster AI helps fashion designers, retailers, and investors make data-driven decisions by:

- Analyzing real-time signals from web searches, social media, news, and academic research
- Generating AI-driven summaries and editorial narratives via the OpenRouter API
- Forecasting trend trajectories with confidence scoring over 1–6 month horizons
- Providing investment analysis (Strong Buy / Buy / Hold / Sell / Avoid) with risk assessments
- Tracking competitors and key brand activity
- Delivering market timing recommendations (Emerging → Growing → Mainstream → Mature → Declining)

## 🛠 Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 19.2.0 |
| TypeScript | — |
| Vite | 6.2.0 |
| Tailwind CSS | CDN |
| Framer Motion | ^12.26.2 |
| Recharts | ^3.3.0 |
| Lucide React | ^0.562.0 |

### Backend
| Technology | Version |
|---|---|
| Node.js / Express | 5.2.1 |
| TypeScript | — |
| MongoDB / Mongoose | 9.1.3 |
| JSON Web Tokens | 9.0.3 |
| bcryptjs | 3.0.3 |
| Helmet | 8.1.0 |
| express-rate-limit | 8.2.1 |

### Data & Integrations
- **OpenRouter API** – AI-generated trend summaries (Mistral / Nemotron models)
- **Google Trends API** – Search trend data (weighted 40%)
- **News API** – Fashion media headlines (weighted 15%)
- **Pexels / Unsplash** – Visual content for trend imagery
- **node-cron** – Scheduled background data refresh

## 🎯 Key Features

- **Multi-source trend analysis** – aggregates web, social, news, and academic signals
- **Statistical forecasting engine** – 6-module pipeline (885 lines) with exponential damping
- **Investment recommendations** – scored analysis with confidence percentages
- **Market timing** – phase detection and peak prediction
- **Price analysis** – budget, mid-range, and luxury segment breakdowns
- **Competitor intelligence** – brand threat assessment and activity tracking
- **Correlation matrix** – visualizes relationships between co-occurring trends
- **Alerts system** – signal-based notifications for tracked trends
- **JWT authentication** – secure login and session management
- **Response caching** – 83% reduction in redundant API calls

## 📂 Project Structure

```
Trend-Forecaster/
├── components/          # 46 React UI components
├── services/            # Frontend API service layer (OpenRouter, Pexels, Unsplash)
├── utils/               # Frontend utility helpers
├── App.tsx              # Root application component
├── types.ts             # Shared TypeScript interfaces
├── constants.ts         # App-wide constants and configuration
├── index.tsx            # React entry point
├── index.html           # HTML shell
├── vite.config.ts       # Vite build configuration
└── server/              # Express backend
    └── src/
        ├── index.ts         # App initialization and middleware
        ├── routes/          # API route handlers
        │   ├── analysis.routes.ts
        │   ├── forecast.routes.ts
        │   └── visual.routes.ts
        ├── services/        # Business logic modules
        │   ├── ai/          # OpenRouter AI integration
        │   ├── sources/     # Data source integrations
        │   ├── forecasting/ # Forecast engine
        │   ├── confidence/  # Confidence scoring
        │   ├── cache/       # Caching layer
        │   ├── fallback/    # Mock/fallback data
        │   └── brands/      # Brand analysis
        ├── models/          # MongoDB schemas
        ├── config/          # Database connection
        └── utils/           # Server utility helpers
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- MongoDB instance (local or Atlas)
- API keys (see Environment Variables)

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Copy the example env file in the `server/` directory and fill in your values:

```bash
cp server/.env.example server/.env
```

### 4. Run in development mode

**Frontend** (port 3000):
```bash
npm run dev
```

**Backend** (port 5000):
```bash
cd server
npm run dev
```

### 5. Build for production

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd server
npm run build
npm start
```

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/trendai

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Model
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=nvidia/nemotron-3-nano-30b-a3b:free

# Data Sources
NEWS_API_KEY=your-newsapi-key

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |
| `GET` | `/api` | API information |
| `POST` | `/api/analysis` | Full trend analysis for a topic |
| `POST` | `/api/forecast` | 1–6 month statistical forecast |

### Example – Forecast request

```bash
POST /api/forecast
{
  "topic": "cargo pants",
  "region": "US"
}
```

```json
{
  "current": { "score": 62, "status": "Growing" },
  "forecast": {
    "1m": { "score": 60, "change": "-4%" },
    "3m": { "score": 57, "change": "-8%" },
    "6m": { "score": 56, "change": "-10%" }
  },
  "confidence": { "score": 0.70, "level": "Medium-High" }
}
```

## 🌍 Supported Regions

- 🌐 Global
- 🇺🇸 United States
- 🇮🇳 India
- 🇬🇧 United Kingdom

## 👤 Author

Krishna Jaiswal
