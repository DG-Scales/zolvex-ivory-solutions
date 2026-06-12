import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  email?: string
}

const NewsletterSubscribeEmail = ({ email = '' }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{`New newsletter subscriber: ${email}`}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Newsletter Subscriber</Heading>
        <Text style={text}>
          A new visitor just subscribed to the Zolvex newsletter.
        </Text>
        <Text style={emailLine}>{email || '—'}</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewsletterSubscribeEmail,
  subject: () => `New Newsletter Subscriber – Zolvex`,
  displayName: 'Newsletter subscriber',
  to: 'notify@zolvex.org',
  previewData: { email: 'reader@example.com' },
} satisfies TemplateEntry

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  padding: '24px 0',
}
const container: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
  padding: '32px 28px',
  border: '1px solid #ececec',
  borderRadius: '12px',
}
const h1: React.CSSProperties = {
  fontSize: '22px',
  margin: '0 0 12px',
  color: '#111',
}
const text: React.CSSProperties = {
  color: '#444',
  fontSize: '15px',
  margin: '0 0 16px',
}
const emailLine: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 600,
  color: '#111',
  background: '#fafafa',
  padding: '12px 14px',
  borderRadius: '8px',
  margin: 0,
}
