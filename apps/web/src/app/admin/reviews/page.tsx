import { type Metadata } from 'next';
import { listReviews } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { AdminAction } from '@/components/admin/AdminAction';

export const metadata: Metadata = { title: 'Admin · Reviews', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const data = await listReviews().catch(() => ({ reviews: [] })) as any;

  return (
    <Container size="xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Reviews</h1>
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">{data.reviews.length} reviews</p>
      </div>

      <div className="space-y-3">
        {data.reviews.map((r: any) => (
          <div key={r.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-forest-900 dark:text-cream-100">{r.rating}★ · {r.vendor?.businessName ?? 'Vendor'}</p>
                <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{r.comment ?? '(no comment)'}</p>
                <p className="mt-1 text-xs text-forest-700/50 dark:text-cream-100/50">by {r.author?.name ?? r.author?.email ?? 'Anonymous'}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!r.hidden && (
                  <AdminAction label="Hide" variant="destructive" path={`/api/admin/reviews/${r.id}/moderate`} method="POST" body={{ action: 'hide', reason: 'Admin action' }} />
                )}
                {r.hidden && (
                  <AdminAction label="Restore" variant="primary" path={`/api/admin/reviews/${r.id}/moderate`} method="POST" body={{ action: 'restore', reason: 'Admin action' }} />
                )}
                <AdminAction label="Delete" variant="destructive" confirmMessage="Delete this review?" path={`/api/admin/reviews/${r.id}/moderate`} method="POST" body={{ action: 'delete', reason: 'Admin action' }} />
              </div>
            </div>
          </div>
        ))}
        {data.reviews.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 p-8 text-center text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">No reviews yet.</p>
        )}
      </div>
    </Container>
  );
}
