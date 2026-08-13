'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import AdminLayout from '../layout';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
  imageUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  isOfficial: boolean;
  parentCategoryId: string | null;
  _count: { listings: number };
}

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ categories: AdminCategory[] }>('/api/admin/categories');
      setRows(data.categories);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (id: string, patch: Partial<AdminCategory>) => {
    setSavingId(id);
    try {
      const res = await api<{ category: AdminCategory }>(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(patch),
      });
      setRows((prev) => prev.map((c) => (c.id === id ? res.category : c)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Categories" />

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-forest-700/70">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <div key={c.id} className="rounded-2xl border border-cream-300 bg-white p-4 dark:border-forest-700 dark:bg-forest-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cream-100 dark:bg-forest-900">
                  {c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.imageUrl} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-forest-700/50 dark:text-cream-100/50">
                      {c.iconName ?? '•'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-forest-900 dark:text-cream-100">{c.name}</p>
                  <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
                    {c._count.listings} listings · {c.isOfficial ? 'Official' : 'Custom'}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={savingId === c.id}
                  onClick={() => update(c.id, { isActive: !c.isActive })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    c.isActive
                      ? 'border-red-300 text-red-700 hover:bg-red-50'
                      : 'border-forest-700 bg-forest-700 text-cream-100'
                  }`}
                >
                  {c.isActive ? 'Hide' : 'Show'}
                </button>
                <button
                  type="button"
                  disabled={savingId === c.id}
                  onClick={() => update(c.id, { isOfficial: !c.isOfficial })}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    c.isOfficial
                      ? 'border-gold-600 bg-gold-50 text-gold-700'
                      : 'border-cream-300 text-forest-700 dark:border-forest-700 dark:text-cream-100'
                  }`}
                >
                  {c.isOfficial ? 'Official ✓' : 'Make official'}
                </button>
              </div>

              {c.isOfficial && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-forest-700/70 dark:text-cream-100/70">Image URL</label>
                  <input
                    type="url"
                    defaultValue={c.imageUrl ?? ''}
                    placeholder="https://…"
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== (c.imageUrl ?? '')) update(c.id, { imageUrl: v || undefined });
                    }}
                    className="mt-1 w-full rounded-lg border border-cream-300 bg-cream-50 px-2 py-1.5 text-xs text-forest-900 outline-none focus:border-forest-700 dark:border-forest-700 dark:bg-forest-900 dark:text-cream-100"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
