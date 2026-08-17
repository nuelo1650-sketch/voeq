'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable } from '@/components/admin/DataTable';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { listUsers, type AdminUser } from '@/lib/admin-client';

type UserRow = AdminUser;

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers({ page, search: search || undefined, role: role || undefined, status: status || undefined });
      setRows(data.users);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, role, status]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 50)), [total]);

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Name', render: (row: UserRow) => row.name || '—' },
      { key: 'email', label: 'Email', render: (row: UserRow) => row.email },
      { key: 'role', label: 'Role', render: (row: UserRow) => <RoleBadge role={row.role} /> },
      { key: 'status', label: 'Status', render: (row: UserRow) => <StatusBadge status={row.status} /> },
      { key: 'createdAt', label: 'Joined', render: (row: UserRow) => new Date(row.createdAt).toLocaleDateString() },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <AdminHeader
        title="Users"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search users..."
              className="rounded-full border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:bg-forest-900 dark:border-forest-700"
            />
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setPage(1); }}
              className="rounded-full border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:bg-forest-900 dark:border-forest-700"
            >
              <option value="">All roles</option>
              <option value="buyer">Shopper</option>
              <option value="vendor">Vendor</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </select>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="rounded-full border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:bg-forest-900 dark:border-forest-700"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        }
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {loading ? <p className="text-sm text-forest-700/80 dark:text-cream-100/80">Loading users...</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        emptyMessage="No users found."
      />

      <div className="flex items-center justify-between text-sm text-forest-700/80 dark:text-cream-100/80">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-cream-300 px-3 py-1.5 disabled:opacity-50 dark:border-forest-700"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-cream-300 px-3 py-1.5 disabled:opacity-50 dark:border-forest-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
