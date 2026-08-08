'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { setConsent, getConsent } from './cookies';

interface CookiesPreferencesProps {
  onClose: () => void;
}

export function CookiesPreferences({ onClose }: CookiesPreferencesProps) {
  const existing = getConsent();
  const [analytics, setAnalytics] = useState(existing?.analytics ?? false);
  const [marketing, setMarketing] = useState(existing?.marketing ?? false);

  const handleSave = () => {
    setConsent({ analytics, marketing });
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Cookie preferences">
      <div className="p-6 space-y-6">
        <div className="rounded-2xl border border-cream-200 bg-cream-50 p-4 dark:border-forest-700 dark:bg-forest-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-medium text-forest-900 dark:text-cream-100">Essential cookies</h3>
              <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">
                Required for authentication, security, and core functionality. Cannot be disabled.
              </p>
            </div>
            <div className="rounded-full bg-forest-700 px-3 py-1 text-xs font-medium text-cream-100">
              Always on
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Analytics cookies"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
          <p className="ml-8 text-sm text-forest-700/70 dark:text-cream-100/70">
            Help us understand how visitors use Voeq so we can improve the platform. No personal data is collected.
          </p>
        </div>

        <div className="space-y-4">
          <Checkbox
            label="Marketing cookies"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
          />
          <p className="ml-8 text-sm text-forest-700/70 dark:text-cream-100/70">
            Used to personalize content and measure ad performance. Not active yet.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save preferences</Button>
        </div>
      </div>
    </Modal>
  );
}
