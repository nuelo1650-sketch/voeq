'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { getCurrentAgreements } from '@/lib/auth-client';

export function VendorAgreementModal({ onAccepted }: { onAccepted: () => void }) {
  const [open, setOpen] = useState(false);
  const [agreement, setAgreement] = useState<{ version: string; content: string; title: string } | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleOpen = async () => {
    const data = await getCurrentAgreements();
    if (data.vendorAgreement) {
      setAgreement({ version: data.vendorAgreement.version, content: data.vendorAgreement.content, title: data.vendorAgreement.title });
    }
    setOpen(true);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) setScrolled(true);
  };

  return (
    <>
      <Button variant="outline" fullWidth onClick={handleOpen}>
        Read vendor agreement
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title={agreement?.title ?? 'Agreement'}>
        <div className="p-6 space-y-4">
          <div onScroll={handleScroll} className="h-64 overflow-y-auto rounded-lg border border-cream-200 bg-cream-50 p-4 text-sm dark:border-forest-700 dark:bg-forest-900">
            <pre className="whitespace-pre-wrap font-sans">{agreement?.content}</pre>
          </div>
          {!scrolled && <p className="text-xs text-forest-700/60">Scroll to the bottom to continue</p>}
          <Checkbox label="I agree to the vendor agreement" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} disabled={!scrolled} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAgreed(true); onAccepted(); setOpen(false); }} disabled={!agreed}>
              Accept
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
