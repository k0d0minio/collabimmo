import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from '@react-email/components';

interface EmailTemplateProps {
  firstname: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  vatNumber?: string;
  propertyType?: string;
  message: string;
}

export function EmailTemplate({
  firstname,
  name,
  email,
  phone,
  company,
  vatNumber,
  propertyType,
  message,
}: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Nouveau message de contact</Heading>
          </Section>

          <Section style={content}>
            <Heading style={h2}>Informations du contact</Heading>
            
            <Text style={field}>
              <strong style={label}>Prénom:</strong> {firstname}
            </Text>
            <Text style={field}>
              <strong style={label}>Nom:</strong> {name}
            </Text>
            <Text style={field}>
              <strong style={label}>Email:</strong>{' '}
              <a href={`mailto:${email}`} style={link}>
                {email}
              </a>
            </Text>
            {phone && (
              <Text style={field}>
                <strong style={label}>Téléphone:</strong>{' '}
                <a href={`tel:${phone}`} style={link}>
                  {phone}
                </a>
              </Text>
            )}
            {company && (
              <Text style={field}>
                <strong style={label}>Entreprise:</strong> {company}
              </Text>
            )}
            {vatNumber && (
              <Text style={field}>
                <strong style={label}>Numéro TVA:</strong> {vatNumber}
              </Text>
            )}
            {propertyType && (
              <Text style={field}>
                <strong style={label}>Type de projet:</strong> {propertyType}
              </Text>
            )}
          </Section>

          <Hr style={divider} />

          <Section style={content}>
            <Heading style={h2}>Message</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Ce message a été envoyé depuis le formulaire de contact de Collabimmo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Email styles - inline for maximum compatibility
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  backgroundColor: '#1a1a1a',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0',
  textAlign: 'center' as const,
};

const content = {
  padding: '24px',
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 16px 0',
};

const field = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 12px 0',
};

const label = {
  color: '#666666',
  fontWeight: '600',
  marginRight: '8px',
};

const link = {
  color: '#0066cc',
  textDecoration: 'none',
};

const divider = {
  borderColor: '#e6ebf1',
  margin: '24px 0',
};

const messageText = {
  color: '#333333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const footer = {
  padding: '24px',
  paddingTop: '0',
};

const footerText = {
  color: '#999999',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '0',
  textAlign: 'center' as const,
};