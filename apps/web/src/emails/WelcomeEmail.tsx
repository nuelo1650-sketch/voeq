import { Html, Head, Body, Container, Heading, Text, Section, Hr } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F7F5F0', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 24px' }}>
          <Section>
            <Heading style={{ color: '#0F3D2E', fontSize: '24px', margin: '0 0 24px' }}>
              Welcome to Voeq
            </Heading>
            <Text style={{ color: '#1A1A1A', fontSize: '16px', lineHeight: '24px', margin: '0 0 24px' }}>
              Hey{name ? ` ${name}` : ''}, your account is ready. Browse verified vendors, read reviews, and connect with trusted services on campus.
            </Text>
            <Text style={{ color: '#0F3D2E', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
              What to do next
            </Text>
            <Text style={{ color: '#1A1A1A', fontSize: '16px', lineHeight: '24px', margin: '0 0 24px' }}>
              1. Select your campus.<br />
              2. Browse vendors in your area.<br />
              3. Leave reviews and earn trust points.
            </Text>
            <Hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E5DECC' }} />
            <Text style={{ color: '#666', fontSize: '12px', lineHeight: '18px', margin: 0 }}>
              Need help? Reply to this email and we&apos;ll help you get started.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomeEmail;
