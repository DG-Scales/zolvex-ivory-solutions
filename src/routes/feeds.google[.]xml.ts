import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { storefrontApiRequest } from "@/lib/shopify";
import { PROCESSING_DAYS, transitDaysFor } from "@/lib/shipping";

// Dedicated Google Merchant Center product feed (RSS 2.0 / g: namespace).
// - Every link is a www.zolvexlighting.com product URL (the Shopify channel feed links to myshopify.com).
// - Item ids follow Shopify's own scheme (shopify_US_<productId>_<variantId>) so product identity is preserved
//   when this feed replaces the Shopify channel feed. Use a DIFFERENT feed label on the new data source while testing.
// - Prices, availability and titles come live from the Shopify Storefront API on each fetch.
// - Shipping is free for the US; processing/transit windows come from lib/shipping.ts (per-product via tag).
// - No GTINs, ratings or other identifiers are invented (identifier_exists = no).
const BASE_URL = "https://www.zolvexlighting.com";

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

export const Route = createFileRoute("/feeds/google.xml")({
  server: {
    handlers: {
      GET: async () => {
        const products: FeedProduct[] = [];
        let after: string | null = null;
        for (let page = 0; page < 10; page++) {
          const data = await storefrontApiRequest(FEED_QUERY, { first: 100, after });
          const conn = data?.data?.products;
          if (!conn) break;
          for (const e of conn.edges) products.push(e.node as FeedProduct);
          if (!conn.pageInfo.hasNextPage) break;
          after = conn.pageInfo.endCursor;
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
                `<g:id>shopify_US_${productId}_${num(v.id)}</g:id>`,
                `<g:item_group_id>${productId}</g:item_group_id>`,
                `<title>${esc(title)}</title>`,
                `<description>${esc(plain(p.description || p.title).slice(0, 4900))}</description>`,
                `<link>${BASE_URL}/product/${esc(p.handle)}</link>`,
                `<g:image_link>${esc(image)}</g:image_link>`,
                ...extra.map((u) => `<g:additional_image_link>${esc(u)}</g:additional_image_link>`),
                `<g:availability>${v.availableForSale ? "in_stock" : "out_of_stock"}</g:availability>`,
                `<g:price>${Number(v.price.amount).toFixed(2)} ${v.price.currencyCode}</g:price>`,
                `<g:condition>new</g:condition>`,
                `<g:brand>Zolvex</g:brand>`,
                `<g:identifier_exists>no</g:identifier_exists>`,
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
          `<title>Zolvex Lighting</title>`,
          `<link>${BASE_URL}</link>`,
          `<description>Zolvex Lighting product feed</description>`,
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
