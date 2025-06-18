import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import chatRoutes from './routes/chatRoutes.js';
import { errorHandler, notFound } from './utils/errorHandler.js';
import { DatabaseService } from './services/databaseService.js';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize database
const dbService = new DatabaseService();
await dbService.initializeDatabase();

// Routes
app.use('/api', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'MERN LangChain Chat API',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /api/chat',
      schema: 'GET /api/schema',
      health: 'GET /api/health'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;