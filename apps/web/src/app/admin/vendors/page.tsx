import { type Metadata } from 'next';
import { listVendors } from '@/lib/admin-server';
import { AdminPage, AdminTable, AdminTh, AdminEmpty } from '@/components/admin/AdminPage';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Vendors', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminVendorsPage() {
  const data = await listVendors({ page: 1 }).catch(() => ({ vendors: [], total: 0, page: 1, totalPages: 1 })) as any;

  return (
    <AdminPage
      title="Vendors"
      description={`${data.total} total · page ${data.page}/${data.totalPages}`}
    >
      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Business</AdminTh>
            <AdminTh>Owner</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-200 dark:divide-forest-700">
          {data.vendors.map((v: any) => (
            <tr key={v.id}>
              <td className="px-4 py-3 font-medium text-forest-900 dark:text-cream-100">{v.businessName}</td>
              <td className="px-4 py-3 text-forest-700/70 dark:text-cream-100/70">{v.ownerName}</td>
              <td className="px-4 py-3">
                <Badge variant={v.status === 'live' ? 'success' : v.status === 'rejected' || v.status === 'suspended' ? 'error' : 'warning'}>{v.status}</Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-wrap justify-end gap-2">
                  {v.status !== 'live' && (
                    <AdminAction label="Verify" variant="primary" path={`/api/admin/vendors/${v.id}/verify`} method="POST" loadingLabel="Verifying…" />
                  )}
                  {v.status !== 'suspended' && (
                    <AdminAction label="Suspend" variant="destructive" confirmMessage={`Suspend ${v.businessName}?`} path={`/api/admin/vendors/${v.id}/suspend`} method="POST" body={{ reason: 'Admin action' }} loadingLabel="Suspending…" />
                  )}
                  {!v.isFeatured && (
                    <AdminAction label="Feature" variant="gold" path={`/api/admin/vendors/${v.id}/feature`} method="POST" body={{ durationDays: 7 }} loadingLabel="Featuring…" />
                  )}
                </div>
              </td>
            </tr>
          ))}
          {data.vendors.length === 0 && <AdminEmpty>No vendors found.</AdminEmpty>}
        </tbody>
      </AdminTable>
    </AdminPage>
  );
}
