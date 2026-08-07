import { Router, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/db';
import { logEvent } from '../services/analytics.service';
import { getClientIp } from '../utils/ip';
import { optionalAuth, type AuthedRequest } from '../middleware/auth';

export const whatsappRouter: ReturnType<typeof Router> = Router();

const clickSchema = z.object({
  vendorId: z.string().min(1),
  listingId: z.string().min(1).optional(),
});

function buildMessage(params: {
  listingTitle?: string;
  listingPrice?: string;
  listingUrl?: string;
  vendorName: string;
}): string {
  const lines: string[] = [];
  lines.push('Hi! I found this on Voeq and I\'m interested — is it still available?');
  if (params.listingTitle) {
    lines.push(`${params.listingTitle}${params.listingPrice ? ` — ${params.listingPrice}` : ''}`);
  } else {
    lines.push(params.vendorName);
  }
  if (params.listingUrl) {
    lines.push(params.listingUrl);
  }
  return lines.join('\n');
}

function formatPrice(min: number, max: number | null): string {
  const formatted = (n: number) => `₦${n.toLocaleString('en-NG')}`;
  if (max && max !== min) return `${formatted(min)} – ${formatted(max)}`;
  return formatted(min);
}

function normalizeUrl(path: string): string {
  const baseUrl = process.env.WEB_URL ?? 'http://localhost:3000';
  return `${baseUrl}${path}`;
}

whatsappRouter.post('/click', optionalAuth, async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const body = clickSchema.parse(req.body);

    const vendor = await prisma.vendor.findUnique({
      where: { id: body.vendorId },
      include: {
        campus: { select: { name: true, id: true } },
        listings: body.listingId ? {
          where: { id: body.listingId },
          take: 1,
          select: {
            id: true,
            title: true,
            slug: true,
            priceMin: true,
            priceMax: true,
            categoryId: true,
          },
        } : false,
      },
    });

    if (!vendor) {
      res.status(404).json({ error: 'VendorNotFound' });
      return;
    }

    let categoryId: string | undefined;
    let listingTitle: string | undefined;
    let listingPrice: string | undefined;
    let listingUrl: string | undefined;

    if (body.listingId && vendor.listings && vendor.listings.length > 0) {
      const listing = vendor.listings[0]!;
      categoryId = listing.categoryId;
      listingTitle = listing.title;
      listingPrice = formatPrice(Number(listing.priceMin), listing.priceMax ? Number(listing.priceMax) : null);
      listingUrl = normalizeUrl(`/l/${listing.slug}`);
    }

    const message = buildMessage({
      listingTitle,
      listingPrice,
      listingUrl,
      vendorName: vendor.businessName,
    });

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { whatsappClickCount: { increment: 1 } },
    });

    if (body.listingId) {
      await prisma.listing.update({
        where: { id: body.listingId },
        data: { whatsappClickCount: { increment: 1 } },
      });
    }

    await logEvent({
      eventType: 'whatsapp_click',
      userId: req.userId,
      sessionId: req.sessionId,
      vendorId: vendor.id,
      listingId: body.listingId,
      categoryId,
      campusId: vendor.campus.id,
      metadata: {
        vendorName: vendor.businessName,
        listingTitle,
        hasPrice: !!listingPrice,
      },
      ipAddress: getClientIp(req),
      userAgent: req.headers['user-agent'],
    });

    const phone = vendor.whatsappNumber.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;

    res.status(200).json({ url, message });
  } catch (error) {
    next(error);
  }
});
