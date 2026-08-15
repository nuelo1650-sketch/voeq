import { redirect } from 'next/navigation';
import { serverApi } from './server-api';
import type { AuthUser } from './auth-client';

export async function serverSignOut(): Promise<{ signedOut: true }> {
  return serverApi<{ signedOut: true }>('/api/auth/signout', { method: 'POST' });
}

export async function serverGetMe(): Promise<{ user: AuthUser & { defaultCampus: { id: string; name: string; institution: { id: string; name: string } } | null } }> {
  return serverApi('/api/users/me');
}

/**
 * Guard for any authenticated (main) route. Redirects to /signin when there is
 * no session. Returns the user on success.
 */
export async function requireAuth() {
  const me = await serverGetMe().catch(() => null);
  if (!me?.user) redirect('/signin');
  return me.user;
}

/**
 * Guard for vendor routes. Enforces that the authenticated user's role matches
 * the section: only vendors (and admins) may enter /vendor/*. A shopper (buyer)
 * who types /vendor/* is server-redirected to their own section — role-switching
 * by URL is impossible. Unauthenticated users go to /signin.
 */
export async function requireVendor() {
  const me = await serverGetMe().catch(() => null);
  if (!me?.user) redirect('/signin');
  if (me.user.role !== 'vendor' && me.user.role !== 'admin' && me.user.role !== 'super_admin') {
    redirect('/shopper/dashboard');
  }
  return me.user;
}

/**
 * Guard for shopper (buyer) routes. Only buyers may enter /shopper/*. A vendor
 * or admin who types /shopper/* is server-redirected to their section.
 */
export async function requireShopper() {
  const me = await serverGetMe().catch(() => null);
  if (!me?.user) redirect('/signin');
  if (me.user.role !== 'buyer') {
    // Vendors (and admins) belong in the vendor section or admin.
    redirect(me.user.vendorStatus === 'live' ? '/vendor/dashboard' : '/vendor/onboarding/step-1');
  }
  return me.user;
}

/**
 * Guard for super-admin routes. Redirects to /signin (no session) or /home
 * (authenticated but not an admin/super admin).
 */
export async function requireSuperUserAdmin() {
  const me = await serverGetMe().catch(() => null);
  if (!me?.user) redirect('/signin');
  if (me.user.role !== 'super_admin' && me.user.role !== 'admin') redirect('/home');
  return me.user;
}
