import { app } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    console.log('[Server] Connecting to MongoDB...');
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`[Server] TravelMate+ API Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`[Server] Health check: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Gracefully terminating...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Process exited gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[Server] Fatal startup error:', error);
    process.exit(1);
  }
}

bootstrap();
