export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-forest-700 border-t-transparent" />
        <p className="mt-4 text-sm text-forest-700/60 dark:text-cream-100/60">Loading Voeq...</p>
      </div>
    </div>
  );
}
