'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminPage } from '@/components/admin/AdminPage';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminEmailsPage() {
  const router = useRouter();
  const [to, setTo] = useState<'all_users' | 'all_vendors'>('all_users');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const send = async () => {
    setPending(true);
    setStatus(null);
    try {
      await api('/api/admin/emails/send', {
        method: 'POST',
        body: JSON.stringify({ to, subject, body }),
      });
      setStatus('Sent ✓');
      router.refresh();
    } catch (e: unknown) {
      const err = e as { message?: string };
      setStatus(err.message ?? 'Failed to send');
    } finally {
      setPending(false);
    }
  };

  return (
    <AdminPage title="Broadcast email" description="Send an announcement to your users or vendors.">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <label className="text-sm font-medium text-forest-900 dark:text-cream-100">Recipients</label>
            <select value={to} onChange={(e) => setTo(e.target.value as 'all_users' | 'all_vendors')} className="mt-1 w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-forest-700 dark:bg-forest-800">
              <option value="all_users">All users</option>
              <option value="all_vendors">All vendors</option>
            </select>
          </div>
          <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-forest-900 dark:text-cream-100">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="mt-1 w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-forest-700 dark:bg-forest-800" />
          </div>
          <Button variant="gold" onClick={send} disabled={pending || !subject || !body}>
            {pending ? 'Sending…' : 'Send email'}
          </Button>
          {status && <p className="text-sm text-forest-700/70 dark:text-cream-100/70">{status}</p>}
        </CardContent>
      </Card>
    </AdminPage>
  );
}
