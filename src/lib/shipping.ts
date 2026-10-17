// Delivery estimates shown on product pages, in structured data and on the Shipping page.
// Values are the owner-provided estimates (business days). They are estimates only, never guarantees.
// A product is shown with the extended window only when it carries the Shopify tag below, so no
// product is labelled slow until its CJ shipping estimate has been confirmed.
export const PROCESSING_DAYS = { min: 1, max: 4 };
export const STANDARD_TRANSIT_DAYS = { min: 7, max: 25 };
export const EXTENDED_TRANSIT_DAYS = { min: 30, max: 60 };
export const EXTENDED_SHIPPING_TAG = "shipping-extended";

export function hasExtendedShipping(tags?: string[] | null): boolean {
  return !!tags?.some((t) => t.trim().toLowerCase() === EXTENDED_SHIPPING_TAG);
}

export function transitDaysFor(tags?: string[] | null) {
  return hasExtendedShipping(tags) ? EXTENDED_TRANSIT_DAYS : STANDARD_TRANSIT_DAYS;
}

// ---- Customer-facing delivery messaging (display only; the feeds and structured data keep using the constants above) ----
// Standard estimate shown across the storefront, counted from the order date.
export const STANDARD_DISPLAY_DELIVERY = { min: 10, max: 20 };
// The 10–20 business days are transit time AFTER the 1–4 business day processing period, so every label says so.
const STANDARD_RANGE = `${STANDARD_DISPLAY_DELIVERY.min}–${STANDARD_DISPLAY_DELIVERY.max} Business Days After Processing`;

// Products whose delivery time has NOT been confirmed (oversized / sea-freight items). They never show the standard
// 10–20 day promise; they show a "varies, confirmed before processing" message until a verified estimate exists.
// To give one a verified estimate later, tag it `${EXTENDED_SHIPPING_TAG}` in Shopify (extended window) or remove it from this list.
export const DELIVERY_UNCONFIRMED_PRODUCT_IDS: ReadonlySet<string> = new Set([
  "15050645602667", "15051565302123", "15050644488555", "15051578868075",
  "15065288311147", "15050644554091", "15050645963115", "15050645700971",
]);

export type DeliveryKind = "standard" | "extended" | "unconfirmed";

export function deliveryKindFor(tags?: string[] | null, productGid?: string | null): DeliveryKind {
  if (hasExtendedShipping(tags)) return "extended";
  const id = productGid ? productGid.split("/").pop() ?? "" : "";
  if (id && DELIVERY_UNCONFIRMED_PRODUCT_IDS.has(id)) return "unconfirmed";
  return "standard";
}

export interface DeliveryMessage {
  kind: DeliveryKind;
  headline: string;
  detail: string;
}

const AFFECTED = "If your order is affected, we'll contact you with an updated delivery estimate before processing it.";

export function deliveryMessageFor(tags?: string[] | null, productGid?: string | null): DeliveryMessage {
  const kind = deliveryKindFor(tags, productGid);
  if (kind === "extended") {
    return {
      kind,
      headline: `Estimated Transit Time: ${EXTENDED_TRANSIT_DAYS.min}–${EXTENDED_TRANSIT_DAYS.max} Days After Processing`,
      detail: "This larger or specialty fixture ships on a longer timeline. Delivery times are estimates, not guarantees.",
    };
  }
  if (kind === "unconfirmed") {
    return {
      kind,
      headline: "Delivery time varies for this fixture",
      detail: `Larger or specialty lighting fixtures may require additional time. ${AFFECTED}`,
    };
  }
  return {
    kind,
    headline: `Estimated Transit Time: ${STANDARD_RANGE}`,
    detail: `Standard shipping takes approximately ${STANDARD_DISPLAY_DELIVERY.min}–${STANDARD_DISPLAY_DELIVERY.max} business days after processing. Certain products may require 30–60 days or longer depending on size, type, availability, or shipping requirements.`,
  };
}

// Bag / cart summary: the worst case among the items decides the wording.
export function cartDeliveryMessage(
  items: Array<{ product: { node: { id: string; tags?: string[] } } }>,
): DeliveryMessage {
  const kinds = items.map((i) => deliveryKindFor(i.product.node.tags, i.product.node.id));
  const hasExt = kinds.includes("extended");
  const hasUnc = kinds.includes("unconfirmed");
  const hasStd = kinds.includes("standard");
  if (!hasExt && !hasUnc) return deliveryMessageFor();
  if (!hasStd && !hasUnc) {
    return {
      kind: "extended",
      headline: `Estimated Transit Time: ${EXTENDED_TRANSIT_DAYS.min}–${EXTENDED_TRANSIT_DAYS.max} Days After Processing`,
      detail: "The larger or specialty fixtures in your bag ship on a longer timeline. Delivery times are estimates, not guarantees.",
    };
  }
  if (!hasStd) {
    return {
      kind: "unconfirmed",
      headline: "Delivery time varies for the item in your bag",
      detail: "Larger or specialty lighting fixtures may require additional time.",
    };
  }
  return {
    kind: hasExt ? "extended" : "unconfirmed",
    headline: `Estimated Transit Time: ${STANDARD_RANGE} for standard items`,
    detail: hasExt
      ? `Specialty items in your bag ship on a longer timeline (${EXTENDED_TRANSIT_DAYS.min}–${EXTENDED_TRANSIT_DAYS.max} days after processing).`
      : "Delivery time varies for the specialty fixtures in your bag.",
  };
}
