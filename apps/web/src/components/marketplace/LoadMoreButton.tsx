'use client';

import { Button } from '@/components/ui/Button';

interface LoadMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
  hasMore: boolean;
}

export function LoadMoreButton({ onClick, loading, hasMore }: LoadMoreButtonProps) {
  if (!hasMore) return null;
  return (
    <div className="flex justify-center py-8">
      <Button variant="outline" onClick={onClick} isLoading={loading}>
        Load more
      </Button>
    </div>
  );
}
