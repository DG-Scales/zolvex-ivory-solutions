import { useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  fetchJudgeMeReviewsPage,
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

const reviewsLabel = (n: number) => `${n} review${n === 1 ? "" : "s"}`;

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
      <span>{reviewsLabel(data.count)}</span>
    </a>
  );
}

const JUDGEME_CSS = "https://cdn.judge.me/shopify_v2.css";

/** Full Customer Reviews section. Renders nothing unless Judge.me reports at least one real review. */
export function JudgeMeReviewsSection({ productGid }: { productGid: string }) {
  const externalId = shopifyNumericId(productGid);
  const { data: summary } = useJudgeMeSummary(productGid);
  const hasReviews = !!summary && summary.count > 0;

  const reviews = useInfiniteQuery({
    queryKey: ["judgeme", "reviews", externalId],
    queryFn: ({ pageParam }) => fetchJudgeMeReviewsPage(externalId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, pages) => {
      if (!last.split || last.reviews.length === 0) return undefined;
      const loaded = pages.reduce((n, p) => n + p.reviews.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
    enabled: hasReviews,
    staleTime: STALE_MS,
    retry: false,
  });

  const items = reviews.data?.pages.flatMap((p) => p.reviews) ?? [];
  const show = hasReviews && items.length > 0;

  // Judge.me's static stylesheet supplies the star glyph font and base layout for its review markup.
  useEffect(() => {
    if (!show || document.querySelector("link[data-jdgm-css]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = JUDGEME_CSS;
    link.setAttribute("data-jdgm-css", "1");
    document.head.appendChild(link);
  }, [show]);

  if (!show || !summary) return null;

  const rows = [...summary.histogram].sort((a, b) => b.rating - a.rating);

  return (
    <section id="reviews" className="zx-reviews mt-16 scroll-mt-24 border-t border-border pt-10">
      <h2 className="font-display text-2xl md:text-3xl tracking-tight">Customer Reviews</h2>
      <div className="mt-8 grid gap-10 md:grid-cols-[240px_1fr]">
        <div>
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl leading-none">{summary.average.toFixed(1)}</span>
            <span className="pb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">out of 5</span>
          </div>
          <div className="mt-3">
            <Stars value={summary.average} className="h-5 w-5" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Based on {reviewsLabel(summary.count)}</p>
          {rows.length > 0 && (
            <ul className="mt-6 space-y-2" aria-label="Rating breakdown">
              {rows.map((r) => (
                <li key={r.rating} className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="w-3 text-foreground">{r.rating}</span>
                  <span className="h-1.5 flex-1 overflow-hidden bg-muted">
                    <span
                      className="block h-full bg-[#b08d57]"
                      style={{ width: `${Math.max(0, Math.min(100, r.percentage))}%` }}
                    />
                  </span>
                  <span className="w-6 text-right">{r.frequency}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <div className="jdgm-widget jdgm-review-widget">
            <div className="jdgm-rev-widg__reviews" dangerouslySetInnerHTML={{ __html: items.join("") }} />
          </div>
          {reviews.hasNextPage && (
            <div className="mt-8">
              <Button
                type="button"
                variant="outline"
                className="rounded-none border-black/80 uppercase tracking-[0.18em] text-[11px] hover:bg-black hover:text-background"
                onClick={() => void reviews.fetchNextPage()}
                disabled={reviews.isFetchingNextPage}
              >
                {reviews.isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Load more reviews"}
              </Button>
            </div>
          )}
          {reviews.isError && !reviews.isFetchingNextPage && (
            <p className="mt-4 text-xs text-muted-foreground">Couldn&apos;t load more reviews. Please try again.</p>
          )}
        </div>
      </div>
    </section>
  );
}
