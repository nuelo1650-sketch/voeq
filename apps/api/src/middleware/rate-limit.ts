import type { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
}

export function rateLimit(config: RateLimitConfig) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${config.keyPrefix}:${req.ip ?? 'unknown'}`;
    const now = Date.now();

    let store = stores.get(config.keyPrefix);
    if (!store) {
      store = new Map();
      stores.set(config.keyPrefix, store);
    }

    const entry = store.get(key);
    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + config.windowMs });
      next();
      return;
    }

    if (entry.count >= config.max) {
      res.status(429).json({
        error: 'TooManyRequests',
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      });
      return;
    }

    entry.count++;
    next();
  };
}
