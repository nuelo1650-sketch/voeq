import { api } from './api';

export interface ConversationSummary {
  id: string;
  listingId: string | null;
  createdAt: string;
  lastMessageAt: string;
  vendor: {
    id: string;
    businessName: string;
    businessSlug: string;
    profilePhotoPublicId: string | null;
    userId: string;
  };
  shopper: {
    id: string;
    name: string | null;
  };
  listing: {
    id: string;
    title: string;
    slug: string;
  } | null;
  lastMessage: {
    id: string;
    body: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
  totalMessages: number;
}

export interface MessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string | null };
}

export interface MessagesResult {
  messages: MessageItem[];
  nextCursor: string | null;
}

export async function createConversation(vendorId: string, listingId?: string): Promise<{ id: string }> {
  return api<{ id: string }>('/api/conversations', {
    method: 'POST',
    body: JSON.stringify(listingId ? { vendorId, listingId } : { vendorId }),
  });
}

export async function getConversations(): Promise<{ conversations: ConversationSummary[] }> {
  return api<{ conversations: ConversationSummary[] }>('/api/conversations');
}

export async function getMessages(conversationId: string, cursor?: string): Promise<MessagesResult> {
  const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=30` : '?limit=30';
  return api<MessagesResult>(`/api/conversations/${conversationId}/messages${qs}`);
}

export async function sendMessage(conversationId: string, body: string): Promise<MessageItem> {
  return api<MessageItem>(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function markConversationRead(conversationId: string): Promise<{ ok: true }> {
  return api<{ ok: true }>(`/api/conversations/${conversationId}/read`, { method: 'PATCH' });
}
