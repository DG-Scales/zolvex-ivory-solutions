import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

const contactSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  subject: z.string().trim().max(300).optional().default(''),
  message: z.string().trim().min(1).max(5000),
})

const subscribeSchema = z.object({
  email: z.string().trim().email().max(320),
})

const FROM = 'Zolvex <notify@zolvex.org>'
const TO = 'zolvex.business@gmail.com'
const RESEND_AUDIENCE_ID = '3a752339-55ff-4d8d-b810-ce1e9a5692f3'

async function resendContactExists(email: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return false
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    )
    return res.status === 200
  } catch (err) {
    console.error('Resend check contact error', err)
    return false
  }
}

async function addResendContact(email: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return
  try {
    const alreadyExists = await resendContactExists(email)
    if (alreadyExists) {
      console.log('Resend contact already exists, skipping:', email)
      return
    }
    const res = await fetch(
      `https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    )
    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('Resend add contact failed', res.status, errText)
    }
  } catch (err) {
    console.error('Resend add contact error', err)
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendResend(args: {
  subject: string
  html: string
  text: string
  replyTo?: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { ok: false, status: 500, body: { error: 'Email not configured' } }
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: args.subject,
      html: args.html,
      text: args.text,
      reply_to: args.replyTo,
    }),
  })
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    console.error('Resend send failed', res.status, errText)
    return { ok: false, status: 502, body: { error: 'Failed to send email' } }
  }
  return { ok: true, status: 200, body: { success: true } }
}

export const Route = createFileRoute('/api/public/notify')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: any
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }

        const kind = body?.kind

        if (kind === 'contact') {
          const parsed = contactSchema.safeParse(body)
          if (!parsed.success) {
            return Response.json({ error: 'Invalid input' }, { status: 400 })
          }
          const { name, email, subject, message } = parsed.data
          const html = `
            <h2>New Contact Form Submission – Zolvex</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject || '(none)')}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          `
          const text = `New Contact Form Submission – Zolvex\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || '(none)'}\n\nMessage:\n${message}`
          const result = await sendResend({
            subject: 'New Contact Form Submission – Zolvex',
            html,
            text,
            replyTo: email,
          })
          return Response.json(result.body, { status: result.status })
        }

        if (kind === 'subscribe') {
          const parsed = subscribeSchema.safeParse(body)
          if (!parsed.success) {
            return Response.json({ error: 'Invalid email' }, { status: 400 })
          }
          const { email } = parsed.data
          const html = `
            <h2>New Newsletter Subscriber – Zolvex</h2>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          `
          const text = `New Newsletter Subscriber – Zolvex\n\nEmail: ${email}`
          const result = await sendResend({
            subject: 'New Newsletter Subscriber – Zolvex',
            html,
            text,
            replyTo: email,
          })
          await addResendContact(email)
          return Response.json(result.body, { status: result.status })
        }

        return Response.json({ error: 'Unknown kind' }, { status: 400 })
      },
    },
  },
})
