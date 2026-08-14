export type PostAuthRole = 'buyer' | 'vendor' | 'admin' | 'super_admin';
export type VendorStatus = 'incomplete' | 'pending' | 'live' | 'rejected' | 'suspended' | null;

export interface PostAuthUser {
  role: PostAuthRole;
  vendorStatus: VendorStatus;
}

/**
 * Single source of truth for where a user lands after sign-in / OTP / magic-link.
 * Driven by the user's actual role + vendor status — never by the signup button they clicked.
 */
export function resolvePostAuthDestination(user: PostAuthUser): string {
  if (user.role === 'admin' || user.role === 'super_admin') return '/admin';
  if (user.role === 'vendor') {
    return user.vendorStatus === 'live' ? '/vendor' : '/vendor/onboarding/step-1';
  }
  return '/home';
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
