import { Html, Head, Body, Container, Heading, Text, Section, Hr, Link as EmailLink } from '@react-email/components';

interface MagicLinkEmailProps {
  email: string;
  url: string;
}

export function MagicLinkEmail({ email, url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F7F5F0', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 24px' }}>
          <Section>
            <Heading style={{ color: '#0F3D2E', fontSize: '24px', margin: '0 0 24px' }}>
              Sign in to Voeq
            </Heading>
            <Text style={{ color: '#1A1A1A', fontSize: '16px', lineHeight: '24px', margin: '0 0 24px' }}>
              Click the button below to sign in to <strong>{email}</strong>. This link expires in 15 minutes.
            </Text>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <EmailLink
                href={url}
                style={{ background: '#0F3D2E', color: '#F7F5F0', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600 }}
              >
                Sign in
              </EmailLink>
            </Section>
            <Text style={{ color: '#666', fontSize: '14px', lineHeight: '20px', margin: '0 0 8px' }}>
              If the button doesn&apos;t work, copy and paste this URL into your browser:
            </Text>
            <Text style={{ color: '#0F3D2E', fontSize: '14px', wordBreak: 'break-all', margin: 0 }}>
              {url}
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

export default MagicLinkEmail;
