import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { serverGetMe as getMe } from '@/lib/auth-server';
import { serverGetCategories as getCategories } from '@/lib/marketplace-server';
import { HomeWizard } from '@/components/home/HomeWizard';

export const metadata: Metadata = {
  title: 'Home',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const me = await getMe().catch(() => null);
  if (!me?.user) {
    redirect('/signin');
  }

  const user = me.user;

  // Returning users skip the one-time welcome wizard.
  if (user.homeSeenAt) {
    if (user.role === 'vendor') redirect('/vendor');
    if (user.role === 'admin' || user.role === 'super_admin') redirect('/admin');
    redirect('/buyer-dashboard');
  }

  const [categoriesResult] = await Promise.all([
    getCategories().catch(() => ({ categories: [] as Array<{ id: string; name: string; slug: string; iconName: string }> })),
  ]);

  const firstName = user.name?.split(' ')[0] ?? 'there';

  return (
    <HomeWizard
      firstName={firstName}
      categories={categoriesResult.categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        iconName: c.iconName,
      }))}
    />
  );
}
