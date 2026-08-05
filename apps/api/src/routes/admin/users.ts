import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireSuperAdmin, type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '@voeq/db';

export const usersRouter: ReturnType<typeof Router> = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().optional(),
  role: z.enum(['buyer', 'vendor', 'admin', 'super_admin']).optional(),
  status: z.enum(['active', 'suspended']).optional(),
});

usersRouter.get('/', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const where: Record<string, unknown> = { deletedAt: null };
    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.role) where.role = params.role;
    if (params.status) where.status = params.status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          status: true,
          createdAt: true,
          lastSignInAt: true,
          agreementAcceptedAt: true,
          defaultCampus: { select: { id: true, name: true, institution: { select: { name: true } } } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.status(200).json({ users, total, page: params.page, totalPages: Math.ceil(total / params.limit) });
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/:id', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id ?? '' },
      include: {
        defaultCampus: { include: { institution: true } },
        vendor: { include: { listings: { take: 10 }, reviews: { take: 10 } } },
        _count: {
          select: {
            reviews: true,
            reportsSubmitted: true,
            sessions: true,
          },
        },
      },
    });
    if (!user) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

const changeRoleSchema = z.object({
  role: z.enum(['buyer', 'vendor', 'admin', 'super_admin']),
  confirm: z.literal('CHANGE ROLE'),
});

usersRouter.post('/:id/change-role', requireSuperAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = changeRoleSchema.parse(req.body);
    const oldUser = await prisma.user.findUnique({ where: { id: req.params.id ?? '' } });
    if (!oldUser) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: oldUser.id },
      data: { role: input.role },
    });

    await logAdminAction(req, 'user.role_changed', 'user', oldUser.id, {
      oldRole: oldUser.role,
      newRole: input.role,
    });

    res.status(200).json({ user: updated });
  } catch (error) {
    next(error);
  }
});

const suspendSchema = z.object({
  reason: z.string().min(10).max(500),
});

usersRouter.post('/:id/suspend', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = suspendSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.params.id ?? '' } });
    if (!user) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    if (user.role === 'super_admin') {
      res.status(403).json({ error: 'CannotSuspendSuperAdmin' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { status: 'suspended' },
    });

    await prisma.session.deleteMany({ where: { userId: user.id } });

    await logAdminAction(req, 'user.suspended', 'user', user.id, {
      reason: input.reason,
      email: user.email,
    });

    res.status(200).json({ user: updated });
  } catch (error) {
    next(error);
  }
});

const hardDeleteSchema = z.object({
  confirmEmail: z.string().email(),
});

usersRouter.delete('/:id', requireSuperAdmin, async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = hardDeleteSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.params.id ?? '' } });
    if (!user) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    if (user.email !== input.confirmEmail) {
      res.status(400).json({ error: 'EmailMismatch' });
      return;
    }
    if (user.role === 'super_admin') {
      res.status(403).json({ error: 'CannotDeleteSuperAdmin' });
      return;
    }

    await prisma.user.delete({ where: { id: user.id } });

    await logAdminAction(req, 'user.hard_deleted', 'user', user.id, {
      email: user.email,
      name: user.name,
    });

    res.status(200).json({ deleted: true });
  } catch (error) {
    next(error);
  }
});
