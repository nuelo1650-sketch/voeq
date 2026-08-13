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
