import { type Metadata } from 'next';
import AdminLayout from '../layout';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Admin - Profile',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProfilePage() {
  return (
    <AdminLayout>
      <AdminHeader title="Admin Profile" />
      <p className="mt-4 text-sm text-forest-700/80 dark:text-cream-100/80">Admin profile placeholder.</p>
    </AdminLayout>
  );
}
