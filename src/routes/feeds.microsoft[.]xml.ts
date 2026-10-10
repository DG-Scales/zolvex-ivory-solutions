import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { storefrontApiRequest } from "@/lib/shopify";
import { PROCESSING_DAYS, transitDaysFor } from "@/lib/shipping";

// Dedicated Microsoft Merchant Center product feed (Google-format RSS 2.0 / g: namespace, which Microsoft Merchant Center accepts).
// Separate from /feeds/google.xml so the Google feed is never affected. Same live Shopify Storefront data, same www product URLs.
// - Item ids: zolvex_<productId>_<variantId> (stable; distinct from the Google ids).
// - Products that need an owner decision before advertising (voltage / unverified shipping) are NOT removed; they carry
//   custom_label_0 = "hold-review" so a campaign can exclude them with a product group until the owner approves.
// - No GTINs, ratings or other identifiers are invented (identifier_exists = no).
const BASE_URL = "https://www.zolvexlighting.com";

// Product ids flagged for owner review (five 220V-listed products; nine sea-freight products with unconfirmed delivery estimates).
const REVIEW_HOLD: Record<string, string> = {
  "15050643997035": "voltage-220v",
  "15050644390251": "voltage-220v",
  "15051548688747": "voltage-220v",
  "15051551965547": "voltage-220v",
  "15051554521451": "voltage-220v",
  "15050645602667": "shipping-unverified",
  "15051566449003": "shipping-unverified",
  "15051565302123": "shipping-unverified",
  "15050644488555": "shipping-unverified",
  "15051578868075": "shipping-unverified",
  "15065288311147": "shipping-unverified",
  "15050644554091": "shipping-unverified",
  "15050645963115": "shipping-unverified",
  "15050645700971": "shipping-unverified",
};

const FEED_QUERY = `
  query FeedProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges { node {
        id handle title description productType tags
        images(first: 10) { edges { node { url } } }
        variants(first: 100) { edges { node {
          id title sku availableForSale
          price { amount currencyCode }
          image { url }
        } } }
      } }
    }
  }
`;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const num = (gid: string) => gid.split("/").pop() ?? gid;
const plain = (s: string) => s.replace(/\s+/g, " ").trim();

interface FeedVariant { id: string; title: string; sku?: string | null; availableForSale: boolean; price: { amount: string; currencyCode: string }; image?: { url: string } | null }
interface FeedProduct { id: string; handle: string; title: string; description: string; productType?: string; tags?: string[]; images: { edges: { node: { url: string } }[] }; variants: { edges: { node: FeedVariant }[] } }

export const Route = createFileRoute("/feeds/microsoft.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const idPrefix = new URL(request.url).searchParams.get("idprefix") ?? "zolvex_";
        // Fail safely: a partial or empty feed must never reach Merchant Center (it would delist products),
        // so any Storefront error or empty result returns 503 and Google keeps its last good copy.
        const products: FeedProduct[] = [];
        try {
          let after: string | null = null;
          let complete = false;
          for (let page = 0; page < 20; page++) {
            const data = await storefrontApiRequest(FEED_QUERY, { first: 100, after });
            const conn = data?.data?.products;
            if (!conn) throw new Error("storefront returned no products connection");
            for (const e of conn.edges) products.push(e.node as FeedProduct);
            if (!conn.pageInfo.hasNextPage) { complete = true; break; }
            after = conn.pageInfo.endCursor;
          }
          if (!complete || products.length === 0) throw new Error("incomplete product list");
        } catch {
          return new Response("Feed temporarily unavailable", { status: 503, headers: { "Retry-After": "900", "Cache-Control": "no-store" } });
        }

        const items: string[] = [];
        for (const p of products) {
          const productId = num(p.id);
          const transit = transitDaysFor(p.tags);
          const gallery = p.images.edges.map((e) => e.node.url);
          const single = p.variants.edges.length === 1;
          for (const { node: v } of p.variants.edges) {
            const image = v.image?.url ?? gallery[0];
            if (!image) continue; // Google requires an image
            const title = plain(single || /^default title$/i.test(v.title) ? p.title : `${p.title} - ${v.title}`).slice(0, 150);
            const extra = gallery.filter((u) => u !== image).slice(0, 10);
            items.push(
              [
                "<item>",
                `<g:id>${esc(idPrefix)}${productId}_${num(v.id)}</g:id>`,
                `<g:item_group_id>${productId}</g:item_group_id>`,
                `<title>${esc(title)}</title>`,
                `<description>${esc(plain(p.description || p.title).slice(0, 4900))}</description>`,
                `<link>${BASE_URL}/product/${esc(p.handle)}?variant=${num(v.id)}</link>`,
                `<g:image_link>${esc(image)}</g:image_link>`,
                ...extra.map((u) => `<g:additional_image_link>${esc(u)}</g:additional_image_link>`),
                `<g:availability>${v.availableForSale ? "in_stock" : "out_of_stock"}</g:availability>`,
                `<g:price>${Number(v.price.amount).toFixed(2)} ${v.price.currencyCode}</g:price>`,
                `<g:condition>new</g:condition>`,
                `<g:brand>Zolvex</g:brand>`,
                `<g:identifier_exists>no</g:identifier_exists>`,
                `<g:custom_label_0>${REVIEW_HOLD[productId] ? "hold-review" : "eligible"}</g:custom_label_0>`,
                REVIEW_HOLD[productId] ? `<g:custom_label_1>${REVIEW_HOLD[productId]}</g:custom_label_1>` : "",
                `<g:google_product_category>Home &amp; Garden &gt; Lighting &gt; Light Fixtures</g:google_product_category>`,
                p.productType ? `<g:product_type>${esc(p.productType)}</g:product_type>` : "",
                "<g:shipping>",
                "<g:country>US</g:country>",
                "<g:service>Free shipping</g:service>",
                `<g:price>0.00 USD</g:price>`,
                `<g:min_handling_time>${PROCESSING_DAYS.min}</g:min_handling_time>`,
                `<g:max_handling_time>${PROCESSING_DAYS.max}</g:max_handling_time>`,
                `<g:min_transit_time>${transit.min}</g:min_transit_time>`,
                `<g:max_transit_time>${transit.max}</g:max_transit_time>`,
                "</g:shipping>",
                "</item>",
              ]
                .filter(Boolean)
                .join("\n"),
            );
          }
        }

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">`,
          `<channel>`,
          `<title>Zolvex Lighting (Microsoft)</title>`,
          `<link>${BASE_URL}</link>`,
          `<description>Zolvex Lighting product feed for Microsoft Merchant Center</description>`,
          ...items,
          `</channel>`,
          `</rss>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=900" },
        });
      },
    },
  },
});
