import type { ShopifyProduct } from "@/lib/shopify";

export const SITE_URL = "https://www.zolvexlighting.com";

type ProductNode = ShopifyProduct["node"];

// schema.org Product markup built only from live Shopify Storefront data.
// No ratings, reviews, GTINs or other identifiers are emitted unless Shopify provides them.
export function buildProductJsonLd(product: ProductNode, url: string) {
  const images = (product.images?.edges ?? []).map((e) => e.node.url).filter(Boolean);
  const variants = (product.variants?.edges ?? []).map((e) => e.node);
  const offers = variants.map((v) => ({
    "@type": "Offer",
    url,
    name: v.title,
    ...(v.sku ? { sku: v.sku } : {}),
    price: Number(v.price.amount).toFixed(2),
    priceCurrency: v.price.currencyCode,
    availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "USD" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 4, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 7, maxValue: 25, unitCode: "DAY" },
      },
    },
  }));
  const skus = variants.map((v) => v.sku).filter(Boolean) as string[];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url,
    description: product.description || undefined,
    image: images.length ? images : undefined,
    ...(variants.length === 1 && skus[0] ? { sku: skus[0] } : {}),
    brand: { "@type": "Brand", name: "Zolvex" },
    offers: offers.length === 1 ? offers[0] : offers,
  };
}
