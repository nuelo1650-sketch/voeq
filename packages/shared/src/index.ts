import { z } from 'zod';

// Placeholder schemas — expanded in later prompts.
// Created here so apps can import @voeq/shared without errors in this prompt.

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  service: z.string(),
  version: z.string(),
  timestamp: z.string().datetime(),
  uptime: z.number().nonnegative(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().url().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().optional(), // comma-separated list, overrides CORS_ORIGIN if set
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters'),
  AUTH_GOOGLE_CLIENT_ID: z.string().min(1),
  AUTH_GOOGLE_CLIENT_SECRET: z.string().min(1),
  AUTH_TRUST_HOST: z.coerce.boolean().default(true),
  NEXTAUTH_URL: z.string().url().optional(),
  WEB_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().email(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  SIGHTENGINE_USER: z.string().min(1).optional(),
  SIGHTENGINE_SECRET: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  IMPERSONATION_SECRET: z.string().min(32).optional(),
  SENTRY_DSN: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
  BACKUP_CLOUDINARY_FOLDER: z.string().default('voeq-backups'),
  BACKUP_RETENTION_DAYS: z.coerce.number().int().positive().default(30),
});

export type Env = z.infer<typeof envSchema>;

export const VOEQ_VERSION = '0.1.0';
