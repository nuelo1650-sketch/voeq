import { type Metadata } from 'next';
import { ThemeToggle } from '@/components/marketplace/ThemeToggle';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">Settings</h1>
      <div className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-forest-900 dark:text-cream-100">Theme</p>
            <p className="text-sm text-forest-700/60 dark:text-cream-100/60">Light or dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
      <p className="text-sm text-forest-700/60 dark:text-cream-100/60">
        More settings coming soon (notifications, account deletion, etc.)
      </p>
    </div>
  );
}
