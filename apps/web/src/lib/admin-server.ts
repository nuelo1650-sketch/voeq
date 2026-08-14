// Server-only admin API wrappers. Mirror admin-client.ts but use serverApi so
// the session cookie is forwarded to the API (server components have no browser
// cookie jar). Import these from server components / actions only.
import { serverApi } from './server-api';

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
  return serverApi('/api/admin/stats');
}

export interface AdminUsersListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export async function listUsers(params: { page?: number; search?: string; role?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.search) qs.set('search', params.search);
  if (params.role) qs.set('role', params.role);
  if (params.status) qs.set('status', params.status);
  return serverApi<AdminUsersListResponse>(`/api/admin/users?${qs.toString()}`);
}

export async function listVendors(params: { page?: number; search?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  return serverApi(`/api/admin/vendors?${qs.toString()}`);
}

export async function listListings(params: { page?: number; search?: string; status?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.search) qs.set('search', params.search);
  if (params.status) qs.set('status', params.status);
  return serverApi(`/api/admin/listings?${qs.toString()}`);
}

export async function listReviews() {
  return serverApi('/api/admin/reviews');
}

export async function listReports() {
  return serverApi('/api/admin/reports');
}

export async function listPendingInstitutions() {
  return serverApi('/api/admin/institutions/pending');
}

export async function listCategories() {
  return serverApi('/api/admin/categories');
}

export async function getAuditLog(params: { page?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  return serverApi(`/api/admin/audit?${qs.toString()}`);
}

export async function getSignupsChart() {
  return serverApi('/api/admin/analytics/signups') as Promise<{ data: Array<{ date: string; count: number }> }>;
}

export async function getClicksByCategory() {
  return serverApi('/api/admin/analytics/clicks-by-category') as Promise<{ data: Array<{ name: string; clicks: number }> }>;
}

export async function getSystemHealth() {
  return serverApi('/api/admin/system/health');
}
