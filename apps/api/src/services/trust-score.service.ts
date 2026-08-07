import { prisma } from '../lib/db';
import type { Vendor } from '@prisma/client';

export async function calculateTrustScore(vendor: Vendor): Promise<number> {
  let score = 50;

  const activeBadgeCount = await prisma.vendorBadge.count({
    where: { vendorId: vendor.id, revokedAt: null },
  });
  score += activeBadgeCount * 2;

  const reviewCount = vendor.ratingCount;
  score += Math.floor(reviewCount / 5);

  if (vendor.verifiedBadge) {
    score += 5;
  }

  const monthsActive = Math.floor(
    (Date.now() - vendor.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  score += Math.min(monthsActive, 12);

  const unresolvedReports = await prisma.report.count({
    where: { targetId: vendor.id, status: 'open' },
  });
  score -= unresolvedReports * 10;

  if (vendor.status === 'suspended') {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

export function getTrustScoreColor(score: number): 'red' | 'amber' | 'green' {
  if (score < 50) return 'red';
  if (score < 70) return 'amber';
  return 'green';
}

export function getTrustScoreLabel(score: number): string {
  if (score < 50) return 'Low trust';
  if (score < 70) return 'Building trust';
  if (score < 85) return 'Trusted';
  return 'Highly trusted';
}
