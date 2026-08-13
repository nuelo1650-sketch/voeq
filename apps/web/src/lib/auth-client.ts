import { api } from './api';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'buyer' | 'vendor' | 'admin' | 'super_admin';
  emailVerified: Date | null;
  agreementAcceptedAt: Date | null;
  defaultCampusId: string | null;
  image?: string | null;
  vendorStatus: 'incomplete' | 'pending' | 'live' | 'rejected' | 'suspended' | null;
}

export async function signUpWithPassword(input: {
  email: string;
  name: string;
  password: string;
  agreedToTerms: true;
  agreementVersion: string;
}): Promise<{ otpSent: true }> {
  return api<{ otpSent: true }>('/api/auth/signup/password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function verifyOtp(input: { email: string; otp: string }): Promise<{ user: AuthUser }> {
  return api<{ user: AuthUser }>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function resendOtp(input: { email: string }): Promise<{ otpSent: true }> {
  return api<{ otpSent: true }>('/api/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return api<{ user: AuthUser }>('/api/auth/signin/password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function requestMagicLink(input: { email: string }): Promise<{ linkSent: true }> {
  return api<{ linkSent: true }>('/api/auth/magic-link', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function consumeMagicLink(token: string): Promise<{ user: AuthUser }> {
  return api<{ user: AuthUser }>('/api/auth/magic-link/consume', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function signOut(): Promise<{ signedOut: true }> {
  return api<{ signedOut: true }>('/api/auth/signout', { method: 'POST' });
}

export async function signInWithGoogle(): Promise<never> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
  window.location.href = `${API_URL}/api/auth/google`;
  return Promise.reject(new Error('Redirecting to Google'));
}

export async function acceptAgreement(version: string): Promise<{ accepted: true; user: AuthUser }> {
  return api('/api/auth/accept-agreement', {
    method: 'POST',
    body: JSON.stringify({ version }),
  });
}

export async function getMe(): Promise<{ user: AuthUser & { defaultCampus: { id: string; name: string; institution: { id: string; name: string } } | null } }> {
  return api('/api/users/me');
}

export async function setDefaultCampus(campusId: string): Promise<{ user: AuthUser }> {
  return api('/api/users/me/campus', {
    method: 'POST',
    body: JSON.stringify({ campusId }),
  });
}

export async function updateProfile(input: { name?: string; image?: string }): Promise<{ user: AuthUser }> {
  return api('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function requestPasswordReset(input: { email: string }): Promise<{ linkSent: true }> {
  return api<{ linkSent: true }>('/api/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function consumePasswordReset(input: {
  token: string;
  newPassword: string;
}): Promise<{ user: AuthUser }> {
  return api<{ user: AuthUser }>('/api/auth/password-reset/consume', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getCurrentAgreements(): Promise<{
  tos: { version: string; title: string; content: string } | null;
  privacy: { version: string; title: string; content: string } | null;
  vendorAgreement: { version: string; title: string; content: string } | null;
}> {
  return api('/api/agreements/current');
}
