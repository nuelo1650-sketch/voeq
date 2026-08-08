import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { CookiesBanner } from '@/components/cookies/CookiesBanner';
import { SkipToContent } from '@/components/a11y/SkipToContent';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Voeq — Find. Connect. Grow.',
    template: '%s · Voeq',
  },
  description: 'Discover verified campus vendors on Voeq. Browse food, tech, fashion, and 20+ categories. Connect directly via WhatsApp. Built for Nigerian students.',
  keywords: ['campus vendors Nigeria', 'student marketplace', 'food near campus', 'UNILAG vendors', 'tech repair campus'],
  authors: [{ name: 'Voeq Limited' }],
  creator: 'Voeq Limited',
  publisher: 'Voeq Limited',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'Voeq',
    title: 'Voeq — Find. Connect. Grow.',
    description: 'Discover verified campus vendors. Connect via WhatsApp. Built for students.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voeq — Find. Connect. Grow.',
    description: 'Discover verified campus vendors. Connect via WhatsApp.',
    creator: '@voeqng',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '180x180' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/favicon.png', sizes: '192x192' },
      { rel: 'apple-touch-icon', url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F5F0' },
    { media: '(prefers-color-scheme: dark)', color: '#061F17' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased font-sans">
        <SkipToContent />
        <ThemeProvider>
          <PostHogProvider>
            {children}
            <Suspense fallback={null}>
              <CookiesBanner />
            </Suspense>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
