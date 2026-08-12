import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { CookiesBanner } from '@/components/cookies/CookiesBanner';
import { ToastProvider } from '@/components/ui/Toast';
import { SkipToContent } from '@/components/a11y/SkipToContent';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://voeq.ng';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Voeq',
  url: siteUrl,
  description: 'Discover verified campus vendors on Voeq. Browse food, tech, fashion, and 20+ categories. Connect directly via WhatsApp.',
  publisher: {
    '@type': 'Organization',
    name: 'Voeq Limited',
    url: siteUrl,
  },
};

export const metadata: Metadata = {
  title: {
    default: 'Voeq — Find. Connect. Grow.',
    template: '%s · Voeq',
  },
  description: 'Voeq is the professional campus marketplace for Nigerian students. Discover verified vendors across 100+ universities and 20+ categories. Connect directly via WhatsApp.',
  keywords: [
    'campus vendors Nigeria',
    'student marketplace',
    'food near campus',
    'UNILAG vendors',
    'tech repair campus',
    'tailoring campus',
    'verified vendors',
    'WhatsApp marketplace',
    'university vendors',
  ],
  authors: [{ name: 'Voeq Limited' }],
  creator: 'Voeq Limited',
  publisher: 'Voeq Limited',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'Voeq',
    title: 'Voeq — Find. Connect. Grow.',
    description: 'Discover verified campus vendors on Voeq. Browse food, tech, fashion, and 20+ categories. Connect directly via WhatsApp.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Voeq — Find. Connect. Grow.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voeq — Find. Connect. Grow.',
    description: 'Discover verified campus vendors on Voeq. Connect directly via WhatsApp.',
    creator: '@voeqng',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '180x180' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
      { url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased font-sans">
        <SkipToContent />
        <ThemeProvider>
          <PostHogProvider>
            <ToastProvider>
              {children}
              <Suspense fallback={null}>
                <CookiesBanner />
              </Suspense>
            </ToastProvider>
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
