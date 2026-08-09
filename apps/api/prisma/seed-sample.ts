import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.warn('🌱 Seeding sample marketplace data...');

  const institutionId = 'cmsky2hhm0000fs74kmc0opas';
  const campusId = 'cmsky51vf003tfs74hnod4w2i';

  const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
  if (!institution) {
    console.warn('  ❌ Institution missing');
    await prisma.$disconnect();
    return;
  }

  const campus = await prisma.campus.findUnique({ where: { id: campusId } });
  if (!campus) {
    console.warn('  ❌ Campus missing');
    await prisma.$disconnect();
    return;
  }

  const admin = await prisma.user.findFirst({ where: { role: 'super_admin' } });
  if (!admin) {
    console.warn('  ❌ No admin user found');
    await prisma.$disconnect();
    return;
  }

  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    console.warn('  ❌ No categories found');
    await prisma.$disconnect();
    return;
  }

  const foodCat = categories.find((c) => c.slug === 'food') ?? categories[0];
  const techCat = categories.find((c) => c.slug === 'tech') ?? categories[1];
  const fashionCat = categories.find((c) => c.slug === 'fashion') ?? categories[2];

  const vendor = await prisma.vendor.upsert({
    where: { businessSlug: 'sample-vendor-nmu' },
    update: {},
    create: {
      userId: admin.id,
      institutionId: institution.id,
      campusId: campus.id,
      businessName: 'Sample Vendor NMU',
      businessSlug: 'sample-vendor-nmu',
      ownerName: 'Admin Seed',
      description: 'Sample multi-category vendor for landing page previews.',
      status: 'live',
      trustScore: 80,
      whatsappNumber: '2348012345678',
    },
  });

  const listing1 = await prisma.listing.upsert({
    where: { vendorId_slug: { vendorId: vendor.id, slug: 'jollof-special' } },
    update: {},
    create: {
      vendorId: vendor.id,
      categoryId: foodCat.id,
      title: 'Jollof Special',
      slug: 'jollof-special',
      description: 'Smoky party jollof with chicken and coleslaw.',
      priceMin: 2500,
      currency: 'NGN',
      status: 'draft',
    },
  });

  const listing2 = await prisma.listing.upsert({
    where: { vendorId_slug: { vendorId: vendor.id, slug: 'iphone-screen-repair' } },
    update: {},
    create: {
      vendorId: vendor.id,
      categoryId: techCat.id,
      title: 'iPhone Screen Repair',
      slug: 'iphone-screen-repair',
      description: 'Same-day screen replacement for iPhone 11-14.',
      priceMin: 18000,
      currency: 'NGN',
      status: 'draft',
    },
  });

  const listing3 = await prisma.listing.upsert({
    where: { vendorId_slug: { vendorId: vendor.id, slug: 'casual-ankara-top' } },
    update: {},
    create: {
      vendorId: vendor.id,
      categoryId: fashionCat.id,
      title: 'Casual Ankara Top',
      slug: 'casual-ankara-top',
      description: 'Handmade Ankara top, available in multiple prints.',
      priceMin: 7000,
      currency: 'NGN',
      status: 'draft',
    },
  });

  await prisma.listingPhoto.createMany({
    data: [
      { listingId: listing1.id, publicId: 'sample-jollof', url: 'https://images.unsplash.com/photo-1604329760661-e071dc40a3cd?w=800&auto=format&fit=crop', width: 800, height: 600, displayOrder: 0 },
      { listingId: listing2.id, publicId: 'sample-iphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop', width: 800, height: 600, displayOrder: 0 },
      { listingId: listing3.id, publicId: 'sample-ankara', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop', width: 800, height: 600, displayOrder: 0 },
    ],
    skipDuplicates: true,
  });

  const existingReviews = await prisma.review.findMany({ where: { vendorId: vendor.id } });
  if (!existingReviews.length) {
    await prisma.review.createMany({
      data: [
        { listingId: listing1.id, userId: admin.id, vendorId: vendor.id, rating: 5, text: 'Best jollof on campus', status: 'visible' },
        { listingId: listing2.id, userId: admin.id, vendorId: vendor.id, rating: 4, text: 'Quick repair', status: 'visible' },
      ],
      skipDuplicates: true,
    });
  }

  const counts = {
    vendors: await prisma.vendor.count(),
    listings: await prisma.listing.count(),
    reviews: await prisma.review.count(),
  };
  console.warn('  📊 Sample counts:', counts);
  console.warn('✅ Sample marketplace data seeded');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
