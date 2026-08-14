import { type Metadata } from 'next';
import { getAuditLog } from '@/lib/admin-server';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Admin · Audit log', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const data = await getAuditLog({ page: 1 }).catch(() => ({ entries: [], total: 0, page: 1, totalPages: 1 })) as any;

  return (
    <Container size="xl">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Audit log</h1>
        <p className="mt-1 text-sm text-forest-700/60 dark:text-cream-100/60">{data.total} events</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ul className="space-y-3">
            {data.entries.map((e: any) => (
              <li key={e.id} className="flex items-start gap-3 border-b border-cream-200 pb-3 last:border-0 dark:border-forest-700">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                <div>
                  <p className="text-sm font-medium text-forest-900 dark:text-cream-100">{e.action}</p>
                  <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
                    {e.actorUser?.email ?? e.actorUserId ?? 'system'} · {new Date(e.createdAt).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
            {data.entries.length === 0 && <p className="text-sm text-forest-700/60 dark:text-cream-100/60">No audit entries yet.</p>}
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}
