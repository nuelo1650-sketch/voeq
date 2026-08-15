interface EmptyReviewsProps {
  vendorName: string;
}

export function EmptyReviews({ vendorName }: EmptyReviewsProps) {
  return (
    <div className="rounded-2xl border border-cream-300 bg-cream-50 p-8 text-center dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
      <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
        No reviews yet for {vendorName}. Be the first to share your experience.
      </p>
    </div>
  );
}
