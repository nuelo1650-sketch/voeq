'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { updatePreferences, type UserPreferences } from '@/lib/user-client';

interface PreferencesFormProps {
  initialPreferences: UserPreferences | null;
}

export function PreferencesForm({ initialPreferences }: PreferencesFormProps) {
  const [prefs, setPrefs] = useState<UserPreferences>({
    emailMarketing: true,
    emailReviews: true,
    emailNewsletter: true,
    notifyNewListings: true,
    notifyNewReviews: true,
    notifyNewFollowers: true,
    notifyDisputes: true,
    ...(initialPreferences || {}),
  });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePreferences(prefs);
      showToast('Preferences saved', 'success');
    } catch (e) {
      showToast('Failed to save preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof UserPreferences, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium text-forest-700 dark:text-cream-100">Email</h4>
        <div className="space-y-2">
          <Checkbox label="Marketing emails" checked={prefs.emailMarketing} onChange={(e) => update('emailMarketing', e.target.checked)} />
          <Checkbox label="Review notifications" checked={prefs.emailReviews} onChange={(e) => update('emailReviews', e.target.checked)} />
          <Checkbox label="Newsletter" checked={prefs.emailNewsletter} onChange={(e) => update('emailNewsletter', e.target.checked)} />
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-sm font-medium text-forest-700 dark:text-cream-100">In-app notifications</h4>
        <div className="space-y-2">
          <Checkbox label="New listings from followed vendors" checked={prefs.notifyNewListings} onChange={(e) => update('notifyNewListings', e.target.checked)} />
          <Checkbox label="New reviews on followed vendors" checked={prefs.notifyNewReviews} onChange={(e) => update('notifyNewReviews', e.target.checked)} />
          <Checkbox label="New followers" checked={prefs.notifyNewFollowers} onChange={(e) => update('notifyNewFollowers', e.target.checked)} />
          <Checkbox label="Dispute updates" checked={prefs.notifyDisputes} onChange={(e) => update('notifyDisputes', e.target.checked)} />
        </div>
      </div>
      <Button onClick={handleSave} isLoading={saving}>Save preferences</Button>
    </div>
  );
}
