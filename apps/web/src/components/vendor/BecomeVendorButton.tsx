'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { upgradeToVendor } from '@/lib/vendor-client';

export function BecomeVendorButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await upgradeToVendor();
      router.push('/vendor/onboarding/step-1');
    } catch {
      setError('Could not start vendor setup. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="lg" fullWidth isLoading={loading} onClick={handleClick}>
        Get started
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
}
