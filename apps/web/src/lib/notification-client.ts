import { api } from './api';

export interface NotificationItem {
  id: string;
  type: 'new_follower' | 'new_review' | 'review_response' | 'badge_earned' | 'new_message';
  payload: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationListResult {
  items: NotificationItem[];
  nextCursor: string | null;
  unreadCount: number;
}

export async function getNotifications(cursor?: string): Promise<NotificationListResult> {
  const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=20` : '?limit=20';
  return api<NotificationListResult>(`/api/notifications${qs}`);
}

export async function markNotificationRead(id: string): Promise<{ ok: true }> {
  return api<{ ok: true }>(`/api/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<{ ok: true }> {
  return api<{ ok: true }>('/api/notifications/read-all', { method: 'POST' });
}
