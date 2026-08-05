import { Router, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../../middleware/admin';
import { getAdminStats } from '../../services/admin/admin.service';

export const statsRouter: ReturnType<typeof Router> = Router();

statsRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await getAdminStats();
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
});
