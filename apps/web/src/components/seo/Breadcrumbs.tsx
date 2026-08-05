import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-forest-700/70 dark:text-cream-100/70">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-1">
              {item.href && index < items.length - 1 ? (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-forest-900 dark:text-cream-100">
                  {item.label}
                </span>
              )}
              {index < items.length - 1 && (
                <span aria-hidden="true" className="text-forest-700/50 dark:text-cream-100/50">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
