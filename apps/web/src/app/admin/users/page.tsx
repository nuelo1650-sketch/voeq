import { type Metadata } from 'next';
import { listUsers, type AdminUser } from '@/lib/admin-server';
import { AdminPage, AdminTable, AdminTh, AdminEmpty } from '@/components/admin/AdminPage';
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
    <AdminPage
      title="Users"
      description={`${data.total} total · page ${data.page}/${data.totalPages}`}
    >
      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Name</AdminTh>
            <AdminTh>Email</AdminTh>
            <AdminTh>Role</AdminTh>
            <AdminTh>Status</AdminTh>
            <AdminTh className="text-right">Actions</AdminTh>
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
                      loadingLabel={u.status === 'active' ? 'Suspending…' : 'Activating…'}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
          {data.users.length === 0 && <AdminEmpty>No users found.</AdminEmpty>}
        </tbody>
      </AdminTable>
    </AdminPage>
  );
}
