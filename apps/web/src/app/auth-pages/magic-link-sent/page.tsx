export default function MagicLinkSentPage() {
  return (
    <div className="space-y-6 text-center">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
        Check your email
      </h1>
      <p className="text-sm text-forest-700/70 dark:text-cream-100/70">
        We sent you a sign-in link. Click it to continue.
      </p>
      <p className="text-xs text-forest-700/60">
        The link expires in 15 minutes and can only be used once.
      </p>
    </div>
  );
}
