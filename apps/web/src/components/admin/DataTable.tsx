'use client';

import { type ReactNode, useState } from 'react';

interface DataTableProps<T> {
  columns: Array<{ key: string; label: string; render?: (row: T) => ReactNode }>;
  rows: T[];
  getRowId: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, rows, getRowId, emptyMessage = 'No records' }: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleAll = () => {
    if (selected.size === rows.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(rows.map(getRowId)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-cream-300 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
      <table className="min-w-full divide-y divide-cream-300 dark:divide-forest-700">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-forest-700/70 dark:text-cream-100/70">
            <th className="px-4 py-3">
              <input
                type="checkbox"
                checked={rows.length > 0 && selected.size === rows.length}
                onChange={toggleAll}
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-300 dark:divide-forest-700">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-forest-700/70 dark:text-cream-100/70">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const id = getRowId(row);
              return (
                <tr key={id} className="text-sm text-forest-900 dark:text-cream-100">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(id)}
                      onChange={() => toggleOne(id)}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as unknown as ReactNode}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {selected.size > 0 ? (
        <div className="border-t border-cream-300 px-4 py-3 text-xs text-forest-700/80 dark:border-forest-700 dark:text-cream-100/80">
          {selected.size} selected
        </div>
      ) : null}
    </div>
  );
}
