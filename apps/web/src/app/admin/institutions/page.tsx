import { type Metadata } from 'next';
import { listPendingInstitutions } from '@/lib/admin-server';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminAction } from '@/components/admin/AdminAction';

export const metadata: Metadata = { title: 'Admin · Institutions', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminInstitutionsPage() {
  const data = await listPendingInstitutions().catch(() => ({ institutions: [] })) as any;

  return (
    <AdminPage
      title="Pending institutions"
      description={`${data.institutions.length} awaiting approval`}
    >
      <div className="space-y-3">
        {data.institutions.map((inst: any) => (
          <div key={inst.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-4 shadow-sm dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-forest-900 dark:text-cream-100">{inst.name}</p>
                <p className="mt-1 text-xs text-forest-700/50 dark:text-cream-100/50">requested by {inst.requestedByEmail ?? '—'}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <AdminAction label="Approve" variant="primary" path={`/api/admin/institutions/${inst.id}/approve`} method="POST" loadingLabel="Approving…" />
                <AdminAction label="Reject" variant="destructive" confirmMessage={`Reject ${inst.name}?`} path={`/api/admin/institutions/${inst.id}/reject`} method="POST" loadingLabel="Rejecting…" />
              </div>
            </div>
          </div>
        ))}
        {data.institutions.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 p-10 text-center text-sm text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60 dark:border-cream-100">No pending institutions.</p>
        )}
      </div>
    </AdminPage>
  );
}
