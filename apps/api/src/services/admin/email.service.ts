import { prisma } from '@voeq/db';
import { env } from '../../config/env';
import { logger } from '../../config/logger';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendAdminEmail(input: {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  body: string;
}): Promise<{ sent: string[]; failed: string[] }> {
  const sent: string[] = [];
  const failed: string[] = [];

  for (const recipient of input.to.slice(0, 100)) {
    try {
      await resend.emails.send({
        from: env.ADMIN_EMAIL ?? 'admin@voeq.ng',
        to: recipient.email,
        subject: input.subject,
        html: `<p>${input.body.replace(/\n/g, '</p><p>')}</p>`,
      });
      sent.push(recipient.email);
    } catch (err) {
      logger.error({ err, email: recipient.email }, 'Failed to send admin email');
      failed.push(recipient.email);
    }
  }

  return { sent, failed };
}

export async function getEmailRecipients(type: 'single' | 'all_users' | 'all_vendors' | 'campus' | 'category', id?: string) {
  if (type === 'single' && id) {
    const user = await prisma.user.findUnique({ where: { id }, select: { email: true, name: true } });
    return user ? [{ email: user.email, name: user.name ?? undefined }] : [];
  }
  if (type === 'all_users') {
    return prisma.user.findMany({ where: { deletedAt: null }, select: { email: true, name: true } });
  }
  if (type === 'all_vendors') {
    return prisma.vendor.findMany({ select: { user: { select: { email: true, name: true } } } }).then((v) => v.map((x) => x.user));
  }
  if (type === 'campus' && id) {
    return prisma.user.findMany({ where: { defaultCampusId: id, deletedAt: null }, select: { email: true, name: true } });
  }
  if (type === 'category' && id) {
    return prisma.vendor
      .findMany({ where: { listings: { some: { categoryId: id } } }, select: { user: { select: { email: true, name: true } } } })
      .then((v) => v.map((x) => x.user));
  }
  return [];
}
