/**
 * Validate a post-auth redirect target. Prevents open-redirect: only allow
 * same-origin, absolute-path destinations (e.g. "/vendor"). Anything with a
 * scheme, protocol-relative "//", "@", or a foreign host is rejected and the
 * caller's fallback is used instead.
 */
export function safeRedirect(dest: string | null | undefined, fallback = '/home'): string {
  if (!dest) return fallback;
  if (/^(https?:)?\/\//i.test(dest) || dest.includes('@') || /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(dest)) {
    return fallback;
  }
  if (!dest.startsWith('/')) return fallback;
  return dest;
}
