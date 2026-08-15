import { Router, type Response, type NextFunction } from 'express';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { rateLimitWithFallback, uploadLimiter } from '../middleware/rate-limit-upstash';
import {
  uploadToCloudinary,
  moderateImage,
  validateImageType,
} from '../services/upload.service';
import { logEvent } from '../services/analytics.service';
import { getClientIp } from '../utils/ip';

export const uploadRouter: ReturnType<typeof Router> = Router();

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

uploadRouter.post(
  '/image',
  requireAuth,
  rateLimitWithFallback(uploadLimiter, { windowMs: 60 * 60 * 1000, max: 50, keyPrefix: 'upload' }),
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { data, filename, mimetype, folder } = req.body as {
        data: string;
        filename: string;
        mimetype: string;
        folder?: 'profile' | 'listing';
      };

      if (!data || !filename || !mimetype) {
        res.status(400).json({ error: 'MissingFields' });
        return;
      }

      if (!validateImageType(mimetype)) {
        res.status(400).json({ error: 'InvalidType', message: 'Only JPEG, PNG, WebP allowed' });
        return;
      }

      const buffer = Buffer.from(data, 'base64');
      if (buffer.length > MAX_UPLOAD_SIZE) {
        res.status(400).json({ error: 'TooLarge', message: 'Max 5MB' });
        return;
      }

      const moderation = await moderateImage(buffer);
      if (!moderation.safe) {
        res.status(400).json({
          error: 'ContentRejected',
          message: moderation.reason ?? 'Image rejected by moderation',
        });
        return;
      }

      const result = await uploadToCloudinary(buffer, `voeq/${folder ?? 'general'}`);

      await logEvent({
        eventType: 'page_view',
        userId: req.userId,
        metadata: {
          type: 'image_upload',
          publicId: result.publicId,
          size: result.size,
          width: result.width,
          height: result.height,
        },
        ipAddress: getClientIp(req),
        userAgent: req.headers['user-agent'],
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);
