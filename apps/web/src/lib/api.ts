const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error: ApiError = data ?? { error: 'NetworkError' };
    throw error;
  }

  return data as T;
}
