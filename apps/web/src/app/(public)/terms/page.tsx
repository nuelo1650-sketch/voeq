import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'Voeq Terms of Service — the rules and guidelines for using Voeq. Effective August 2, 2026.',
  path: '/terms',
});

const TOCS_CONTENT = `TERMS OF SERVICE — Voeq
Effective date: August 2, 2026 · Last updated: August 2, 2026

1. About Voeq
Voeq ("Voeq," "we," "us") is a free vendor discovery directory. Voeq does not currently process payments, does not hold funds in escrow, and is not a party to any transaction, sale, or agreement between a buyer and a vendor. Connections are currently facilitated via WhatsApp, outside the platform. Voeq intends to introduce direct in-platform transactions in the future; this section will be updated when that launches.

2. Eligibility
- You must be at least 13 years old to create an account.
- Vendors select their status at registration.
- Buyers may register using Google sign-in or email.
- A valid email address is required for all accounts and must be confirmed by one-time password (OTP) before the account is active.

3. Listings & Categories
- Each vendor may create one or more listings, each assigned to a single category.
- A vendor's storefront may contain listings across multiple categories.
- A vendor profile is not visible or searchable until it has at least one published listing and the vendor has accepted these Terms.
- Voeq may edit or remove a listing's category, title, or images if inaccurate, misleading, or in violation of these Terms.

4. Buyer Conduct
Buyers may browse freely without an account. An account with a verified email is required to use the Connect feature. Buyers agree to use Connect in good faith, not for harassment, spam, or fraud.

5. Prohibited Conduct
No user may: create fraudulent listings; use the platform to harass or defraud another user; attempt to bypass reporting systems; scrape or extract platform data without permission.

6. Reporting & Enforcement
Every listing and profile has a report/flag option. Voeq may warn, restrict, or permanently remove a vendor or listing for confirmed violations.

7. Fees
Listing on Voeq is currently free. Optional paid features, transaction commissions, and in-platform payments are planned for the future; users will be notified before any fees take effect.

8. Disclaimers
Voeq does not guarantee the accuracy of listings, the quality of any product or service, or the outcome of any transaction. Users transact with each other at their own risk.

9. Termination
Voeq may suspend or terminate accounts violating these Terms. Users may deactivate their account anytime.

10. Changes to These Terms
Terms may be updated as new features launch, particularly payments. Material changes will be communicated before taking effect.

11. Governing Law
Governed by the laws of the Federal Republic of Nigeria.

12. Contact
hello@voeq.ng`;

export default function TermsPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100 sm:text-6xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">
          Effective date: August 2, 2026 · Last updated: August 2, 2026
        </p>
        <pre className="mt-12 whitespace-pre-wrap font-sans text-base leading-relaxed text-forest-700/90 dark:text-cream-100/90">
          {TOCS_CONTENT}
        </pre>
      </Container>
    </Section>
  );
}
