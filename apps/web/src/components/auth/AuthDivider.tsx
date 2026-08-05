export function AuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-cream-300 dark:border-forest-700" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-cream-50 px-4 text-forest-700/60 dark:bg-forest-800 dark:text-cream-100/60">
          or
        </span>
      </div>
    </div>
  );
}
