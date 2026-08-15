import { type Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Careers',
  robots: { index: true, follow: true },
};

export default function CareersPage() {
  const openings = [
    { title: 'Frontend Engineer', location: 'Remote · Nigeria', type: 'Full-time' },
    { title: 'Backend Engineer', location: 'Remote · Nigeria', type: 'Full-time' },
    { title: 'University Ambassador', location: 'NMU / UNILAG / UI', type: 'Part-time' },
  ];

  return (
    <Section spacing="lg">
      <Container size="md">
        <h1 className="font-serif text-3xl font-semibold text-forest-900 dark:text-cream-100 sm:text-4xl">Careers at Voeq</h1>
        <p className="mt-3 text-base text-forest-700/80 dark:text-cream-100/80">We’re building the campus marketplace for Nigerian students. Join us.</p>

        <div className="mt-10 space-y-4">
          {openings.map((job) => (
            <div key={job.title} className="rounded-2xl border border-cream-300 bg-cream-50 p-6 dark:border-forest-700 dark:bg-forest-800 dark:border-cream-100">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">{job.title}</h2>
                  <p className="mt-1 text-sm text-forest-700/70 dark:text-cream-100/70">{job.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-cream-300 px-3 py-1 text-xs font-medium text-forest-700 dark:border-forest-700 dark:text-cream-100 dark:border-cream-100">{job.type}</span>
                  <Button variant="primary" size="sm" asChild>
                    <a href={`mailto:careers@voeq.ng?subject=Application:%20${encodeURIComponent(job.title)}`}>Apply</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-forest-900 dark:text-cream-100">Don’t see a fit?</h2>
          <p className="mt-2 text-sm text-forest-700/70 dark:text-cream-100/70">We’re always looking for talented people. Send your CV to careers@voeq.ng.</p>
        </div>
      </Container>
    </Section>
  );
}
