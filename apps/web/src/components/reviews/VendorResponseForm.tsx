'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { respondToReview, updateResponse } from '@/lib/review-client';

const schema = z.object({
  text: z.string().min(20, 'At least 20 characters').max(500),
});

type FormData = z.infer<typeof schema>;

interface VendorResponseFormProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  existingResponse?: string | null;
  onSuccess?: () => void;
}

export function VendorResponseForm({ isOpen, onClose, reviewId, existingResponse, onSuccess }: VendorResponseFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { text: existingResponse ?? '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError(null);
    try {
      if (existingResponse) {
        await updateResponse(reviewId, data.text);
      } else {
        await respondToReview(reviewId, data.text);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const e = err as { message?: string };
      setError(e.message ?? 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingResponse ? 'Edit response' : 'Respond to review'}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
        <Textarea
          label="Your response"
          rows={4}
          maxLength={500}
          placeholder="Thank the customer, address concerns, or add context..."
          helperText={`${watch('text')?.length ?? 0}/500 characters (min 20)`}
          error={errors.text?.message}
          {...register('text')}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={submitting}>
            {existingResponse ? 'Update response' : 'Post response'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
