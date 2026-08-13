import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';

export const institutionsRouter: ReturnType<typeof Router> = Router();

institutionsRouter.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const institutions = await prisma.institution.findMany({
      where: { status: 'approved' },
      orderBy: { name: 'asc' },
      include: {
        campuses: {
          where: { isActive: true },
          orderBy: { isPrimary: 'desc' },
          select: { id: true, name: true, isPrimary: true },
        },
      },
    });
    res.status(200).json({ institutions });
  } catch (error) {
    next(error);
  }
});

const searchSchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().int().positive().max(20).default(10),
});

institutionsRouter.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = searchSchema.parse(req.query);
    const institutions = await prisma.institution.findMany({
      where: {
        status: 'approved',
        name: { contains: params.q, mode: 'insensitive' },
      },
      orderBy: { name: 'asc' },
      take: params.limit,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        campuses: {
          where: { isActive: true },
          orderBy: { isPrimary: 'desc' },
          take: 5,
          select: { id: true, name: true, isPrimary: true },
        },
      },
    });
    res.status(200).json({ institutions });
  } catch (error) {
    next(error);
  }
});

// Allow users to request an institution that isn't listed yet. Stored as a
// pending institution (status: 'pending') so admins can approve/review it.
const requestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().optional(),
});

institutionsRouter.post('/request', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = requestSchema.parse(req.body ?? {});
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    const existing = await prisma.institution.findFirst({
      where: { slug },
      select: { id: true, status: true },
    });
    if (existing) {
      // Already exists (approved or pending) — just acknowledge.
      return res.status(200).json({ requested: true, status: existing.status });
    }
    await prisma.institution.create({
      data: {
        name: name.trim(),
        slug,
        type: 'university',
        status: 'pending',
        requestedByEmail: email,
      },
    });
    res.status(201).json({ requested: true, status: 'pending' });
  } catch (error) {
    next(error);
  }
});
