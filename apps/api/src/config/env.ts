import 'dotenv/config';
import { z } from 'zod';
import { envSchema } from '@voeq/shared';

const apiEnvSchema = envSchema.extend({
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  SIGHTENGINE_USER: z.string().min(1),
  SIGHTENGINE_SECRET: z.string().min(1),
  ADMIN_EMAIL: z.string().email().optional(),
  IMPERSONATION_SECRET: z.string().min(32).optional(),
});

const parsed = apiEnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid API environment variables:');
  console.error(JSON.stringify(parsed.error.issues, null, 2));
  process.exit(1);
}

export const env = parsed.data;

// Canonical web-app origin. Never falls back to the API origin (WEB_URL),
// otherwise OAuth/magic-link redirects would land on the API server (e.g.
// voeq.onrender.com/home) which has no such route -> 404.
export const webAppUrl = env.WEB_APP_URL ?? 'https://voeq.ng';
