import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '@voeq/db';
import { markReportFalse } from '../../services/report.service';

export const reportsRouter: ReturnType<typeof Router> = Router();

reportsRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: 100,
      include: {
        submitter: { select: { id: true, name: true, email: true } },
        target: { select: { id: true, businessName: true, status: true } },
      },
    });
    res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
});

const resolveSchema = z.object({
  action: z.enum(['warned', 'suspended', 'no_action']),
  notes: z.string().max(500).optional(),
});

reportsRouter.post('/:id/resolve', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = resolveSchema.parse(req.body);
    const report = await prisma.report.findUnique({ where: { id: req.params.id ?? '' } });
    if (!report) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const updated = await prisma.report.update({
      where: { id: report.id },
      data: {
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedBy: req.userId,
      },
    });

    if (input.action === 'suspended') {
      await prisma.vendor.update({
        where: { id: report.targetId },
        data: { status: 'suspended' },
      });
    }

    await logAdminAction(req, 'report.resolved', 'report', report.id, { action: input.action, notes: input.notes });
    res.status(200).json({ report: updated });
  } catch (error) {
    next(error);
  }
});

reportsRouter.post('/:id/dismiss', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: req.params.id ?? '' } });
    if (!report) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    await markReportFalse(report.id, req.userId!);
    await logAdminAction(req, 'report.dismissed', 'report', report.id, {});
    res.status(200).json({ dismissed: true });
  } catch (error) {
    next(error);
  }
});
