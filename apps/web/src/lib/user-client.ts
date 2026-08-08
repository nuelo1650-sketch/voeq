import { api } from './api';

export interface UserPreferences {
  emailMarketing: boolean;
  emailReviews: boolean;
  emailNewsletter: boolean;
  notifyNewListings: boolean;
  notifyNewReviews: boolean;
  notifyNewFollowers: boolean;
  notifyDisputes: boolean;
}

export async function getPreferences(): Promise<UserPreferences> {
  return api('/api/preferences/me');
}

export async function updatePreferences(prefs: Partial<UserPreferences>): Promise<{ preferences: UserPreferences }> {
  return api('/api/preferences/me', { method: 'PATCH', body: JSON.stringify(prefs) });
}

export async function deleteAccount(): Promise<{ deleted: boolean }> {
  return api('/api/preferences/me', { method: 'DELETE', body: JSON.stringify({ confirm: 'DELETE MY ACCOUNT' }) });
}
