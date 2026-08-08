import LandingPage from '@/components/landing/LandingPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voeq — Find. Connect. Grow.',
  description: 'Discover verified campus vendors on Voeq. Browse food, tech, fashion, and 20+ categories. Connect directly via WhatsApp. Built for Nigerian students at 100+ universities.',
  keywords: ['campus vendors Nigeria', 'student marketplace', 'UNILAG vendors', 'food near campus', 'tech repair campus', 'tailoring campus'],
};

export default function RootPage() {
  return <LandingPage />;
}
