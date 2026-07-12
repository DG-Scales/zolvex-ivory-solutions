import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

// Server-side Meta Conversions API (CAPI) relay.
// Client posts { event_name, event_id, event_source_url, custom_data?, user_data? }.
// We enrich with client_ip_address + client_user_agent (required by CAPI),
// hash any provided email/phone (SHA-256), and forward to Meta.
//
// Deduplication with the browser Pixel relies on the SAME event_id being
// sent from both fbq('track', name, data, { eventID }) and this endpoint.

const PIXEL_ID = "2231805574125153";
const CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
} as const;

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function getClientIp(request: Request): string | undefined {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    undefined
  );
}

type IncomingEvent = {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  action_source?: string;
  custom_data?: Record<string, unknown>;
  user_data?: {
    em?: string; // plaintext email — hashed here
    ph?: string; // plaintext phone — hashed here
    fbp?: string; // _fbp cookie
    fbc?: string; // _fbc cookie
    external_id?: string;
  };
};

export const Route = createFileRoute("/api/public/meta-capi")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: CORS_HEADERS }),

      POST: async ({ request }) => {
        const token = process.env.META_CAPI_ACCESS_TOKEN;
        if (!token) {
          return new Response(
            JSON.stringify({ error: "META_CAPI_ACCESS_TOKEN not configured" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            },
          );
        }

        let body: IncomingEvent;
        try {
          body = (await request.json()) as IncomingEvent;
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }

        if (!body?.event_name || !body?.event_id) {
          return new Response(
            JSON.stringify({ error: "event_name and event_id are required" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            },
          );
        }

        const clientIp = getClientIp(request);
        const userAgent = request.headers.get("user-agent") ?? undefined;

        const user_data: Record<string, unknown> = {
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        };
        if (body.user_data?.em) user_data.em = [sha256(body.user_data.em)];
        if (body.user_data?.ph)
          user_data.ph = [sha256(body.user_data.ph.replace(/\D/g, ""))];
        if (body.user_data?.fbp) user_data.fbp = body.user_data.fbp;
        if (body.user_data?.fbc) user_data.fbc = body.user_data.fbc;
        if (body.user_data?.external_id)
          user_data.external_id = [sha256(body.user_data.external_id)];

        const payload = {
          data: [
            {
              event_name: body.event_name,
              event_time: Math.floor(Date.now() / 1000),
              event_id: body.event_id,
              event_source_url: body.event_source_url,
              action_source: body.action_source ?? "website",
              user_data,
              custom_data: body.custom_data ?? {},
            },
          ],
        };

        try {
          const res = await fetch(`${CAPI_URL}?access_token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const text = await res.text();
          if (!res.ok) {
            console.error("Meta CAPI error", res.status, text);
            return new Response(
              JSON.stringify({ error: "Meta CAPI request failed", status: res.status, body: text }),
              {
                status: 502,
                headers: { "Content-Type": "application/json", ...CORS_HEADERS },
              },
            );
          }
          return new Response(text, {
            status: 200,
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        } catch (err) {
          console.error("Meta CAPI fetch failed", err);
          return new Response(
            JSON.stringify({ error: "Meta CAPI fetch failed" }),
            {
              status: 502,
              headers: { "Content-Type": "application/json", ...CORS_HEADERS },
            },
          );
        }
      },
    },
  },
});
