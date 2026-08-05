import { Router, type Request, type Response, type NextFunction } from 'express';
import { syncAllVendorBadges } from '../services/badge.service';
import { logger } from '../config/logger';

export const cronRouter: ReturnType<typeof Router> = Router();

cronRouter.get('/tick', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const start = Date.now();
    logger.info('Cron tick started');

    const result = await syncAllVendorBadges();

    const duration = Date.now() - start;
    logger.info({ result, duration }, 'Cron tick complete');

    res.status(200).json({
      ok: true,
      result,
      duration,
    });
  } catch (error) {
    logger.error({ error }, 'Cron tick failed');
    next(error);
  }
});
