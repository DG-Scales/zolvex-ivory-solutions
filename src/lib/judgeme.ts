/**
 * Judge.me public widget API (Free plan, public token only).
 * The PUBLIC token is safe in the browser. The private token must never be used here.
 * Judge.me stays the single source of truth: nothing is stored, seeded or invented locally.
 */
export const JUDGEME_SHOP_DOMAIN = "zolvex-solutions-hub-pnf34.myshopify.com";
export const JUDGEME_PUBLIC_TOKEN = "UbQYSwQLVFG931zlQAdfRPM0IK4";

const WIDGET_API = "https://judge.me/api/v1/widgets";

/** Reviews Judge.me returns per widget page. Further pages need Judge.me's own JS, so we only show the first. */
export const JUDGEME_PAGE_SIZE = 5;

export type JudgeMeSummary = { average: number; count: number };

export function shopifyNumericId(gid: string): string {
  const parts = gid.split("/");
  return parts[parts.length - 1] || "";
}

async function fetchWidget(kind: "preview_badge" | "product_review", externalId: string): Promise<string | null> {
  const params = new URLSearchParams({
    api_token: JUDGEME_PUBLIC_TOKEN,
    shop_domain: JUDGEME_SHOP_DOMAIN,
    external_id: externalId,
  });
  const res = await fetch(`${WIDGET_API}/${kind}?${params.toString()}`);
  if (!res.ok) return null;
  const json = (await res.json()) as { badge?: string; widget?: string };
  return (kind === "preview_badge" ? json.badge : json.widget) ?? null;
}

/** Real average rating and review count from Judge.me, or null if unavailable. */
export async function fetchJudgeMeSummary(externalId: string): Promise<JudgeMeSummary | null> {
  const html = await fetchWidget("preview_badge", externalId);
  if (!html) return null;
  const average = Number(html.match(/data-average-rating=['"]([\d.]+)['"]/)?.[1]);
  const count = Number(html.match(/data-number-of-reviews=['"](\d+)['"]/)?.[1]);
  if (!Number.isFinite(average) || !Number.isFinite(count)) return null;
  return { average, count };
}

/**
 * Judge.me returns sanitized, ready-to-render HTML. We still strip anything active or interactive:
 * scripts, styles (incl. Judge.me's temporary "hide until JS runs" rule), forms, the write-review link,
 * the sort control and pagination (those need Judge.me's own JS), and inline event handlers.
 */
export function sanitizeJudgeMeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc
    .querySelectorAll(
      "script, style, iframe, object, embed, form, .jdgm-write-rev-link, .jdgm-rev-widg__sort-wrapper, .jdgm-paginate, .jdgm-histogram__clear-filter",
    )
    .forEach((n) => n.remove());
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith("on") || ((name === "href" || name === "src") && /^\s*javascript:/i.test(attr.value))) {
        el.removeAttribute(attr.name);
      }
    }
  });
  doc.querySelectorAll("a[href]").forEach((a) => {
    a.setAttribute("rel", "noopener noreferrer nofollow");
    a.setAttribute("target", "_blank");
  });
  return doc.body.innerHTML;
}

export async function fetchJudgeMeReviewsHtml(externalId: string): Promise<string | null> {
  const html = await fetchWidget("product_review", externalId);
  return html ? sanitizeJudgeMeHtml(html) : null;
}
