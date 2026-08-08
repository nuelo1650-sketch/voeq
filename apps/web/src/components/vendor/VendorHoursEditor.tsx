'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const DAY_LABELS = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
  friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
} as const;

interface DayHours { open?: string; close?: string; closed?: boolean }
interface OperatingHours { [key: string]: DayHours }

interface VendorHoursEditorProps {
  initialHours: OperatingHours | null;
  isAlwaysOpen: boolean;
  timezone: string;
  onSave: (data: { operatingHours: OperatingHours; isAlwaysOpen: boolean; timezone: string }) => Promise<void>;
}

export function VendorHoursEditor({ initialHours, isAlwaysOpen, timezone, onSave }: VendorHoursEditorProps) {
  const [hours, setHours] = useState<OperatingHours>(
    initialHours || DAYS.reduce((acc, day) => ({ ...acc, [day]: { open: '09:00', close: '18:00' } }), {})
  );
  const [alwaysOpen, setAlwaysOpen] = useState(isAlwaysOpen);
  const [tz, setTz] = useState(timezone);
  const [saving, setSaving] = useState(false);

  const updateDay = (day: string, field: 'open' | 'close', value: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };
  const toggleClosed = (day: string, closed: boolean) => {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ operatingHours: hours, isAlwaysOpen: alwaysOpen, timezone: tz });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-forest-900 dark:text-cream-100">Operating hours</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={alwaysOpen}
              onChange={(e) => setAlwaysOpen(e.target.checked)}
              className="rounded"
            />
            Always open
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 dark:text-cream-100 mb-1">Timezone</label>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className="rounded-md border border-cream-300 bg-cream-50 px-3 py-1.5 text-sm dark:border-forest-700 dark:bg-forest-800"
          >
            <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        {!alwaysOpen && (
          <div className="space-y-2">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-3">
                <label className="w-24 text-sm font-medium text-forest-700 dark:text-cream-100">
                  {DAY_LABELS[day]}
                </label>
                <input
                  type="checkbox"
                  checked={!hours[day]?.closed}
                  onChange={(e) => toggleClosed(day, !e.target.checked)}
                />
                <input
                  type="time"
                  value={hours[day]?.open || '09:00'}
                  onChange={(e) => updateDay(day, 'open', e.target.value)}
                  disabled={hours[day]?.closed}
                  className="rounded-md border border-cream-300 bg-cream-50 px-2 py-1 text-sm dark:border-forest-700 dark:bg-forest-800"
                />
                <span className="text-sm text-forest-700/60 dark:text-cream-100/60">to</span>
                <input
                  type="time"
                  value={hours[day]?.close || '18:00'}
                  onChange={(e) => updateDay(day, 'close', e.target.value)}
                  disabled={hours[day]?.closed}
                  className="rounded-md border border-cream-300 bg-cream-50 px-2 py-1 text-sm dark:border-forest-700 dark:bg-forest-800"
                />
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleSave} isLoading={saving} className="w-full">
          Save hours
        </Button>
      </CardContent>
    </Card>
  );
}
