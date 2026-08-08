import { PrismaClient, InstitutionSource, InstitutionStatus } from '@prisma/client';

const prisma = new PrismaClient();

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const AGREEMENT_V1_TOS = `TERMS OF SERVICE — Voeq
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

const AGREEMENT_V1_PRIVACY = `PRIVACY POLICY — Voeq
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

const AGREEMENT_V1_VENDOR = `VENDOR AGREEMENT — Voeq
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

const UNIVERSITIES: Array<{ name: string; city: string; state: string; type: 'university' | 'polytechnic' | 'college' | 'other' }> = [
  { name: 'University of Lagos', city: 'Lagos', state: 'Lagos', type: 'university' },
  { name: 'University of Ibadan', city: 'Ibadan', state: 'Oyo', type: 'university' },
  { name: 'Obafemi Awolowo University', city: 'Ile-Ife', state: 'Osun', type: 'university' },
  { name: 'Ahmadu Bello University', city: 'Zaria', state: 'Kaduna', type: 'university' },
  { name: 'University of Nigeria, Nsukka', city: 'Nsukka', state: 'Enugu', type: 'university' },
  { name: 'University of Benin', city: 'Benin City', state: 'Edo', type: 'university' },
  { name: 'Bayero University Kano', city: 'Kano', state: 'Kano', type: 'university' },
  { name: 'University of Port Harcourt', city: 'Port Harcourt', state: 'Rivers', type: 'university' },
  { name: 'University of Calabar', city: 'Calabar', state: 'Cross River', type: 'university' },
  { name: 'University of Abuja', city: 'Abuja', state: 'FCT', type: 'university' },
  { name: 'University of Ilorin', city: 'Ilorin', state: 'Kwara', type: 'university' },
  { name: 'University of Jos', city: 'Jos', state: 'Plateau', type: 'university' },
  { name: 'University of Maiduguri', city: 'Maiduguri', state: 'Borno', type: 'university' },
  { name: 'Usman Dan Fodio University', city: 'Sokoto', state: 'Sokoto', type: 'university' },
  { name: 'Federal University Oye-Ekiti', city: 'Oye-Ekiti', state: 'Ekiti', type: 'university' },
  { name: 'Federal University Dutse', city: 'Dutse', state: 'Jigawa', type: 'university' },
  { name: 'Federal University Kashere', city: 'Kashere', state: 'Gombe', type: 'university' },
  { name: 'Federal University Lafia', city: 'Lafia', state: 'Nasarawa', type: 'university' },
  { name: 'Federal University Lokoja', city: 'Lokoja', state: 'Kogi', type: 'university' },
  { name: 'Alex Ekwueme Federal University Ndufu-Alike', city: 'Ndufu-Alike', state: 'Ebonyi', type: 'university' },
  { name: 'Federal University Otuoke', city: 'Otuoke', state: 'Bayelsa', type: 'university' },
  { name: 'Federal University Wukari', city: 'Wukari', state: 'Taraba', type: 'university' },
  { name: 'Federal University Birnin Kebbi', city: 'Birnin Kebbi', state: 'Kebbi', type: 'university' },
  { name: 'Federal University Gusau', city: 'Gusau', state: 'Zamfara', type: 'university' },
  { name: 'Federal University Dutsin-Ma', city: 'Dutsin-Ma', state: 'Katsina', type: 'university' },
  { name: 'Federal University of Technology Akure', city: 'Akure', state: 'Ondo', type: 'university' },
  { name: 'Federal University of Technology Minna', city: 'Minna', state: 'Niger', type: 'university' },
  { name: 'Federal University of Technology Owerri', city: 'Owerri', state: 'Imo', type: 'university' },
  { name: 'Modibbo Adama University of Technology', city: 'Yola', state: 'Adamawa', type: 'university' },
  { name: 'Nigerian Defence Academy', city: 'Kaduna', state: 'Kaduna', type: 'university' },
  { name: 'Nigerian Police Academy', city: 'Wudil', state: 'Kano', type: 'university' },
  { name: 'Air Force Institute of Technology', city: 'Kaduna', state: 'Kaduna', type: 'university' },
  { name: 'Lagos State University', city: 'Lagos', state: 'Lagos', type: 'university' },
  { name: 'Ambrose Alli University', city: 'Ekpoma', state: 'Edo', type: 'university' },
  { name: 'Chukwuemeka Odumegwu Ojukwu University', city: 'Uli', state: 'Anambra', type: 'university' },
  { name: 'Benue State University', city: 'Makurdi', state: 'Benue', type: 'university' },
  { name: 'Cross River University of Technology', city: 'Calabar', state: 'Cross River', type: 'university' },
  { name: 'Delta State University', city: 'Abraka', state: 'Delta', type: 'university' },
  { name: 'Ebonyi State University', city: 'Abakaliki', state: 'Ebonyi', type: 'university' },
  { name: 'Edo State University', city: 'Benin City', state: 'Edo', type: 'university' },
  { name: 'Ekiti State University', city: 'Ado-Ekiti', state: 'Ekiti', type: 'university' },
  { name: 'Enugu State University of Science and Technology', city: 'Enugu', state: 'Enugu', type: 'university' },
  { name: 'Gombe State University', city: 'Gombe', state: 'Gombe', type: 'university' },
  { name: 'Ibrahim Badamasi Babangida University', city: 'Lapai', state: 'Niger', type: 'university' },
  { name: 'Imo State University', city: 'Owerri', state: 'Imo', type: 'university' },
  { name: 'Kaduna State University', city: 'Kaduna', state: 'Kaduna', type: 'university' },
  { name: 'Kano University of Science and Technology', city: 'Wudil', state: 'Kano', type: 'university' },
  { name: 'Kebbi State University of Science and Technology', city: 'Aliero', state: 'Kebbi', type: 'university' },
  { name: 'Kogi State University', city: 'Anyigba', state: 'Kogi', type: 'university' },
  { name: 'Kwara State University', city: 'Malete', state: 'Kwara', type: 'university' },
  { name: 'Ladoke Akintola University of Technology', city: 'Ogbomoso', state: 'Oyo', type: 'university' },
  { name: 'Nasarawa State University, Keffi', city: 'Keffi', state: 'Nasarawa', type: 'university' },
  { name: 'Niger Delta University', city: 'Wilberforce Island', state: 'Bayelsa', type: 'university' },
  { name: 'Olabisi Onabanjo University', city: 'Ago-Iwoye', state: 'Ogun', type: 'university' },
  { name: 'Ondo State University of Science and Technology', city: 'Okitipupa', state: 'Ondo', type: 'university' },
  { name: 'Osun State University', city: 'Osogbo', state: 'Osun', type: 'university' },
  { name: 'Plateau State University', city: 'Bokkos', state: 'Plateau', type: 'university' },
  { name: 'Rivers State University', city: 'Port Harcourt', state: 'Rivers', type: 'university' },
  { name: 'Sokoto State University', city: 'Sokoto', state: 'Sokoto', type: 'university' },
  { name: 'Taraba State University', city: 'Jalingo', state: 'Taraba', type: 'university' },
  { name: 'Yobe State University', city: 'Damaturu', state: 'Yobe', type: 'university' },
  { name: 'Zamfara State University', city: 'Talata Mafara', state: 'Zamfara', type: 'university' },
  { name: 'Abia State University', city: 'Uturu', state: 'Abia', type: 'university' },
  { name: 'Adamawa State University', city: 'Mubi', state: 'Adamawa', type: 'university' },
  { name: 'Akwa Ibom State University', city: 'Ikot Akpaden', state: 'Akwa Ibom', type: 'university' },
  { name: 'Bauchi State University', city: 'Gadau', state: 'Bauchi', type: 'university' },
  { name: 'Borno State University', city: 'Maiduguri', state: 'Borno', type: 'university' },
  { name: 'Sule Lamido State University', city: 'Kafin Hausa', state: 'Jigawa', type: 'university' },
  { name: "Sa'adatu Rimi College of Education, Kano", city: 'Kano', state: 'Kano', type: 'college' },
  { name: 'Tai Solarin University of Education', city: 'Ijebu-Ode', state: 'Ogun', type: 'university' },
  { name: 'Alvan Ikoku Federal College of Education', city: 'Owerri', state: 'Imo', type: 'college' },
  { name: 'Adeyemi College of Education', city: 'Ondo', state: 'Ondo', type: 'college' },
  { name: 'Covenant University', city: 'Ota', state: 'Ogun', type: 'university' },
  { name: 'Babcock University', city: 'Ilishan-Remo', state: 'Ogun', type: 'university' },
  { name: 'Afe Babalola University', city: 'Ado-Ekiti', state: 'Ekiti', type: 'university' },
  { name: 'Pan-Atlantic University', city: 'Lagos', state: 'Lagos', type: 'university' },
  { name: 'American University of Nigeria', city: 'Yola', state: 'Adamawa', type: 'university' },
  { name: 'Nile University of Nigeria', city: 'Abuja', state: 'FCT', type: 'university' },
  { name: 'Baze University', city: 'Abuja', state: 'FCT', type: 'university' },
  { name: 'Veritas University', city: 'Abuja', state: 'FCT', type: 'university' },
  { name: 'Nigerian Maritime University', city: 'Okerenkoko', state: 'Delta', type: 'university' },
  { name: 'Bells University of Technology', city: 'Ota', state: 'Ogun', type: 'university' },
  { name: 'Benson Idahosa University', city: 'Benin City', state: 'Edo', type: 'university' },
  { name: 'Bowen University', city: 'Iwo', state: 'Osun', type: 'university' },
  { name: 'Caleb University', city: 'Lagos', state: 'Lagos', type: 'university' },
  { name: 'Caritas University', city: 'Enugu', state: 'Enugu', type: 'university' },
  { name: 'Christopher University', city: 'Sango-Otta', state: 'Ogun', type: 'university' },
  { name: 'Coal City University', city: 'Enugu', state: 'Enugu', type: 'university' },
  { name: 'Crescent University', city: 'Abeokuta', state: 'Ogun', type: 'university' },
  { name: 'Elizade University', city: 'Ilara-Mokin', state: 'Ondo', type: 'university' },
  { name: 'Evangel University', city: 'Akaeze', state: 'Ebonyi', type: 'university' },
  { name: 'Gregory University', city: 'Uturu', state: 'Abia', type: 'university' },
  { name: 'Hallmark University', city: 'Iju', state: 'Ogun', type: 'university' },
  { name: 'Hezekiah University', city: 'Ibadan', state: 'Oyo', type: 'university' },
  { name: 'Igbinedion University Okada', city: 'Okada', state: 'Edo', type: 'university' },
  { name: 'Kings University', city: 'Osun', state: 'Osun', type: 'university' },
  { name: 'Kola Daisi University', city: 'Ibadan', state: 'Oyo', type: 'university' },
  { name: 'Lead City University', city: 'Ibadan', state: 'Oyo', type: 'university' },
  { name: 'Madonna University', city: 'Okija', state: 'Anambra', type: 'university' },
  { name: 'McPherson University', city: 'Seriki Sotayo', state: 'Ogun', type: 'university' },
  { name: 'Micheal and Cecilia Ibru University', city: 'Agbarha-Otor', state: 'Delta', type: 'university' },
  { name: 'Mountain Top University', city: 'Makogi', state: 'Ogun', type: 'university' },
  { name: 'Novena University', city: 'Ogume', state: 'Delta', type: 'university' },
  { name: 'Obong University', city: 'Obong Ntak', state: 'Akwa Ibom', type: 'university' },
  { name: 'Oduduwa University', city: 'Ile-Ife', state: 'Osun', type: 'university' },
  { name: 'Precious Cornerstone University', city: 'Ibadan', state: 'Oyo', type: 'university' },
  { name: "Redeemer's University", city: 'Ede', state: 'Osun', type: 'university' },
  { name: 'Renaissance University', city: 'Enugu', state: 'Enugu', type: 'university' },
  { name: 'Rhema University', city: 'Aba', state: 'Abia', type: 'university' },
  { name: 'Samuel Adegboyega University', city: 'Ogwa', state: 'Edo', type: 'university' },
  { name: 'Southwestern University', city: 'Okun-Owa', state: 'Ogun', type: 'university' },
  { name: 'Summit University', city: 'Offa', state: 'Kwara', type: 'university' },
  { name: 'Tansian University', city: 'Umunya', state: 'Anambra', type: 'university' },
  { name: 'University of Mkar', city: 'Mkar', state: 'Benue', type: 'university' },
  { name: 'Wellspring University', city: 'Benin City', state: 'Edo', type: 'university' },
  { name: 'Western Delta University', city: 'Oghara', state: 'Delta', type: 'university' },
  { name: 'Wesley University', city: 'Ondo', state: 'Ondo', type: 'university' },
  { name: 'Joseph Ayo Babalola University', city: 'Ikeji-Arakeji', state: 'Osun', type: 'university' },
  { name: 'Atiku Abubakar University, Yola', city: 'Yola', state: 'Adamawa', type: 'university' },
  { name: 'Spiritan University, Nneochi', city: 'Nneochi', state: 'Abia', type: 'university' },
  { name: 'Clifford University', city: 'Owerrinta', state: 'Abia', type: 'university' },
  { name: 'Godfrey Okoye University', city: 'Enugu', state: 'Enugu', type: 'university' },
  { name: 'Dominican University, Ibadan', city: 'Ibadan', state: 'Oyo', type: 'university' },
  { name: 'Skyline University Nigeria', city: 'Kano', state: 'Kano', type: 'university' },
  { name: 'Trinity University, Yaba', city: 'Lagos', state: 'Lagos', type: 'university' },
  { name: 'University of Africa, Toru-Orua', city: 'Toru-Orua', state: 'Bayelsa', type: 'university' },
  { name: 'Greenfield University', city: 'Kaduna', state: 'Kaduna', type: 'university' },
  { name: 'Topfaith University', city: 'Makurdi', state: 'Benue', type: 'university' },
  { name: 'Hensard University', city: 'Port Harcourt', state: 'Rivers', type: 'university' },
  { name: 'Nigerian British University', city: 'Asaba', state: 'Delta', type: 'university' },
  { name: 'Dorben Polytechnic', city: 'Abuja', state: 'FCT', type: 'polytechnic' },
  { name: 'Yaba College of Technology', city: 'Lagos', state: 'Lagos', type: 'polytechnic' },
  { name: 'Federal Polytechnic Ilaro', city: 'Ilaro', state: 'Ogun', type: 'polytechnic' },
  { name: 'The Polytechnic Ibadan', city: 'Ibadan', state: 'Oyo', type: 'polytechnic' },
  { name: 'Auchi Polytechnic', city: 'Auchi', state: 'Edo', type: 'polytechnic' },
  { name: 'Federal Polytechnic Bida', city: 'Bida', state: 'Niger', type: 'polytechnic' },
];

const CAMPUSES: Array<{ institutionName: string; campuses: Array<{ name: string; isPrimary: boolean }> }> = [
  {
    institutionName: 'University of Lagos',
    campuses: [
      { name: 'Akoka', isPrimary: true },
      { name: 'Idi-Araba (College of Medicine)', isPrimary: false },
      { name: 'Surulere', isPrimary: false },
    ],
  },
  {
    institutionName: 'University of Ibadan',
    campuses: [
      { name: 'Ibadan Main', isPrimary: true },
      { name: 'University College Hospital', isPrimary: false },
    ],
  },
  {
    institutionName: 'Obafemi Awolowo University',
    campuses: [
      { name: 'Ile-Ife Main', isPrimary: true },
      { name: 'College of Health Sciences', isPrimary: false },
    ],
  },
  {
    institutionName: 'Ahmadu Bello University',
    campuses: [
      { name: 'Zaria Main', isPrimary: true },
      { name: 'Institute of Administration', isPrimary: false },
    ],
  },
  {
    institutionName: 'University of Nigeria, Nsukka',
    campuses: [
      { name: 'Nsukka Main', isPrimary: true },
      { name: 'Enugu Campus', isPrimary: false },
    ],
  },
  {
    institutionName: 'Lagos State University',
    campuses: [
      { name: 'Ojo', isPrimary: true },
      { name: 'Epe', isPrimary: false },
    ],
  },
  {
    institutionName: 'Nigerian Maritime University',
    campuses: [
      { name: 'Okerenkoko', isPrimary: true },
      { name: 'Kurutie', isPrimary: false },
    ],
  },
  {
    institutionName: 'Covenant University',
    campuses: [{ name: 'Ota', isPrimary: true }],
  },
  {
    institutionName: 'Babcock University',
    campuses: [
      { name: 'Ilishan-Remo', isPrimary: true },
      { name: 'Adler Campus', isPrimary: false },
    ],
  },
  {
    institutionName: 'University of Port Harcourt',
    campuses: [
      { name: 'Choba', isPrimary: true },
      { name: 'Abuja Campus', isPrimary: false },
    ],
  },
  {
    institutionName: 'University of Abuja',
    campuses: [
      { name: 'Main Campus', isPrimary: true },
      { name: 'Distance Learning', isPrimary: false },
    ],
  },
];

const CATEGORIES: Array<{
  slug: string;
  name: string;
  iconName: string;
  displayOrder: number;
  description: string;
}> = [
  { slug: 'food', name: 'Food', iconName: 'utensils', displayOrder: 1, description: 'Meals, snacks, drinks, and food vendors on campus.' },
  { slug: 'fashion', name: 'Fashion', iconName: 'shirt', displayOrder: 2, description: 'Clothing, shoes, bags, and fashion accessories.' },
  { slug: 'tech', name: 'Tech', iconName: 'cpu', displayOrder: 3, description: 'Phones, laptops, gadgets, repairs, and tech services.' },
  { slug: 'laundry', name: 'Laundry', iconName: 'shirt', displayOrder: 4, description: 'Wash, dry clean, iron, and laundry pickup.' },
  { slug: 'beauty', name: 'Beauty', iconName: 'sparkles', displayOrder: 5, description: 'Makeup, hair, skincare, and beauty services.' },
  { slug: 'repairs', name: 'Repairs', iconName: 'wrench', displayOrder: 6, description: 'Phone, laptop, electronics, and general repairs.' },
  { slug: 'printing', name: 'Printing', iconName: 'printer', displayOrder: 7, description: 'Printing, photocopying, binding, and stationery.' },
  { slug: 'photography', name: 'Photography', iconName: 'camera', displayOrder: 8, description: 'Photography, videography, and editing services.' },
  { slug: 'academic-services', name: 'Academic Services', iconName: 'book', displayOrder: 9, description: 'Tutoring, assignment help, and academic support.' },
  { slug: 'logistics', name: 'Logistics', iconName: 'truck', displayOrder: 10, description: 'Delivery, errand running, and logistics services.' },
  { slug: 'furniture', name: 'Furniture', iconName: 'sofa', displayOrder: 11, description: 'Furniture, fittings, and home goods.' },
  { slug: 'health-wellness', name: 'Health & Wellness', iconName: 'heart', displayOrder: 12, description: 'Pharmacy, fitness, and wellness services.' },
  { slug: 'catering', name: 'Catering', iconName: 'utensils', displayOrder: 13, description: 'Event catering, bulk food, and party services.' },
  { slug: 'cleaning', name: 'Cleaning', iconName: 'spray-can', displayOrder: 14, description: 'Home, office, and hostel cleaning services.' },
  { slug: 'electrical', name: 'Electrical', iconName: 'zap', displayOrder: 15, description: 'Electrical work, wiring, and appliance services.' },
  { slug: 'plumbing', name: 'Plumbing', iconName: 'droplet', displayOrder: 16, description: 'Plumbing, pipework, and water services.' },
  { slug: 'tailoring', name: 'Tailoring', iconName: 'scissors', displayOrder: 17, description: 'Tailoring, fashion design, and alterations.' },
  { slug: 'supermarket', name: 'Supermarket', iconName: 'shopping-cart', displayOrder: 18, description: 'Groceries, provisions, and supermarket items.' },
  { slug: 'pharmacy', name: 'Pharmacy', iconName: 'pill', displayOrder: 19, description: 'Pharmacy, medication, and health products.' },
  { slug: 'other', name: 'Other', iconName: 'grid', displayOrder: 20, description: 'Anything else that does not fit a specific category.' },
];

async function main(): Promise<void> {
  console.warn('🌱 Starting seed...');

  console.warn('📚 Seeding institutions...');
  const institutionMap = new Map<string, string>();
  for (const uni of UNIVERSITIES) {
    const slug = slugify(uni.name);
    const existing = await prisma.institution.findUnique({ where: { slug } });
    if (existing) {
      institutionMap.set(uni.name, existing.id);
      continue;
    }
    const created = await prisma.institution.create({
      data: {
        name: uni.name,
        slug,
        type: uni.type,
        city: uni.city,
        state: uni.state,
        country: 'Nigeria',
        source: InstitutionSource.seed,
        status: InstitutionStatus.approved,
        isVerified: true,
        approvedAt: new Date(),
      },
    });
    institutionMap.set(uni.name, created.id);
  }
  console.warn(`  ✓ Seeded ${UNIVERSITIES.length} institutions`);

  console.warn('🏛️  Seeding campuses...');
  let campusCount = 0;
  for (const entry of CAMPUSES) {
    const institutionId = institutionMap.get(entry.institutionName);
    if (!institutionId) continue;
    for (const campus of entry.campuses) {
      const slug = slugify(campus.name);
      await prisma.campus.upsert({
        where: { institutionId_slug: { institutionId, slug } },
        update: {},
        create: {
          institutionId,
          name: campus.name,
          slug,
          isPrimary: campus.isPrimary,
          isActive: true,
        },
      });
      campusCount++;
    }
  }
  console.warn(`  ✓ Seeded ${campusCount} campuses`);

  console.warn('🏷️  Seeding categories...');
  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.warn(`  ✓ Seeded ${CATEGORIES.length} categories`);

  console.warn('👤 Seeding super-admin...');
  const adminEmail = 'owidavid2002@gmail.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Emmanuel Owi',
        role: 'super_admin',
        status: 'active',
        currentContext: 'buyer',
        emailVerified: new Date(),
        agreementVersion: 'v1',
        agreementAcceptedAt: new Date(),
        agreementIp: '127.0.0.1',
        agreementUserAgent: 'seed-script',
      },
    });
    console.warn(`  ✓ Created super-admin: ${adminEmail}`);
  } else {
    console.warn(`  ✓ Super-admin already exists: ${adminEmail}`);
  }

  console.warn('📜 Seeding agreements...');
  const now = new Date();
  await prisma.agreement.upsert({
    where: { type_version: { type: 'tos', version: 'v1' } },
    update: {},
    create: {
      type: 'tos',
      version: 'v1',
      title: 'Voeq Terms of Service',
      content: AGREEMENT_V1_TOS,
      effectiveAt: now,
    },
  });
  await prisma.agreement.upsert({
    where: { type_version: { type: 'privacy', version: 'v1' } },
    update: {},
    create: {
      type: 'privacy',
      version: 'v1',
      title: 'Voeq Privacy Policy',
      content: AGREEMENT_V1_PRIVACY,
      effectiveAt: now,
    },
  });
  await prisma.agreement.upsert({
    where: { type_version: { type: 'vendor_agreement', version: 'v1' } },
    update: {},
    create: {
      type: 'vendor_agreement',
      version: 'v1',
      title: 'Voeq Vendor Agreement',
      content: AGREEMENT_V1_VENDOR,
      effectiveAt: now,
    },
  });
  console.warn('  ✓ Seeded 3 agreement versions');

  console.warn('🚩 Seeding feature flags...');
  const defaultFlags = [
    { key: 'phase2_payments_enabled', value: false, description: 'Enable Paystack payment features' },
    { key: 'phase2_subscriptions_enabled', value: false, description: 'Enable vendor subscriptions' },
    { key: 'phase2_housing_enabled', value: false, description: 'Enable housing section' },
    { key: 'phase2_waybill_enabled', value: false, description: 'Enable waybill service' },
    { key: 'phase2_event_ticketing_enabled', value: false, description: 'Enable event ticketing' },
    { key: 'analytics_enabled', value: true, description: 'PostHog analytics' },
    { key: 'waitlist_enabled', value: true, description: 'Waitlist capture for Phase 2 features' },
  ];
  for (const flag of defaultFlags) {
    await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {},
      create: flag,
    });
  }
  console.warn(`  ✓ Seeded ${defaultFlags.length} feature flags`);

  console.warn('✅ Seed complete!');
  const counts = {
    institutions: await prisma.institution.count(),
    campuses: await prisma.campus.count(),
    categories: await prisma.category.count(),
    users: await prisma.user.count(),
    agreements: await prisma.agreement.count(),
    featureFlags: await prisma.featureFlag.count(),
  };
  console.warn('📊 Final counts:', counts);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });