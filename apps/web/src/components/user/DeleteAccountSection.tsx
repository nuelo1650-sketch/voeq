'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { deleteAccount } from '@/lib/user-client';
import { useToast } from '@/components/ui/Toast';

export function DeleteAccountSection() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (confirm !== 'DELETE MY ACCOUNT') return;
    setDeleting(true);
    try {
      await deleteAccount();
      showToast('Account deleted', 'success');
      router.push('/');
    } catch (e) {
      showToast('Failed to delete account', 'error');
      setDeleting(false);
    }
  };

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <CardTitle className="text-red-700 dark:text-red-400">Danger zone</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-forest-700/70 dark:text-cream-100/70">
          Deleting your account is permanent. All your data will be removed.
        </p>
        <Button variant="destructive" className="mt-4" onClick={() => setOpen(true)}>
          Delete account
        </Button>

        <Modal isOpen={open} onClose={() => setOpen(false)} title="Delete account">
          <div className="p-6 space-y-4">
            <p className="text-sm text-forest-700/80 dark:text-cream-100/80">
              This action cannot be undone. Type <strong>DELETE MY ACCOUNT</strong> to confirm.
            </p>
            <Input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type DELETE MY ACCOUNT"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} isLoading={deleting} disabled={confirm !== 'DELETE MY ACCOUNT'}>
                Delete permanently
              </Button>
            </div>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
}
