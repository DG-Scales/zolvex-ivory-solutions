import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartSync } from "@/hooks/useCartSync";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — Zolvex" },
      { name: "description", content: "The latest Zolvex lighting drops — fresh chandeliers, sconces, pendants, and exterior pieces, presented in a wide-format editorial." },
      { property: "og:title", content: "New Arrivals — Zolvex" },
      { property: "og:description", content: "Just landed. Browse the newest Zolvex lighting in a wide horizontal showcase." },
    ],
  }),
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  useCartSync();
  const { data, isLoading } = useQuery({
    queryKey: ["new-arrivals", 30],
    queryFn: () => fetchProducts(30),
    staleTime: 5 * 60 * 1000,
  });

  const products = (data ?? [])
    .slice()
    .sort((a, b) => new Date(b.node.createdAt).getTime() - new Date(a.node.createdAt).getTime());

  const hero = products[0];
  const strip = products.slice(0, 12);
  const editorial = products.slice(1, 9);

  return (
    <div className="min-h-screen flex flex-col bg-[#0E0E0C] text-[#F5F1E8]">
      <SiteHeader />

      {/* Hero */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-16 md:pt-24 pb-12">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-[#F5F1E8]/50 mb-4">
                Just landed · Season 01
              </p>
              <h1 className="font-display text-6xl md:text-8xl leading-[0.95]">
                New <span className="italic font-light">arrivals.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm md:text-base text-[#F5F1E8]/70">
                Fresh pieces, photographed at scale. Scroll sideways through the latest drops —
                each fixture in a wide editorial frame.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/30 text-[11px] uppercase tracking-[0.3em] hover:bg-[#F5F1E8] hover:text-[#0E0E0C] transition"
            >
              Shop all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {hero && (
            <Link
              to="/product/$handle"
              params={{ handle: hero.node.handle }}
              className="group relative block aspect-[21/9] overflow-hidden bg-white/5"
            >
              {hero.node.images.edges[0] && (
                <img
                  src={hero.node.images.edges[0].node.url}
                  alt={hero.node.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#F5F1E8]/70 mb-3">
                    Featured arrival
                  </p>
                  <h2 className="font-display text-3xl md:text-5xl max-w-2xl leading-tight">
                    {hero.node.title}
                  </h2>
                </div>
                <span className="hidden md:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em]">
                  View <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Horizontal scroll strip */}
      <section className="border-b border-white/10 py-16 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#F5F1E8]/50 mb-3">Scroll →</p>
            <h2 className="font-display text-4xl md:text-5xl">The drop, in wide format.</h2>
          </div>
          <p className="hidden md:block text-xs uppercase tracking-[0.3em] text-[#F5F1E8]/50">
            {strip.length.toString().padStart(2, "0")} pieces
          </p>
        </div>

        {isLoading ? (
          <div className="px-6 md:px-10 text-sm text-[#F5F1E8]/50">Loading the latest…</div>
        ) : (
          <div className="overflow-x-auto pb-6 [scrollbar-color:rgba(245,241,232,0.3)_transparent]">
            <div className="flex gap-6 px-6 md:px-10 snap-x snap-mandatory">
              {strip.map((p, i) => (
                <Link
                  key={p.node.id}
                  to="/product/$handle"
                  params={{ handle: p.node.handle }}
                  className="group snap-start shrink-0 w-[78vw] md:w-[620px] lg:w-[720px]"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                    {p.node.images.edges[0] && (
                      <img
                        src={p.node.images.edges[0].node.url}
                        alt={p.node.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                      />
                    )}
                    <span className="absolute top-4 left-4 bg-[#F5F1E8] text-[#0E0E0C] text-[10px] tracking-[0.25em] uppercase px-2.5 py-1">
                      New · {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="font-display text-xl md:text-2xl leading-snug group-hover:opacity-70 transition">
                      {p.node.title}
                    </h3>
                    <p className="text-sm tracking-wide whitespace-nowrap pt-1">
                      {p.node.priceRange.minVariantPrice.currencyCode}{" "}
                      {parseFloat(p.node.priceRange.minVariantPrice.amount).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Editorial zigzag */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#F5F1E8]/50 mb-3">Editorial</p>
            <h2 className="font-display text-4xl md:text-5xl max-w-2xl">
              A closer look at each piece.
            </h2>
          </div>

          <div className="space-y-20 md:space-y-32">
            {editorial.map((p, i) => {
              const reverse = i % 2 === 1;
              return (
                <EditorialRow key={p.node.id} product={p} index={i} reverse={reverse} />
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function EditorialRow({ product, index, reverse }: { product: ShopifyProduct; index: number; reverse: boolean }) {
  const n = product.node;
  const img = n.images.edges[0]?.node;
  return (
    <div className={`grid md:grid-cols-12 gap-8 md:gap-12 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
      <Link
        to="/product/$handle"
        params={{ handle: n.handle }}
        className="group md:col-span-8 relative block aspect-[16/10] overflow-hidden bg-white/5"
      >
        {img && (
          <img
            src={img.url}
            alt={n.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
          />
        )}
        <span className="absolute top-5 left-5 text-[10px] tracking-[0.3em] uppercase text-[#F5F1E8] bg-black/50 backdrop-blur px-3 py-1.5">
          № {String(index + 2).padStart(2, "0")}
        </span>
      </Link>
      <div className="md:col-span-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#F5F1E8]/50 mb-4">
          Newly arrived
        </p>
        <h3 className="font-display text-3xl md:text-4xl leading-tight mb-5">
          {n.title}
        </h3>
        {n.description && (
          <p className="text-sm text-[#F5F1E8]/70 leading-relaxed line-clamp-4 mb-6">
            {n.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-5">
          <span className="text-sm tracking-wide">
            {n.priceRange.minVariantPrice.currencyCode}{" "}
            {parseFloat(n.priceRange.minVariantPrice.amount).toFixed(2)}
          </span>
          <Link
            to="/product/$handle"
            params={{ handle: n.handle }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] hover:opacity-70"
          >
            View piece <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
