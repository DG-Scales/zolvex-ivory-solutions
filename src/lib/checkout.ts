// Direct Shopify checkout redirect by variant ID.
const STORE_DOMAIN = "zolvex-solutions-hub-pnf34.myshopify.com";

export function checkoutUrlForVariant(variantId: string | undefined | null, quantity = 1): string | null {
  if (!variantId) return null;
  // Accept full GraphQL gid or plain numeric ID.
  const match = String(variantId).match(/(\d+)\s*$/);
  if (!match) return null;
  return `https://${STORE_DOMAIN}/cart/${match[1]}:${quantity}`;
}

export function goToCheckout(variantId: string | undefined | null, quantity = 1): void {
  const url = checkoutUrlForVariant(variantId, quantity);
  if (url) window.location.href = url;
}
