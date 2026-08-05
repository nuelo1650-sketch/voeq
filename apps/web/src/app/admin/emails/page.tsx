import { type Metadata } from 'next';
import AdminLayout from '../layout';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin - Emails',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminEmailsPage() {
  return (
    <AdminLayout>
      <AdminHeader title="Emails" />
      <p className="mt-4 text-sm text-forest-700/80 dark:text-cream-100/80">Email composer placeholder.</p>
    </AdminLayout>
  );
}
