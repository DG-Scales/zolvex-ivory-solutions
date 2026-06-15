import * as React from 'react'
import { render } from '@react-email/components'
import { createClient } from '@supabase/supabase-js'
import { TEMPLATES, type TemplateEntry } from '@/lib/email-templates/registry'

const SITE_NAME = 'Zolvex'
const SENDER_DOMAIN = 'notify.zolvex.org'
const FROM_DOMAIN = 'zolvex.org'

function redactEmail(email: string | null | undefined): string {
  if (!email) return '***'
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return '***'
  return `${localPart[0]}***@${domain}`
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export interface EnqueueArgs {
  templateName: string
  recipientEmail?: string
  templateData?: Record<string, any>
  idempotencyKey?: string
}

export interface EnqueueResult {
  ok: boolean
  status: number
  body: Record<string, any>
}

/**
 * Server-only helper that enqueues a transactional email for sending.
 * Skips the user-auth check that /lovable/email/transactional/send enforces,
 * so it MUST only be called from server routes that have already validated
 * the input and verified the caller is authorized (e.g. a CSRF-safe public
 * form action).
 */
export async function enqueueTemplateEmail(
  args: EnqueueArgs,
): Promise<EnqueueResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      ok: false,
      status: 500,
      body: { error: 'Server configuration error' },
    }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const template: TemplateEntry | undefined = TEMPLATES[args.templateName]
  if (!template) {
    return {
      ok: false,
      status: 404,
      body: { error: `Unknown template '${args.templateName}'` },
    }
  }

  const effectiveRecipient = template.to || args.recipientEmail
  if (!effectiveRecipient) {
    return {
      ok: false,
      status: 400,
      body: { error: 'recipientEmail required' },
    }
  }

  const messageId = crypto.randomUUID()
  const idempotencyKey = args.idempotencyKey || messageId
  const templateData = args.templateData ?? {}

  // Suppression check
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', effectiveRecipient.toLowerCase())
    .maybeSingle()

  if (suppressed) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: args.templateName,
      recipient_email: effectiveRecipient,
      status: 'suppressed',
    })
    return { ok: false, status: 200, body: { success: false, reason: 'email_suppressed' } }
  }

  // Unsubscribe token
  const normalizedEmail = effectiveRecipient.toLowerCase()
  let unsubscribeToken: string
  const { data: existingToken } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token
  } else if (!existingToken) {
    unsubscribeToken = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert(
        { token: unsubscribeToken, email: normalizedEmail },
        { onConflict: 'email', ignoreDuplicates: true },
      )
    const { data: stored } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalizedEmail)
      .maybeSingle()
    if (stored) unsubscribeToken = stored.token
  } else {
    return { ok: false, status: 200, body: { success: false, reason: 'email_suppressed' } }
  }

  // Render
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const plainText = await render(element, { plainText: true })
  const resolvedSubject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: args.templateName,
    recipient_email: effectiveRecipient,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: effectiveRecipient,
      from: `Zolvex <notify@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      sender_domain: SENDER_DOMAIN,
      subject: resolvedSubject,
      html,
      text: plainText,
      purpose: 'transactional',
      label: args.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: args.templateName,
      recipient_email: effectiveRecipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    console.error('enqueueTemplateEmail failed', {
      error: enqueueError,
      template: args.templateName,
      recipient_redacted: redactEmail(effectiveRecipient),
    })
    return { ok: false, status: 500, body: { error: 'Failed to enqueue email' } }
  }

  return { ok: true, status: 200, body: { success: true, queued: true } }
}
