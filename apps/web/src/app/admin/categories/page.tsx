import { type Metadata } from 'next';
import { listCategories } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { AdminAction } from '@/components/admin/AdminAction';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = { title: 'Admin · Categories', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const data = await listCategories().catch(() => ({ categories: [] })) as any;

  return (
    <Container size="xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Categories</h1>
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">{data.categories.length} categories</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.categories.map((c: any) => (
          <div key={c.id} className="rounded-2xl border border-cream-300 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
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
              />
            </div>
          </div>
        ))}
        {data.categories.length === 0 && (
          <p className="rounded-2xl border border-dashed border-cream-300 p-8 text-center text-forest-700/60 dark:border-forest-700 dark:text-cream-100/60">No categories.</p>
        )}
      </div>
    </Container>
  );
}
