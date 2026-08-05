import { Router, type Response, type NextFunction } from 'express';
import { type AdminRequest } from '../../middleware/admin';
import { z } from 'zod';
import { prisma } from '@voeq/db';

export const auditRouter: ReturnType<typeof Router> = Router();

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  action: z.string().optional(),
  actorUserId: z.string().optional(),
  targetType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

auditRouter.get('/', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const params = querySchema.parse(req.query);
    const where: Record<string, unknown> = {} as Record<string, unknown>;
    if (params.action) where.action = params.action;
    if (params.actorUserId) where.actorUserId = params.actorUserId;
    if (params.targetType) where.targetType = params.targetType;
    if (params.startDate || params.endDate) {
      where.createdAt = {} as Record<string, Date>;
      if (params.startDate) (where.createdAt as Record<string, Date>).gte = new Date(params.startDate);
      if (params.endDate) (where.createdAt as Record<string, Date>).lte = new Date(params.endDate);
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          actor: { select: { id: true, email: true, name: true, role: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    res.status(200).json({ logs, total, page: params.page, totalPages: Math.ceil(total / params.limit) });
  } catch (error) {
    next(error);
  }
});
