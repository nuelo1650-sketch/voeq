import { prisma } from '../lib/db';

export async function upsertConversation(
  shopperId: string,
  vendorId: string,
  listingId?: string | null,
) {
  const existing = await prisma.conversation.findUnique({
    where: { shopperId_vendorId: { shopperId, vendorId } },
  });
  if (existing) return existing;
  return prisma.conversation.create({
    data: { shopperId, vendorId, listingId: listingId ?? null },
  });
}

export async function listConversations(userId: string, role: string) {
  const where =
    role === 'vendor' ? { vendor: { userId } } : { shopperId: userId };

  const conversations = await prisma.conversation.findMany({
    where,
    orderBy: { lastMessageAt: 'desc' },
    include: {
      vendor: {
        select: { id: true, businessName: true, businessSlug: true, profilePhotoPublicId: true, userId: true },
      },
      shopper: {
        select: { id: true, name: true },
      },
      listing: {
        select: { id: true, title: true, slug: true },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
  });

  // Unread = messages not sent by me and not yet read.
  const withUnread = await Promise.all(
    conversations.map(async (c) => {
      const unread = await prisma.message.count({
        where: {
          conversationId: c.id,
          senderId: { not: userId },
          readAt: null,
        },
      });
      return {
        id: c.id,
        listingId: c.listingId,
        createdAt: c.createdAt,
        lastMessageAt: c.lastMessageAt,
        vendor: c.vendor,
        shopper: c.shopper,
        listing: c.listing,
        lastMessage: c.messages[0] ?? null,
        unreadCount: unread,
        totalMessages: c._count.messages,
      };
    }),
  );

  return withUnread;
}

export async function getMessages(
  conversationId: string,
  userId: string,
  limit: number,
  cursor?: string,
) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { vendor: { select: { userId: true } } },
  });
  if (!conversation) throw new Error('NotFound');
  const isParticipant =
    conversation.shopperId === userId || conversation.vendor.userId === userId;
  if (!isParticipant) throw new Error('Forbidden');

  const messages = await prisma.message.findMany({
    where: cursor
      ? { conversationId, createdAt: { lt: new Date(cursor) } }
      : { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    include: { sender: { select: { id: true, name: true } } },
  });

  const hasMore = messages.length > limit;
  const sliced = hasMore ? messages.slice(0, limit) : messages;
  const nextCursor =
    hasMore && sliced.length > 0 ? sliced[sliced.length - 1]?.createdAt?.toISOString() ?? null : null;

  return { messages: sliced.reverse(), nextCursor };
}

export async function sendMessage(conversationId: string, senderId: string, body: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { vendor: { select: { userId: true } } },
  });
  if (!conversation) throw new Error('NotFound');
  const isParticipant =
    conversation.shopperId === senderId || conversation.vendor.userId === senderId;
  if (!isParticipant) throw new Error('Forbidden');

  const message = await prisma.message.create({
    data: { conversationId, senderId, body },
    include: { sender: { select: { id: true, name: true } } },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });

  return message;
}

export async function markConversationRead(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { vendor: { select: { userId: true } } },
  });
  if (!conversation) throw new Error('NotFound');
  const isParticipant =
    conversation.shopperId === userId || conversation.vendor.userId === userId;
  if (!isParticipant) throw new Error('Forbidden');

  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });
}
