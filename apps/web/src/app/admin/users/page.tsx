import { type Metadata } from 'next';
import AdminUsersClient from './client-page';

export const metadata: Metadata = {
  title: 'Admin - Users',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminUsersPage() {
  return <AdminUsersClient />;
}
