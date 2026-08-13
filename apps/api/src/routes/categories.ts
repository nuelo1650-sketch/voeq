import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/db';
import { z } from 'zod';
import { optionalAuth, type AuthedRequest } from '../middleware/auth';

export const categoriesRouter: ReturnType<typeof Router> = Router();

const createCategorySchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  iconName: z.string().max(50).optional(),
  imagePublicId: z.string().max(200).optional(),
  imageUrl: z.string().url().optional(),
});

categoriesRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const flat = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        iconName: true,
        imageUrl: true,
        displayOrder: true,
        isOfficial: true,
        parentCategoryId: true,
        _count: {
          select: {
            listings: {
              where: { status: 'active', deletedAt: null, vendor: { status: 'live', deletedAt: null } },
            },
          },
        },
      },
    });

    const childrenOf = new Map<string | null, typeof flat>();
    for (const c of flat) {
      const key = c.parentCategoryId ?? null;
      if (!childrenOf.has(key)) childrenOf.set(key, []);
      childrenOf.get(key)!.push(c);
    }

    type CategoryNode = {
      id: string;
      slug: string;
      name: string;
      description: string | null;
      iconName: string | null;
      imageUrl: string | null;
      displayOrder: number;
      isOfficial: boolean;
      parentId: string | null;
      listingCount: number;
      children: CategoryNode[];
    };

    const toNode = (c: (typeof flat)[number]): CategoryNode => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      iconName: c.iconName,
      imageUrl: c.imageUrl,
      displayOrder: c.displayOrder,
      isOfficial: c.isOfficial,
      parentId: c.parentCategoryId,
      listingCount: c._count.listings,
      children: (childrenOf.get(c.id) ?? []).map(toNode),
    });

    const topLevel = (childrenOf.get(null) ?? []).map(toNode);

    res.status(200).json({ categories: topLevel });
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
          iconName: input.iconName ?? undefined,
          imagePublicId: input.imagePublicId ?? undefined,
          imageUrl: input.imageUrl ?? undefined,
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
