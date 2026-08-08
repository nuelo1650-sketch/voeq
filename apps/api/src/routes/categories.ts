import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/db';
import { z } from 'zod';
import { optionalAuth, type AuthedRequest } from '../middleware/auth';

export const categoriesRouter: ReturnType<typeof Router> = Router();

const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  iconName: z.string().max(50).optional(),
});

categoriesRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        iconName: true,
        displayOrder: true,
        isOfficial: true,
        _count: {
          select: {
            listings: {
              where: { status: 'active', deletedAt: null, vendor: { status: 'live', deletedAt: null } },
            },
          },
        },
      },
    });

    res.status(200).json({
      categories: categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description,
        iconName: c.iconName,
        displayOrder: c.displayOrder,
        isOfficial: c.isOfficial,
        listingCount: c._count.listings,
      })),
    });
  } catch (error) {
    next(error);
  }
});

categoriesRouter.post(
  '/',
  optionalAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = createCategorySchema.parse(req.body);

      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) {
        res.status(409).json({ error: 'CategoryExists', message: 'A category with this name already exists' });
        return;
      }

      const maxOrder = await prisma.category.aggregate({ _max: { displayOrder: true } });
      const displayOrder = (maxOrder._max.displayOrder ?? 0) + 1;

      const category = await prisma.category.create({
        data: {
          slug,
          name: input.name,
          description: input.description,
          iconName: input.iconName,
          displayOrder,
          isOfficial: false,
          createdById: req.userId ?? null,
        },
      });

      res.status(201).json({ category });
    } catch (error) {
      next(error);
    }
  }
);
