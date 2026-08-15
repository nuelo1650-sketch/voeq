'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';

interface SignupDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  userType: 'buyer' | 'vendor';
}

export function SignupDisclaimerModal({ isOpen, onClose, onAccept, userType }: SignupDisclaimerModalProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Before you create your ${userType} account`}
    >
      <div className="p-6 space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            <strong>Important:</strong> Please read and acknowledge the following before continuing.
          </p>
        </div>

        <div className="space-y-3 text-sm text-forest-700/90 dark:text-cream-100/90">
          <Checkbox
            label={
              <span>
                I understand that Voeq is strictly a discovery and classifieds directory. Voeq does not process payments, verify vendor identity beyond email confirmation, or take responsibility for any transaction, exchange, scam, or interaction between users. I agree to transact with other users entirely at my own risk, and I agree to release and hold harmless Voeq&apos;s founders, developers, and administrators from any resulting claims or disputes, per Voeq&apos;s{' '}
                <Link href="/terms" target="_blank" className="text-forest-700 underline dark:text-gold-500 dark:text-cream-100">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-forest-700 underline dark:text-gold-500 dark:text-cream-100">
                  Privacy Policy
                </Link>
                .
              </span>
            }
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAccept} disabled={!accepted}>
            I understand, continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
