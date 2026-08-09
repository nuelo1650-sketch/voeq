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
    if (!origin || origin === 'null' || corsOrigin.includes(origin)) {
      callback(null, true);
      return;
    }
    try {
      if (/\.vercel\.app$/.test(new URL(origin).hostname)) {
        callback(null, true);
        return;
      }
      if (/\.onrender\.com$/.test(new URL(origin).hostname)) {
        callback(null, true);
        return;
      }
    } catch {
      // ignore malformed origins
    }
    callback(new Error('Not allowed by CORS'));
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
  const GLOBAL_RATE_LIMIT_WINDOW = 15 * 60 * 1000;
  const GLOBAL_RATE_LIMIT_MAX = 200;
  let globalRequestCount = 0;
  let globalWindowStart = Date.now();
  app.use((req, res, next) => {
    const now = Date.now();
    if (now - globalWindowStart >= GLOBAL_RATE_LIMIT_WINDOW) {
      globalRequestCount = 0;
      globalWindowStart = now;
    }
    globalRequestCount++;
    if (globalRequestCount > GLOBAL_RATE_LIMIT_MAX) {
      res.status(429).json({
        error: 'TooManyRequests',
        message: 'Too many requests, please try again later',
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
  app.use('/api/disputes', disputesRouter);
  app.use('/api/preferences', preferencesRouter);
  app.use('/api', apiRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/admin/backup', backupRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
