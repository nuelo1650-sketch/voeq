import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest, requirePermission } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '../../lib/db';

export const vendorsRouter: ReturnType<typeof Router> = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  search: z.string().optional(),
  status: z.enum(['incomplete', 'pending_review', 'live', 'suspended']).optional(),
  campusId: z.string().optional(),
  verified: z.coerce.boolean().optional(),
});

vendorsRouter.get('/', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const where: Record<string, unknown> = { deletedAt: null };
    if (params.search) {
      where.OR = [
        { businessName: { contains: params.search, mode: 'insensitive' } },
        { ownerName: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.status) where.status = params.status;
    if (params.campusId) where.campusId = params.campusId;
    if (params.verified !== undefined) where.verifiedBadge = params.verified;

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          user: { select: { email: true, status: true } },
          campus: { select: { name: true, institution: { select: { name: true } } } },
          _count: { select: { listings: { where: { status: 'active', deletedAt: null } }, reviews: true } },
        },
      }),
      prisma.vendor.count({ where }),
    ]);

    res.status(200).json({ vendors, total, page: params.page, totalPages: Math.ceil(total / params.limit) });
  } catch (error) {
    next(error);
  }
});

vendorsRouter.get('/:id', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id ?? '' },
      include: {
        user: { select: { id: true, email: true, name: true, image: true, status: true, createdAt: true } },
        institution: true,
        campus: true,
        listings: { where: { deletedAt: null }, orderBy: { createdAt: 'desc' } },
        reviews: { where: { status: 'visible' }, orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { name: true, email: true } } } },
        reports: { orderBy: { createdAt: 'desc' }, take: 20 },
        badges: { where: { revokedAt: null } },
      },
    });
    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    res.status(200).json({ vendor });
  } catch (error) {
    next(error);
  }
});

vendorsRouter.post('/:id/verify', requirePermission('vendor.verify'), async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id ?? '' } });
    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const updated = await prisma.vendor.update({
      where: { id: vendor.id },
      data: { verifiedBadge: true, verifiedAt: new Date(), verifiedBy: req.userId },
    });
    await logAdminAction(req, 'vendor.verified', 'vendor', vendor.id, { businessName: vendor.businessName });
    res.status(200).json({ vendor: updated });
  } catch (error) {
    next(error);
  }
});

const suspendVendorSchema = z.object({
  reason: z.string().min(10).max(500),
});

vendorsRouter.post('/:id/suspend', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = suspendVendorSchema.parse(req.body);
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id ?? '' } });
    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const updated = await prisma.vendor.update({
      where: { id: vendor.id },
      data: { status: 'suspended' },
    });
    await logAdminAction(req, 'vendor.suspended', 'vendor', vendor.id, { reason: input.reason, businessName: vendor.businessName });
    res.status(200).json({ vendor: updated });
  } catch (error) {
    next(error);
  }
});

const featureSchema = z.object({
  durationDays: z.number().int().positive().max(90),
  notes: z.string().max(500).optional(),
});

vendorsRouter.post('/:id/feature', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = featureSchema.parse(req.body);
    const vendor = await prisma.vendor.findUnique({ where: { id: req.params.id ?? '' } });
    if (!vendor) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const featuredUntil = new Date(Date.now() + input.durationDays * 24 * 60 * 60 * 1000);
    const updated = await prisma.vendor.update({
      where: { id: vendor.id },
      data: { isFeatured: true, featuredUntil, featuredBy: req.userId },
    });
    await logAdminAction(req, 'vendor.featured', 'vendor', vendor.id, {
      durationDays: input.durationDays,
      featuredUntil: featuredUntil.toISOString(),
      notes: input.notes,
    });
    res.status(200).json({ vendor: updated });
  } catch (error) {
    next(error);
  }
});
