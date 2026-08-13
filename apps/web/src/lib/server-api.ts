// Server-only. Do not import from any 'use client' component.

import { cookies, headers } from 'next/headers';
import { ApiException, type ApiError } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL is not set. Add it to .env.local (local) and to the Vercel project environment variables (production).',
  );
}

/**
 * Server-component variant of `api()`. Forwards the incoming request's cookies
 * to the backend and disables Next.js fetch caching so one user's response is
 * never served to another user (cross-tenant data leakage).
 *
 * Mirror of `api()`'s error handling (ApiException, JSON parsing) — duplicated
 * deliberately, not shared state, so the fetch pipeline is self-contained.
 *
 * MUST be called from a server component, server action, or route handler.
 * Do NOT call from a client component — use `api()` there.
 */
export async function serverApi<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  // Server-to-API call. The browser's session cookie lives on the web domain
  // (voeq.ng), but the API runs on a separate domain (Render), so a direct
  // server fetch can't read it. Route through the same-origin internal proxy
  // (/api-internal) which forwards the incoming cookie to the API. This keeps
  // getMe() working on server components without cross-domain cookie hacks.
  const host = (await headers()).get('host');
  const base = host ? `${new URL('/api-internal', `http://${host}`).origin}` : '';

  try {
    const res = await fetch(`${base}${path}`, {
      ...options,
      // CRITICAL: do not cache. Next.js caches fetch() by default; without this,
      // the first authenticated user's response would be served to subsequent
      // users in the same render/cache window.
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...options.headers,
      },
    });

    let data: unknown = null;
    const contentType = res.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      const error = data as ApiError | null;
      const message = error?.message || error?.error || `Request failed with status ${res.status}`;
      throw new ApiException(message, res.status, error?.details);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }

    // Network error or other fetch failure
    if (error instanceof TypeError) {
      throw new ApiException('Network error. Please check your connection.', 0);
    }

    throw new ApiException('An unexpected error occurred.', 500);
  }
}
