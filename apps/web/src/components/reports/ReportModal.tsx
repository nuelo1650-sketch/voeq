'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { reportVendor } from '@/lib/report-client';
import type { ReportCategory } from '@/lib/report-client';

const CATEGORIES = [
  { value: 'not_on_campus', label: 'Not on campus' },
  { value: 'scam_or_fraud', label: 'Scam or fraud' },
  { value: 'inappropriate_content', label: 'Inappropriate content' },
  { value: 'impersonation', label: 'Impersonation' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'other', label: 'Other' },
] as const;

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
}

export function ReportModal({ isOpen, onClose, vendorId, vendorName }: ReportModalProps) {
  const [category, setCategory] = useState<string>('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!category) return;
    setSubmitting(true);
    setError(null);
    try {
      await reportVendor(vendorId, { category: category as ReportCategory, text: text || undefined });
      setSubmitted(true);
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message ?? 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setCategory('');
    setText('');
    setError(null);
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Report submitted">
        <div className="p-6 text-center">
          <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
            Thank you. Our team will review your report and take action if needed.
          </p>
          <p className="mt-3 text-xs text-forest-700/60 dark:text-cream-100/60">
            False reports may result in your reporting privileges being suspended.
          </p>
          <div className="mt-6">
            <Button onClick={handleClose} fullWidth>Close</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Report ${vendorName}`}>
      <div className="p-6 space-y-4">
        <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
          Why are you reporting this vendor?
        </p>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left text-sm transition ${
                category === cat.value
                  ? 'border-forest-700 bg-cream-100 dark:border-gold-500 dark:bg-forest-900'
                  : 'border-cream-200 hover:border-forest-700/30 dark:border-forest-700'
              } dark:border-cream-100 dark:border-cream-100/30`}
            >
              <div className={`h-4 w-4 rounded-full border-2 ${
                category === cat.value ? 'border-forest-700 bg-forest-700' : 'border-cream-300'
              } dark:border-cream-100 dark:border-forest-700`} />
              {cat.label}
            </button>
          ))}
        </div>
        <Textarea
          label="Details (optional)"
          rows={3}
          maxLength={500}
          placeholder="Provide more context..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={submitting} disabled={!category}>
            Submit report
          </Button>
        </div>
      </div>
    </Modal>
  );
}
