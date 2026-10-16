import { Router } from 'express';
import { generateItinerary } from '../controllers/ai.controller.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Endpoint for AI itinerary generation (can be accessed by registered or exploratory users)
router.post('/generate-itinerary', aiLimiter, generateItinerary);

export default router;
