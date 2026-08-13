import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { prisma } from '../../lib/db';

export const pressRouter: ReturnType<typeof Router> = Router();

const createSchema = z.object({
  kind: z.string().min(1).max(40).default('announcement'),
  title: z.string().min(1).max(200),
  summary: z.string().max(500).optional(),
  body: z.string().max(20000).optional(),
  publishDate: z.string().datetime().optional(),
  isPublished: z.boolean().default(true),
});

const updateSchema = z.object({
  kind: z.string().min(1).max(40).optional(),
  title: z.string().min(1).max(200).optional(),
  summary: z.string().max(500).optional(),
  body: z.string().max(20000).optional(),
  publishDate: z.string().datetime().optional(),
  isPublished: z.boolean().optional(),
});

// List all press items (admin sees drafts too).
pressRouter.get('/', async (_req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.pressItem.findMany({
      orderBy: [{ publishDate: 'desc' }, { createdAt: 'desc' }],
    });
    res.status(200).json({ items });
  } catch (error) {
    next(error);
  }
});

pressRouter.post('/', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = createSchema.parse(req.body);
    const item = await prisma.pressItem.create({
      data: {
        kind: input.kind,
        title: input.title,
        summary: input.summary,
        body: input.body,
        publishDate: input.publishDate ? new Date(input.publishDate) : undefined,
        isPublished: input.isPublished,
      },
    });
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
});

pressRouter.patch('/:id', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateSchema.parse(req.body);
    const existing = await prisma.pressItem.findUnique({ where: { id: req.params.id ?? '' } });
    if (!existing) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    const item = await prisma.pressItem.update({
      where: { id: existing.id },
      data: {
        kind: input.kind,
        title: input.title,
        summary: input.summary,
        body: input.body,
        publishDate: input.publishDate ? new Date(input.publishDate) : undefined,
        isPublished: input.isPublished,
      },
    });
    res.status(200).json({ item });
  } catch (error) {
    next(error);
  }
});

pressRouter.delete('/:id', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.pressItem.findUnique({ where: { id: req.params.id ?? '' } });
    if (!existing) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    await prisma.pressItem.delete({ where: { id: existing.id } });
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
});
