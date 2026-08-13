import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service',
  description: 'Voeq Terms of Service — the rules and guidelines for using Voeq. Effective August 7, 2026.',
  path: '/terms',
});

const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: '1. About Voeq',
    body: 'Voeq ("Voeq," "we," "us") is an independent, peer-to-peer vendor discovery directory. Voeq operates strictly as a digital classifieds and discovery board. Voeq does not process payments, does not hold funds in escrow, does not handle deliveries, and is not a party, broker, or agent to any transaction, sale, service, or agreement between a Shopper and a vendor. All financial interactions, price negotiations, and exchanges happen entirely outside the platform (e.g. via WhatsApp or in person), at users\' own risk.',
  },
  {
    heading: '2. Eligibility',
    body: 'You must be at least 13 years old to create an account. Vendors select their status at registration (Campus Vendor or Off-Campus Vendor). Shoppers may register using Google sign-in or email. A valid email address is required for all accounts and must be confirmed by one-time password (OTP) before the account is active.',
  },
  {
    heading: '3. Listings & Categories',
    body: 'Each vendor may create one or more listings, each assigned to a single category. A vendor\'s storefront may contain listings across multiple categories. A vendor profile is not visible or searchable until it has at least one published listing and the vendor has accepted these Terms. Voeq may edit or remove a listing\'s category, title, or images if inaccurate, misleading, or in violation of these Terms.',
  },
  {
    heading: '4. Shopper Conduct',
    body: 'Shoppers may browse freely without an account. An account with a verified email is required to use the Connect feature. Shoppers agree to use Connect in good faith, not for harassment, spam, or fraud.',
  },
  {
    heading: '5. Prohibited Conduct & Content',
    body: 'No user may create fraudulent listings, use the platform to harass or defraud another user, or attempt to bypass reporting systems. The listing or promotion of the following is strictly prohibited: Counterfeit or unauthorized reproduction of official university rank, insignia, or credentials intended to enable impersonation. (Genuine, personally-owned uniforms, boots, berets, and accessories remain a permitted listing category.) Materials facilitating academic dishonesty, including leaked exams, assignment ghostwriting, or project duplication. Narcotics, prescription medication, unverified medical supplements, alcohol, electronic vapes, shisha, or tobacco products. Ponzi schemes, illicit financial tools, or fraudulent data-harvesting activity.',
  },
  {
    heading: '6. Reporting & Enforcement',
    body: 'Every listing and profile has a report/flag option. Voeq may warn, restrict, or permanently remove a vendor or listing for confirmed violations.',
  },
  {
    heading: '7. Fees & Platform Monetization',
    body: 'Basic listings on Voeq are free. Voeq may offer optional paid promotional features (e.g. featured placement, pinned storefronts, listing boosts) charged directly to vendors for visibility — never as a commission or fee on any transaction between users.',
  },
  {
    heading: '8. Disclaimers & Indemnification',
    body: 'Voeq does not guarantee the accuracy of listings, the quality or safety of any product or service, or the outcome of any interaction between users. Users assume all risk in their own transactions. Meetup Guidance: Users are strongly encouraged to conduct physical inspections and exchanges in well-lit, public, populated locations, and to avoid sending payment in advance of receiving a product or service. Indemnity: By using Voeq, you agree to indemnify and hold harmless Voeq\'s founders, developers, and administrators from claims, losses, or disputes arising from your interactions with other users, to the fullest extent permitted by Nigerian law.',
  },
  {
    heading: '9. Termination',
    body: 'Voeq may suspend or terminate accounts violating these Terms. Users may deactivate their account anytime.',
  },
  {
    heading: '10. Changes to These Terms',
    body: 'Terms may be updated as the platform evolves. Material changes will be communicated before taking effect.',
  },
  {
    heading: '11. Governing Law',
    body: 'Governed by the laws of the Federal Republic of Nigeria.',
  },
  {
    heading: '12. Contact',
    body: 'hello@voeq.ng',
  },
];

export default function TermsPage() {
  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-4xl font-semibold text-forest-900 dark:text-cream-100 sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">
          Effective date: August 7, 2026 · Last updated: August 7, 2026
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
