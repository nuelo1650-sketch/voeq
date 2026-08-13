'use client';

import { useEffect, useState, useCallback } from 'react';

interface PressItem {
  id: string;
  kind: string;
  title: string;
  summary: string | null;
  body: string | null;
  publishDate: string;
  isPublished: boolean;
}

const KINDS = ['announcement', 'feature', 'press-release', 'blog'];

export default function PressAdminClient() {
  const [items, setItems] = useState<PressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kind, setKind] = useState('announcement');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/press', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch (e) {
      setError('Could not load press items.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setEditingId(null);
    setKind('announcement');
    setTitle('');
    setSummary('');
    setBody('');
    setIsPublished(true);
  };

  const startEdit = (item: PressItem) => {
    setEditingId(item.id);
    setKind(item.kind);
    setTitle(item.title);
    setSummary(item.summary ?? '');
    setBody(item.body ?? '');
    setIsPublished(item.isPublished);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = { kind, title, summary: summary || undefined, body: body || undefined, isPublished };
    try {
      const res = editingId
        ? await fetch(`/api/admin/press/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) })
        : await fetch('/api/admin/press', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Save failed');
      resetForm();
      await load();
    } catch {
      setError('Could not save. Check your session and try again.');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this press item?')) return;
    try {
      const res = await fetch(`/api/admin/press/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError('Could not delete.');
    }
  };

  return (
    <div>
      {error && <p className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
        <h2 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">
          {editingId ? 'Edit press item' : 'New press item'}
        </h2>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-forest-700 dark:text-cream-100">Kind</span>
              <select value={kind} onChange={(e) => setKind(e.target.value)} className="w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-forest-700 dark:bg-forest-800">
                {KINDS.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-forest-700 dark:text-cream-100">Title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-forest-700 dark:bg-forest-800" />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-forest-700 dark:text-cream-100">Summary</span>
            <input value={summary} onChange={(e) => setSummary(e.target.value)} className="w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-forest-700 dark:bg-forest-800" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-forest-700 dark:text-cream-100">Body</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-forest-700 dark:bg-forest-800" />
          </label>
          <label className="flex items-center gap-2 text-sm text-forest-700 dark:text-cream-100">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /> Published
          </label>
          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-forest-700 px-4 py-2 text-sm font-medium text-cream-100 hover:bg-forest-800">
              {editingId ? 'Save changes' : 'Create'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="rounded-md border border-cream-300 px-4 py-2 text-sm text-forest-700 dark:border-forest-700 dark:text-cream-100">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">Existing items</h2>
        {loading ? (
          <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">No press items yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 dark:border-forest-700 dark:bg-forest-800">
                <div>
                  <p className="text-sm font-medium text-forest-900 dark:text-cream-100">{item.title}</p>
                  <p className="text-xs text-forest-700/60 dark:text-cream-100/60">{item.kind}{item.isPublished ? '' : ' · draft'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(item)} className="rounded-md border border-cream-300 px-3 py-1 text-xs text-forest-700 dark:border-forest-700 dark:text-cream-100">Edit</button>
                  <button onClick={() => remove(item.id)} className="rounded-md border border-red-300 px-3 py-1 text-xs text-red-700">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
