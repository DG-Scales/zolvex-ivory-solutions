import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { getCategory } from "@/lib/categories";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useRef, useCallback, useEffect, useState } from "react";

/**
 * Cinematic trending carousel — horizontal snap-scroll with drag-to-swipe
 * and arrow controls.
 */
export function TrendingCarousel() {
  const cat = getCategory("trending");
  const handles = cat?.productHandles ?? [];

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(120),
  });

  const products = (data ?? []).filter((p) => handles.includes(p.node.handle));
  // preserve curated order
  const ordered = handles
    .map((h) => products.find((p) => p.node.handle === h))
    .filter(Boolean) as typeof products;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
  }, [ordered.length, updateArrows]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Pointer drag-to-scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      // Let touch devices use native momentum scrolling
      if (e.pointerType !== "mouse") return;
      if (e.button !== 0) return;
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 8) {
        moved = true;
        // Only hijack scroll once we know it's a drag, so small clicks pass through
        const next = startScroll - dx;
        requestAnimationFrame(() => {
          el.scrollLeft = next;
        });
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      try { el.releasePointerCapture(e.pointerId); } catch {}
      if (moved) {
        const prevent = (ev: Event) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener("click", prevent, { capture: true, once: true });
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("scroll", updateArrows, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("scroll", updateArrows);
    };
  }, [updateArrows]);

  return (
    <section className="relative border-y border-black/10 bg-black text-background overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_25%,rgba(245,241,232,0.18),transparent_55%),radial-gradient(circle_at_85%_75%,rgba(245,241,232,0.12),transparent_60%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 md:pt-28 pb-6">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-background/60 mb-4">
              Editor's edit · Season 01
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.02]">
              Trending <span className="italic font-light">Right Now.</span>
            </h2>
            <p className="mt-4 max-w-md text-background/65 text-sm md:text-base">
              Swipe through the most-coveted pieces of the season — marble,
              crystal and full-spectrum statement lighting.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                disabled={!canPrev}
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-background/30 flex items-center justify-center hover:bg-background hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-background"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                disabled={!canNext}
                aria-label="Next"
                className="w-10 h-10 rounded-full border border-background/30 flex items-center justify-center hover:bg-background hover:text-black transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-background"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <Link
              to="/categories/$slug"
              params={{ slug: "trending" }}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] border-b border-background/40 pb-1 hover:border-background transition-colors"
            >
              View All Trending <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative pb-24 md:pb-32">
        <div
          ref={scrollerRef}
          className="flex gap-5 md:gap-6 overflow-x-auto px-6 md:px-[calc((100vw-80rem)/2+1.5rem)] snap-x scrollbar-hide cursor-grab active:cursor-grabbing select-none [touch-action:pan-x] [-webkit-overflow-scrolling:touch] [scroll-behavior:smooth] [overscroll-behavior-x:contain]"
        >
          {ordered.map((p) => {
            const img = p.node.images.edges[0]?.node.url;
            const price = p.node.priceRange.minVariantPrice.amount;
            return (
              <Link
                key={p.node.id}
                to="/product/$handle"
                params={{ handle: p.node.handle }}
                data-card
                draggable={false}
                className="group relative shrink-0 snap-start block overflow-hidden rounded-sm bg-neutral-900 w-[78vw] sm:w-[58vw] md:w-[420px] aspect-[4/5]"
              >
                {img && (
                  <img
                    src={img}
                    alt={p.node.title}
                    loading="lazy"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-110 group-hover:brightness-90 pointer-events-none"
                  />
                )}
                {/* gradient base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                {/* always-visible price chip */}
                <div className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.3em] text-background/90 bg-black/55 backdrop-blur px-3 py-1.5">
                  ${parseFloat(price).toFixed(0)}
                </div>

                {/* hover title overlay (white) */}
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-white/70 mb-2">
                    Trending
                  </p>
                  <h3 className="font-display text-white text-2xl md:text-3xl leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                    {p.node.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white">
                    View piece <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
          <div className="shrink-0 w-6" aria-hidden />
        </div>
      </div>
    </section>
  );
}
