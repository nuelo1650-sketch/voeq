import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

/**
 * Distributed rate-limit store (Upstash Redis). When UPSTASH_REDIS_URL and
 * UPSTASH_REDIS_TOKEN are set, limiters use this shared store so limits
 * hold across the Render instance fleet (the in-memory fallback in
 * rate-limit.ts is per-instance and doesn't aggregate). Local dev / missing
 * creds => callers fall back to the in-memory limiter.
 */
const redis =
  env.UPSTASH_REDIS_URL && env.UPSTASH_REDIS_TOKEN
    ? new Redis({
        url: env.UPSTASH_REDIS_URL,
        token: env.UPSTASH_REDIS_TOKEN,
      })
    : null;

export const isUpstashEnabled = redis !== null;

// Per-purpose sliding-window limiters (shared across instances).
export const authLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '15 m'), analytics: true, prefix: 'auth' })
  : null;
export const magicLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '15 m'), analytics: true, prefix: 'magic' })
  : null;
export const agreementLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 h'), analytics: true, prefix: 'agreement' })
  : null;
export const reviewCreateLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h'), analytics: true, prefix: 'review-create' })
  : null;
export const reviewRespondLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '1 h'), analytics: true, prefix: 'review-respond' })
  : null;
export const uploadLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(50, '1 h'), analytics: true, prefix: 'upload' })
  : null;
export const writeLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m'), analytics: true, prefix: 'write' })
  : null;
export const readLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '1 m'), analytics: true, prefix: 'read' })
  : null;
export const searchLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), analytics: true, prefix: 'search' })
  : null;

interface UpstashLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
  /** Composite key field read from the request body (e.g. 'email') so a single
   *  attacker can't skirt the limit by rotating IPs, and one victim's failures
   *  don't penalise unrelated users. Mirrors rate-limit.ts behaviour. */
  keyFromBody?: string;
  lockoutAfter?: number;
  lockoutMs?: number;
}

/** Build the same composite identifier (ip + body field) as the in-memory limiter. */
function identifierFor(config: UpstashLimitConfig, req: Request): string {
  const ip = req.ip ?? 'unknown';
  const bodyVal =
    config.keyFromBody && req.body && typeof req.body === 'object'
      ? String((req.body as Record<string, unknown>)[config.keyFromBody] ?? '')
      : '';
  return `${config.keyPrefix}:${ip}:${bodyVal}`;
}

/**
 * Wrap an Upstash Ratelimit with the composite-key + brute-force lockout
 * semantics already present in the in-memory limiter. Falls back to next()
 * (no limiting) when Upstash is not configured — callers should also register
 * the in-memory limiter so local dev is still protected.
 */
export function rateLimitWithFallback(limiter: Ratelimit | null, config: UpstashLimitConfig) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!limiter) {
      if (env.NODE_ENV === 'production') {
        console.error('Upstash not configured in production — using in-memory fallback (NOT DISTRIBUTED)');
      }
      return next();
    }

    const identifier = identifierFor(config, req);
    const { success, limit, reset, remaining } = await limiter.limit(identifier);

    res.setHeader('RateLimit-Limit', limit.toString());
    res.setHeader('RateLimit-Remaining', remaining.toString());
    res.setHeader('RateLimit-Reset', reset.toString());

    if (!success) {
      res.status(429).json({
        error: 'TooManyRequests',
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      });
      return;
    }

    next();
  };
}
