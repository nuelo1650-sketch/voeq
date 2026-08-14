import { type Metadata } from 'next';
import { getStats, getSignupsChart, getClicksByCategory } from '@/lib/admin-server';
import { KPICard } from '@/components/admin/KPICard';
import { ChartCard } from '@/components/admin/ChartCard';
import { SignupsChart } from '@/components/admin/SignupsChart';
import { CategoryClicksChart } from '@/components/admin/CategoryClicksChart';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const [stats, signups, clicks] = await Promise.all([
    getStats(),
    getSignupsChart().catch(() => ({ data: [] })),
    getClicksByCategory().catch(() => ({ data: [] })),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KPICard label="Total users" value={stats.totalUsers} delta={stats.newUsersToday} deltaLabel="today" />
        <KPICard label="Live vendors" value={stats.liveVendors} subValue={`${stats.pendingVendors} pending`} />
        <KPICard label="Total listings" value={stats.totalListings} />
        <KPICard label="Open reports" value={stats.openReports} href="/admin/reports" />
        <KPICard label="WA clicks today" value={stats.whatsappClicksToday} delta={stats.whatsappClicksThisWeek} deltaLabel="this week" />
        <KPICard label="Pending institutions" value={stats.pendingInstitutions} href="/admin/institutions" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Signups (last 30 days)">
          <SignupsChart data={signups.data} />
        </ChartCard>
        <ChartCard title="Top categories by clicks">
          <CategoryClicksChart data={clicks.data} />
        </ChartCard>
      </div>
    </div>
  );
}
