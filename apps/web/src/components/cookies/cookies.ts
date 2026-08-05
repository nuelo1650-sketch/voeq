const COOKIE_NAME = 'voeq_cookie_consent';
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface CookieConsent {
  necessary: true; // always true
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: string;
}

const CONSENT_VERSION = 'v1';

export function getConsent(): CookieConsent | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const decoded = JSON.parse(decodeURIComponent(match[1]!));
    if (decoded.version !== CONSENT_VERSION) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function setConsent(consent: Omit<CookieConsent, 'necessary' | 'timestamp' | 'version'>): void {
  const full: CookieConsent = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  const value = encodeURIComponent(JSON.stringify(full));
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax${secure}`;
}

export function clearConsent(): void {
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
}

export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics ?? false;
}

export function hasMarketingConsent(): boolean {
  const consent = getConsent();
  return consent?.marketing ?? false;
}
