'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-12">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">← Back</Link>
          </Button>
        </div>
        <div className="flex-1 flex flex-col justify-center">{children}</div>
      </div>
    </div>
  );
}
