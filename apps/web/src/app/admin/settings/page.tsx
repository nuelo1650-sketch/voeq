import { type Metadata } from 'next';
import { getSystemHealth } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { AdminAction } from '@/components/admin/AdminAction';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ThreadSeam } from '@/components/brand/Thread';

export const metadata: Metadata = { title: 'Admin · Settings', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const health = await getSystemHealth().catch(() => null) as any;

  return (
    <Container size="lg">
      <AdminHeader title="Settings" />
      <div className="mb-6">
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">System status and maintenance actions.</p>
        <ThreadSeam className="mt-3" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">System health</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-forest-700/60 dark:text-cream-100/60">Status</dt><dd className="font-medium text-forest-900 dark:text-cream-100">{health?.status ?? 'unknown'}</dd></div>
              <div className="flex justify-between"><dt className="text-forest-700/60 dark:text-cream-100/60">Database</dt><dd className="font-medium text-forest-900 dark:text-cream-100">{health?.db ?? 'unknown'}</dd></div>
              <div className="flex justify-between"><dt className="text-forest-700/60 dark:text-cream-100/60">Uptime</dt><dd className="font-medium text-forest-900 dark:text-cream-100">{health?.uptime ? `${Math.round(health.uptime)}s` : '—'}</dd></div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Maintenance</h2>
            <p className="mt-2 text-sm text-forest-700/60 dark:text-cream-100/60">Manually trigger scheduled jobs.</p>
            <div className="mt-4">
              <AdminAction label="Trigger cron" variant="gold" path="/api/admin/system/cron/trigger" method="POST" confirmMessage="Run scheduled cron jobs now?" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
