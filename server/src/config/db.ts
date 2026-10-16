import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} on ${conn.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    // In production or test environments, let callers know failure occurred
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) {
    return;
  }
  await mongoose.disconnect();
  isConnected = false;
  console.log('[MongoDB] Disconnected from database');
}
