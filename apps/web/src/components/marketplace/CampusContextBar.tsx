'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon } from '@/components/icons';
import { CampusSwitcher } from './CampusSwitcher';

interface CampusContextBarProps {
  campusId?: string;
  campusName?: string;
  institutionName?: string;
  onChange?: () => void;
}

export function CampusContextBar({ campusId, campusName, institutionName, onChange }: CampusContextBarProps) {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const router = useRouter();

  if (!campusId) {
    return (
      <button
        type="button"
        onClick={() => setShowSwitcher(true)}
        className="sticky top-16 z-30 flex w-full items-center justify-between gap-2 border-b border-cream-200 bg-cream-50/95 px-6 py-2.5 backdrop-blur transition hover:bg-cream-100 dark:border-forest-700 dark:bg-forest-900/95 dark:hover:bg-forest-800 dark:bg-forest-800/95 dark:border-cream-100"
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-forest-900 dark:text-cream-100">
            Select your campus
          </span>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-forest-700/60 dark:text-cream-100/60" />
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowSwitcher(true)}
        className="sticky top-16 z-30 flex w-full items-center justify-between gap-2 border-b border-cream-200 bg-cream-50/95 px-6 py-2.5 backdrop-blur transition hover:bg-cream-100 dark:border-forest-700 dark:bg-forest-900/95 dark:hover:bg-forest-800 dark:bg-forest-800/95 dark:border-cream-100"
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-forest-700/60 dark:text-cream-100/60">Browsing</span>
          <span className="font-semibold text-forest-900 dark:text-cream-100">
            {institutionName} · {campusName}
          </span>
        </div>
        <ChevronDownIcon className="h-4 w-4 text-forest-700/60 dark:text-cream-100/60" />
      </button>

      {showSwitcher && (
        <CampusSwitcher
          currentCampusId={campusId}
          onClose={() => setShowSwitcher(false)}
          onSelect={() => {
            setShowSwitcher(false);
            onChange?.();
            router.refresh();
          }}
        />
      )}
    </>
  );
}
