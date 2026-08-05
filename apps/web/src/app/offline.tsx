import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export default function Offline() {
  return (
    <Section spacing="xl" className="min-h-[60vh] flex items-center">
      <Container size="md">
        <div className="text-center">
          <h1 className="font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100">
            No internet connection
          </h1>
          <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">
            Check your connection and try again. Some features may be unavailable offline.
          </p>
          <div className="mt-8">
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
