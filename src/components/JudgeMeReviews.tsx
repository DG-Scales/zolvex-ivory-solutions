import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  JUDGEME_PAGE_SIZE,
  fetchJudgeMeReviewsHtml,
  fetchJudgeMeSummary,
  shopifyNumericId,
} from "@/lib/judgeme";

const STALE_MS = 20 * 60 * 1000;

function useJudgeMeSummary(productGid: string) {
  const externalId = shopifyNumericId(productGid);
  return useQuery({
    queryKey: ["judgeme", "summary", externalId],
    queryFn: () => fetchJudgeMeSummary(externalId),
    enabled: !!externalId && typeof window !== "undefined",
    staleTime: STALE_MS,
    retry: false,
  });
}

const STAR_PATH =
  "M12 2.5l2.94 6.1 6.56.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6-4.8-4.6 6.56-.9L12 2.5z";

function Stars({ value, className }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  const row = (color: string) => (
    <span className="flex">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={className ?? "h-4 w-4"} fill={color} aria-hidden="true">
          <path d={STAR_PATH} />
        </svg>
      ))}
    </span>
  );
  return (
    <span className="relative inline-flex" role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className="opacity-30">{row("currentColor")}</span>
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct}%` }}>
        {row("#b08d57")}
      </span>
    </span>
  );
}

/** Compact rating. Renders nothing unless Judge.me reports at least one real review. */
export function JudgeMeRating({ productGid, className }: { productGid: string; className?: string }) {
  const { data } = useJudgeMeSummary(productGid);
  if (!data || data.count <= 0) return null;
  return (
    <a
      href="#reviews"
      className={`inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors ${className ?? ""}`}
    >
      <Stars value={data.average} />
      <span className="text-foreground font-medium">{data.average.toFixed(1)}</span>
      <span>
        {data.count} review{data.count === 1 ? "" : "s"}
      </span>
    </a>
  );
}

const JUDGEME_CSS = "https://cdn.judge.me/shopify_v2.css";

/** Full Customer Reviews section. Renders nothing unless Judge.me reports at least one real review. */
export function JudgeMeReviewsSection({ productGid }: { productGid: string }) {
  const externalId = shopifyNumericId(productGid);
  const { data: summary } = useJudgeMeSummary(productGid);
  const hasReviews = !!summary && summary.count > 0;

  const { data: html } = useQuery({
    queryKey: ["judgeme", "reviews", externalId],
    queryFn: () => fetchJudgeMeReviewsHtml(externalId),
    enabled: hasReviews,
    staleTime: STALE_MS,
    retry: false,
  });

  const show = hasReviews && !!html;

  // Judge.me's static stylesheet supplies the star glyph font and base layout for its markup.
  useEffect(() => {
    if (!show || document.querySelector("link[data-jdgm-css]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = JUDGEME_CSS;
    link.setAttribute("data-jdgm-css", "1");
    document.head.appendChild(link);
  }, [show]);

  if (!show || !summary) return null;

  return (
    <section id="reviews" className="zx-reviews mt-16 scroll-mt-24 border-t border-border pt-10">
      <div className="jdgm-widget jdgm-review-widget" dangerouslySetInnerHTML={{ __html: html }} />
      {summary.count > JUDGEME_PAGE_SIZE && (
        <p className="mt-6 text-xs text-muted-foreground">
          Showing {JUDGEME_PAGE_SIZE} of {summary.count} reviews.
        </p>
      )}
    </section>
  );
}
