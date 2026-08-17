import { type NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Same-origin proxy to the API. Server components call /api-internal (via
 * serverApi) so the browser's voeq.ng session cookie — forwarded here from the
 * incoming request — can be sent to the API on its own domain. The upstream
 * Set-Cookie is returned to the browser scoped to voeq.ng, so getMe() works on
 * server components. Client components still call the API directly (its cookie is
 * SameSite=None; Secure, so cross-site works).
 */
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

async function handler(req: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  if (!API_URL) {
    return NextResponse.json({ error: 'API_URL not configured' }, { status: 500 });
  }
  const { path } = await ctx.params;
  // Callers already pass the full path including the leading /api (e.g.
  // api('/api/auth/signin') -> /api-internal/api/auth/signin). Forward as-is;
  // do NOT prepend another /api/ or the upstream receives /api/api/... and 404s.
  const upstream = `${API_URL.replace(/\/$/, '')}/${path?.join('/') ?? ''}${req.nextUrl.search}`;

  const cookie = req.headers.get('cookie') ?? '';
  const headersToSend: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (cookie) headersToSend['Cookie'] = cookie;

  const init: RequestInit = {
    method: req.method,
    headers: headersToSend,
    // Forward the request body for writes; GET/HEAD have none.
    body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text(),
    cache: 'no-store',
    // We forward cookies manually; don't let fetch attach its own.
    credentials: 'omit',
  };

  const upstreamRes = await fetch(upstream, init);
  const responseHeaders = new Headers();
  // Pass through content-type. For Set-Cookie, strip any Domain attribute so the
  // browser scopes the session cookie to voeq.ng (the proxy response host), since
  // the API cannot set a voeq.ng cookie directly from its own domain.
  const setCookie = upstreamRes.headers.get('set-cookie');
  upstreamRes.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'content-type') {
      responseHeaders.set(key, value);
    }
  });
  if (setCookie) {
    // Normalize the session cookie for the voeq.ng (web) ↔ Render (API)
    // cross-site relationship:
    //  - Strip any Domain attribute so the browser scopes the cookie to voeq.ng
    //    (the proxy response host); the API cannot set a voeq.ng cookie directly.
    //  - Force SameSite=None; Secure. The web app and API run on different
    //    domains, so the cookie is cross-site; a Lax cookie is dropped by the
    //    browser in that context, which breaks every authenticated page.
    // Do NOT split on commas: the Expires value ("Thu, 13 Aug 2026 ...") contains
    // commas, and splitting mangles the cookie so browsers reject it entirely
    // (no session -> all auth pages bounce to /signin).
    const normalized = setCookie
      .replace(/;\s*domain=[^;]+/i, '')
      .replace(/;\s*samesite=[^;]+/i, '')
      .replace(/;\s*secure\b/i, '')
      .trim()
      .replace(/$/, '; Secure; SameSite=None');
    responseHeaders.set('Set-Cookie', normalized);
  }

  const text = await upstreamRes.text();
  return new NextResponse(text || null, {
    status: upstreamRes.status,
    headers: responseHeaders,
  });
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const runtime = 'nodejs';

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
