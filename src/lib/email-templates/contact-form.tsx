import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const ContactFormEmail = ({
  name = '',
  email = '',
  subject = '',
  message = '',
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New contact form message${name ? ` from ${name}` : ''}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Contact Form Message</Heading>
        <Text style={muted}>Someone reached out through zolvex.org.</Text>

        <Section style={card}>
          <Text style={label}>From</Text>
          <Text style={value}>{name || '—'}</Text>

          <Text style={label}>Email</Text>
          <Text style={value}>{email || '—'}</Text>

          {subject ? (
            <>
              <Text style={label}>Subject</Text>
              <Text style={value}>{subject}</Text>
            </>
          ) : null}
        </Section>

        <Hr style={hr} />
        <Text style={label}>Message</Text>
        <Text style={messageBox}>{message || '—'}</Text>

        <Hr style={hr} />
        <Text style={footer}>Sent from the Zolvex contact form.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactFormEmail,
  subject: () => `New Contact Form Submission – Zolvex`,
  displayName: 'Contact form message',
  to: 'notify@zolvex.org',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    subject: 'Question about a custom chandelier',
    message: 'Hi! I love your work and would like a custom piece for my studio.',
  },
} satisfies TemplateEntry

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  padding: '24px 0',
}
const container: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '32px 28px',
  border: '1px solid #ececec',
  borderRadius: '12px',
}
const h1: React.CSSProperties = {
  fontSize: '22px',
  margin: '0 0 8px',
  color: '#111',
}
const muted: React.CSSProperties = {
  color: '#666',
  fontSize: '14px',
  margin: '0 0 20px',
}
const card: React.CSSProperties = {
  background: '#fafafa',
  borderRadius: '8px',
  padding: '16px 18px',
  margin: '8px 0 16px',
}
const label: React.CSSProperties = {
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#888',
  margin: '8px 0 2px',
}
const value: React.CSSProperties = {
  fontSize: '15px',
  color: '#111',
  margin: '0 0 6px',
}
const messageBox: React.CSSProperties = {
  fontSize: '15px',
  color: '#111',
  whiteSpace: 'pre-wrap',
  lineHeight: '1.55',
  margin: '4px 0 16px',
}
const hr: React.CSSProperties = {
  borderColor: '#ececec',
  margin: '16px 0',
}
const footer: React.CSSProperties = {
  fontSize: '12px',
  color: '#888',
  margin: 0,
}
