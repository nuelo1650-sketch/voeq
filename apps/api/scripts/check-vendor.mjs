import { PrismaClient } from '../generated/prisma-client/index.js';
const p = new PrismaClient();
const u = await p.user.findUnique({ where: { email: 'voeqvendor@voeq.test' }, select: { id: true, role: true, vendorStatus: true, defaultCampusId: true } });
console.log('USER:', JSON.stringify(u));
if (u) {
  const v = await p.vendor.findUnique({ where: { userId: u.id }, select: { id: true, status: true, businessName: true } });
  console.log('VENDOR ROW:', JSON.stringify(v));
  const v2 = await p.vendor.findFirst({ where: { businessSlug: 'voeq-test-store' }, select: { id: true, status: true, userId: true } });
  console.log('VENDOR by slug voeq-test-store:', JSON.stringify(v2));
}
await p.$disconnect();
