import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import tripRoutes from './routes/trip.routes.js';
import aiRoutes from './routes/ai.routes.js';
import destinationRoutes from './routes/destination.routes.js';

export const app = express();

// Trust reverse proxy (e.g. Render, Railway, AWS ALB, Vercel)
// Trusting 1 hop ensures the front-most proxy IP is used for rate limiting and client IP resolution,
// while preventing spoofed X-Forwarded-For headers from untrusted clients.
app.set('trust proxy', 1);

// Helper function to validate allowed origins
export function isAllowedOrigin(origin?: string, nodeEnv: string = env.NODE_ENV): boolean {
  // Allow requests with no origin (like mobile apps, curl, or supertest)
  if (!origin) return true;

  // Allow explicit client origin configured in environment
  if (origin === env.CLIENT_ORIGIN) {
    return true;
  }

  try {
    const parsed = new URL(origin);

    // In non-production, allow localhost and loopback development servers
    if (nodeEnv !== 'production') {
      if (
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname === '[::1]'
      ) {
        return true;
      }
    }

    // Allow production domain and project-scoped preview Vercel deployments (HTTPS only)
    if (parsed.protocol === 'https:') {
      // Exact production domain
      if (parsed.hostname === 'travel-mate-plus.vercel.app') {
        return true;
      }
      // Project preview deployments: travel-mate-plus-<branch/hash>.vercel.app
      if (
        parsed.hostname.startsWith('travel-mate-plus-') &&
        parsed.hostname.endsWith('.vercel.app')
      ) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      // Disallow origin cleanly without throwing a 500 error
      return callback(null, false);
    },
    credentials: true,
  })
);

// General rate limiter & body parsers
app.use(generalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: env.NODE_ENV,
    database: dbStatusMap[dbState] || 'unknown',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/destinations', destinationRoutes);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Centralized error handler
app.use(errorHandler);
