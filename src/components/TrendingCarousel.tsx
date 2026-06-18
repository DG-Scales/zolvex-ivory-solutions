import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionProducts } from "@/lib/shopify";
import { ArrowRight, ArrowLeft, Share2 } from "lucide-react";
import { useRef, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const TRENDING_DISCOUNT_CODE = "ZOLVEX20";
const TRENDING_DISCOUNT_PCT = 20;

/**
 * Cinematic trending carousel — pulls the Shopify `trending` collection
 * and renders a horizontal snap-scroll with drag-to-swipe.
 */
export function TrendingCarousel() {
  const { data } = useQuery({
    queryKey: ["collection", "trending"],
    queryFn: () => fetchCollectionProducts("trending", 24),
  });

  const ordered = data ?? [];

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

  // Pointer drag-to-scroll with rAF batching + inertial momentum on release
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px per ms
    let moved = false;
    let pendingScroll: number | null = null;
    let rafId: number | null = null;
    let momentumId: number | null = null;

    const flush = () => {
      rafId = null;
      if (pendingScroll != null) {
        el.scrollLeft = pendingScroll;
        pendingScroll = null;
      }
    };

    const cancelMomentum = () => {
      if (momentumId != null) {
        cancelAnimationFrame(momentumId);
        momentumId = null;
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (e.button !== 0) return;
      cancelMomentum();
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        velocity = 0.8 * velocity + 0.2 * ((e.clientX - lastX) / dt);
      }
      lastX = e.clientX;
      lastT = now;
      pendingScroll = startScroll - dx;
      if (rafId == null) rafId = requestAnimationFrame(flush);
    };
    const startMomentum = () => {
      if (Math.abs(velocity) < 0.05) return;
      let v = velocity * 16; // px per frame baseline
      const friction = 0.93;
      let lastFrame = performance.now();
      const step = (t: number) => {
        const dt = t - lastFrame;
        lastFrame = t;
        const frames = dt / 16;
        el.scrollLeft -= v * frames;
        v *= Math.pow(friction, frames);
        if (Math.abs(v) > 0.2) {
          momentumId = requestAnimationFrame(step);
        } else {
          momentumId = null;
        }
      };
      momentumId = requestAnimationFrame(step);
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
        startMomentum();
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
      if (rafId != null) cancelAnimationFrame(rafId);
      cancelMomentum();
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
          className="flex gap-5 md:gap-6 overflow-x-auto px-6 md:px-[calc((100vw-80rem)/2+1.5rem)] snap-x scrollbar-hide cursor-grab active:cursor-grabbing select-none [touch-action:pan-x] [-webkit-overflow-scrolling:touch] [overscroll-behavior-x:contain] [scrollbar-width:none] [will-change:scroll-position]"
        >
          {ordered.map((p, idx) => {
            const img = p.node.images.edges[0]?.node.url;
            const price = p.node.priceRange.minVariantPrice.amount;
            const priceNum = parseFloat(price);
            const discounted = priceNum * (1 - TRENDING_DISCOUNT_PCT / 100);
            return (
              <Link
                key={`${p.node.id}-${idx}`}
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
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-110 group-hover:brightness-90 pointer-events-none"
                  />
                )}
                {/* gradient base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

                {/* always-visible price + discount stack */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-background/90 bg-black/55 backdrop-blur px-3 py-1.5 line-through opacity-75">
                    ${priceNum.toFixed(0)}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-black bg-background px-3 py-1.5 font-medium">
                    ${discounted.toFixed(0)} <span className="opacity-60">· code {TRENDING_DISCOUNT_CODE}</span>
                  </div>
                </div>

                {/* share chip */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = `${window.location.origin}/product/${p.node.handle}`;
                    navigator.clipboard.writeText(url).then(() => {
                      toast.success("Link copied to clipboard");
                    });
                  }}
                  aria-label="Share product"
                  className="absolute top-4 right-4 text-background/90 bg-black/55 backdrop-blur p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

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
