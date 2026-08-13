import { Router } from 'express';
import { reviewsRouter } from './reviews';
import { reportsRouter } from './reports';
import { badgesRouter } from './badges';
import { cronRouter } from './cron';
import { pressPublicRouter } from './press';

export const apiRouter: ReturnType<typeof Router> = Router();

apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/badges', badgesRouter);
apiRouter.use('/cron', cronRouter);
apiRouter.use('/press', pressPublicRouter);
