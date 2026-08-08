import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingGridSkeleton } from '@/components/ui/PageSkeleton';

export default function Loading() {
  return (
    <Section spacing="md">
      <Container size="xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded-md bg-cream-200 dark:bg-forest-700" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-cream-200 dark:bg-forest-700" />
            ))}
          </div>
          <ListingGridSkeleton count={8} />
        </div>
      </Container>
    </Section>
  );
}
