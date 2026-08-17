import { Router, type Response, type NextFunction } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { getNotifications, markRead, markAllRead } from '../services/notification.service';

export const notificationsRouter: ReturnType<typeof Router> = Router();

notificationsRouter.get('/', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 50);
    const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
    const result = await getNotifications(req.userId!, limit, cursor);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

notificationsRouter.patch(
  '/:id/read',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      await markRead(req.userId!, req.params.id!);
      res.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

notificationsRouter.post(
  '/read-all',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      await markAllRead(req.userId!);
      res.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

