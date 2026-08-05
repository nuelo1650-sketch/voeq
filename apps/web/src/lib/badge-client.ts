import { api } from './api';

export interface BadgeDefinition {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export interface VendorBadge {
  id: string;
  badgeKey: string;
  earnedAt: string;
  revokedAt: string | null;
}

export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  newcomer: {
    key: 'newcomer',
    label: 'Newcomer',
    description: 'Profile complete with at least one listing. Welcome to Voeq!',
    icon: 'sprout',
    color: 'text-green-600',
  },
  active_seller: {
    key: 'active_seller',
    label: 'Active Seller',
    description: 'Live for 14+ days with complete profile.',
    icon: 'star',
    color: 'text-gold-600',
  },
  verified_presence: {
    key: 'verified_presence',
    label: 'Verified Presence',
    description: 'Admin confirmed physical location on campus.',
    icon: 'shield-check',
    color: 'text-forest-700',
  },
  quick_responder: {
    key: 'quick_responder',
    label: 'Quick Responder',
    description: 'Responds to messages within 24 hours.',
    icon: 'chat-bubble',
    color: 'text-blue-600',
  },
  rising_star: {
    key: 'rising_star',
    label: 'Rising Star',
    description: '10+ reviews with 4.0+ average rating.',
    icon: 'trending-up',
    color: 'text-orange-600',
  },
  top_rated: {
    key: 'top_rated',
    label: 'Top Rated',
    description: '50+ reviews with 4.5+ average rating.',
    icon: 'trophy',
    color: 'text-gold-600',
  },
  multi_talented: {
    key: 'multi_talented',
    label: 'Multi-Talented',
    description: 'Active listings in 3+ different categories.',
    icon: 'grid',
    color: 'text-purple-600',
  },
  community_pillar: {
    key: 'community_pillar',
    label: 'Community Pillar',
    description: '6+ months active, 100+ reviews, 4.7+ rating, no disputes.',
    icon: 'award',
    color: 'text-gold-600',
  },
};

export async function getAllBadges(): Promise<{ badges: BadgeDefinition[] }> {
  return api('/api/badges');
}

export async function getVendorBadges(vendorId: string): Promise<{ badges: VendorBadge[] }> {
  return api(`/api/badges/vendor/${vendorId}`);
}
