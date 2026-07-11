import { useEffect, useRef, useState } from "react";

/**
 * Judge.me public config. The PUBLIC_TOKEN is safe on the client — it's the
 * same value Judge.me embeds in the Shopify theme snippet.
 */
export const JUDGEME_SHOP_DOMAIN = "zolvex-solutions-hub-pnf34.myshopify.com";
export const JUDGEME_PUBLIC_TOKEN = "UbQYSwQLVFG931zlQAdfRPM0IK4";

let loaderPromise: Promise<void> | null = null;

/** Load the Judge.me widget preloader once, client-side only. */
export function loadJudgeMe(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<void>((resolve) => {
    const w = window as unknown as {
      jdgm?: Record<string, unknown>;
    };
    w.jdgm = w.jdgm || {};
    w.jdgm.SHOP_DOMAIN = JUDGEME_SHOP_DOMAIN;
    w.jdgm.PLATFORM = "shopify";
    w.jdgm.PUBLIC_TOKEN = JUDGEME_PUBLIC_TOKEN;

    // Stylesheet
    if (!document.querySelector('link[data-jdgm-css="1"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.judge.me/shopify_v2.css";
      link.setAttribute("data-jdgm-css", "1");
      document.head.appendChild(link);
    }

    if (document.querySelector('script[data-jdgm-preloader="1"]')) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://cdn.judge.me/widget_preloader.js";
    s.async = true;
    s.setAttribute("data-jdgm-preloader", "1");
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });

  return loaderPromise;
}

/** Extract the numeric Shopify product ID from a GraphQL gid. */
export function shopifyNumericId(gid: string): string {
  const parts = gid.split("/");
  return parts[parts.length - 1] || "";
}

/**
 * Small star + count row for product cards.
 * Hides itself entirely when the product has 0 reviews.
 */
export function JudgeMePreviewBadge({
  productGid,
  className,
}: {
  productGid: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasReviews, setHasReviews] = useState<boolean | null>(null);
  const numericId = shopifyNumericId(productGid);

  useEffect(() => {
    if (!ref.current || !numericId) return;
    let cancelled = false;

    void loadJudgeMe().then(() => {
      if (cancelled || !ref.current) return;
      const w = window as unknown as {
        jdgm?: { customizeBadges?: () => void };
        JudgeMe?: { customizeBadges?: () => void };
      };
      try {
        w.jdgm?.customizeBadges?.();
        w.JudgeMe?.customizeBadges?.();
      } catch {
        /* noop */
      }
    });

    // Observe the badge element; Judge.me sets data-number-of-reviews once rendered.
    const check = () => {
      const el = ref.current?.querySelector<HTMLElement>(".jdgm-prev-badge");
      const raw = el?.getAttribute("data-number-of-reviews");
      if (raw != null) {
        setHasReviews(Number(raw) > 0);
        return true;
      }
      return false;
    };
    if (check()) return;

    const obs = new MutationObserver(() => {
      if (check()) obs.disconnect();
    });
    obs.observe(ref.current, { subtree: true, attributes: true, childList: true });

    // Safety fallback — stop trying after 6s if widget never mounted.
    const timeout = window.setTimeout(() => {
      if (!cancelled && hasReviews === null) setHasReviews(false);
      obs.disconnect();
    }, 6000);

    return () => {
      cancelled = true;
      obs.disconnect();
      window.clearTimeout(timeout);
    };
  }, [numericId, hasReviews]);

  if (hasReviews === false) return null;

  return (
    <div
      ref={ref}
      className={className}
      style={{ minHeight: hasReviews ? undefined : 0 }}
    >
      <div
        className="jdgm-widget jdgm-preview-badge"
        data-id={numericId}
        data-template="index"
      />
    </div>
  );
}

/**
 * Homepage "All Reviews" carousel. Renders the Judge.me widget and hides the
 * whole section when the store has zero reviews.
 */
export function JudgeMeAllReviewsSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    let cancelled = false;

    void loadJudgeMe().then(() => {
      if (cancelled || !containerRef.current) return;
      const w = window as unknown as {
        jdgm?: { customizeBadges?: () => void; loadCarousel?: () => void };
        JudgeMe?: { loadCarousel?: () => void };
      };
      try {
        w.jdgm?.customizeBadges?.();
      } catch {
        /* noop */
      }
    });

    const evaluate = () => {
      const root = containerRef.current;
      if (!root) return false;
      const carousel = root.querySelector<HTMLElement>(".jdgm-carousel");
      const reviews = root.querySelectorAll(".jdgm-carousel-item, .jdgm-rev").length;
      if (carousel && reviews > 0) {
        setState("ready");
        return true;
      }
      // Judge.me renders an empty message container when there are no reviews.
      const emptyMarker = root.querySelector(".jdgm-carousel-wrapper--no-reviews, .jdgm-no-reviews");
      if (emptyMarker) {
        setState("empty");
        return true;
      }
      return false;
    };

    const obs = new MutationObserver(() => {
      evaluate();
    });
    if (containerRef.current) {
      obs.observe(containerRef.current, { subtree: true, childList: true, attributes: true });
    }

    // Give the widget up to 7s; if it never populated, treat as empty.
    const timeout = window.setTimeout(() => {
      if (cancelled) return;
      if (!evaluate()) setState("empty");
      obs.disconnect();
    }, 7000);

    return () => {
      cancelled = true;
      obs.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  if (state === "empty") return null;

  return (
    <section
      className="border-t border-black/10 bg-[#F5F1E8] text-black"
      style={{
        // Hide the section visually while we don't yet know if there are reviews,
        // so we don't flash an empty heading before Judge.me responds.
        display: state === "loading" ? "none" : undefined,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 w-full">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-black/60 mb-3">
            From our customers
          </p>
          <h2 className="font-display text-4xl md:text-5xl uppercase tracking-[0.04em]">
            What people are saying
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-black/70" />
        </div>
        <div ref={containerRef} className="jdgm-zx-carousel-wrap">
          <div
            className="jdgm-all-reviews-widget"
            data-product-title-link="true"
          />
        </div>
      </div>
    </section>
  );
}
