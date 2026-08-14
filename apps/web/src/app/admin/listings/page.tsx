import { type Metadata } from 'next';
import { listListings } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Listings', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  const data = await listListings({ page: 1 }).catch(() => ({ listings: [], total: 0, page: 1, totalPages: 1 })) as any;

  return (
    <Container size="xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Listings</h1>
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">{data.total} total · page {data.page}/{data.totalPages}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cream-200 text-xs uppercase tracking-wide text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200 dark:divide-forest-700">
            {data.listings.map((l: any) => (
              <tr key={l.id}>
                <td className="px-4 py-3 font-medium text-forest-900 dark:text-cream-100">{l.title}</td>
                <td className="px-4 py-3 text-forest-700/70 dark:text-cream-100/70">{l.vendor?.businessName ?? '—'}</td>
                <td className="px-4 py-3"><Badge variant={l.status === 'active' ? 'success' : l.status === 'rejected' ? 'error' : 'warning'}>{l.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {l.status === 'active' ? (
                      <AdminAction label="Hide" variant="destructive" confirmMessage={`Hide "${l.title}"?`} path={`/api/admin/listings/${l.id}/update-status`} method="POST" body={{ status: 'hidden', reason: 'Admin action' }} />
                    ) : (
                      <AdminAction label="Approve" variant="primary" path={`/api/admin/listings/${l.id}/update-status`} method="POST" body={{ status: 'active', reason: 'Admin action' }} />
                    )}
                    <AdminAction label="Delete" variant="destructive" confirmMessage={`Delete "${l.title}" permanently?`} path={`/api/admin/listings/${l.id}`} method="DELETE" />
                  </div>
                </td>
              </tr>
            ))}
            {data.listings.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-forest-700/60 dark:text-cream-100/60">No listings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
