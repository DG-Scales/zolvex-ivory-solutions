import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  fetchCollectionProducts,
  storefrontApiRequest,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartSync } from "@/hooks/useCartSync";

const NEW_ARRIVALS_HANDLE = "new-arrivals";

const DEBUG_QUERY = `
  query DebugCollection($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      products(first: $first) {
        edges { node { id title handle } }
      }
    }
  }
`;



type FilterKey = "all" | "pendants" | "chandeliers" | "sconces" | "ceiling";

type DebugCollectionResponse = {
  data?: {
    collectionByHandle?: {
      products?: {
        edges?: unknown[];
      };
    } | null;
  };
  errors?: unknown;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

const FILTERS: { key: FilterKey; label: string; match: (t: string) => boolean }[] = [
  { key: "all", label: "All", match: () => true },
  { key: "pendants", label: "Pendants", match: (t) => /pendant/i.test(t) },
  { key: "chandeliers", label: "Chandeliers", match: (t) => /chandelier/i.test(t) },
  { key: "sconces", label: "Wall Sconces", match: (t) => /sconce|wall\s*lamp|wall\s*light/i.test(t) },
  { key: "ceiling", label: "Ceiling Lights", match: (t) => /ceiling|flush\s*mount/i.test(t) },
];

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Zolvex" },
      { name: "description", content: "Just landed — handpicked statement lighting for every space. Browse the latest Zolvex chandeliers, pendants, sconces, and ceiling lights." },
      { property: "og:title", content: "New Arrivals — Zolvex" },
      { property: "og:description", content: "Handpicked statement lighting. Just landed at Zolvex." },
    ],
  }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  useCartSync();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [productsFetchError, setProductsFetchError] = useState<string | null>(null);
  const [debugFetchError, setDebugFetchError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: productsQueryError,
    status: productsStatus,
    fetchStatus: productsFetchStatus,
  } = useQuery<ShopifyProduct[], Error>({
    queryKey: ["new-arrivals-collection", NEW_ARRIVALS_HANDLE],
    queryFn: async () => {
      console.log("[New Arrivals] about to call fetchCollectionProducts", {
        handle: NEW_ARRIVALS_HANDLE,
        first: 60,
      });
      setProductsFetchError(null);
      try {
        const result = await fetchCollectionProducts(NEW_ARRIVALS_HANDLE, 60);
        console.log("[New Arrivals] fetchCollectionProducts resolved", {
          handle: NEW_ARRIVALS_HANDLE,
          count: result.length,
        });
        return result;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("[New Arrivals] fetchCollectionProducts failed", error);
        setProductsFetchError(message);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: debugData,
    error: debugQueryError,
    status: debugStatus,
    fetchStatus: debugFetchStatus,
  } = useQuery<DebugCollectionResponse, Error>({
    queryKey: ["new-arrivals-debug", NEW_ARRIVALS_HANDLE],
    queryFn: async () => {
      console.log("[New Arrivals] about to call raw collectionByHandle debug query", {
        handle: NEW_ARRIVALS_HANDLE,
        first: 60,
      });
      setDebugFetchError(null);
      try {
        const response = await storefrontApiRequest(DEBUG_QUERY, { handle: NEW_ARRIVALS_HANDLE, first: 60 });
        console.log("[New Arrivals] raw collectionByHandle debug query resolved", response);
        return response as DebugCollectionResponse;
      } catch (error) {
        const message = getErrorMessage(error);
        console.error("[New Arrivals] raw collectionByHandle debug query failed", error);
        setDebugFetchError(message);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const products = data ?? [];
  const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];
  const visible = useMemo(
    () => products.filter((p) => active.match(p.node.title)),
    [products, active],
  );

  const rawEdges = debugData?.data?.collectionByHandle?.products?.edges ?? null;
  const productsErrorMessage = productsFetchError ?? (productsQueryError ? getErrorMessage(productsQueryError) : null);
  const debugErrorMessage = debugFetchError ?? (debugQueryError ? getErrorMessage(debugQueryError) : null);


  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="bg-[#FAFAFA] text-[#1A1A1A] font-sans">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-20 md:pt-32 pb-14 md:pb-20 text-center">
            <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A84C] mb-6">
              Season 04 · Just Landed
            </p>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] tracking-tight">
              New <span className="relative inline-block">
                <span className="italic font-light">Arrivals</span>
                <span className="pointer-events-none absolute left-0 right-0 -bottom-2 h-[3px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent animate-pulse" />
              </span>
            </h1>
            <p className="mt-8 max-w-xl mx-auto text-[15px] md:text-base text-[#1A1A1A]/60 leading-relaxed">
              Just landed — handpicked statement lighting for every space.
            </p>
          </div>
        </section>

        {/* Debug panel */}
        <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-6">
          <details open className="rounded-lg border border-[#1A1A1A]/15 bg-white">
            <summary className="cursor-pointer px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/70">
              Debug · collectionByHandle("{NEW_ARRIVALS_HANDLE}")
            </summary>
            <div className="px-4 pb-4 space-y-3 text-xs font-mono">
              <div>
                <span className="text-[#1A1A1A]/60">Parsed query status: </span>
                <span className="font-bold">{productsStatus}</span>
                <span className="text-[#1A1A1A]/60"> · fetchStatus: </span>
                <span className="font-bold">{productsFetchStatus}</span>
              </div>
              <div>
                <span className="text-[#1A1A1A]/60">Raw debug query status: </span>
                <span className="font-bold">{debugStatus}</span>
                <span className="text-[#1A1A1A]/60"> · fetchStatus: </span>
                <span className="font-bold">{debugFetchStatus}</span>
              </div>
              <div>
                <span className="text-[#1A1A1A]/60">Parsed products (data length): </span>
                <span className="font-bold">{products.length}</span>
              </div>
              {productsErrorMessage && (
                <div className="rounded bg-red-50 p-3 text-red-700">
                  Parsed products error: {productsErrorMessage}
                </div>
              )}
              {debugErrorMessage && (
                <div className="rounded bg-red-50 p-3 text-red-700">
                  Raw debug query error: {debugErrorMessage}
                </div>
              )}
              <div>
                <span className="text-[#1A1A1A]/60">Raw products.edges length: </span>
                <span className="font-bold">
                  {rawEdges === null ? "(loading)" : rawEdges.length}
                </span>
              </div>
              <div>
                <span className="text-[#1A1A1A]/60">Raw response:</span>
                <pre className="mt-2 max-h-[420px] overflow-auto rounded bg-[#0F0F0F] p-3 text-[11px] leading-relaxed text-[#E6E6E6]">
{JSON.stringify(debugData ?? { status: debugStatus, fetchStatus: debugFetchStatus, error: debugErrorMessage }, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </section>


        {/* Filter bar */}
        <section className="sticky top-[64px] z-20 bg-[#FAFAFA]/85 backdrop-blur border-y border-[#1A1A1A]/8">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-4 flex items-center justify-center gap-1 md:gap-2 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = f.key === filter;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`shrink-0 px-4 md:px-5 py-2 text-[11px] md:text-xs uppercase tracking-[0.25em] rounded-full transition-all ${
                    isActive
                      ? "bg-[#1A1A1A] text-[#FAFAFA]"
                      : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 md:py-16">
          {isLoading ? (
            <div className="text-center py-24 text-sm text-[#1A1A1A]/50">Loading the latest…</div>
          ) : productsErrorMessage ? (
            <div className="text-center py-24 text-sm text-red-700">Unable to load New Arrivals: {productsErrorMessage}</div>
          ) : visible.length === 0 ? (
            <div className="text-center py-24 text-sm text-[#1A1A1A]/50">No pieces in this category yet.</div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 [column-fill:_balance]">
              {visible.map((p, i) => (
                <EditorialCard key={p.node.id} product={p} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Banner strip */}
        <section className="border-t border-[#1A1A1A]/10 bg-[#F2EFE8]">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-10 text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[#1A1A1A]/70 text-center">
            <span>Free shipping on orders over $200</span>
            <span className="hidden md:inline text-[#C9A84C]">·</span>
            <span>Easy 30-day returns</span>
            <span className="hidden md:inline text-[#C9A84C]">·</span>
            <span>Handpicked for your home</span>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

const ASPECTS = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[1/1]", "aspect-[3/4]", "aspect-[4/5]", "aspect-[2/3]"];

function EditorialCard({ product, index }: { product: ShopifyProduct; index: number }) {
  const n = product.node;
  const img = n.images.edges[0]?.node;
  const aspect = ASPECTS[index % ASPECTS.length];
  const delay = `${Math.min(index, 18) * 50}ms`;

  return (
    <Link
      to="/product/$handle"
      params={{ handle: n.handle }}
      className="group mb-4 md:mb-6 block break-inside-avoid opacity-0 animate-fade-in"
      style={{ animationDelay: delay, animationFillMode: "forwards" }}
    >
      <div className={`relative ${aspect} overflow-hidden rounded-[10px] bg-[#EFEBE2]`}>
        {img && (
          <img
            src={img.url}
            alt={n.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
          />
        )}
        <span className="absolute top-3 left-3 bg-[#C9A84C] text-[#1A1A1A] text-[9px] tracking-[0.3em] uppercase font-semibold px-2.5 py-1 rounded-full">
          New
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] text-[#1A1A1A] text-[10px] uppercase tracking-[0.3em] px-5 py-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
          View product
        </span>
      </div>
      <div className="pt-4 px-1 flex items-start justify-between gap-4">
        <h3 className="text-[13px] md:text-sm font-medium leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
          {n.title}
        </h3>
        <p className="text-[13px] md:text-sm tracking-wide whitespace-nowrap text-[#1A1A1A]/70 pt-0.5">
          ${parseFloat(n.priceRange.minVariantPrice.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
