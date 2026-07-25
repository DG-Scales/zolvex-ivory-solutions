import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";

// Server-side Meta Conversions API (CAPI) relay.
// Hardened against abuse:
// - Same-origin only (Origin/Referer must match an allow-list)
// - CORS restricted to allowed origins (no wildcard)
// - Strict allow-list of event names
// - Bounded request body size
// - Per-IP in-memory rate limiting
// - Shape validation on user_data / custom_data

const PIXEL_ID = "2231805574125153";
const CAPI_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

const ALLOWED_ORIGINS = new Set<string>([
  "https://zolvexlighting.com",
  "https://www.zolvexlighting.com",
  "https://zolvex.org",
  "https://www.zolvex.org",
  "https://zolvex-ivory-solutions.lovable.app",
]);

const ALLOWED_EVENT_NAMES = new Set([
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
]);

const MAX_BODY_BYTES = 8 * 1024; // 8KB is more than enough
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60; // 60 events / minute / IP

type Bucket = { count: number; resetAt: number };
const rateBuckets = new Map<string, Bucket>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = rateBuckets.get(ip);
  if (!b || now > b.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (b.count >= RATE_LIMIT_MAX) return false;
  b.count += 1;
  return true;
}

function isAllowedOrigin(request: Request): { ok: boolean; origin?: string } {
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.has(origin)) return { ok: true, origin };
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const u = new URL(referer);
      const o = `${u.protocol}//${u.host}`;
      if (ALLOWED_ORIGINS.has(o)) return { ok: true, origin: o };
    } catch {
      // ignore
    }
  }
  return { ok: false };
}

function corsHeaders(origin?: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "https://zolvexlighting.com",
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? "unknown";
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

type IncomingEvent = {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  action_source?: string;
  custom_data?: Record<string, unknown>;
  user_data?: {
    em?: string;
    ph?: string;
    fbp?: string;
    fbc?: string;
    external_id?: string;
  };
};

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function validate(body: unknown): { ok: true; value: IncomingEvent } | { ok: false; error: string } {
  if (!isPlainObject(body)) return { ok: false, error: "Body must be an object" };

  const event_name = body.event_name;
  const event_id = body.event_id;
  if (typeof event_name !== "string" || !ALLOWED_EVENT_NAMES.has(event_name)) {
    return { ok: false, error: "Invalid event_name" };
  }
  if (typeof event_id !== "string" || event_id.length < 8 || event_id.length > 128) {
    return { ok: false, error: "Invalid event_id" };
  }

  const event_source_url =
    typeof body.event_source_url === "string" && body.event_source_url.length <= 2048
      ? body.event_source_url
      : undefined;
  if (event_source_url) {
    try {
      const u = new URL(event_source_url);
      if (!ALLOWED_ORIGINS.has(`${u.protocol}//${u.host}`)) {
        return { ok: false, error: "event_source_url not allowed" };
      }
    } catch {
      return { ok: false, error: "Invalid event_source_url" };
    }
  }

  const action_source =
    typeof body.action_source === "string" && body.action_source.length <= 32
      ? body.action_source
      : undefined;

  let custom_data: Record<string, unknown> | undefined;
  if (body.custom_data !== undefined) {
    if (!isPlainObject(body.custom_data)) return { ok: false, error: "Invalid custom_data" };
    if (Object.keys(body.custom_data).length > 30) return { ok: false, error: "custom_data too large" };
    custom_data = body.custom_data;
  }

  let user_data: IncomingEvent["user_data"];
  if (body.user_data !== undefined) {
    if (!isPlainObject(body.user_data)) return { ok: false, error: "Invalid user_data" };
    const ud = body.user_data;
    const pickStr = (k: string): string | undefined => {
      const v = ud[k];
      return typeof v === "string" && v.length <= 512 ? v : undefined;
    };
    user_data = {
      em: pickStr("em"),
      ph: pickStr("ph"),
      fbp: pickStr("fbp"),
      fbc: pickStr("fbc"),
      external_id: pickStr("external_id"),
    };
  }

  return {
    ok: true,
    value: { event_name, event_id, event_source_url, action_source, custom_data, user_data },
  };
}

export const Route = createFileRoute("/api/public/meta-capi")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { ok, origin } = isAllowedOrigin(request);
        if (!ok) return new Response(null, { status: 403 });
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      },

      POST: async ({ request }) => {
        const { ok: originOk, origin } = isAllowedOrigin(request);
        if (!originOk) {
          return new Response(JSON.stringify({ error: "Forbidden origin" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
          });
        }

        const headers = { "Content-Type": "application/json", ...corsHeaders(origin) };

        const ip = getClientIp(request);
        if (!rateLimit(ip)) {
          return new Response(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers,
          });
        }

        const token = process.env.META_CAPI_ACCESS_TOKEN;
        if (!token) {
          return new Response(
            JSON.stringify({ error: "META_CAPI_ACCESS_TOKEN not configured" }),
            { status: 500, headers },
          );
        }

        const raw = await request.text();
        if (raw.length > MAX_BODY_BYTES) {
          return new Response(JSON.stringify({ error: "Payload too large" }), {
            status: 413,
            headers,
          });
        }

        let parsed: unknown;
        try {
          parsed = JSON.parse(raw);
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers });
        }

        const validated = validate(parsed);
        if (!validated.ok) {
          return new Response(JSON.stringify({ error: validated.error }), {
            status: 400,
            headers,
          });
        }
        const body = validated.value;

        const clientIp = ip !== "unknown" ? ip : undefined;
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
              JSON.stringify({ error: "Meta CAPI request failed", status: res.status }),
              { status: 502, headers },
            );
          }
          return new Response(text, { status: 200, headers });
        } catch (err) {
          console.error("Meta CAPI fetch failed", err);
          return new Response(JSON.stringify({ error: "Meta CAPI fetch failed" }), {
            status: 502,
            headers,
          });
        }
      },
    },
  },
});
