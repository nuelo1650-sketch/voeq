import { prisma } from '@voeq/db';

export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === 'admin' || user?.role === 'super_admin';
}

export async function getAdminStats(): Promise<{
  totalUsers: number;
  totalVendors: number;
  liveVendors: number;
  pendingVendors: number;
  totalListings: number;
  totalReviews: number;
  openReports: number;
  whatsappClicksToday: number;
  whatsappClicksThisWeek: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  pendingInstitutions: number;
}> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalVendors,
    liveVendors,
    pendingVendors,
    totalListings,
    totalReviews,
    openReports,
    whatsappClicksToday,
    whatsappClicksThisWeek,
    newUsersToday,
    newUsersThisWeek,
    pendingInstitutions,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.vendor.count({ where: { deletedAt: null } }),
    prisma.vendor.count({ where: { status: 'live', deletedAt: null } }),
    prisma.vendor.count({ where: { status: 'pending_review', deletedAt: null } }),
    prisma.listing.count({ where: { deletedAt: null } }),
    prisma.review.count({ where: { status: 'visible' } }),
    prisma.report.count({ where: { status: 'open' } }),
    prisma.eventLog.count({ where: { eventType: 'whatsapp_click', createdAt: { gte: startOfDay } } }),
    prisma.eventLog.count({ where: { eventType: 'whatsapp_click', createdAt: { gte: startOfWeek } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfDay }, deletedAt: null } }),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek }, deletedAt: null } }),
    prisma.institution.count({ where: { status: 'pending' } }),
  ]);

  return {
    totalUsers,
    totalVendors,
    liveVendors,
    pendingVendors,
    totalListings,
    totalReviews,
    openReports,
    whatsappClicksToday,
    whatsappClicksThisWeek,
    newUsersToday,
    newUsersThisWeek,
    pendingInstitutions,
  };
}
