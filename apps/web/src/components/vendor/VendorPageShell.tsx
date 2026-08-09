import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

export function VendorPageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <Section spacing="lg" className="border-b border-cream-200 bg-cream-50 dark:border-forest-700 dark:bg-forest-800">
      <Container size="lg">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{subtitle}</p>}
          </div>
          {children}
        </div>
      </Container>
    </Section>
  );
}

export function VendorSection({ title, description, children, className = '' }: { title?: string; description?: string; children: React.ReactNode; className?: string }) {
  return (
    <Section spacing="lg" className={className}>
      <Container size="lg">
        {(title || description) && (
          <div className="mb-6">
            {title && <h2 className="font-serif text-2xl font-semibold text-forest-900 dark:text-cream-100">{title}</h2>}
            {description && <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{description}</p>}
          </div>
        )}
        {children}
      </Container>
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
