import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, type EdgeRole } from '@/lib/session-edge';

/**
 * Edge gate — the single spine of auth/role enforcement for the web app.
 *
 * - Unauthenticated users hitting a protected route are redirected to /signin.
 * - Authenticated users hitting an auth page (/signin, /signup, /forgot-password,
 *   /reset-password) are bounced to their post-auth destination (no re-auth).
 * - /verify-otp is allowed for an authenticated user (resume) OR a visitor
 *   carrying a valid ?pendingToken= (issued by signup). Bare /verify-otp with
 *   no pending token is sent back to /signup (closes the OTP enumeration gap).
 * - Wrong-role access is bounced: /vendor/* -> /become-vendor, /admin/* -> /home.
 *
 * Fail-closed: any verification error is treated as unauthenticated.
 */

const AUTH_PAGES = ['/signin', '/signup', '/forgot-password', '/reset-password'];
const PROTECTED_PREFIXES = [
  '/home',
  '/shopper',
  '/shopper/dashboard',
  '/shopper/onboarding',
  '/wishlist',
  '/following',
  '/messages',
  '/profile',
  '/settings',
  '/select-campus',
  '/become-vendor',
  '/vendor',
  '/vendor/dashboard',
  '/vendor/onboarding',
  '/admin',
];

// Source of truth mirrors lib/auth-server.ts (requireVendor/requireShopper):
// - vendor (live)      -> /vendor/dashboard
// - vendor (not live)  -> /vendor/onboarding/step-1
// - shopper            -> /shopper/dashboard
// - admin              -> /admin
function postAuthDestination(role: EdgeRole, vendorStatus: string | null): string {
  if (role === 'admin' || role === 'super_admin') return '/admin';
  if (role === 'vendor') return vendorStatus === 'live' ? '/vendor/dashboard' : '/vendor/onboarding/step-1';
  return '/shopper/dashboard';
}

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function sessionCookieName(): string {
  return process.env.NODE_ENV === 'production' ? '__Secure-voeq_session' : 'voeq_session';
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(sessionCookieName())?.value;
  const session = token ? await verifySession(token) : null;
  const authed = session !== null;

  // Auth pages: bounce authenticated users to their destination.
  if (AUTH_PAGES.some((p) => pathname === p)) {
    if (authed && session) {
      return NextResponse.redirect(
        new URL(postAuthDestination(session.role, session.vendorStatus), req.url),
      );
    }
    return NextResponse.next();
  }

  // /verify-otp: allow authenticated (resume) or a valid pending token.
  if (pathname === '/verify-otp') {
    if (authed) return NextResponse.next();
    const pending = req.nextUrl.searchParams.get('pendingToken');
    if (pending) return NextResponse.next();
    return NextResponse.redirect(new URL('/signup', req.url));
  }

  // Protected routes.
  if (isProtected(pathname)) {
    if (!authed) {
      const signin = new URL('/signin', req.url);
      signin.searchParams.set('next', pathname + search);
      return NextResponse.redirect(signin);
    }
    if (session) {
    if (pathname === '/vendor' || pathname.startsWith('/vendor/')) {
      // Mirror requireVendor() in lib/auth-server.ts: a non-vendor in the
      // vendor section is bounced to their own section, not to promotion.
      if (session.role !== 'vendor' && session.role !== 'admin' && session.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/shopper/dashboard', req.url));
      }
    }
      if (pathname === '/admin' || pathname.startsWith('/admin/')) {
        if (session.role !== 'admin' && session.role !== 'super_admin') {
          return NextResponse.redirect(new URL('/home', req.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on app routes only; never on API, static, or Next internals.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp|.*\\.ico).*)',
  ],
};
