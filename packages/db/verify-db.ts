import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verifying database setup...\n');

  const institutionCount = await prisma.institution.count();
  console.log(`✓ Institutions: ${institutionCount}`);

  const campusCount = await prisma.campus.count();
  console.log(`✓ Campuses: ${campusCount}`);

  const categoryCount = await prisma.category.count();
  console.log(`✓ Categories: ${categoryCount}`);

  const userCount = await prisma.user.count();
  console.log(`✓ Users: ${userCount}`);

  const admins = await prisma.user.findMany({
    where: {
      role: { in: ['admin', 'super_admin'] },
    },
    select: {
      email: true,
      role: true,
    },
  });
  console.log(`\n👤 Admin users:`);
  admins.forEach((admin) => {
    console.log(`  - ${admin.email} (${admin.role})`);
  });

  const agreementCount = await prisma.agreement.count();
  console.log(`\n✓ Agreements: ${agreementCount}`);

  const featureFlagCount = await prisma.featureFlag.count();
  console.log(`✓ Feature Flags: ${featureFlagCount}`);

  console.log('\n✅ Database verification complete!');
}

main()
  .catch((e) => {
    console.error('❌ Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
