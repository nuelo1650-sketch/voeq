import { Router, type Response, type NextFunction } from 'express';
import { SelectCampusSchema } from '../schemas/auth';
import { setDefaultCampus } from '../services/auth.service';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';
import { z } from 'zod';

export const usersRouter: ReturnType<typeof Router> = Router();

usersRouter.get('/me', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      include: {
        defaultCampus: {
          include: { institution: true },
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

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional(),
});

usersRouter.patch(
  '/me',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = updateProfileSchema.parse(req.body);
      const user = await prisma.user.update({
        where: { id: req.userId! },
        data: input,
      });
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },
);

usersRouter.post(
  '/me/campus',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const input = SelectCampusSchema.parse(req.body);
      const user = await setDefaultCampus(req.userId!, input.campusId);
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  },
);
