import { prisma } from '@voeq/db';
import type { EventType } from '@prisma/client';

interface LogEventParams {
  eventType: EventType;
  userId?: string;
  sessionId?: string;
  vendorId?: string;
  listingId?: string;
  categoryId?: string;
  campusId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logEvent(params: LogEventParams): Promise<void> {
  try {
    await prisma.eventLog.create({
      data: {
        eventType: params.eventType,
        userId: params.userId,
        sessionId: params.sessionId,
        vendorId: params.vendorId,
        listingId: params.listingId,
        categoryId: params.categoryId,
        campusId: params.campusId,
        metadata: params.metadata as object,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch {
    // Analytics failures should never break the user flow
  }
}
