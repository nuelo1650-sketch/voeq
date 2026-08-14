import type { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface FailureEntry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();
// Brute-force lockout: consecutive auth failures per composite key.
const failures = new Map<string, Map<string, FailureEntry>>();

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
  /**
   * When set, the rate-limit key is composed of the client IP AND this field
   * read from the request body (e.g. 'email'), so a single attacker cannot
   * skirt the limit by rotating IPs, and one victim's failures don't penalise
   * unrelated users.
   */
  keyFromBody?: string;
  /**
   * If set, after this many recorded failures (via trackFailure) for the same
   * composite key, ALL requests with that key are blocked until resetAt.
   */
  lockoutAfter?: number;
  lockoutMs?: number;
}

function buildKey(config: RateLimitConfig, req: Request): string {
  const ip = req.ip ?? 'unknown';
  const bodyVal =
    config.keyFromBody && req.body && typeof req.body === 'object'
      ? String((req.body as Record<string, unknown>)[config.keyFromBody] ?? '')
      : '';
  return `${config.keyPrefix}:${ip}:${bodyVal}`;
}

/**
 * Record a failed authentication attempt for the composite key (used by OTP /
 * signin routes). When lockoutAfter is configured and the threshold is reached,
 * the limiter blocks further attempts for lockoutMs.
 */
export function trackFailure(config: RateLimitConfig, req: Request): void {
  if (!config.lockoutAfter) return;
  const prefix = `${config.keyPrefix}:fail`;
  let store = failures.get(prefix);
  if (!store) {
    store = new Map();
    failures.set(prefix, store);
  }
  const key = buildKey(config, req);
  const now = Date.now();
  const entry = store.get(key);
  const lockoutMs = config.lockoutMs ?? config.windowMs;
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + lockoutMs });
    return;
  }
  entry.count++;
  entry.resetAt = now + lockoutMs;
}

export function rateLimit(config: RateLimitConfig) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = buildKey(config, req);
    const now = Date.now();

    // Brute-force lockout takes precedence.
    if (config.lockoutAfter) {
      const fstore = failures.get(`${config.keyPrefix}:fail`);
      const fentry = fstore?.get(key);
      if (fentry && fentry.count >= config.lockoutAfter && fentry.resetAt > now) {
        res.status(429).json({
          error: 'TooManyRequests',
          message: 'Too many failed attempts. Please try again later.',
          retryAfter: Math.ceil((fentry.resetAt - now) / 1000),
        });
        return;
      }
    }

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
