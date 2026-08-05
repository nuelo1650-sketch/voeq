import { type Metadata } from 'next';
import AdminLayout from '../layout';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin - Reports',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminReportsPage() {
  return (
    <AdminLayout>
      <AdminHeader title="Reports" />
      <p className="mt-4 text-sm text-forest-700/80 dark:text-cream-100/80">Report queue placeholder.</p>
    </AdminLayout>
  );
}
