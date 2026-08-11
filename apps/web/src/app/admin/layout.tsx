import { redirect } from 'next/navigation';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ImpersonationBanner } from '@/components/admin/ImpersonationBanner';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getMe().catch(() => null);
  if (!me || (me.user.role !== 'admin' && me.user.role !== 'super_admin')) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-forest-900">
      <ImpersonationBanner />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
