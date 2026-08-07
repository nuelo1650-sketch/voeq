import { type Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ComingSoonBadge } from '@/components/phase2/ComingSoonBadge';

export const metadata: Metadata = {
  title: 'Messages',
  robots: { index: false, follow: false },
};

export default function MessagesPage() {
  return (
    <Section spacing="md">
      <Container size="md">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100">
          Messages <ComingSoonBadge />
        </h1>
        <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">
          In-app messaging with vendors and buyers. Coming soon.
        </p>
      </Container>
    </Section>
  );
}
