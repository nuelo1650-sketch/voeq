'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { acceptAgreement, getCurrentAgreements } from '@/lib/auth-client';

interface AgreementModalProps {
  isOpen: boolean;
  onAccepted: () => void;
}

export function AgreementModal({ isOpen, onAccepted }: AgreementModalProps) {
  const [content, setContent] = useState<{
    tos: { version: string; content: string; title: string } | null;
    privacy: { version: string; content: string; title: string } | null;
  } | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setAgreed(false);
    setScrolledToBottom(false);
    setError(null);
    getCurrentAgreements()
      .then((data) => {
        setContent({
          tos: data.tos ? { version: data.tos.version, content: data.tos.content, title: data.tos.title } : null,
          privacy: data.privacy ? { version: data.privacy.version, content: data.privacy.content, title: data.privacy.title } : null,
        });
      })
      .catch(() => {
        setError('Failed to load agreement. Please refresh.');
      });
  }, [isOpen]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 20) {
      setScrolledToBottom(true);
    }
  };

  const handleAccept = async () => {
    // Accept if we have at least one agreement to record against. If the
    // backend has no current TOS configured we still let the user proceed
    // (recording acceptance of whatever was shown) instead of dead-locking
    // the entire app behind a missing row.
    const version = content?.tos?.version ?? content?.privacy?.version ?? '1.0';
    if (!agreed || !scrolledToBottom) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await acceptAgreement(version);
      onAccepted();
    } catch {
      setError('Failed to save acceptance. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => undefined} hideCloseButton closeOnBackdrop={false} closeOnEscape={false}>
      <div className="p-6">
        <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">
          {content?.tos?.title ?? 'Terms of Service'}
        </h2>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          Please read to the end and accept to continue.
        </p>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="mt-4 h-64 overflow-y-auto rounded-lg border border-cream-200 bg-cream-50 p-4 text-sm text-forest-900 dark:border-forest-700 dark:bg-forest-900 dark:text-cream-100 dark:bg-forest-800 dark:border-cream-100"
        >
          {content ? (
            <div className="space-y-6">
              {content.tos && (
                <section>
                  <h3 className="mb-2 font-semibold text-forest-900 dark:text-cream-100">{content.tos.title}</h3>
                  <pre className="whitespace-pre-wrap font-sans">{content.tos.content}</pre>
                </section>
              )}
              {content.privacy && (
                <section>
                  <h3 className="mb-2 font-semibold text-forest-900 dark:text-cream-100">{content.privacy.title}</h3>
                  <pre className="whitespace-pre-wrap font-sans">{content.privacy.content}</pre>
                </section>
              )}
              {!content.tos && !content.privacy && <p>Loading…</p>}
            </div>
          ) : (
            <p>Loading…</p>
          )}
        </div>
        {!scrolledToBottom && content && (
          <p className="mt-2 text-xs text-forest-700/60 dark:text-cream-100/60">Scroll to the bottom to continue</p>
        )}
        <div className="mt-4">
          <Checkbox
            label={`I agree to the ${content?.tos?.title ?? 'Terms of Service'}${content?.privacy ? ' and Privacy Policy' : ''}`}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={!scrolledToBottom}
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end">
          <Button onClick={handleAccept} isLoading={isSubmitting} disabled={!agreed || !scrolledToBottom}>
            Accept and continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
