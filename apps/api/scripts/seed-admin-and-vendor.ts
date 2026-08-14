import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
} as const;

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'owidavid2002@gmail.com';
  const adminPw = 'VoeqAdmin2026!';
  const vendorEmail = 'voeqvendor@voeq.test';
  const vendorPw = 'VendorTest2026!';

  const adminHash = await argon2.hash(adminPw, ARGON2_OPTIONS);
  // Find or create the super-admin user.
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'super_admin',
      status: 'active',
      passwordHash: adminHash,
      hasPassword: true,
      emailVerified: new Date(),
      agreementAcceptedAt: new Date(),
      agreementVersion: '1.0',
      homeSeenAt: new Date(),
      name: 'David (Admin)',
    },
    create: {
      email: adminEmail,
      name: 'David (Admin)',
      role: 'super_admin',
      status: 'active',
      passwordHash: adminHash,
      hasPassword: true,
      emailVerified: new Date(),
      agreementAcceptedAt: new Date(),
      agreementVersion: '1.0',
      homeSeenAt: new Date(),
    },
  });
  console.log('Super-admin ready:', admin.email, admin.role);

  // Vendor test account: user + a minimal live vendor so /vendor works.
  const vendorHash = await argon2.hash(vendorPw, ARGON2_OPTIONS);
  const existing = await prisma.user.findUnique({ where: { email: vendorEmail } });
  let vendorUser = existing;
  if (!existing) {
    vendorUser = await prisma.user.create({
      data: {
        email: vendorEmail,
        name: 'Voeq Test Vendor',
        role: 'vendor',
        status: 'active',
        passwordHash: vendorHash,
        hasPassword: true,
        emailVerified: new Date(),
        agreementAcceptedAt: new Date(),
        agreementVersion: '1.0',
        homeSeenAt: new Date(),
      },
    });
  } else {
    vendorUser = await prisma.user.update({
      where: { email: vendorEmail },
      data: { role: 'vendor', status: 'active', passwordHash: vendorHash, hasPassword: true, emailVerified: new Date(), agreementAcceptedAt: new Date(), agreementVersion: '1.0', homeSeenAt: new Date() },
    });
  }

  // Ensure a campus + institution exist so the vendor can be linked.
  const institution = await prisma.institution.findFirst();
  if (!institution) throw new Error('No institution seeded — cannot create vendor test account');
  let campus = await prisma.campus.findFirst({ where: { institutionId: institution.id } });
  if (!campus) {
    campus = await prisma.campus.create({ data: { name: `${institution.name} Main`, institutionId: institution.id } });
  }

  const existingVendor = await prisma.vendor.findUnique({ where: { userId: vendorUser.id } });
  if (!existingVendor) {
    await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
        businessName: 'Voeq Test Store',
        businessSlug: 'voeq-test-store',
        ownerName: 'Voeq Test Vendor',
        description: 'Test vendor for automated verification.',
        whatsappNumber: '+2348000000000',
        institutionId: institution.id,
        campusId: campus.id,
        status: 'live',
        agreementAcceptedAt: new Date(),
        agreementVersion: '1.0',
        verifiedBadge: true,
        onboardingProgress: 100,
      },
    });
  } else {
    await prisma.vendor.update({ where: { userId: vendorUser.id }, data: { status: 'live', verifiedBadge: true, onboardingProgress: 100 } });
  }
  console.log('Vendor test account ready:', vendorEmail, '| campus:', campus.name);
  console.log('CREDENTIALS (dev only):');
  console.log('  admin:', adminEmail, '/', adminPw);
  console.log('  vendor:', vendorEmail, '/', vendorPw);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
