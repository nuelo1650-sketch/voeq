'use client';

import { useState } from 'react';
import { ReportModal } from './ReportModal';

interface ReportButtonProps {
  vendorId: string;
  vendorName: string;
  className?: string;
}

export function ReportButton({ vendorId, vendorName, className }: ReportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`text-xs text-forest-700/60 hover:underline dark:text-cream-100/60 ${className ?? ''}`}
      >
        Report this vendor
      </button>
      <ReportModal isOpen={open} onClose={() => setOpen(false)} vendorId={vendorId} vendorName={vendorName} />
    </>
  );
}
