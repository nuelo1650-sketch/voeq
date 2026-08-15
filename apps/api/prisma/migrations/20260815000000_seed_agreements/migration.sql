-- Seed current Terms of Service + Privacy Policy so the post-auth
-- AgreementModal has content to display. Without these rows the modal
-- renders "Loading…" forever and acceptance can never be recorded,
-- which dead-locks the entire app for unaccepted users.
-- Idempotent: only insert if no current row of that type exists.

INSERT INTO "Agreement" ("id", "type", "version", "title", "content", "effectiveAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'tos', '1.0', 'Terms of Service',
  'Welcome to Voeq. By using Voeq you agree to these Terms of Service. Voeq is a campus marketplace connecting students with verified campus vendors. Vendors list their businesses and students contact them directly via WhatsApp. You are responsible for the accuracy of the information you provide and for complying with applicable laws. Voeq does not take ownership of listings or mediate payments in Phase 1. We may update these terms; continued use constitutes acceptance of the updated terms. Contact support@voeq.ng for questions.',
  now(), now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Agreement" WHERE "type" = 'tos');

INSERT INTO "Agreement" ("id", "type", "version", "title", "content", "effectiveAt", "createdAt", "updatedAt")
SELECT gen_random_uuid(), 'privacy', '1.0', 'Privacy Policy',
  'Voeq Privacy Policy. We collect the information you provide (name, email, phone, campus, business details) to operate the marketplace and connect you with other users. We use WhatsApp numbers only to enable direct communication between students and vendors. We do not sell your personal data. You may request deletion of your account and associated data by contacting support@voeq.ng. Cookies are used to keep you signed in and remember preferences.',
  now(), now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "Agreement" WHERE "type" = 'privacy');
