// Lightweight analytics for the Lovable storefront.
// - GA4 page_view on every SPA route change
// - Persistent Shopify visitor/session cookies on zolvex.org, forwarded to
//   Shopify checkout via query params so checkout sessions are attributed
//   to the same visitor that browsed the storefront.

const SHOPIFY_Y_COOKIE = "_shopify_y"; // unique visitor (long-lived)
const SHOPIFY_S_COOKIE = "_shopify_s"; // session (30-min sliding)
const ONE_YEAR_DAYS = 365;
const SESSION_MINUTES = 30;

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function uuid(): string {
  if (isBrowser() && "crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, opts: { days?: number; minutes?: number }) {
  if (!isBrowser()) return;
  const date = new Date();
  if (opts.days) date.setTime(date.getTime() + opts.days * 24 * 60 * 60 * 1000);
  if (opts.minutes) date.setTime(date.getTime() + opts.minutes * 60 * 1000);
  const host = window.location.hostname;
  // Scope to the eTLD+1 when possible so subdomains share the cookie.
  const parts = host.split(".");
  const domain = parts.length >= 2 ? "." + parts.slice(-2).join(".") : host;
  document.cookie =
    name +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    date.toUTCString() +
    "; path=/; domain=" +
    domain +
    "; SameSite=Lax";
}

export function ensureShopifyVisitor(): string {
  let y = readCookie(SHOPIFY_Y_COOKIE);
  if (!y) {
    y = uuid();
    writeCookie(SHOPIFY_Y_COOKIE, y, { days: ONE_YEAR_DAYS });
  }
  return y;
}

export function ensureShopifySession(): string {
  let s = readCookie(SHOPIFY_S_COOKIE);
  if (!s) s = uuid();
  // Refresh the sliding window every call.
  writeCookie(SHOPIFY_S_COOKIE, s, { minutes: SESSION_MINUTES });
  return s;
}

export function getShopifyTrackingParams(): Record<string, string> {
  if (!isBrowser()) return {};
  return {
    _y: ensureShopifyVisitor(),
    _s: ensureShopifySession(),
  };
}

/**
 * Append visitor / session identifiers to a Shopify checkout URL so the
 * checkout session is attributed to the same visitor that browsed the
 * Lovable-hosted storefront.
 */
export function appendShopifyTrackingToCheckoutUrl(url: string): string {
  if (!isBrowser() || !url) return url;
  try {
    const u = new URL(url);
    const params = getShopifyTrackingParams();
    for (const [k, v] of Object.entries(params)) {
      if (!u.searchParams.has(k)) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return url;
  }
}

type GtagFn = (...args: unknown[]) => void;
function gtag(): GtagFn | null {
  if (!isBrowser()) return null;
  const w = window as unknown as { gtag?: GtagFn };
  return typeof w.gtag === "function" ? w.gtag : null;
}

type FbqFn = (...args: unknown[]) => void;
function fbq(): FbqFn | null {
  if (!isBrowser()) return null;
  const w = window as unknown as { fbq?: FbqFn };
  return typeof w.fbq === "function" ? w.fbq : null;
}


const GA4_ID = "G-NJD4V4K981";

export function trackPageView(path: string, title?: string) {
  if (!isBrowser()) return;
  // Refresh the Shopify session window on every navigation.
  ensureShopifyVisitor();
  ensureShopifySession();
  const g = gtag();
  if (g) {
    g("event", "page_view", {
      page_path: path,
      page_location: window.location.origin + path,
      page_title: title ?? document.title,
      send_to: GA4_ID,
    });
  }
  const f = fbq();
  if (f) f("track", "PageView");
}

export function trackProductView(args: {
  id: string;
  title: string;
  price: number;
  currency: string;
}) {
  const g = gtag();
  if (g) {
    g("event", "view_item", {
      currency: args.currency,
      value: args.price,
      items: [{ item_id: args.id, item_name: args.title, price: args.price, quantity: 1 }],
    });
  }
  const f = fbq();
  if (f) {
    f("track", "ViewContent", {
      content_ids: [args.id],
      content_name: args.title,
      content_type: "product",
      value: args.price,
      currency: args.currency,
    });
  }
}

export function trackAddToCart(args: {
  id: string;
  title: string;
  price: number;
  currency: string;
  quantity: number;
}) {
  const g = gtag();
  if (g) {
    g("event", "add_to_cart", {
      currency: args.currency,
      value: args.price * args.quantity,
      items: [
        { item_id: args.id, item_name: args.title, price: args.price, quantity: args.quantity },
      ],
    });
  }
  const f = fbq();
  if (f) {
    f("track", "AddToCart", {
      content_ids: [args.id],
      content_name: args.title,
      content_type: "product",
      value: args.price * args.quantity,
      currency: args.currency,
    });
  }
}


export function trackBeginCheckout(args: { value: number; currency: string; itemCount: number }) {
  const g = gtag();
  if (!g) return;
  g("event", "begin_checkout", {
    currency: args.currency,
    value: args.value,
    num_items: args.itemCount,
  });
}
