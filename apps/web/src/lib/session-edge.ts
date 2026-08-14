import { jwtVerify } from 'jose';

export type EdgeRole = 'buyer' | 'vendor' | 'admin' | 'super_admin';
export type EdgeVendorStatus =
  | 'incomplete'
  | 'pending'
  | 'live'
  | 'rejected'
  | 'suspended'
  | null;

export interface EdgeSession {
  sub: string;
  email: string;
  role: EdgeRole;
  vendorStatus: EdgeVendorStatus;
}

/**
 * Verify the session JWT at the edge (middleware) using the same AUTH_SECRET
 * the API signs with. Fail-closed: any missing/expired/garbage token returns
 * null, and the caller treats the request as unauthenticated.
 */
export async function verifySession(token: string): Promise<EdgeSession | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (
      typeof payload.sub === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string'
    ) {
      return {
        sub: payload.sub,
        email: payload.email,
        role: payload.role as EdgeRole,
        vendorStatus: (payload.vendorStatus as EdgeVendorStatus) ?? null,
      };
    }
    return null;
  } catch {
    return null;
  }
}
