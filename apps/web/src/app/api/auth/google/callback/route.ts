import { NextRequest, NextResponse } from 'next/server';
import { safeRedirect } from '@/lib/auth-redirect';

/**
 * Web-side Google OAuth callback.
 *
 * The API (voeq.onrender.com) cannot set the session cookie on the web domain
 * (voeq.ng) due to cross-domain scoping, so it redirects here with the signed
 * session token in the query string. This route sets the cookie on the web
 * domain with the same name/flags the API uses (SameSite=None; Secure; Path=/)
 * and then sends the user to their role-based destination.
 */
const COOKIE_NAME =
  process.env.NODE_ENV === 'production' ? '__Secure-voeq_session' : 'voeq_session';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  // Pin the post-auth destination to a same-origin absolute path (§12): reject
  // any scheme / protocol-relative / foreign-host value to close open-redirect.
  const dest = safeRedirect(searchParams.get('dest'), '/home');

  if (!token) {
    return NextResponse.redirect(new URL('/signin?error=oauth', req.url));
  }

  const isProd = process.env.NODE_ENV === 'production';
  const response = NextResponse.redirect(new URL(dest, req.url));
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'none',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
  return response;
}
