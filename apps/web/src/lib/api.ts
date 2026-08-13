const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
if (!API_URL) {
  // Client-side: don't crash the bundle, but surface the misconfiguration loudly.
  console.error(
    '[api] NEXT_PUBLIC_API_URL is not set — API calls will fail. Add it to the Vercel project environment variables.',
  );
}

export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
  statusCode?: number;
}

export class ApiException extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  // In the browser, route through the same-origin /api-internal proxy so the
  // session Set-Cookie is delivered from voeq.ng and scoped to it (the API runs
  // on a separate domain and cannot set a voeq.ng cookie directly). This is what
  // makes getMe() work on server components. Server-side stays on the absolute URL.
  const base = typeof window !== 'undefined' ? '/api-internal' : API_URL;
  try {
    const res = await fetch(`${base}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
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
