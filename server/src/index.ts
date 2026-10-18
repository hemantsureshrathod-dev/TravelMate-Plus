import { app } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

async function bootstrap() {
  try {
    console.log('[Server] Initializing TravelMate+ backend...');
    console.log('[Server] Connecting to database before starting HTTP listeners...');
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`[Server] TravelMate+ API Server successfully started in ${env.NODE_ENV} mode on port ${env.PORT}`);
      console.log(`[Server] Health endpoint: http://localhost:${env.PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await disconnectDB();
        console.log('[Server] Database disconnected. Process terminated cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error: any) {
    console.error('[Server] Fatal startup failure during database initialization.');
    console.error('[Server] Application will NOT start in an un-connected state. Exiting process.');
    process.exit(1);
  }
}

bootstrap();
