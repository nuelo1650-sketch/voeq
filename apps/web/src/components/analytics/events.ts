import posthog from 'posthog-js';

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!posthog.__loaded) return;
  posthog.capture(eventName, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (!posthog.__loaded) return;
  posthog.identify(userId, traits);
}

export function resetUser(): void {
  if (!posthog.__loaded) return;
  posthog.reset();
}

export const analytics = {
  signupCompleted: (method: 'google' | 'email' | 'magic_link') =>
    trackEvent('signup_completed', { method }),
  vendorGoLive: (vendorId: string) => trackEvent('vendor_go_live', { vendor_id: vendorId }),
  listingCreated: (categoryId: string, hasPhotos: boolean, priceRange: number) =>
    trackEvent('listing_created', { category_id: categoryId, has_photos: hasPhotos, price_range: priceRange }),
  searchPerformed: (query: string, resultsCount: number) =>
    trackEvent('search_performed', { query, results_count: resultsCount }),
  whatsappClicked: (vendorId: string, listingId?: string, fromContext?: string) =>
    trackEvent('whatsapp_clicked', { vendor_id: vendorId, listing_id: listingId, from: fromContext }),
  reviewSubmitted: (vendorId: string, rating: number) =>
    trackEvent('review_submitted', { vendor_id: vendorId, rating }),
  reportSubmitted: (vendorId: string, category: string) =>
    trackEvent('report_submitted', { vendor_id: vendorId, category }),
  requestSubmitted: (categoryId?: string) =>
    trackEvent('request_submitted', { category_id: categoryId }),
  badgeEarned: (badgeKey: string) => trackEvent('badge_earned', { badge_key: badgeKey }),
  campusSelected: (institutionName: string, campusName: string) =>
    trackEvent('campus_selected', { institution: institutionName, campus: campusName }),
  campusSwitched: (from: string, to: string) =>
    trackEvent('campus_switched', { from, to }),
};
