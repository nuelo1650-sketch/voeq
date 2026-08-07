import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { type AdminRequest } from '../../middleware/admin';
import { logAdminAction } from '../../middleware/audit';
import { prisma } from '../../lib/db';

export const emailsRouter: ReturnType<typeof Router> = Router();

const sendSchema = z.object({
  to: z.enum(['single', 'all_users', 'all_vendors', 'campus', 'category']),
  userId: z.string().optional(),
  campusId: z.string().optional(),
  categoryId: z.string().optional(),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(10000),
});

emailsRouter.post('/send', async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const input = sendSchema.parse(req.body);

    let recipients: Array<{ email: string; name?: string }> = [];
    if (input.to === 'single' && input.userId) {
      const user = await prisma.user.findUnique({ where: { id: input.userId }, select: { email: true, name: true } });
      if (user) recipients = [{ email: user.email, name: user.name ?? undefined }];
    } else if (input.to === 'all_users') {
      const items = await prisma.user.findMany({ where: { deletedAt: null }, select: { email: true, name: true } });
      recipients = items.map((u) => ({ email: u.email, name: u.name ?? undefined }));
    } else if (input.to === 'all_vendors') {
      const vendors = await prisma.vendor.findMany({ select: { user: { select: { email: true, name: true } } } });
      recipients = vendors.map((v) => ({ email: v.user.email, name: v.user.name ?? undefined }));
    } else if (input.to === 'campus' && input.campusId) {
      const items = await prisma.user.findMany({ where: { defaultCampusId: input.campusId, deletedAt: null }, select: { email: true, name: true } });
      recipients = items.map((u) => ({ email: u.email, name: u.name ?? undefined }));
    } else if (input.to === 'category' && input.categoryId) {
      const vendors = await prisma.vendor.findMany({
        where: { listings: { some: { categoryId: input.categoryId } } },
        select: { user: { select: { email: true, name: true } } },
      });
      recipients = vendors.map((v) => ({ email: v.user.email, name: v.user.name ?? undefined }));
    }

    const sent: string[] = [];
    for (const recipient of recipients.slice(0, 100)) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY ?? '');
        await resend.emails.send({
          from: process.env.ADMIN_EMAIL ?? 'admin@voeq.ng',
          to: recipient.email,
          subject: input.subject,
          html: `<p>${input.body.replace(/\n/g, '</p><p>')}</p>`,
        });
        sent.push(recipient.email);
      } catch (err) {
        console.error('Failed to send admin email', err);
      }
    }

    await logAdminAction(req, 'email.sent', 'email', undefined, {
      to: input.to,
      recipientCount: sent.length,
      subject: input.subject,
    });

    res.status(200).json({ sent: sent.length, recipients: sent });
  } catch (error) {
    next(error);
  }
});
