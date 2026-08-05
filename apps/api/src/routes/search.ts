import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { searchAll } from '../services/search.service';
import { logEvent } from '../services/analytics.service';
import { getClientIp } from '../utils/ip';
import { optionalAuth, type AuthedRequest } from '../middleware/auth';

export const searchRouter: ReturnType<typeof Router> = Router();

const querySchema = z.object({
  q: z.string().min(1).max(200),
  campusId: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
});

searchRouter.get('/', optionalAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const params = querySchema.parse(req.query);
    const results = await searchAll({
      query: params.q,
      campusId: params.campusId,
      categorySlug: params.category,
      page: params.page,
    });

    await logEvent({
      eventType: 'search',
      userId: req.userId,
      sessionId: req.sessionId,
      campusId: params.campusId,
      metadata: { query: params.q, category: params.category, results: results.totalListings + results.totalVendors },
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});
