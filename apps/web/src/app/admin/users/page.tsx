import { type Metadata } from 'next';
import { listUsers, type AdminUser } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Users', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  const map: Record<string, string> = {
    super_admin: 'bg-gold-500/20 text-gold-700 dark:text-gold-400',
    admin: 'bg-gold-500/15 text-gold-700 dark:text-gold-400',
    vendor: 'bg-forest-700/10 text-forest-800 dark:text-cream-100',
    buyer: 'bg-cream-200 text-forest-700 dark:bg-forest-800 dark:text-cream-100',
  };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[role] ?? ''}`}>{role}</span>;
}

export default async function AdminUsersPage() {
  const data = await listUsers({ page: 1 }).catch(() => ({ users: [], total: 0, page: 1, totalPages: 1 }));

  return (
    <Container size="xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Users</h1>
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">{data.total} total · page {data.page}/{data.totalPages}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cream-200 text-xs uppercase tracking-wide text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200 dark:divide-forest-700">
            {data.users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-forest-900 dark:text-cream-100">{u.name ?? '—'}</td>
                <td className="px-4 py-3 text-forest-700/70 dark:text-cream-100/70">{u.email}</td>
                <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                <td className="px-4 py-3">
                  <Badge variant={u.status === 'active' ? 'success' : 'error'}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {u.role !== 'super_admin' && u.role !== 'admin' && (
                      <AdminAction
                        label={u.status === 'active' ? 'Suspend' : 'Activate'}
                        variant={u.status === 'active' ? 'destructive' : 'primary'}
                        confirmMessage={u.status === 'active' ? `Suspend ${u.email}?` : undefined}
                        path={`/api/admin/users/${u.id}/suspend`}
                        method="POST"
                        body={{ reason: u.status === 'active' ? 'Admin action' : '' }}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {data.users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-forest-700/60 dark:text-cream-100/60">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
