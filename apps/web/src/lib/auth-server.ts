import { serverApi } from './server-api';
import type { AuthUser } from './auth-client';

export async function serverSignOut(): Promise<{ signedOut: true }> {
  return serverApi<{ signedOut: true }>('/api/auth/signout', { method: 'POST' });
}

export async function serverGetMe(): Promise<{ user: AuthUser & { defaultCampus: { id: string; name: string; institution: { id: string; name: string } } | null } }> {
  return serverApi('/api/users/me');
}
