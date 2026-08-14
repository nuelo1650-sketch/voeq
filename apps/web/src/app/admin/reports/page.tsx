import { type Metadata } from 'next';
import { listReports } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Reports', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const data = await listReports().catch(() => ({ reports: [] })) as any;

  return (
    <Container size="xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Reports</h1>
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">{data.reports.length} open reports</p>
      </div>

      <div className="space-y-3">
        {data.reports.map((r: any) => (
          <div key={r.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{r.reason ?? 'report'}</Badge>
                  <span className="text-xs text-forest-700/50 dark:text-cream-100/50">{r.status}</span>
                </div>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{r.details ?? ''}</p>
                <p className="mt-1 text-xs text-forest-700/50 dark:text-cream-100/50">reporter: {r.reporter?.email ?? '—'} · target: {r.targetType} {r.targetId}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <AdminAction label="Warn" variant="gold" path={`/api/admin/reports/${r.id}/resolve`} method="POST" body={{ action: 'warned', notes: 'Admin review' }} />
                <AdminAction label="Dismiss" variant="outline" path={`/api/admin/reports/${r.id}/dismiss`} method="POST" />
              </div>
            </div>
          </div>
        ))}
        {data.reports.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 p-8 text-center text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">No open reports. 🎉</p>
        )}
      </div>
    </Container>
  );
}
