import { serverApi } from './server-api';
import type { UserPreferences } from './user-client';

export async function serverGetPreferences(): Promise<UserPreferences> {
  return serverApi('/api/preferences/me');
}
