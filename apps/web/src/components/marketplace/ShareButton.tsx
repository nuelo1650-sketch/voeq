'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export function ShareButton({ url, title, text, className, variant = 'secondary', fullWidth }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ url, title, text });
        return;
      } catch {
        // User cancelled or error, fall through to copy
      }
    }
    await handleCopy();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard failed
    }
  };

  return (
    <Button variant={variant} onClick={handleShare} className={className} fullWidth={fullWidth}>
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
}
