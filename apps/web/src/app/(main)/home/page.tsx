import { redirect } from 'next/navigation';
import { serverGetMe as getMe } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const me = await getMe().catch(() => null);
  if (!me?.user) {
    redirect('/signin');
  }
  const role = me.user.role;
  if (role === 'vendor') redirect('/vendor/dashboard');
  if (role === 'admin' || role === 'super_admin') redirect('/admin');
  redirect('/shopper/dashboard');
}
