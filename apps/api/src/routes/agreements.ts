import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '@voeq/db';

export const agreementsRouter: ReturnType<typeof Router> = Router();

agreementsRouter.get('/current', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [tos, privacy, vendorAgreement] = await Promise.all([
      prisma.agreement.findFirst({ where: { type: 'tos' }, orderBy: { effectiveAt: 'desc' } }),
      prisma.agreement.findFirst({ where: { type: 'privacy' }, orderBy: { effectiveAt: 'desc' } }),
      prisma.agreement.findFirst({ where: { type: 'vendor_agreement' }, orderBy: { effectiveAt: 'desc' } }),
    ]);
    res.status(200).json({ tos, privacy, vendorAgreement });
  } catch (error) {
    next(error);
  }
});
