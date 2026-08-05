import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

const redis = env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: env.UPSTASH_REDIS_REST_URL, token: env.UPSTASH_REDIS_REST_TOKEN })
  : null;

export const authLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '15 m'), analytics: true, prefix: 'auth' }) : null;
export const uploadLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(50, '1 h'), analytics: true, prefix: 'upload' }) : null;
export const writeLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m'), analytics: true, prefix: 'write' }) : null;
export const readLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, '1 m'), analytics: true, prefix: 'read' }) : null;
export const searchLimiter = redis ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), analytics: true, prefix: 'search' }) : null;

export function rateLimitWithFallback(limiter: Ratelimit | null) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!limiter) {
      if (env.NODE_ENV === 'production') {
        console.error('Upstash not configured in production — using in-memory fallback (NOT DISTRIBUTED)');
      }
      return next();
    }

    const identifier = req.ip ?? 'unknown';
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
