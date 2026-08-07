import { Router, type Router as ExpressRouter } from 'express';
import { prisma } from '../lib/db';

export const testRouter: ExpressRouter = Router();

testRouter.get('/db', async (_req, res, next) => {
  try {
    const [institutions, campuses, categories, users, agreements, featureFlags] = await Promise.all([
      prisma.institution.count(),
      prisma.campus.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.agreement.count(),
      prisma.featureFlag.count(),
    ]);

    res.status(200).json({
      institutions,
      campuses,
      categories,
      users,
      agreements,
      featureFlags,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});
