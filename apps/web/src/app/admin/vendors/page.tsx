import { type Metadata } from 'next';
import { listVendors } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Vendors', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminVendorsPage() {
  const data = await listVendors({ page: 1 }).catch(() => ({ vendors: [], total: 0, page: 1, totalPages: 1 })) as any;

  return (
    <Container size="xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Vendors</h1>
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">{data.total} total · page {data.page}/{data.totalPages}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cream-200 text-xs uppercase tracking-wide text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">
            <tr>
              <th className="px-4 py-3">Business</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200 dark:divide-forest-700">
            {data.vendors.map((v: any) => (
              <tr key={v.id}>
                <td className="px-4 py-3 font-medium text-forest-900 dark:text-cream-100">{v.businessName}</td>
                <td className="px-4 py-3 text-forest-700/70 dark:text-cream-100/70">{v.ownerName}</td>
                <td className="px-4 py-3"><Badge variant={v.status === 'live' ? 'success' : v.status === 'rejected' || v.status === 'suspended' ? 'error' : 'warning'}>{v.status}</Badge></td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {v.status !== 'live' && (
                      <AdminAction label="Verify" variant="primary" path={`/api/admin/vendors/${v.id}/verify`} method="POST" />
                    )}
                    {v.status !== 'suspended' && (
                      <AdminAction label="Suspend" variant="destructive" confirmMessage={`Suspend ${v.businessName}?`} path={`/api/admin/vendors/${v.id}/suspend`} method="POST" body={{ reason: 'Admin action' }} />
                    )}
                    {!v.isFeatured && (
                      <AdminAction label="Feature" variant="gold" path={`/api/admin/vendors/${v.id}/feature`} method="POST" body={{ durationDays: 7 }} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.vendors.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-forest-700/60 dark:text-cream-100/60">No vendors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
