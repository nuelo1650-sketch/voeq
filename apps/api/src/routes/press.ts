import { Router, type Response, type NextFunction, type Request } from 'express';
import { prisma } from '../lib/db';

export const pressPublicRouter: ReturnType<typeof Router> = Router();

// Public: published press items, newest first.
pressPublicRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.pressItem.findMany({
      where: { isPublished: true },
      orderBy: [{ publishDate: 'desc' }, { createdAt: 'desc' }],
      take: 50,
    });
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});
