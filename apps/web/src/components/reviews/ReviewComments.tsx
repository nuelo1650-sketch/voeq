'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { HeartIcon } from '@/components/icons';
import { useToast } from '@/components/ui/Toast';
import { formatDistanceToNow } from '@/lib/utils';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; image: string | null };
}

interface ReviewCommentsProps {
  reviewId: string;
}

export function ReviewComments({ reviewId }: ReviewCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetch(`/api/reviews/${reviewId}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments || []))
      .catch(() => setComments([]));
  }, [reviewId]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
        credentials: 'include',
      });
      if (res.ok) {
        const { comment } = await res.json();
        setComments((prev) => [...prev, comment]);
        setNewComment('');
        showToast('Comment added', 'success');
      } else {
        showToast('Failed to add comment', 'error');
      }
    } catch (e) {
      showToast('Failed to add comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-3 border-t border-cream-200 pt-4 dark:border-forest-700 dark:border-cream-100">
      {comments.map((c) => (
        <div key={c.id} className="flex gap-3">
          <Avatar size="sm" alt={c.author.name ?? 'User'} src={c.author.image} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-forest-900 dark:text-cream-100">{c.author.name ?? 'Anonymous'}</span>
              <span className="text-xs text-forest-700/60 dark:text-cream-100/60">
                {formatDistanceToNow(new Date(c.createdAt))} ago
              </span>
            </div>
            <p className="mt-1 text-sm text-forest-700/90 dark:text-cream-100/90">{c.content}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button
          onClick={handleSubmit}
          isLoading={submitting}
          disabled={!newComment.trim()}
          size="sm"
        >
          Post
        </Button>
      </div>
    </div>
  );
}

interface ReviewLikeButtonProps {
  reviewId: string;
  initialCount: number;
  initialLiked: boolean;
}

export function ReviewLikeButton({ reviewId, initialCount, initialLiked }: ReviewLikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const { showToast } = useToast();

  const handleClick = async () => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const { liked: newLiked } = await res.json();
        setLiked(newLiked);
        setCount((c) => c + (newLiked ? 1 : -1));
      } else {
        showToast('Please sign in to like reviews', 'info');
      }
    } catch (e) {
      showToast('Failed to like review', 'error');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-1 text-sm text-forest-700/70 transition hover:text-red-600 dark:text-cream-100/70"
      aria-label={liked ? 'Unlike review' : 'Like review'}
    >
      <HeartIcon className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} filled={liked} />
      <span>{count}</span>
    </button>
  );
}
