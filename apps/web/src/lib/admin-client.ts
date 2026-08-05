import { api } from './api';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: 'buyer' | 'vendor' | 'admin' | 'super_admin';
  status: 'active' | 'suspended';
  createdAt: string;
  lastSignInAt: string | null;
  agreementAcceptedAt: string | null;
  defaultCampus: { id: string; name: string; institution: { name: string } } | null;
}

export interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  liveVendors: number;
  pendingVendors: number;
  totalListings: number;
  totalReviews: number;
  openReports: number;
  whatsappClicksToday: number;
  whatsappClicksThisWeek: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  pendingInstitutions: number;
}

export async function getStats(): Promise<AdminStats> {
  return api('/api/admin/stats');
}

export interface AdminUsersListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listUsers(params: { page?: number; search?: string; role?: string; status?: string } = {}): Promise<AdminUsersListResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.search) qs.set('search', params.search);
  if (params.role) qs.set('role', params.role);
  if (params.status) qs.set('status', params.status);
  return api<AdminUsersListResponse>(`/api/admin/users?${qs.toString()}`);
}

export async function getUser(id: string) {
  return api(`/api/admin/users/${id}`);
}

export async function changeUserRole(id: string, role: string, confirm: string) {
  return api(`/api/admin/users/${id}/change-role`, {
    method: 'POST',
    body: JSON.stringify({ role, confirm }),
  });
}

export async function suspendUser(id: string, reason: string) {
  return api(`/api/admin/users/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function deleteUser(id: string, confirmEmail: string) {
  return api(`/api/admin/users/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ confirmEmail }),
  });
}

export async function listVendors(params: { page?: number; search?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  return api(`/api/admin/vendors?${qs.toString()}`);
}

export async function getVendor(id: string) {
  return api(`/api/admin/vendors/${id}`);
}

export async function verifyVendor(id: string) {
  return api(`/api/admin/vendors/${id}/verify`, { method: 'POST' });
}

export async function suspendVendor(id: string, reason: string) {
  return api(`/api/admin/vendors/${id}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function featureVendor(id: string, durationDays: number, notes?: string) {
  return api(`/api/admin/vendors/${id}/feature`, {
    method: 'POST',
    body: JSON.stringify({ durationDays, notes }),
  });
}

export async function listListings(params: { page?: number; search?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  return api(`/api/admin/listings?${qs.toString()}`);
}

export async function updateListingStatus(id: string, status: string, reason: string) {
  return api(`/api/admin/listings/${id}/update-status`, {
    method: 'POST',
    body: JSON.stringify({ status, reason }),
  });
}

export async function deleteListing(id: string) {
  return api(`/api/admin/listings/${id}`, { method: 'DELETE' });
}

export async function listReviews() {
  return api('/api/admin/reviews');
}

export async function moderateReview(id: string, action: 'hide' | 'delete' | 'restore', reason: string) {
  return api(`/api/admin/reviews/${id}/moderate`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
}

export async function listReports() {
  return api('/api/admin/reports');
}

export async function resolveReport(id: string, action: 'warned' | 'suspended' | 'no_action', notes?: string) {
  return api(`/api/admin/reports/${id}/resolve`, {
    method: 'POST',
    body: JSON.stringify({ action, notes }),
  });
}

export async function dismissReport(id: string) {
  return api(`/api/admin/reports/${id}/dismiss`, { method: 'POST' });
}

export async function listPendingInstitutions() {
  return api('/api/admin/institutions/pending');
}

export async function approveInstitution(id: string, type?: string) {
  return api(`/api/admin/institutions/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  });
}

export async function rejectInstitution(id: string) {
  return api(`/api/admin/institutions/${id}/reject`, { method: 'POST' });
}

export async function listCategories() {
  return api('/api/admin/categories');
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  return api(`/api/admin/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getAuditLog(params: { page?: number; action?: string; actorUserId?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.action) qs.set('action', params.action);
  if (params.actorUserId) qs.set('actorUserId', params.actorUserId);
  return api(`/api/admin/audit?${qs.toString()}`);
}

export async function startImpersonation(userId: string, duration: '1h' | '4h' | '24h', reason: string) {
  return api('/api/admin/impersonate/start', {
    method: 'POST',
    body: JSON.stringify({ userId, duration, reason }),
  });
}

export async function endImpersonation() {
  return api('/api/admin/impersonate/end', { method: 'POST' });
}

export async function triggerCron() {
  return api('/api/admin/system/cron/trigger', { method: 'POST' });
}

export async function getSystemHealth() {
  return api('/api/admin/system/health');
}

export interface SignupsChartResponse {
  data: Array<{ date: string; count: number }>;
}

export interface ClicksByCategoryResponse {
  data: Array<{ name: string; clicks: number }>;
}

export async function getSignupsChart(): Promise<SignupsChartResponse> {
  return api('/api/admin/analytics/signups');
}

export async function getClicksByCategory(): Promise<ClicksByCategoryResponse> {
  return api('/api/admin/analytics/clicks-by-category');
}

export function getExportURL(type: 'users' | 'vendors' | 'listings' | 'reviews'): string {
  return `${process.env.NEXT_PUBLIC_API_URL || ''}/api/admin/export/${type}`;
}

export async function sendEmail(input: {
  to: 'single' | 'all_users' | 'all_vendors' | 'campus' | 'category';
  userId?: string;
  campusId?: string;
  categoryId?: string;
  subject: string;
  body: string;
}) {
  return api('/api/admin/emails/send', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
