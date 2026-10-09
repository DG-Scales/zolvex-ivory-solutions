import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

const CANONICAL_HOST = "www.zolvexlighting.com";
const REDIRECT_HOSTS = new Set(["zolvexlighting.com", "zolvex.org", "www.zolvex.org"]);

function canonicalRedirect(request: Request): Response | null {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  const isAlias = REDIRECT_HOSTS.has(host);
  // Shopify's "External Redirect" theme (and the Google product feed) use the standard /products/<handle>
  // path; this storefront serves products at /product/<handle>. Redirect the alias so those URLs resolve.
  const aliasPath = url.pathname.match(/^\/products\/([^/]+)\/?$/);
  if (!isAlias && !(host === CANONICAL_HOST && aliasPath)) return null;
  if (aliasPath) url.pathname = "/product/" + aliasPath[1];
  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";
  return new Response(null, { status: 301, headers: { Location: url.toString(), "Cache-Control": "public, max-age=3600" } });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const redirect = canonicalRedirect(request);
    if (redirect) return redirect;
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
