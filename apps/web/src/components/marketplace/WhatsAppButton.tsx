'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { WhatsAppIcon } from '@/components/icons';
import { trackWhatsAppClick } from '@/lib/marketplace-client';
import { Modal } from '@/components/ui/Modal';

interface WhatsAppButtonProps {
  vendorId: string;
  vendorName: string;
  listingId?: string;
  listingTitle?: string;
  listingPrice?: string;
  listingUrl?: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  className?: string;
}

const PREFERENCE_KEY = 'voeq_whatsapp_confirmed';

function buildPrefilledMessage(params: {
  listingTitle?: string;
  listingPrice?: string;
  listingUrl?: string;
  vendorName: string;
}): string {
  const lines: string[] = [];
  lines.push('Hi! I found this on Voeq and I&apos;m interested — is it still available?');
  if (params.listingTitle) {
    lines.push(`${params.listingTitle}${params.listingPrice ? ` — ${params.listingPrice}` : ''}`);
  } else {
    lines.push(params.vendorName);
  }
  if (params.listingUrl) {
    lines.push(params.listingUrl);
  }
  return lines.join('\n');
}

export function WhatsAppButton({
  vendorId,
  vendorName,
  listingId,
  listingTitle,
  listingPrice,
  listingUrl,
  variant = 'primary',
  fullWidth,
  className,
}: WhatsAppButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    const confirmed = typeof window !== 'undefined' && localStorage.getItem(PREFERENCE_KEY) === 'true';
    if (!confirmed) {
      setShowConfirm(true);
      return;
    }
    await performClick();
  };

  const performClick = async () => {
    setLoading(true);
    try {
      const { url } = await trackWhatsAppClick({ vendorId, listingId });
      localStorage.setItem(PREFERENCE_KEY, 'true');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    await performClick();
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={handleClick}
        isLoading={loading}
        fullWidth={fullWidth}
        leftIcon={<WhatsAppIcon className="h-5 w-5" />}
        className={className}
      >
        Connect
      </Button>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Open WhatsApp?">
        <div className="p-6 space-y-4">
          <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
            You&apos;re about to chat with <span className="font-semibold">{vendorName}</span>
            {listingTitle && <> about <span className="font-semibold">{listingTitle}</span></>}
            {' '}on WhatsApp. Voeq doesn&apos;t see or store your messages.
          </p>
          <div className="rounded-lg bg-cream-100 p-3 text-xs text-forest-700/80 dark:bg-forest-900 dark:text-cream-100/80">
            <p className="font-medium mb-1">Message preview:</p>
            <pre className="whitespace-pre-wrap font-sans">
              {buildPrefilledMessage({ listingTitle, listingPrice, listingUrl, vendorName })}
            </pre>
          </div>
          <p className="text-xs text-forest-700/60 dark:text-cream-100/60">
            Tip: Verify the vendor&apos;s identity and agree on price before sending money.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm} leftIcon={<WhatsAppIcon className="h-4 w-4" />}>
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
