import { Html, Head, Body, Container, Heading, Text, Section, Hr, Link as EmailLink } from '@react-email/components';

interface ReviewNotificationEmailProps {
  vendorName: string;
  rating: number;
  reviewUrl: string;
}

export function ReviewNotificationEmail({ vendorName, rating, reviewUrl }: ReviewNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F7F5F0', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 24px' }}>
          <Section>
            <Heading style={{ color: '#0F3D2E', fontSize: '24px', margin: '0 0 24px' }}>
              New review for {vendorName}
            </Heading>
            <Text style={{ color: '#1A1A1A', fontSize: '16px', lineHeight: '24px', margin: '0 0 24px' }}>
              A customer left a {rating}-star review. Respond publicly to show you care about customer experience.
            </Text>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <EmailLink
                href={reviewUrl}
                style={{ background: '#0F3D2E', color: '#F7F5F0', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600 }}
              >
                View review
              </EmailLink>
            </Section>
            <Hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E5DECC' }} />
            <Text style={{ color: '#666', fontSize: '12px', lineHeight: '18px', margin: 0 }}>
              You can manage notification preferences in your vendor settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default ReviewNotificationEmail;
