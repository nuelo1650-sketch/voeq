import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SITE_NAME = 'Voeq';
const DEFAULT_DESCRIPTION = 'Discover verified campus vendors on Voeq. Browse food, tech, fashion, and 20+ categories. Connect directly via WhatsApp. Built for Nigerian students.';
const DEFAULT_OG_IMAGE = '/og/default.png';

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  keywords,
}: {
  title: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} · ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: 'en_NG',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildOrganizationJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Voeq Limited',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/voeq-wordmark.svg`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  });
}

export function buildWebSiteJsonLd(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}

export function buildFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>,
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}
