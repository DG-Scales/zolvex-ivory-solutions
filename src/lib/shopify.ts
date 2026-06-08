import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "zolvex-solutions-hub-pnf34.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "aca299ec2a80e5fe6a89a07aeacf7817";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    createdAt: string;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

export const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    title
    createdAt
    description
    handle
    priceRange { minVariantPrice { amount currencyCode } }
    images(first: 20) { edges { node { url altText } } }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price { amount currencyCode }
          availableForSale
          selectedOptions { name value }
          image { url altText }
        }
      }
    }
    options { name values }
  }
`;

export const PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges { node { ...ProductFields } }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
`;

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const data = await response.json();
  if (data.errors) throw new Error(`Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  return data;
}

// Matches CJK Unified Ideographs (Chinese characters) in alt text or URLs
const CJK_REGEX = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

function hasChinese(str: string | null | undefined): boolean {
  if (!str) return false;
  try {
    return CJK_REGEX.test(decodeURIComponent(str));
  } catch {
    return CJK_REGEX.test(str);
  }
}

function stripChineseImages(product: ShopifyProduct["node"] | null | undefined) {
  if (!product?.images?.edges) return product;
  const filtered = product.images.edges.filter(
    (e) => !hasChinese(e.node.altText) && !hasChinese(e.node.url),
  );
  // Keep at least one image so cards don't break entirely
  product.images.edges = filtered.length > 0 ? filtered : product.images.edges.slice(0, 1);
  return product;
}

function stripChineseFromEdges(edges: ShopifyProduct[]): ShopifyProduct[] {
  for (const edge of edges) stripChineseImages(edge.node);
  return edges;
}

export async function fetchProducts(first = 24): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first });
  return stripChineseFromEdges(data?.data?.products?.edges ?? []);
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct["node"] | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return stripChineseImages(data?.data?.product ?? null) ?? null;
}

const COLLECTION_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first) {
        edges { node { ...ProductFields } }
      }
    }
  }
`;

export async function fetchCollectionProducts(handle: string, first = 50): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(COLLECTION_PRODUCTS_QUERY, { handle, first });
  return stripChineseFromEdges(data?.data?.collection?.products?.edges ?? []);
}
