import { type Metadata } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin - Impersonating',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminImpersonatingPage() {
  return (
    <>
      <AdminHeader title="Impersonation" />
      <p className="mt-4 text-sm text-forest-700/80 dark:text-cream-100/80">Impersonation landing placeholder.</p>
    </>
  );
}
