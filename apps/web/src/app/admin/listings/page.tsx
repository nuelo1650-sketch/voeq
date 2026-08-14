import { type Metadata } from 'next';
import { listListings } from '@/lib/admin-server';
import { AdminPage, AdminTable, AdminTh, AdminEmpty } from '@/components/admin/AdminPage';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Listings', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  const data = await listListings({ page: 1 }).catch(() => ({ listings: [], total: 0, page: 1, totalPages: 1 })) as any;

  return (
    <AdminPage
      title="Listings"
      description={`${data.total} total · page ${data.page}/${data.totalPages}`}
    >
      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Title</AdminTh>
            <AdminTh>Vendor</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-200 dark:divide-forest-700">
          {data.listings.map((l: any) => (
            <tr key={l.id}>
              <td className="px-4 py-3 font-medium text-forest-900 dark:text-cream-100">{l.title}</td>
              <td className="px-4 py-3 text-forest-700/70 dark:text-cream-100/70">{l.vendor?.businessName ?? '—'}</td>
              <td className="px-4 py-3">
                <Badge variant={l.status === 'active' ? 'success' : l.status === 'rejected' ? 'error' : 'warning'}>{l.status}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  {l.status === 'active' ? (
                    <AdminAction label="Hide" variant="destructive" confirmMessage={`Hide "${l.title}"?`} path={`/api/admin/listings/${l.id}/update-status`} method="POST" body={{ status: 'hidden', reason: 'Admin action' }} loadingLabel="Hiding…" />
                  ) : (
                    <AdminAction label="Approve" variant="primary" path={`/api/admin/listings/${l.id}/update-status`} method="POST" body={{ status: 'active', reason: 'Admin action' }} loadingLabel="Approving…" />
                  )}
                  <AdminAction label="Delete" variant="destructive" confirmMessage={`Delete "${l.title}" permanently?`} path={`/api/admin/listings/${l.id}`} method="DELETE" loadingLabel="Deleting…" />
                </div>
              </td>
            </tr>
          ))}
          {data.listings.length === 0 && <AdminEmpty>No listings found.</AdminEmpty>}
        </tbody>
      </AdminTable>
    </AdminPage>
  );
}
