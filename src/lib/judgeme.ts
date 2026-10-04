/**
 * Judge.me review data for the headless storefront (Free plan).
 *
 * Reads come from Judge.me's public `reviews_for_widget` endpoint, the same one Judge.me's own widget
 * pages through. It needs no token and is CORS-open. No private token is ever used here, and nothing is
 * stored, seeded or invented locally: Judge.me is the single source of truth.
 */
export const JUDGEME_SHOP_DOMAIN = "zolvex-solutions-hub-pnf34.myshopify.com";

const REVIEWS_ENDPOINT = "https://api.judge.me/reviews/reviews_for_widget";

/** Reviews fetched per page. Judge.me caps this at 30. */
export const JUDGEME_PAGE_SIZE = 10;

export type JudgeMeHistogramRow = { rating: number; frequency: number; percentage: number };
export type JudgeMeSummary = { average: number; count: number; histogram: JudgeMeHistogramRow[] };
export type JudgeMeReviewsPage = {
  /** Sanitized review markup, one entry per review. */
  reviews: string[];
  /** Total genuine reviews Judge.me has for the product. */
  total: number;
  /** False when Judge.me's markup could not be split into reviews (shown as one block, no further paging). */
  split: boolean;
};

export function shopifyNumericId(gid: string): string {
  const parts = gid.split("/");
  return parts[parts.length - 1] || "";
}

function buildUrl(externalId: string, page: number, perPage: number, legacy: boolean): string {
  const params = new URLSearchParams({
    shop_domain: JUDGEME_SHOP_DOMAIN,
    platform: "shopify",
    product_id: externalId,
    page: String(page),
    per_page: String(perPage),
  });
  if (legacy) params.set("legacy_widget", "true");
  return `${REVIEWS_ENDPOINT}?${params.toString()}`;
}

/** Real average rating, review count and rating histogram from Judge.me, or null if unavailable. */
export async function fetchJudgeMeSummary(externalId: string): Promise<JudgeMeSummary | null> {
  const res = await fetch(buildUrl(externalId, 1, 1, false));
  if (!res.ok) return null;
  const json = (await res.json()) as {
    number_of_reviews?: unknown;
    average_rating?: unknown;
    histogram?: Array<{ rating?: unknown; frequency?: unknown; percentage?: unknown }>;
  };
  const count = Number(json.number_of_reviews);
  const average = Number(json.average_rating);
  if (!Number.isFinite(count) || !Number.isFinite(average)) return null;
  const histogram = Array.isArray(json.histogram)
    ? json.histogram.map((h) => ({
        rating: Number(h.rating),
        frequency: Number(h.frequency) || 0,
        percentage: Number(h.percentage) || 0,
      }))
    : [];
  return { average, count, histogram };
}

/**
 * Strip anything active or interactive. Judge.me markup is already sanitized; this also removes the
 * parts that only work with Judge.me's own JavaScript (voting, sharing, read-more, pagination).
 */
function sanitize(doc: Document): void {
  doc
    .querySelectorAll(
      [
        "script, style, iframe, object, embed, form, input, textarea, select, button",
        ".jdgm-rev__social, .jdgm-rev__votes, .jdgm-rev__actions, .jdgm-rev__share-btn, .jdgm-rev__body-read-more",
        ".jdgm-paginate, .jdgm-write-rev-link",
      ].join(", "),
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
}

/** One page of genuine reviews (1-indexed), as sanitized markup. */
export async function fetchJudgeMeReviewsPage(externalId: string, page: number): Promise<JudgeMeReviewsPage> {
  const res = await fetch(buildUrl(externalId, page, JUDGEME_PAGE_SIZE, true));
  if (!res.ok) throw new Error(`Judge.me reviews request failed (${res.status})`);
  const json = (await res.json()) as { html?: string; total_count?: number };
  const total = Number(json.total_count) || 0;
  const doc = new DOMParser().parseFromString(json.html ?? "", "text/html");
  sanitize(doc);
  const items = Array.from(doc.querySelectorAll(".jdgm-rev")).map((el) => el.outerHTML);
  if (items.length > 0) return { reviews: items, total, split: true };
  const fallback = doc.body.innerHTML.trim();
  return { reviews: fallback && total > 0 ? [fallback] : [], total, split: false };
}
