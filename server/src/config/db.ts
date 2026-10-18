import dns from 'node:dns';
import mongoose from 'mongoose';
import { env, isLocalMongoFallback } from './env.js';

let isConnected = false;

export function sanitizeMongoError(error: unknown): string {
  if (!error) return 'Unknown database error';
  const msg = error instanceof Error ? error.message : String(error);
  // Redact user:password in URIs: mongodb://user:pass@host or mongodb+srv://user:pass@host
  return msg.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+@/gi, '$1****@');
}

export async function connectDB(): Promise<void> {
  if (isConnected) {
    return;
  }

  const isAtlas = env.MONGODB_URI.startsWith('mongodb+srv://') || env.MONGODB_URI.includes('mongodb.net');
  const targetLabel = isAtlas ? 'MongoDB Atlas (Cloud Cluster)' : 'Local / Standalone MongoDB';

  if (isAtlas) {
    // Atlas SRV connection strings (mongodb+srv://) require asynchronous DNS resolution via c-ares (dns.resolveSrv).
    // On systems where virtual network adapters (e.g. VMware, Hyper-V, WSL) have lower interface metrics than the
    // physical network interface, Node.js c-ares evaluates adapters with 0 DNS servers and defaults to [ '127.0.0.1' ],
    // causing 'querySrv ECONNREFUSED'.
    if (env.DNS_SERVERS && env.DNS_SERVERS.length > 0) {
      console.log(`[MongoDB] Using explicitly configured DNS servers: ${env.DNS_SERVERS.join(', ')}`);
      dns.setServers(env.DNS_SERVERS);
    } else {
      const currentServers = dns.getServers();
      const isOnlyLoopback = currentServers.length === 1 && (currentServers[0] === '127.0.0.1' || currentServers[0] === '::1');
      if (isOnlyLoopback) {
        // Fall back to reliable Cloudflare resolvers matching the machine's primary configured DNS
        const defaultDns = ['1.1.1.1', '1.0.0.1'];
        console.warn(`[MongoDB] Node.js DNS resolver defaulted to loopback (${currentServers[0]}). Applying reliable DNS servers for SRV resolution: ${defaultDns.join(', ')}`);
        dns.setServers(defaultDns);
      }
    }
  }

  if (isLocalMongoFallback) {
    console.warn('[MongoDB] MONGODB_URI not specified. Using documented local development fallback: mongodb://127.0.0.1:27017/travelmate');
  } else {
    console.log(`[MongoDB] Initiating connection to configured ${targetLabel}...`);
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    const host = conn.connection.host || '(unknown host)';
    const dbName = conn.connection.name || '(default database)';

    console.log(`[MongoDB] Connected successfully to ${targetLabel}`);
    console.log(`[MongoDB] Target Host: ${host} | Database: ${dbName}`);
  } catch (error) {
    const sanitized = sanitizeMongoError(error);
    console.error(`[MongoDB] Connection to ${targetLabel} failed:`, sanitized);

    if (!isLocalMongoFallback) {
      console.error('[MongoDB] The explicitly configured database connection failed. Server will NOT silently fall back to local database.');
    }
    throw new Error(`Database connection failed: ${sanitized}`);
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
