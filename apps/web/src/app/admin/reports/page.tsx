import { type Metadata } from 'next';
import { listReports } from '@/lib/admin-server';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Reports', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const data = await listReports().catch(() => ({ reports: [] })) as any;

  return (
    <AdminPage
      title="Reports"
      description={`${data.reports.length} open reports`}
    >
      <div className="space-y-3">
        {data.reports.map((r: any) => (
          <div key={r.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-4 shadow-sm dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{r.reason ?? 'report'}</Badge>
                  <span className="text-xs text-forest-700/50 dark:text-cream-100/50">{r.status}</span>
                </div>
                <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{r.details ?? ''}</p>
                <p className="mt-1 text-xs text-forest-700/50 dark:text-cream-100/50">reporter: {r.reporter?.email ?? '—'} · target: {r.targetType} {r.targetId}</p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                <AdminAction label="Warn" variant="gold" path={`/api/admin/reports/${r.id}/resolve`} method="POST" body={{ action: 'warned', notes: 'Admin review' }} loadingLabel="Warning…" />
                <AdminAction label="Dismiss" variant="outline" path={`/api/admin/reports/${r.id}/dismiss`} method="POST" loadingLabel="Dismissing…" />
              </div>
            </div>
          </div>
        ))}
        {data.reports.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 p-10 text-center text-sm text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60 dark:border-cream-100">No open reports. 🎉</p>
        )}
      </div>
    </AdminPage>
  );
}
