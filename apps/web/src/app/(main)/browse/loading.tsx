import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ListingGridSkeleton } from '@/components/ui/PageSkeleton';

export default function Loading() {
  return (
    <Section spacing="md">
      <Container size="xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/4 rounded-md bg-cream-200 dark:bg-forest-700" />
          <div className="h-12 w-full rounded-md bg-cream-200 dark:bg-forest-700" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-20 rounded-full bg-cream-200 dark:bg-forest-700" />
            ))}
          </div>
          <ListingGridSkeleton count={12} />
        </div>
      </Container>
    </Section>
  );
}
