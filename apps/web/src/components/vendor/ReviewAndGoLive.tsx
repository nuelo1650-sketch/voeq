'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/Checkbox';
import { getMyVendor, acceptVendorAgreement, goLive } from '@/lib/vendor-client';
import { getCurrentAgreements } from '@/lib/auth-client';
import type { VendorProfile } from '@/lib/vendor-client';

export function ReviewAndGoLive() {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [agreement, setAgreement] = useState<{ version: string; content: string; title: string } | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyVendor().then((res) => {
      if ('vendor' in res) setVendor(res.vendor);
    });
    getCurrentAgreements().then((data) => {
      if (data.vendorAgreement) {
        setAgreement({ version: data.vendorAgreement.version, content: data.vendorAgreement.content, title: data.vendorAgreement.title });
      }
    });
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) setScrolled(true);
  };

  const handleGoLive = async () => {
    if (!vendor || !agreement) return;
    setSubmitting(true);
    setError(null);
    try {
      if (!vendor.agreementAcceptedAt) {
        await acceptVendorAgreement(agreement.version);
      }
      await goLive();
      router.push('/vendor');
    } catch (err) {
      const e = err as { reason?: string; message?: string };
      setError(e.reason ?? e.message ?? 'Failed to go live');
    } finally {
      setSubmitting(false);
    }
  };

  if (!vendor) {
    return <p className="text-sm text-forest-700/60">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Review your profile</h2>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          Check that everything looks right before going live.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-cream-200 p-4 dark:border-forest-700">
          <p className="text-xs font-medium uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Business</p>
          <p className="mt-1 font-semibold text-forest-900 dark:text-cream-100">{vendor.businessName}</p>
          <p className="text-sm text-forest-700/70 dark:text-cream-100/70">{vendor.description}</p>
        </div>
        <div className="rounded-lg border border-cream-200 p-4 dark:border-forest-700">
          <p className="text-xs font-medium uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">Contact</p>
          <p className="mt-1 text-sm text-forest-900 dark:text-cream-100">WhatsApp: {vendor.whatsappNumber}</p>
        </div>
      </div>

      <div className="rounded-lg border-2 border-gold-500/30 bg-gold-500/5 p-4">
        <Button variant="outline" fullWidth onClick={() => setShowAgreement(true)}>
          {vendor.agreementAcceptedAt ? '✓ Vendor agreement accepted' : 'Read & accept vendor agreement'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => router.push('/vendor/onboarding/step-4')}>
          Back
        </Button>
        <Button
          onClick={handleGoLive}
          isLoading={submitting}
          disabled={!vendor.agreementAcceptedAt && !agreed}
        >
          Go live
        </Button>
      </div>

      <Modal isOpen={showAgreement} onClose={() => setShowAgreement(false)} title={agreement?.title ?? 'Agreement'}>
        <div className="p-6 space-y-4">
          <div onScroll={handleScroll} className="h-64 overflow-y-auto rounded-lg border border-cream-200 bg-cream-50 p-4 text-sm dark:border-forest-700 dark:bg-forest-900">
            <pre className="whitespace-pre-wrap font-sans">{agreement?.content}</pre>
          </div>
          {!scrolled && <p className="text-xs text-forest-700/60">Scroll to the bottom to continue</p>}
          <Checkbox label="I agree to the vendor agreement" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} disabled={!scrolled} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAgreement(false)}>Cancel</Button>
            <Button onClick={() => { setAgreed(true); setShowAgreement(false); }} disabled={!agreed}>
              Accept
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
