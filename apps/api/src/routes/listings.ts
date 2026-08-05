import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { listListings, getListingBySlug } from '../services/listings.service';

export const listingsRouter: ReturnType<typeof Router> = Router();

const listQuerySchema = z.object({
  campusId: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  sort: z.enum(['newest', 'price_asc', 'price_desc']).default('newest'),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});

listingsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const results = await listListings({
      campusId: params.campusId,
      categorySlug: params.category,
      page: params.page,
      sort: params.sort,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    });
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

listingsRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await getListingBySlug(req.params.slug ?? '');
    if (!listing) {
      res.status(404).json({ error: 'NotFound' });
      return;
    }
    res.status(200).json({ listing });
  } catch (error) {
    next(error);
  }
});
