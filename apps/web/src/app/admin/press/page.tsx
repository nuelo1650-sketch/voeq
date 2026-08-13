import { type Metadata } from 'next';
import AdminLayout from '../layout';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Container } from '@/components/ui/Container';
import PressAdminClient from './PressAdminClient';

export const metadata: Metadata = {
  title: 'Admin - Press',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminPressPage() {
  return (
    <AdminLayout>
      <AdminHeader title="Press" />
      <Container size="lg">
        <PressAdminClient />
      </Container>
    </AdminLayout>
  );
}
