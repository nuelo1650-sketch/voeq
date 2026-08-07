import { type Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = buildMetadata({
  title: 'Vendor Agreement',
  description: 'Voeq Vendor Agreement — terms specific to vendors listing on the platform. Effective August 7, 2026.',
  path: '/vendor-agreement',
});

const VENDOR_AGREEMENT_CONTENT = `VENDOR AGREEMENT — Voeq
Effective date: August 7, 2026 · Last updated: August 7, 2026

This Vendor Agreement supplements the Voeq Terms of Service and applies to all vendors on the platform. By accepting this agreement, you confirm that you have read and agree to both documents.

1. Eligibility & Registration
- You must be the owner or authorized representative of a legitimate business or service.
- You must select your vendor status (Campus Vendor or Off-Campus Vendor) at registration.
- You must provide accurate business information, including a valid WhatsApp number.
- You must select your primary campus at registration. Your campus is fixed and cannot be changed without admin approval.

2. Listing Standards
- All listings must have accurate titles, descriptions, prices, and photos.
- Stock images are prohibited. Photos must represent the actual product or service.
- Each listing belongs to exactly one category. Vendors may create multiple listings across multiple categories.
- Voeq may edit or remove listings that violate these standards.

3. Prohibited Content
Vendors may not list:
- Counterfeit or unauthorized reproduction of official university credentials.
- Materials facilitating academic dishonesty.
- Narcotics, alcohol, vapes, shisha, or tobacco products.
- Ponzi schemes or fraudulent financial tools.
- Any content that violates Nigerian law.

4. Campus Presence
- Campus Vendors must be physically present on the campus they claim to operate on.
- Off-Campus Vendors must accurately represent their location.
- False location claims result in immediate suspension.
- Admin may verify your presence at any time.

5. Conduct
- You must communicate professionally with buyers.
- You must honor all advertised offerings, prices, and availability.
- You may not harass, spam, or defraud buyers.
- You may not solicit buyers to transact outside the platform once Phase 2 payments launch.

6. Fees & Promotion
- Basic listings on Voeq are free.
- Optional paid promotional features (featured placement, listing boosts) may be available for purchase.
- Voeq does not charge any commission on transactions between users.
- All fees are for platform visibility, never for transaction processing.

7. Badges & Trust Score
- Voeq awards badges for milestones (account age, review count, campus verification, etc.).
- Badges are earned automatically and may be revoked if criteria are no longer met.
- Your trust score reflects your overall standing on the platform.
- Badges and trust score are displayed on your storefront and listing cards.

8. Reporting & Suspension
- Buyers may report your profile or listings for: not on campus, scam or fraud, inappropriate content, impersonation, or harassment.
- 3 or more reports in 7 days will flag your account for admin review.
- Voeq may warn, restrict, suspend, or permanently remove your account for confirmed violations.
- You may appeal any suspension by contacting vendors@voeq.ng.

9. Reviews
- Buyers may leave reviews on your storefront.
- You may publicly respond to each review once.
- You may not bribe, coerce, or fake reviews.
- Voeq may remove reviews that violate platform standards.

10. Termination
- You may deactivate your account at any time.
- Voeq may terminate your account for violations of this agreement or the Terms of Service.
- Upon termination, your listings will be removed from search and browse.

11. Contact
- General: hello@voeq.ng
- Vendor-specific: vendors@voeq.ng`;

export default function VendorAgreementPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100 sm:text-6xl">
          Vendor Agreement
        </h1>
        <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">
          Effective date: August 7, 2026 · Last updated: August 7, 2026
        </p>
        <pre className="mt-12 whitespace-pre-wrap font-sans text-base leading-relaxed text-forest-700/90 dark:text-cream-100/90">
          {VENDOR_AGREEMENT_CONTENT}
        </pre>
      </Container>
    </Section>
  );
}
