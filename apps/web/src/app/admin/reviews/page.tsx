import { type Metadata } from 'next';
import { listReviews } from '@/lib/admin-server';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminAction } from '@/components/admin/AdminAction';

export const metadata: Metadata = { title: 'Admin · Reviews', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const data = await listReviews().catch(() => ({ reviews: [] })) as any;

  return (
    <AdminPage
      title="Reviews"
      description={`${data.reviews.length} reviews`}
    >
      <div className="space-y-3">
        {data.reviews.map((r: any) => (
          <div key={r.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-4 shadow-sm dark:border-forest-700 dark:bg-forest-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-forest-900 dark:text-cream-100">{r.rating}★ · {r.vendor?.businessName ?? 'Vendor'}</p>
                <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{r.comment ?? '(no comment)'}</p>
                <p className="mt-1 text-xs text-forest-700/50 dark:text-cream-100/50">by {r.author?.name ?? r.author?.email ?? 'Anonymous'}</p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-2">
                {!r.hidden && (
                  <AdminAction label="Hide" variant="destructive" path={`/api/admin/reviews/${r.id}/moderate`} method="POST" body={{ action: 'hide', reason: 'Admin action' }} loadingLabel="Hiding…" />
                )}
                {r.hidden && (
                  <AdminAction label="Restore" variant="primary" path={`/api/admin/reviews/${r.id}/moderate`} method="POST" body={{ action: 'restore', reason: 'Admin action' }} loadingLabel="Restoring…" />
                )}
                <AdminAction label="Delete" variant="destructive" confirmMessage="Delete this review?" path={`/api/admin/reviews/${r.id}/moderate`} method="POST" body={{ action: 'delete', reason: 'Admin action' }} loadingLabel="Deleting…" />
              </div>
            </div>
          </div>
        ))}
        {data.reviews.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 p-10 text-center text-sm text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">No reviews yet.</p>
        )}
      </div>
    </AdminPage>
  );
}
