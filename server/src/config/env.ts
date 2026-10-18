import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the .env file path reliably regardless of terminal working directory
const candidateEnvPaths = [
  path.resolve(__dirname, '../../.env'), // <root>/server/.env (when built or running from src)
  path.resolve(process.cwd(), 'server/.env'), // When executing from project root
  path.resolve(process.cwd(), '.env'), // Current working directory fallback
  path.resolve(__dirname, '../../../.env'), // Root fallback
];

let loadedEnvPath: string | null = null;
for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    loadedEnvPath = envPath;
    break;
  }
}

// Fallback to standard dotenv loading for platform-injected variables (never overrides existing process.env)
dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Default fallback is documented and only used if MONGODB_URI is completely absent
  MONGODB_URI: z
    .string()
    .min(10, 'MONGODB_URI must be a valid connection string')
    .default('mongodb://127.0.0.1:27017/travelmate'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET must be at least 16 characters long')
    .default('travelmate-plus-secure-default-jwt-secret-key-32chars'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-flash-latest'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('500').transform((val) => parseInt(val, 10)),
  AUTH_RATE_LIMIT_MAX: z.string().default('100').transform((val) => parseInt(val, 10)),
  AI_RATE_LIMIT_MAX: z.string().default('50').transform((val) => parseInt(val, 10)),
  DNS_SERVERS: z
    .string()
    .optional()
    .default('')
    .transform((val) =>
      val
        ? val
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    ),
});

const isMongoUriExplicit = Boolean(process.env.MONGODB_URI?.trim());

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('[Config] Invalid environment variables:', parsed.error.format());
  throw new Error('Environment configuration validation failed');
}

export const isLocalMongoFallback = !isMongoUriExplicit;
export const envSourcePath = loadedEnvPath;
export const env = parsed.data;
