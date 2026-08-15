import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';

export function PageSkeleton() {
  return (
    <Section spacing="md">
      <Container size="lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded-md bg-cream-200 dark:bg-forest-700" />
          <div className="h-4 w-1/2 rounded-md bg-cream-200 dark:bg-forest-700" />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-cream-200 dark:bg-forest-700" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
      <div className="aspect-square w-full bg-cream-200 dark:bg-forest-700" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 rounded bg-cream-200 dark:bg-forest-700" />
        <div className="h-3 w-1/2 rounded bg-cream-200 dark:bg-forest-700" />
        <div className="h-4 w-1/3 rounded bg-cream-200 dark:bg-forest-700" />
      </div>
    </div>
  );
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
