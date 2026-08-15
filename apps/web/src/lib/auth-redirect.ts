export type PostAuthRole = 'buyer' | 'vendor' | 'admin' | 'super_admin';
export type VendorStatus = 'incomplete' | 'pending' | 'live' | 'rejected' | 'suspended' | null;

export interface PostAuthUser {
  role: PostAuthRole;
  vendorStatus: VendorStatus;
  agreementAcceptedAt?: Date | string | null;
  defaultCampusId?: string | null;
}

/**
 * Single source of truth for where a user lands after sign-in / sign-up / OTP.
 * Driven by the user's actual role + completion status — never by the button
 * they clicked. Enforces the chain: Auth -> Onboarding -> Dashboard.
 *
 * - Vendor (live)        -> /vendor/dashboard
 * - Vendor (not live)    -> /vendor/onboarding/step-1
 * - Buyer (complete)     -> /shopper/dashboard
 * - Buyer (incomplete)   -> /shopper/onboarding
 * - Admin                 -> /admin
 */
export function resolvePostAuthDestination(user: PostAuthUser, next?: string | null): string {
  const roleBased = (() => {
    if (user.role === 'admin' || user.role === 'super_admin') return '/admin';
    if (user.role === 'vendor') {
      return user.vendorStatus === 'live' ? '/vendor/dashboard' : '/vendor/onboarding/step-1';
    }
    const shopperReady = !!user.agreementAcceptedAt && !!user.defaultCampusId;
    return shopperReady ? '/shopper/dashboard' : '/shopper/onboarding';
  })();
  // An explicit, safe `next` (e.g. from "List your business") wins — but only if
  // it's a same-origin absolute path. Otherwise fall back to role-based routing.
  return next ? safeRedirect(next, roleBased) : roleBased;
}

/**
 * Validate a post-auth redirect target. Prevents open-redirect: only allow
 * same-origin, absolute-path destinations (e.g. "/vendor"). Anything with a
 * scheme, protocol-relative "//", "@", or a foreign host is rejected and the
 * caller's fallback is used instead.
 */
export function safeRedirect(dest: string | null | undefined, fallback = '/home'): string {
  if (!dest) return fallback;
  // Reject schemes, protocol-relative, and credential/authority tricks.
  if (/^(https?:)?\/\//i.test(dest) || dest.includes('@') || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(dest)) {
    return fallback;
  }
  // Must be an absolute path (starts with "/") — never a bare host or "//".
  if (!dest.startsWith('/')) return fallback;
  return dest;
}
