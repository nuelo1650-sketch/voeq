'use client';

import { useEffect, useState } from 'react';
import { VendorHoursEditor } from './VendorHoursEditor';
import { getMyVendor, upsertVendor } from '@/lib/vendor-client';

type OperatingHours = Record<string, { open?: string; close?: string; closed?: boolean }>;

export function VendorHoursOnboarding() {
  const [initialHours, setInitialHours] = useState<OperatingHours | null>(null);
  const [isAlwaysOpen, setIsAlwaysOpen] = useState(false);
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getMyVendor()
      .then((res) => {
        if ('vendor' in res) {
          setInitialHours(res.vendor.operatingHours ?? null);
          setIsAlwaysOpen(res.vendor.isAlwaysOpen ?? false);
          setTimezone(res.vendor.timezone ?? 'Africa/Lagos');
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return (
    <VendorHoursEditor
      initialHours={initialHours}
      isAlwaysOpen={isAlwaysOpen}
      timezone={timezone}
      onSave={async (data) => {
        await upsertVendor({
          operatingHours: data.operatingHours,
          isAlwaysOpen: data.isAlwaysOpen,
          timezone: data.timezone,
        });
      }}
    />
  );
}
