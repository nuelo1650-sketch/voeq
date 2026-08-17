'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { createConversation } from '@/lib/conversation-client';

interface MessageButtonProps {
  vendorId: string;
  listingId?: string;
  className?: string;
  fullWidth?: boolean;
}

export function MessageButton({ vendorId, listingId, className, fullWidth }: MessageButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { id } = await createConversation(vendorId, listingId);
      router.push(`/messages/${id}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-forest-700 bg-transparent px-4 py-2.5 text-sm font-semibold text-forest-800 transition hover:bg-forest-700/10 disabled:opacity-60 dark:border-cream-100 dark:text-cream-100 dark:hover:bg-forest-700 ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
    >
      <MessageSquare className="h-4 w-4" />
      {loading ? 'Opening…' : 'Message'}
    </button>
  );
}
