import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthedRequest } from '../middleware/auth';
import { prisma } from '../lib/db';
import {
  upsertConversation,
  listConversations,
  getMessages,
  sendMessage,
  markConversationRead,
} from '../services/conversation.service';
import { logEvent } from '../services/analytics.service';

export const conversationsRouter: ReturnType<typeof Router> = Router();

const createSchema = z.object({
  vendorId: z.string().min(1),
  listingId: z.string().min(1).optional(),
});

// Find-or-create a conversation. Logs conversation_started (contact signal)
// with a campusId when resolvable (shopper's default campus preferred).
conversationsRouter.post(
  '/',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { vendorId, listingId } = createSchema.parse(req.body);

      const [shopper, vendor] = await Promise.all([
        prisma.user.findUnique({ where: { id: req.userId! }, select: { defaultCampusId: true } }),
        prisma.vendor.findUnique({ where: { id: vendorId }, select: { id: true, campusId: true } }),
      ]);
      if (!vendor) {
        res.status(404).json({ error: 'VendorNotFound' });
        return;
      }

      const conversation = await upsertConversation(req.userId!, vendorId, listingId);

      // Only log on first creation (campusId may be null).
      if (conversation.createdAt.getTime() >= Date.now() - 2000) {
        const campusId = shopper?.defaultCampusId ?? vendor.campusId ?? null;
        await logEvent({
          eventType: 'conversation_started',
          userId: req.userId,
          vendorId,
          listingId: listingId ?? undefined,
          campusId: campusId ?? undefined,
        });
      }

      res.status(200).json({ id: conversation.id });
    } catch (error) {
      next(error);
    }
  },
);

conversationsRouter.get('/', requireAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const items = await listConversations(req.userId!, req.userRole ?? 'buyer');
    res.status(200).json({ conversations: items });
  } catch (error) {
    next(error);
  }
});

conversationsRouter.get(
  '/:id/messages',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const limit = Math.min(Number(req.query.limit) || 30, 50);
      const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
      const result = await getMessages(req.params.id!, req.userId!, limit, cursor);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
);

const messageSchema = z.object({ body: z.string().trim().min(1).max(4000) });

conversationsRouter.post(
  '/:id/messages',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const { body } = messageSchema.parse(req.body);
      const message = await sendMessage(req.params.id!, req.userId!, body);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  },
);

conversationsRouter.patch(
  '/:id/read',
  requireAuth,
  async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      await markConversationRead(req.params.id!, req.userId!);
      res.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);
