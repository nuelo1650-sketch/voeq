import { Router, type Request, type Response, type NextFunction } from 'express';
import { prisma } from '@voeq/db';

export const categoriesRouter: ReturnType<typeof Router> = Router();

categoriesRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        iconName: true,
        displayOrder: true,
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
        iconName: c.iconName,
        displayOrder: c.displayOrder,
        listingCount: c._count.listings,
      })),
    });
  } catch (error) {
    next(error);
  }
});
