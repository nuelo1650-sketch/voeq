import { prisma } from '../lib/db';
import type { BadgeKey } from '@prisma/client';

export interface BadgeCriteria {
  key: BadgeKey;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGE_DEFINITIONS: Record<BadgeKey, BadgeCriteria> = {
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

interface BadgeCheckResult {
  earned: BadgeKey[];
  lost: BadgeKey[];
}

export async function checkVendorBadges(vendorId: string): Promise<BadgeCheckResult> {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      listings: {
        where: { status: 'active', deletedAt: null },
        select: { categoryId: true },
      },
      reviews: {
        where: { status: 'visible' },
        select: { rating: true },
      },
      _count: {
        select: {
          reviews: { where: { status: 'visible' } },
        },
      },
    },
  });

  if (!vendor) return { earned: [], lost: [] };

  const now = new Date();
  const daysSinceCreated = Math.floor((now.getTime() - vendor.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const activeListingsCount = vendor.listings.length;
  const uniqueCategories = new Set(vendor.listings.map((l) => l.categoryId)).size;
  const reviewCount = vendor._count.reviews;
  const avgRating = vendor.ratingAvg;

  const earned: BadgeKey[] = [];
  const lost: BadgeKey[] = [];

  if (activeListingsCount >= 1 && daysSinceCreated < 30) {
    earned.push('newcomer');
  } else if (daysSinceCreated >= 30) {
    lost.push('newcomer');
  }

  if (daysSinceCreated >= 14 && activeListingsCount >= 1) {
    earned.push('active_seller');
  }

  if (vendor.verifiedBadge) {
    earned.push('verified_presence');
  } else {
    lost.push('verified_presence');
  }

  const canEarnQuickResponder = await checkQuickResponderEligibility(vendorId);
  if (canEarnQuickResponder) {
    earned.push('quick_responder');
  } else {
    lost.push('quick_responder');
  }

  if (reviewCount >= 10 && avgRating >= 4.0) {
    earned.push('rising_star');
  } else {
    lost.push('rising_star');
  }

  if (reviewCount >= 50 && avgRating >= 4.5) {
    earned.push('top_rated');
  } else {
    lost.push('top_rated');
  }

  if (uniqueCategories >= 3) {
    earned.push('multi_talented');
  } else {
    lost.push('multi_talented');
  }

  if (daysSinceCreated >= 180 && reviewCount >= 100 && avgRating >= 4.7) {
    earned.push('community_pillar');
  } else {
    lost.push('community_pillar');
  }

  return { earned, lost };
}

export async function checkQuickResponderEligibility(_vendorId: string): Promise<boolean> {
  return false;
}

export async function syncVendorBadges(vendorId: string): Promise<{ awarded: BadgeKey[]; revoked: BadgeKey[] }> {
  const { earned, lost } = await checkVendorBadges(vendorId);

  const currentBadges = await prisma.vendorBadge.findMany({
    where: { vendorId, revokedAt: null },
  });
  const currentBadgeKeys = new Set(currentBadges.map((b) => b.badgeKey));

  const awarded: BadgeKey[] = [];
  for (const key of earned) {
    if (!currentBadgeKeys.has(key)) {
      await prisma.vendorBadge.create({
        data: { vendorId, badgeKey: key },
      });
      awarded.push(key);
    }
  }

  const revoked: BadgeKey[] = [];
  for (const key of lost) {
    if (currentBadgeKeys.has(key)) {
      await prisma.vendorBadge.updateMany({
        where: { vendorId, badgeKey: key, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: 'Criteria no longer met' },
      });
      revoked.push(key);
    }
  }

  return { awarded, revoked };
}

export async function syncAllVendorBadges(): Promise<{
  vendorsChecked: number;
  badgesAwarded: number;
  badgesRevoked: number;
}> {
  const vendors = await prisma.vendor.findMany({
    where: { status: { in: ['live', 'pending_review'] } },
    select: { id: true },
  });

  let totalAwarded = 0;
  let totalRevoked = 0;

  for (const vendor of vendors) {
    const { awarded, revoked } = await syncVendorBadges(vendor.id);
    totalAwarded += awarded.length;
    totalRevoked += revoked.length;
  }

  return {
    vendorsChecked: vendors.length,
    badgesAwarded: totalAwarded,
    badgesRevoked: totalRevoked,
  };
}
