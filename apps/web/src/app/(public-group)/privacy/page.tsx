import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: 'Voeq Privacy Policy — how we collect, use, and protect your data. NDPR 2019 / NDPA 2023 compliant. Effective August 7, 2026.',
  path: '/privacy',
});

const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: '1. Data Controller',
    body: 'Voeq (hello@voeq.ng)',
  },
  {
    heading: '2. What We Collect',
    body: 'Email address (all users, OTP-verified); name and business details (vendors); listing details — publicly displayed (vendors); reviews and reports (buyers/vendors); Google account basics, if used to sign up. Voeq does not collect or require National Identification Numbers (NIN), academic matriculation numbers, or passwords stored outside of Google/email\'s own authentication systems.',
  },
  {
    heading: '3. How We Use It',
    body: 'Operate search, browsing, storefronts, and the Connect feature; maintain trust and safety; communicate platform updates; generate aggregate, non-identifying demand insights for vendors.',
  },
  {
    heading: '4. Data Retention',
    body: 'Listing, review, and storefront content is retained while the account stays active, or as required by law after closure.',
  },
  {
    heading: '5. Data Sharing',
    body: 'Voeq does not sell personal data. Data is kept confidential and shared only where required by Nigerian law or regulation.',
  },
  {
    heading: '6. Your Rights',
    body: 'Under NDPR/NDPA, you may access, correct, or request deletion of your data, and withdraw consent for optional uses. Contact privacy@voeq.ng.',
  },
  {
    heading: '7. Security',
    body: 'Authentication is handled via Google Sign-In or email OTP, relying on their industry-standard security. Reasonable technical and organizational measures protect other user data. No system is completely secure.',
  },
  {
    heading: '8. Children\'s Privacy',
    body: 'Voeq is intended for users aged 13+.',
  },
  {
    heading: '9. Changes',
    body: 'This policy will be updated as new features launch.',
  },
  {
    heading: '10. Contact',
    body: 'privacy@voeq.ng',
  },
];

export default function PrivacyPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">
          Effective date: August 7, 2026 · Last updated: August 7, 2026
        </p>
        <p className="mt-2 text-sm text-forest-700/60 dark:text-cream-100/60">
          Prepared with reference to NDPR 2019 / NDPA 2023
        </p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{section.heading}</h2>
              <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-forest-700/90 dark:text-cream-100/90">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
