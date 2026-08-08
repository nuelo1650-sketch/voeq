import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { listListings, getListingBySlug } from '../services/listings.service';

export const listingsRouter: ReturnType<typeof Router> = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  campusId: z.string().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  verifiedOnly: z.coerce.boolean().optional(),
  sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'rating', 'popular']).default('newest'),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  radiusKm: z.coerce.number().positive().max(50).default(10),
});

listingsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = listQuerySchema.parse(req.query);
    const results = await listListings({
      campusId: params.campusId,
      categorySlug: params.category,
      page: params.page,
      limit: params.limit,
      sort: params.sort,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      search: params.search,
      minRating: params.minRating,
      verifiedOnly: params.verifiedOnly,
      lat: params.lat,
      lng: params.lng,
      radiusKm: params.radiusKm,
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
