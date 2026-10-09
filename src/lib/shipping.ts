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

export function deliveryEstimateText(tags?: string[] | null): string {
  const t = transitDaysFor(tags);
  return `Estimated delivery: ${t.min}–${t.max} business days after your order ships (orders are processed in ${PROCESSING_DAYS.min}–${PROCESSING_DAYS.max} business days). Delivery times are estimates, not guarantees.`;
}
