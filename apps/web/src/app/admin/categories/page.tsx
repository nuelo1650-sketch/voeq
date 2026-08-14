import { type Metadata } from 'next';
import { listCategories } from '@/lib/admin-server';
import { AdminPage } from '@/components/admin/AdminPage';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Categories', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const data = await listCategories().catch(() => ({ categories: [] })) as any;

  return (
    <AdminPage
      title="Categories"
      description={`${data.categories.length} categories`}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.categories.map((c: any) => (
          <div key={c.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-4 shadow-sm dark:border-forest-700 dark:bg-forest-800">
            <div className="flex items-center justify-between">
              <p className="font-medium text-forest-900 dark:text-cream-100">{c.name}</p>
              <Badge variant={c.active ? 'success' : 'warning'}>{c.active ? 'active' : 'inactive'}</Badge>
            </div>
            <p className="mt-1 text-xs text-forest-700/50 dark:text-cream-100/50">{c.slug} · {c.iconName}</p>
            <div className="mt-3">
              <AdminAction
                label={c.active ? 'Deactivate' : 'Activate'}
                variant={c.active ? 'outline' : 'primary'}
                path={`/api/admin/categories/${c.id}`}
                method="PATCH"
                body={{ active: !c.active }}
                loadingLabel={c.active ? 'Deactivating…' : 'Activating…'}
              />
            </div>
          </div>
        ))}
        {data.categories.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 p-10 text-center text-sm text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">No categories.</p>
        )}
      </div>
    </AdminPage>
  );
}
