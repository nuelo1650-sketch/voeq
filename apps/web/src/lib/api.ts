const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

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
  try {
    const res = await fetch(`${API_URL}${path}`, {
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
