'use client';

import { useState } from 'react';

interface CSVExportButtonProps {
  url: string;
  filename?: string;
  label?: string;
}

export function CSVExportButton({ url, filename = 'export.csv', label = 'Export CSV' }: CSVExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, { credentials: 'include' });
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      className="rounded-full border border-cream-300 px-3 py-1.5 text-sm font-medium text-forest-900 hover:border-forest-700/40 disabled:opacity-50 dark:text-cream-100 dark:border-forest-700 dark:border-cream-100/40"
    >
      {loading ? 'Exporting…' : label}
    </button>
  );
}
