import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import './instrumentation';
import { searchRouter } from './routes/search';
import { listingsRouter } from './routes/listings';
import { vendorsRouter } from './routes/vendors';
import { whatsappRouter } from './routes/whatsapp';
import { categoriesRouter } from './routes/categories';
import { usersRouter } from './routes/users';
import { authRouter } from './routes/auth';
import { agreementsRouter } from './routes/agreements';
import { institutionsRouter } from './routes/institutions';
import { healthRouter } from './routes/health';
import { testRouter } from './routes/test';
import { wishlistRouter } from './routes/wishlist';
import { followRouter } from './routes/follow';
import { notificationsRouter } from './routes/notifications';
import { statsRouter } from './routes/stats';
import { vendorRouter } from './routes/vendor';
import { uploadRouter } from './routes/upload';
import { apiRouter } from './routes';
import { adminRouter } from './routes/admin';
import { backupRouter } from './routes/backup';
import { disputesRouter } from './routes/disputes';
import { preferencesRouter } from './routes/preferences';
import { vendorSocialRouter } from './routes/vendor-social';
import { vendorHoursRouter } from './routes/vendor-hours';
import { errorHandler } from './middleware/error';
import { notFoundHandler } from './middleware/notFound';

export function createApp(): Application {
  const app = express();
  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
          connectSrc: ["'self'", env.NEXT_PUBLIC_API_URL ?? env.CORS_ORIGIN],
        },
      },
      crossOriginEmbedderPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );
  const corsOrigin = env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
  const corsOriginValidator = (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }
    // Allow only explicitly configured origins
    if (corsOrigin.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  };
  app.use(
    cors({
      origin: corsOriginValidator,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    }),
  );
  const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per 15 min per IP

  const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

  // Periodic cleanup of expired entries (prevent memory leak)
  const rateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequestCounts.entries()) {
      if (data.resetAt < now) ipRequestCounts.delete(ip);
    }
  }, 5 * 60 * 1000); // cleanup every 5 minutes
  // Don't keep the event loop alive solely for the cleanup timer
  if (typeof rateLimitCleanup.unref === 'function') rateLimitCleanup.unref();

  app.use((req, res, next) => {
    const ip = req.ip ?? 'unknown';
    const now = Date.now();

    let record = ipRequestCounts.get(ip);

    if (!record || record.resetAt < now) {
      record = { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
      ipRequestCounts.set(ip, record);
    }

    record.count++;

    if (record.count > RATE_LIMIT_MAX_REQUESTS) {
      const retryAfter = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      res.status(429).json({
        error: 'TooManyRequests',
        message: 'Rate limit exceeded. Try again later.',
        retryAfter,
      });
      return;
    }

    next();
  });

  app.use('/health', healthRouter);
  app.use('/', healthRouter);
  app.use('/api/test', testRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/agreements', agreementsRouter);
  app.use('/api/institutions', institutionsRouter);
  app.use('/api/search', searchRouter);
  app.use('/api/listings', listingsRouter);
  app.use('/api/vendors', vendorsRouter);
  app.use('/api/vendors', vendorRouter);
  app.use('/api/vendors', vendorSocialRouter);
  app.use('/api/vendors', vendorHoursRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/whatsapp', whatsappRouter);
  app.use('/api/categories', categoriesRouter);
  app.use('/api/wishlist', wishlistRouter);
  app.use('/api/follow', followRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/stats', statsRouter);
  app.use('/api/disputes', disputesRouter);
  app.use('/api/preferences', preferencesRouter);
  app.use('/api', apiRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/admin/backup', backupRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
