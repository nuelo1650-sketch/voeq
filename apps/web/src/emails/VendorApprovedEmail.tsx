import { Html, Head, Body, Container, Heading, Text, Section, Hr, Link as EmailLink } from '@react-email/components';

interface VendorApprovedEmailProps {
  businessName: string;
  vendorUrl: string;
}

export function VendorApprovedEmail({ businessName, vendorUrl }: VendorApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F7F5F0', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 24px' }}>
          <Section>
            <Heading style={{ color: '#0F3D2E', fontSize: '24px', margin: '0 0 24px' }}>
              Your vendor profile is live
            </Heading>
            <Text style={{ color: '#1A1A1A', fontSize: '16px', lineHeight: '24px', margin: '0 0 24px' }}>
              <strong>{businessName}</strong> is now visible on Voeq. Start adding listings, uploading photos, and connecting with customers.
            </Text>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <EmailLink
                href={vendorUrl}
                style={{ background: '#0F3D2E', color: '#F7F5F0', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600 }}
              >
                Open vendor dashboard
              </EmailLink>
            </Section>
            <Text style={{ color: '#666', fontSize: '14px', lineHeight: '20px', margin: '0 0 8px' }}>
              Tip: complete your profile and add at least 3 listings to improve visibility.
            </Text>
            <Hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E5DECC' }} />
            <Text style={{ color: '#666', fontSize: '12px', lineHeight: '18px', margin: 0 }}>
              Questions? Reply to this email or contact support.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default VendorApprovedEmail;
