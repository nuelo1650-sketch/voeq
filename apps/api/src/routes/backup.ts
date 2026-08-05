import { Router, type Router as RouterType, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../middleware/admin';
import { logAdminAction } from '../middleware/audit';
import { createBackup } from '../services/backup.service';

export const backupRouter: RouterType = Router();

backupRouter.post('/trigger', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const result = await createBackup();
    await logAdminAction(req, 'backup.triggered', 'backup', undefined, result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
