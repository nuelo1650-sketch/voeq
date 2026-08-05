import { type Metadata } from 'next';
import AdminLayout from '../layout';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin - Campuses',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCampusesPage() {
  return (
    <AdminLayout>
      <AdminHeader title="Campuses" />
      <p className="mt-4 text-sm text-forest-700/80 dark:text-cream-100/80">Campus management placeholder.</p>
    </AdminLayout>
  );
}
