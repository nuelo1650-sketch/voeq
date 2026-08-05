import { Html, Head, Body, Container, Heading, Text, Section, Hr, Link as EmailLink } from '@react-email/components';

interface WeeklyVendorDigestProps {
  businessName: string;
  views: number;
  clicks: number;
  reviews: number;
  dashboardUrl: string;
}

export function WeeklyVendorDigest({ businessName, views, clicks, reviews, dashboardUrl }: WeeklyVendorDigestProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#F7F5F0', fontFamily: '-apple-system, sans-serif' }}>
        <Container style={{ maxWidth: '480px', margin: '0 auto', padding: '32px 24px' }}>
          <Section>
            <Heading style={{ color: '#0F3D2E', fontSize: '24px', margin: '0 0 24px' }}>
              Weekly digest for {businessName}
            </Heading>
            <Text style={{ color: '#1A1A1A', fontSize: '16px', lineHeight: '24px', margin: '0 0 24px' }}>
              Here&apos;s what happened to your listings this week.
            </Text>
            <Section style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', margin: '0 0 24px' }}>
              <Text style={{ color: '#0F3D2E', fontSize: '16px', fontWeight: 600, margin: '0 0 12px' }}>This week</Text>
              <Text style={{ color: '#1A1A1A', fontSize: '14px', lineHeight: '22px', margin: 0 }}>
                {views} views<br />
                {clicks} WhatsApp clicks<br />
                {reviews} new reviews
              </Text>
            </Section>
            <Section style={{ textAlign: 'center', margin: '0 0 24px' }}>
              <EmailLink
                href={dashboardUrl}
                style={{ background: '#0F3D2E', color: '#F7F5F0', padding: '12px 24px', borderRadius: '999px', textDecoration: 'none', fontWeight: 600 }}
              >
                Open dashboard
              </EmailLink>
            </Section>
            <Hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #E5DECC' }} />
            <Text style={{ color: '#666', fontSize: '12px', lineHeight: '18px', margin: 0 }}>
              Want fewer emails? Change notification frequency in your settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WeeklyVendorDigest;
