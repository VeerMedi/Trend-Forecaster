# Trend Forecaster AI - Backend Server

Node.js/Express backend for Trend Forecaster AI with MongoDB, JWT authentication, and AI-powered trend analysis.

## Prerequisites

- Node.js 18+ 
- MongoDB (Atlas, local, or Docker)
- OpenRouter API key
- News API key

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update with your actual values (MongoDB URI, API keys, etc.)

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
server/
├── src/
│   ├── config/          # Database and app configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic (AI, data sources)
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   └── index.ts         # Server entry point
├── dist/                # Compiled JavaScript (build output)
├── package.json
└── tsconfig.json
```

## API Endpoints

- `GET /health` - Health check
- `GET /api` - API information
- `POST /api/auth/register` - User registration (coming soon)
- `POST /api/auth/login` - User login (coming soon)
- `POST /api/analysis` - Create trend analysis (coming soon)
- `GET /api/analysis/history` - Get analysis history (coming soon)
- `POST /api/alerts` - Create alert (coming soon)

## Environment Variables

See `.env.example` for required environment variables.

## Development

- Hot reload with nodemon
- TypeScript for type safety
- ESLint and Prettier (recommended)

## License

ISC
