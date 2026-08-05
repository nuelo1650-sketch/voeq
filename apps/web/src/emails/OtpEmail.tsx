import { Html, Head, Body, Container, Heading, Text, Section, Hr } from '@react-email/components';

interface OtpEmailProps {
  otp: string;
  email: string;
}

export function OtpEmail({ otp, email }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F7F5F0', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 24px' }}>
          <Section>
            <Heading style={{ color: '#0F3D2E', fontSize: '24px', margin: '0 0 24px' }}>
              Your verification code
            </Heading>
            <Text style={{ color: '#1A1A1A', fontSize: '16px', lineHeight: '24px', margin: '0 0 24px' }}>
              Enter this code to verify <strong>{email}</strong> and continue setting up your Voeq account:
            </Text>
            <Section style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', textAlign: 'center', margin: '0 0 24px' }}>
              <Text style={{ color: '#0F3D2E', fontSize: '32px', fontWeight: 600, letterSpacing: '8px', margin: 0, fontFamily: 'monospace' }}>
                {otp}
              </Text>
            </Section>
            <Text style={{ color: '#666', fontSize: '14px', lineHeight: '20px', margin: '0 0 8px' }}>
              This code expires in 10 minutes.
            </Text>
            <Hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E5DECC' }} />
            <Text style={{ color: '#666', fontSize: '12px', lineHeight: '18px', margin: 0 }}>
              If you didn&apos;t request this, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OtpEmail;
