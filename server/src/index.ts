// Load environment variables FIRST (before any other imports)
import dotenv from 'dotenv';
dotenv.config();

// Now import everything else
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './config/database';
import analysisRoutes from './routes/analysis.routes';

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Temporarily disable helmet for testing
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false,
// }));

// ⚡ OPTIMIZATION: Enable response compression (60-80% smaller responses)
app.use(compression());

app.use(cors({
    origin: '*', // Allow all origins for testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Trend Forecaster AI Backend',
        version: '1.0.0'
    });
});

// API info endpoint
app.get('/api', (req: Request, res: Response) => {
    res.json({
        message: 'Trend Forecaster AI API v1',
        endpoints: {
            health: '/health',
            analysis: '/api/analysis',
            auth: '/api/auth/* (coming soon)',
            alerts: '/api/alerts/* (coming soon)',
        },
        documentation: 'Coming soon'
    });
});

// API Routes
app.use('/api/analysis', analysisRoutes);

// Visual Intelligence Routes (Pexels)
import visualRoutes from './routes/visual.routes';
app.use('/api/visual', visualRoutes);

// Statistical Forecasting Routes
import forecastRoutes from './routes/forecast.routes';
app.use('/api/forecast', forecastRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start listening
        app.listen(PORT, () => {
            console.log('🚀 ================================');
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV}`);
            console.log(`🌐 Frontend: ${process.env.FRONTEND_URL}`);
            console.log('🚀 ================================');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
