import { Router, type Response, type NextFunction } from 'express';
import { CreateReportSchema } from '../schemas/review';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimitWithFallback, agreementLimiter } from '../middleware/rate-limit-upstash';
import { createReport } from '../services/report.service';
import { logEvent } from '../services/analytics.service';
import { getClientIp } from '../utils/ip';

export const reportsRouter: ReturnType<typeof Router> = Router();

reportsRouter.post(
  '/vendor/:vendorId',
  requireAuth,
  rateLimitWithFallback(agreementLimiter, { windowMs: 60 * 60 * 1000, max: 10, keyPrefix: 'report' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = CreateReportSchema.parse(req.body);
      const result = await createReport(req.userId!, req.params.vendorId ?? '', input);

      await logEvent({
        eventType: 'report_submitted',
        userId: req.userId,
        vendorId: req.params.vendorId,
        metadata: { category: input.category },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
);
