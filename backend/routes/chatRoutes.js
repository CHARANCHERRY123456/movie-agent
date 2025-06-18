import express from 'express';
import { handleChatQuery, getSchema } from '../controllers/chatController.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

// POST /api/chat - Handle chat queries
router.post('/chat', asyncHandler(handleChatQuery));

// GET /api/schema - Get database schema
router.get('/schema', asyncHandler(getSchema));

// GET /api/health - Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chat API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;