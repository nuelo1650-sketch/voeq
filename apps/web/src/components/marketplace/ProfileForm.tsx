'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { updateProfile } from '@/lib/auth-client';

interface ProfileFormProps {
  initialName: string;
  initialImage: string | null;
}

export function ProfileForm({ initialName, initialImage }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateProfile({ name, image: image || undefined });
      setSuccess(true);
      router.refresh();
    } catch {
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={100}
      />
      <Input
        label="Profile image URL"
        type="url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="https://..."
        helperText="Paste a URL to your profile image"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved successfully</p>}
      <Button type="submit" isLoading={saving}>
        Save changes
      </Button>
    </form>
  );
}
