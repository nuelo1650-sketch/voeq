import { envSchema } from '@voeq/shared';

const webEnvSchema = envSchema.extend({
  // Web-specific env vars (none yet beyond shared)
});

const parsed = webEnvSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: undefined, // Not used on web
  CORS_ORIGIN: process.env.NEXT_PUBLIC_SITE_URL, // Web doesn't need CORS_ORIGIN but env requires it
});

if (!parsed.success) {
  console.error('❌ Invalid web environment variables:');
  console.error(JSON.stringify(parsed.error.issues, null, 2));
  throw new Error('Invalid web environment variables');
}

export const env = parsed.data;
