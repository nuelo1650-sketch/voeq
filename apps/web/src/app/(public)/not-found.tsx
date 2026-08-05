import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Error404 } from '@/components/illustrations';

export default function NotFound() {
  return (
    <Section spacing="xl" className="min-h-[60vh] flex items-center">
      <Container size="md">
        <div className="text-center">
          <Error404 className="mx-auto h-48 w-48 text-forest-700 dark:text-cream-100" />
          <h1 className="mt-8 font-serif text-5xl font-semibold text-forest-900 dark:text-cream-100">Page not found</h1>
          <p className="mt-4 text-lg text-forest-700/70 dark:text-cream-100/70">Looks like this page got lost on campus.</p>
          <div className="mt-8">
            <Button variant="primary" size="lg" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
