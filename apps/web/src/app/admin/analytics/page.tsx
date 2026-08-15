import { type Metadata } from 'next';
import { getSignupsChart, getClicksByCategory } from '@/lib/admin-server';
import { AdminPage } from '@/components/admin/AdminPage';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'Admin · Analytics', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const [signups, clicks] = await Promise.all([
    getSignupsChart().catch(() => ({ data: [] })),
    getClicksByCategory().catch(() => ({ data: [] })),
  ]) as any;

  const maxClicks = Math.max(1, ...clicks.data.map((c: any) => c.clicks));
  const maxSignups = Math.max(1, ...signups.data.map((d: any) => d.count));

  return (
    <AdminPage title="Analytics" description="Growth and engagement signals.">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Signups (last 30 days)</h2>
            <div className="mt-4 flex h-40 items-end gap-1">
              {signups.data.slice(-30).map((d: any, i: number) => (
                <div key={i} className="flex-1 rounded-t bg-gold-500/70" style={{ height: `${Math.max(4, (d.count / maxSignups) * 100)}%` }} title={`${d.date}: ${d.count}`} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">WhatsApp clicks by category</h2>
            <div className="mt-4 space-y-2">
              {clicks.data.map((c: any) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-sm text-forest-700/70 dark:text-cream-100/70">{c.name}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-cream-200 dark:bg-forest-800 dark:bg-forest-700">
                    <div className="h-full rounded-full bg-gold-500" style={{ width: `${(c.clicks / maxClicks) * 100}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-forest-900 dark:text-cream-100">{c.clicks}</span>
                </div>
              ))}
              {clicks.data.length === 0 && <p className="text-sm text-forest-700/60 dark:text-cream-100/60">No data yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPage>
  );
}
