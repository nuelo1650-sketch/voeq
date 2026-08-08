import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { searchAll } from '../services/search.service';
import { logEvent } from '../services/analytics.service';
import { getClientIp } from '../utils/ip';
import { optionalAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';

export const searchRouter: ReturnType<typeof Router> = Router();

const querySchema = z.object({
  q: z.string().min(1).max(200),
  campusId: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
});

searchRouter.get('/', optionalAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const params = querySchema.parse(req.query);
    const results = await searchAll({
      query: params.q,
      campusId: params.campusId,
      categorySlug: params.category,
      page: params.page,
    });

    await logEvent({
      eventType: 'search',
      userId: req.userId,
      sessionId: req.sessionId,
      campusId: params.campusId,
      metadata: { query: params.q, category: params.category, results: results.totalListings + results.totalVendors },
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

searchRouter.get('/suggestions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = z.object({ q: z.string().min(1).max(50) }).parse(req.query);
    const query = q.toLowerCase();

    const [vendorSuggestions, categorySuggestions, listingSuggestions] = await Promise.all([
      prisma.vendor.findMany({
        where: {
          status: 'live',
          deletedAt: null,
          businessName: { contains: query, mode: 'insensitive' },
        },
        select: { businessName: true, businessSlug: true },
        take: 3,
      }),
      prisma.category.findMany({
        where: {
          isActive: true,
          name: { contains: query, mode: 'insensitive' },
        },
        select: { name: true, slug: true },
        take: 3,
      }),
      prisma.listing.findMany({
        where: {
          status: 'active',
          deletedAt: null,
          title: { contains: query, mode: 'insensitive' },
        },
        select: { title: true, slug: true },
        take: 3,
      }),
    ]);

    const suggestions = [
      ...vendorSuggestions.map((v) => ({ type: 'vendor', label: v.businessName, href: `/v/${v.businessSlug}` })),
      ...categorySuggestions.map((c) => ({ type: 'category', label: c.name, href: `/browse?category=${c.slug}` })),
      ...listingSuggestions.map((l) => ({ type: 'listing', label: l.title, href: `/l/${l.slug}` })),
    ];

    res.status(200).json({ suggestions });
  } catch (error) {
    next(error);
  }
});
