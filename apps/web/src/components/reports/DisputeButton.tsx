'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { AlertIcon } from '@/components/icons';
import { fileDispute } from '@/lib/marketplace-client';

const REASONS = [
  'Vendor not on campus',
  'Scam or fraud',
  'Inappropriate content',
  'Impersonation',
  'Poor quality / misrepresentation',
  'No-show or unresponsive',
  'Other',
];

interface DisputeButtonProps {
  vendorId: string;
  vendorName: string;
  listingId?: string;
  listingTitle?: string;
}

export function DisputeButton({ vendorId, vendorName, listingId, listingTitle }: DisputeButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!reason || details.length < 10) return;
    setSubmitting(true);
    try {
      await fileDispute({ vendorId, listingId, reason, details });
      showToast('Dispute filed. Our team will review it within 24 hours.', 'success');
      setOpen(false);
      setReason('');
      setDetails('');
    } catch (error) {
      showToast('Failed to file dispute. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Report issue
      </Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`Report ${vendorName}`}>
        <div className="p-6 space-y-4">
          <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
            Tell us what&apos;s wrong. We&apos;ll review within 24 hours.
          </p>

          {listingTitle && (
            <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
              Regarding: {listingTitle}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-md border border-cream-300 bg-cream-50 px-3 py-2 text-sm dark:border-forest-700 dark:bg-forest-800"
            >
              <option value="">Select a reason</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-1">Details (minimum 10 characters)</label>
            <Textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              placeholder="What happened? Include dates, amounts, or any relevant details."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} isLoading={submitting} disabled={!reason || details.length < 10}>
              File dispute
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
