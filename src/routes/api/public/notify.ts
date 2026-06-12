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
        const { enqueueTemplateEmail } = await import(
          '@/lib/email/enqueue.server'
        )

        if (kind === 'contact') {
          const parsed = contactSchema.safeParse(body)
          if (!parsed.success) {
            return Response.json({ error: 'Invalid input' }, { status: 400 })
          }
          const result = await enqueueTemplateEmail({
            templateName: 'contact-form',
            templateData: parsed.data,
            idempotencyKey: `contact-${parsed.data.email}-${Date.now()}`,
          })
          return Response.json(result.body, { status: result.status })
        }

        if (kind === 'subscribe') {
          const parsed = subscribeSchema.safeParse(body)
          if (!parsed.success) {
            return Response.json({ error: 'Invalid email' }, { status: 400 })
          }
          const result = await enqueueTemplateEmail({
            templateName: 'newsletter-subscribe',
            templateData: parsed.data,
            idempotencyKey: `subscribe-${parsed.data.email}`,
          })
          return Response.json(result.body, { status: result.status })
        }

        return Response.json({ error: 'Unknown kind' }, { status: 400 })
      },
    },
  },
})
