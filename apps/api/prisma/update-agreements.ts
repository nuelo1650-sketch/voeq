import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TOS_CONTENT = `TERMS OF SERVICE — Voeq
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

const PRIVACY_CONTENT = `PRIVACY POLICY — Voeq
Effective date: August 2, 2026 · Last updated: August 2, 2026 · Prepared with reference to NDPR 2019 / NDPA 2023

1. Data Controller: Voeq (hello@voeq.ng)

2. What We Collect: email address (all users, OTP-verified); name and business details (vendors); listing details — publicly displayed (vendors); reviews and reports (buyers/vendors); Google account basics, if used to sign up.

3. How We Use It: operate search, browsing, storefronts, and the Connect feature; maintain trust and safety; communicate updates including future feature and fee changes; generate aggregate, non-identifying demand insights for vendors.

4. Data Retention: listing, review, and storefront content is retained while the account stays active, or as required by law after closure.

5. Data Sharing: Voeq does not sell personal data. May be shared with future payment partners once in-platform payments launch, or law enforcement/regulators where legally required.

6. Your Rights: under NDPR/NDPA, you may access, correct, or request deletion of your data, and withdraw consent for optional uses. Contact privacy@voeq.ng.

7. Security: reasonable technical and organizational measures are used to protect user data. No system is completely secure.

8. Children's Privacy: Voeq is intended for users aged 13+.

9. Changes: this policy will be updated as new features, especially in-platform payments, launch.

10. Contact: privacy@voeq.ng`;

const VENDOR_CONTENT = `VENDOR AGREEMENT — Voeq
Effective date: August 2, 2026 · Last updated: August 2, 2026

This Vendor Agreement supplements the Voeq Terms of Service and applies to all vendors on the platform. By accepting this agreement, you confirm that you have read and agree to both documents.

1. Eligibility & Registration
- You must be the owner or authorized representative of a legitimate business or service.
- You must provide accurate business information, including a valid WhatsApp number.
- You must select your primary campus at registration. Your campus is fixed and cannot be changed without admin approval.

2. Listing Standards
- All listings must have accurate titles, descriptions, prices, and photos.
- Stock images are prohibited. Photos must represent the actual product or service.
- Each listing belongs to exactly one category. Vendors may create multiple listings across multiple categories.
- Voeq may edit or remove listings that violate these standards.

3. Campus Presence
- You must be physically present on the campus you claim to operate on.
- False campus claims result in immediate suspension.
- Admin may verify your presence at any time.

4. Conduct
- You must communicate professionally with buyers.
- You must honor all advertised offerings, prices, and availability.
- You may not harass, spam, or defraud buyers.
- You may not solicit buyers to transact outside the platform once Phase 2 payments launch.

5. Commission (Phase 2)
- When in-platform payments launch (planned January 2027), Voeq will take a 6.5% commission on all transactions.
- Paystack will process payments and take 1.5% of the 6.5%.
- Voeq's net commission will be approximately 5%.
- Buyers will not be charged any additional fees.
- Specific commission terms will be communicated 30 days before Phase 2 launch.

6. Badges & Trust Score
- Voeq awards badges for milestones (account age, review count, campus verification, etc.).
- Badges are earned automatically and may be revoked if criteria are no longer met.
- Your trust score reflects your overall standing on the platform.
- Badges and trust score are displayed on your storefront and listing cards.

7. Reporting & Suspension
- Buyers may report your profile or listings for: not on campus, scam or fraud, inappropriate content, impersonation, or harassment.
- 3 or more reports in 7 days will flag your account for admin review.
- Voeq may warn, restrict, suspend, or permanently remove your account for confirmed violations.
- You may appeal any suspension by contacting vendors@voeq.ng.

8. Reviews
- Buyers may leave reviews on your storefront.
- You may publicly respond to each review once.
- You may not bribe, coerce, or fake reviews.
- Voeq may remove reviews that violate platform standards (profanity, off-topic, doxxing).

9. Termination
- You may deactivate your account at any time.
- Voeq may terminate your account for violations of this agreement or the Terms of Service.
- Upon termination, your listings will be removed from search and browse, but may be retained internally for legal compliance.

10. Contact
- General: hello@voeq.ng
- Vendor-specific: vendors@voeq.ng`;

async function main(): Promise<void> {
  await prisma.agreement.update({
    where: { type_version: { type: 'tos', version: 'v1' } },
    data: { content: TOS_CONTENT },
  });

  await prisma.agreement.update({
    where: { type_version: { type: 'privacy', version: 'v1' } },
    data: { content: PRIVACY_CONTENT },
  });

  await prisma.agreement.update({
    where: { type_version: { type: 'vendor_agreement', version: 'v1' } },
    data: { content: VENDOR_CONTENT },
  });
}

main()
  .catch((e) => {
    process.stderr.write(`Update failed: ${e}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
