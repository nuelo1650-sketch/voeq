'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { RatingInput } from './RatingInput';
import { createReview, updateReview, type Review } from '@/lib/review-client';

const schema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  text: z.string().min(20, 'At least 20 characters').max(500),
});

type FormData = z.infer<typeof schema>;

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: string;
  vendorName: string;
  existingReview?: Review | null;
  onSuccess?: () => void;
}

export function ReviewForm({ isOpen, onClose, vendorId, vendorName, existingReview, onSuccess }: ReviewFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(existingReview?.rating ?? 0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: existingReview?.rating ?? 0,
      text: existingReview?.text ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    try {
      if (existingReview) {
        await updateReview(existingReview.id, data);
      } else {
        await createReview(vendorId, data);
      }
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message ?? 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingReview ? 'Edit your review' : `Review ${vendorName}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-forest-900 dark:text-cream-100 mb-2">
            Your rating
          </label>
          <RatingInput
            value={rating}
            onChange={(r) => {
              setRating(r);
              register('rating').onChange({ target: { value: r, name: 'rating' } });
            }}
            error={errors.rating?.message}
          />
          <input type="hidden" {...register('rating')} value={rating} />
        </div>

        <Textarea
          label="Your review"
          rows={4}
          maxLength={500}
          placeholder="Share your experience with this vendor..."
          helperText={`${watch('text')?.length ?? 0}/500 characters (min 20)`}
          error={errors.text?.message}
          {...register('text')}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={submitting}>
            {existingReview ? 'Update review' : 'Submit review'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
