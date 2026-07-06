import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchCollectionProducts, type ShopifyProduct } from "@/lib/shopify";
import { useCartSync } from "@/hooks/useCartSync";

const NEW_ARRIVALS_HANDLE = "new-arrivals";

type FilterKey = "all" | "pendants" | "chandeliers" | "sconces" | "ceiling";

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

  const { data, isLoading } = useQuery<ShopifyProduct[]>({
    queryKey: ["new-arrivals-collection", NEW_ARRIVALS_HANDLE],
    queryFn: () => fetchCollectionProducts(NEW_ARRIVALS_HANDLE, 60),
    staleTime: 5 * 60 * 1000,
  });

  const products = data ?? [];
  const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];
  const visible = useMemo(
    () => products.filter((p) => active.match(p.node.title)),
    [products, active],
  );

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

        {/* Filter bar */}
        <section className="sticky top-[64px] z-20 bg-[#FAFAFA]/85 backdrop-blur border-y border-[#1A1A1A]/8">
          <div className="mx-auto max-w-[1400px] px-4 md:px-10 py-4 flex items-center md:justify-center gap-1 md:gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <span>Free shipping on all U.S. orders</span>
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
  const images = n.images.edges;
  const aspect = ASPECTS[index % ASPECTS.length];

  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const trackWidth = useRef<number>(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const next = (e: React.MouseEvent) => {
    stop(e);
    setImgIndex((i) => (i + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    stop(e);
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      touchStartX.current = null;
      touchStartY.current = null;
      setDragging(false);
      setDrag(0);
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    trackWidth.current = e.currentTarget.clientWidth;
    setDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 1) return;
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dy) > Math.abs(dx)) return;
    let nextDx = dx;
    if ((imgIndex === 0 && dx > 0) || (imgIndex === images.length - 1 && dx < 0)) {
      nextDx = dx * 0.35;
    }
    setDrag(nextDx);
  };

  const onTouchEnd = () => {
    const width = trackWidth.current || 1;
    const offset = drag;
    touchStartX.current = null;
    touchStartY.current = null;
    setDragging(false);
    setDrag(0);
    const threshold = Math.min(70, width * 0.18);
    if (Math.abs(offset) > threshold && images.length > 1) {
      setImgIndex((i) =>
        offset < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length,
      );
    }
  };

  return (
    <Link
      to="/product/$handle"
      params={{ handle: n.handle }}
      className="group mb-4 md:mb-6 block break-inside-avoid"
    >
      <div
        className={`relative ${aspect} overflow-hidden rounded-[10px] bg-[#EFEBE2] [touch-action:pan-y_pinch-zoom] select-none`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {images.length > 0 ? (
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${images.length * 100}%`,
              transform: `translate3d(calc(${-imgIndex * (100 / images.length)}% + ${drag}px), 0, 0)`,
              transition: dragging ? "none" : "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {images.map(({ node: img }, i) => (
              <div
  key={img.url + i}
  className="h-full shrink-0 overflow-hidden"
  style={{ width: `${100 / images.length}%` }}
>
  <img
    src={img.url}
    alt={img.altText || n.title}
    loading="lazy"
    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
  />
</div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-[#1A1A1A]/40">No image</div>
        )}

        <span className="absolute top-3 left-3 bg-[#C9A84C] text-[#1A1A1A] text-[9px] tracking-[0.3em] uppercase font-semibold px-2.5 py-1 rounded-full z-20">
          New
        </span>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#FAFAFA]/85 text-[#1A1A1A] flex items-center justify-center transition-opacity hover:bg-[#FAFAFA] z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#FAFAFA]/85 text-[#1A1A1A] flex items-center justify-center transition-opacity hover:bg-[#FAFAFA] z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    stop(e);
                    setImgIndex(i);
                  }}
                  aria-label={`Show image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIndex ? "w-4 bg-[#FAFAFA]" : "w-1.5 bg-[#FAFAFA]/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAFAFA] text-[#1A1A1A] text-[10px] uppercase tracking-[0.3em] px-5 py-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 pointer-events-none">
          View product
        </span>
      </div>
      <div className="pt-4 px-1 flex items-start justify-between gap-4">
        <h3 className="text-lg md:text-xl font-medium leading-snug line-clamp-2 group-hover:text-[#C9A84C] transition-colors">
          {n.title}
        </h3>
        <p className="text-base md:text-lg tracking-wide whitespace-nowrap text-[#1A1A1A]/70 pt-0.5">
          ${parseFloat(n.priceRange.minVariantPrice.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
