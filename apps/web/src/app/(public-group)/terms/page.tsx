import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'Voeq Terms of Service — the rules and guidelines for using Voeq. Effective August 7, 2026.',
  path: '/terms',
});

const TOCS_CONTENT = `TERMS OF SERVICE — Voeq
Effective date: August 7, 2026 · Last updated: August 7, 2026

1. About Voeq
Voeq ("Voeq," "we," "us") is an independent, peer-to-peer vendor discovery directory. Voeq operates strictly as a digital classifieds and discovery board. Voeq does not process payments, does not hold funds in escrow, does not handle deliveries, and is not a party, broker, or agent to any transaction, sale, service, or agreement between a buyer and a vendor. All financial interactions, price negotiations, and exchanges happen entirely outside the platform (e.g. via WhatsApp or in person), at users' own risk.

2. Eligibility
- You must be at least 13 years old to create an account.
- Vendors select their status at registration (Campus Vendor or Off-Campus Vendor).
- Buyers may register using Google sign-in or email.
- A valid email address is required for all accounts and must be confirmed by one-time password (OTP) before the account is active.

3. Listings & Categories
- Each vendor may create one or more listings, each assigned to a single category.
- A vendor's storefront may contain listings across multiple categories.
- A vendor profile is not visible or searchable until it has at least one published listing and the vendor has accepted these Terms.
- Voeq may edit or remove a listing's category, title, or images if inaccurate, misleading, or in violation of these Terms.

4. Buyer Conduct
Buyers may browse freely without an account. An account with a verified email is required to use the Connect feature. Buyers agree to use Connect in good faith, not for harassment, spam, or fraud.

5. Prohibited Conduct & Content
No user may create fraudulent listings, use the platform to harass or defraud another user, or attempt to bypass reporting systems. The listing or promotion of the following is strictly prohibited:

- Counterfeit or unauthorized reproduction of official university rank, insignia, or credentials intended to enable impersonation. (Genuine, personally-owned uniforms, boots, berets, and accessories remain a permitted listing category.)
- Materials facilitating academic dishonesty, including leaked exams, assignment ghostwriting, or project duplication.
- Narcotics, prescription medication, unverified medical supplements, alcohol, electronic vapes, shisha, or tobacco products.
- Ponzi schemes, illicit financial tools, or fraudulent data-harvesting activity.

6. Reporting & Enforcement
Every listing and profile has a report/flag option. Voeq may warn, restrict, or permanently remove a vendor or listing for confirmed violations.

7. Fees & Platform Monetization
Basic listings on Voeq are free. Voeq may offer optional paid promotional features (e.g. featured placement, pinned storefronts, listing boosts) charged directly to vendors for visibility — never as a commission or fee on any transaction between users.

8. Disclaimers & Indemnification
Voeq does not guarantee the accuracy of listings, the quality or safety of any product or service, or the outcome of any interaction between users. Users assume all risk in their own transactions.
- Meetup Guidance: Users are strongly encouraged to conduct physical inspections and exchanges in well-lit, public, populated locations, and to avoid sending payment in advance of receiving a product or service.
- Indemnity: By using Voeq, you agree to indemnify and hold harmless Voeq's founders, developers, and administrators from claims, losses, or disputes arising from your interactions with other users, to the fullest extent permitted by Nigerian law.

9. Termination
Voeq may suspend or terminate accounts violating these Terms. Users may deactivate their account anytime.

10. Changes to These Terms
Terms may be updated as the platform evolves. Material changes will be communicated before taking effect.

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
          Effective date: August 7, 2026 · Last updated: August 7, 2026
        </p>
        <pre className="mt-12 whitespace-pre-wrap font-sans text-base leading-relaxed text-forest-700/90 dark:text-cream-100/90">
          {TOCS_CONTENT}
        </pre>
      </Container>
    </Section>
  );
}
