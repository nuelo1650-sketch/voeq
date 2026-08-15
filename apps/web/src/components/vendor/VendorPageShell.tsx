import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { ThreadSeam } from '@/components/brand/Thread';
import type { ReactNode } from 'react';

export function VendorPageHeader({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <Section spacing="lg" className="border-b border-cream-200 bg-cream-50/70 dark:border-forest-700 dark:bg-forest-800 dark:bg-forest-800/70 dark:border-cream-100">
      <Container size="xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">{title}</h1>
            {subtitle ? <p className="text-sm text-forest-700/70 dark:text-cream-100/70">{subtitle}</p> : null}
          </div>
          {children ? <div className="flex items-center gap-2">{children}</div> : null}
        </div>
      </Container>
    </Section>
  );
}

/** Neutral page header for non-vendor pages (e.g. shopper profile). Same shell, no "vendor" framing. */
export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <Section spacing="lg" className="border-b border-cream-200 bg-cream-50/70 dark:border-forest-700 dark:bg-forest-800 dark:bg-forest-800/70 dark:border-cream-100">
      <Container size="xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">{title}</h1>
            {subtitle ? <p className="text-sm text-forest-700/70 dark:text-cream-100/70">{subtitle}</p> : null}
            <ThreadSeam />
          </div>
          {children ? <div className="flex items-center gap-2">{children}</div> : null}
        </div>
      </Container>
    </Section>
  );
}

export function VendorSection({ title, subtitle, children, className }: { title?: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <Section spacing="md" className={className}>
      {title ? (
        <Container size="xl">
          <div className="mb-4">
            <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{subtitle}</p> : null}
            <ThreadSeam className="mt-3" />
          </div>
        </Container>
      ) : null}
      {children}
    </Section>
  );
}

export function VendorEmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <Section spacing="lg">
      <Container size="md">
        <div className="py-16 text-center">
          <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{title}</h2>
          {description && <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">{description}</p>}
          {action && <div className="mt-6">{action}</div>}
        </div>
      </Container>
    </Section>
  );
}
