import { prisma } from '../lib/db';
import type { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  payload?: Record<string, unknown>;
}

/**
 * Fire-and-forget: a failed notification must never break the primary flow
 * (follow, review, badge sync). Swallow errors here.
 */
export async function notify(params: CreateNotificationParams): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        payload: (params.payload ?? {}) as object,
      },
    });
  } catch {
    // Analytics/notification failures should never break the user flow.
  }
}

export async function getNotifications(userId: string, limit: number, cursor?: string) {
  const items = await prisma.notification.findMany({
    where: cursor
      ? { userId, createdAt: { lt: new Date(cursor) } }
      : { userId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
  });

  const hasMore = items.length > limit;
  const sliced = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore && sliced.length > 0 ? sliced[sliced.length - 1]?.createdAt?.toISOString() ?? null : null;

  const unreadCount = await prisma.notification.count({
    where: { userId, readAt: null },
  });

  return { items: sliced, nextCursor, unreadCount };
}

export async function markRead(userId: string, notificationId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { readAt: new Date() },
  });
}

export async function markAllRead(userId: string): Promise<void> {
  await prisma.notification.updateMany({
    where: { userId, readAt: null },
    data: { readAt: new Date() },
  });
}
