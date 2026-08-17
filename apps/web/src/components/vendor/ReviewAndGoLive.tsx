'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/Checkbox';
import { VendorCard } from '@/components/marketplace/VendorCard';
import { getMyVendor, acceptVendorAgreement, goLive } from '@/lib/vendor-client';
import { getCurrentAgreements } from '@/lib/auth-client';
import { useStepSave } from '@/lib/useStepSave';
import { AuthError } from '@/components/auth/AuthError';
import type { VendorProfile } from '@/lib/vendor-client';

export function ReviewAndGoLive() {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [agreement, setAgreement] = useState<{ version: string; content: string; title: string } | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const { status, error, save, retry } = useStepSave();

  const load = useCallback(() => {
    setLoadError(false);
    Promise.all([
      getMyVendor().then((res) => {
        if ('vendor' in res) setVendor(res.vendor);
      }),
      getCurrentAgreements().then((data) => {
        if (data.vendorAgreement) {
          setAgreement({
            version: data.vendorAgreement.version,
            content: data.vendorAgreement.content,
            title: data.vendorAgreement.title,
          });
        }
      }),
    ]).catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loadError) {
    return (
      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 text-center dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
        <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
          We couldn&apos;t load your profile. Check your connection and try again.
        </p>
        <Button className="mt-4" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  if (!vendor) {
    return <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Loading…</p>;
  }

  const previewVendor = {
    id: vendor.id,
    slug: vendor.businessSlug,
    businessName: vendor.businessName,
    description: vendor.description,
    photoUrl: null,
    campusName: vendor.campus?.name ?? '',
    ratingAvg: 0,
    ratingCount: 0,
    verifiedBadge: false,
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) setScrolled(true);
  };

  const handleGoLive = () =>
    save(async () => {
      if (!vendor || !agreement) return;
      if (!vendor.agreementAcceptedAt) {
        await acceptVendorAgreement(agreement.version);
      }
      await goLive();
      router.push('/vendor');
    });

  const SummaryCard = ({
    title,
    step,
    children,
  }: {
    title: string;
    step: 1 | 2 | 3;
    children: React.ReactNode;
  }) => (
    <details className="group rounded-lg border border-cream-200 dark:border-forest-700 dark:border-cream-100/30">
      <summary className="flex cursor-pointer items-center justify-between gap-3 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-forest-700/60 dark:text-cream-100/60">{title}</span>
        <Button variant="ghost" size="sm" onClick={() => router.push(`/vendor/onboarding/step-${step}`)}>
          Edit
        </Button>
      </summary>
      <div className="border-t border-cream-200 px-4 py-3 text-sm text-forest-700/80 dark:border-forest-700 dark:text-cream-100/80">
        {children}
      </div>
    </details>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Review your profile</h2>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          Check that everything looks right before going live.
        </p>
      </div>

      <div className="space-y-3">
        <SummaryCard title="Business" step={1}>
          <p className="font-semibold text-forest-900 dark:text-cream-100">{vendor.businessName}</p>
          <p>{vendor.description}</p>
        </SummaryCard>
        <SummaryCard title="Contact & location" step={2}>
          <p>WhatsApp: {vendor.whatsappNumber}</p>
          {vendor.publicPhone && <p>Public phone: {vendor.publicPhone}</p>}
          <p>
            {vendor.institution?.name}
            {vendor.campus?.name ? ` — ${vendor.campus.name}` : ''}
          </p>
          {(vendor.websiteUrl || vendor.instagramHandle || vendor.tiktokHandle || vendor.twitterHandle || vendor.facebookPage || vendor.linkedinProfile) && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {vendor.websiteUrl && <span>Website: {vendor.websiteUrl}</span>}
              {vendor.instagramHandle && <span>Instagram: {vendor.instagramHandle}</span>}
              {vendor.tiktokHandle && <span>TikTok: {vendor.tiktokHandle}</span>}
              {vendor.twitterHandle && <span>X: {vendor.twitterHandle}</span>}
              {vendor.facebookPage && <span>Facebook: {vendor.facebookPage}</span>}
              {vendor.linkedinProfile && <span>LinkedIn: {vendor.linkedinProfile}</span>}
            </div>
          )}
        </SummaryCard>
        <SummaryCard title="Listing" step={3}>
          {vendor.listings.length > 0 ? (
            <ul className="space-y-1">
              {vendor.listings.map((listing) => (
                <li key={listing.id}>
                  {listing.title}{' '}
                  <span className="text-forest-700/60 dark:text-cream-100/60">({listing.category.name})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-forest-700/60 dark:text-cream-100/60">No listing yet.</p>
          )}
        </SummaryCard>
      </div>

      {/* Live public preview — the payoff/check moment */}
      <div className="rounded-2xl border border-gold-500/30 bg-gold-500/5 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-forest-700/70 dark:text-cream-100/70">
          How your storefront appears live
        </p>
        <div className="mx-auto max-w-xs">
          <VendorCard vendor={previewVendor} />
        </div>
      </div>

      <div className="rounded-lg border-2 border-gold-500/30 bg-gold-500/5 p-4">
        <Button variant="outline" fullWidth onClick={() => setShowAgreement(true)}>
          {vendor.agreementAcceptedAt ? '✓ Vendor agreement accepted' : 'Read & accept vendor agreement'}
        </Button>
      </div>

      <AuthError>{error}</AuthError>
      {status === 'error' && (
        <div className="flex justify-end">
          <Button variant="ghost" onClick={retry}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex justify-between border-t border-cream-200 pt-6 dark:border-forest-700">
        <Button variant="ghost" onClick={() => router.push('/vendor/onboarding/step-3')}>
          Back
        </Button>
        <Button onClick={handleGoLive} isLoading={status === 'saving'} disabled={!vendor.agreementAcceptedAt && !agreed}>
          Go live
        </Button>
      </div>

      <Modal isOpen={showAgreement} onClose={() => setShowAgreement(false)} title={agreement?.title ?? 'Agreement'}>
        <div className="space-y-4 p-6">
          <div
            onScroll={handleScroll}
            className="h-64 overflow-y-auto rounded-lg border border-cream-200 bg-cream-50 p-4 text-sm dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100"
          >
            <pre className="whitespace-pre-wrap font-sans">{agreement?.content}</pre>
          </div>
          {!scrolled && <p className="text-xs text-forest-700/60 dark:text-cream-100/60">Scroll to the bottom to continue</p>}
          <Checkbox
            label="I agree to the vendor agreement"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={!scrolled}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowAgreement(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setAgreed(true); setShowAgreement(false); }} disabled={!agreed}>
              Accept
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
