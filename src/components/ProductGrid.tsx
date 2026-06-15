import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchProducts, fetchCollectionProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories as ALL_CATEGORIES, type Category, matchesCategory, getTrendingHandles } from "@/lib/categories";

interface ProductGridProps {
  category?: Category;
  limit?: number;
  variant?: "default" | "featured";
  showFilters?: boolean;
}

type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

export function ProductGrid({ category, limit, variant = "default", showFilters = true }: ProductGridProps = {}) {
  const useCollection = !!category?.collectionHandle;
  const useCurated = !!category?.productHandles?.length;

  const { data, isLoading, error } = useQuery({
    queryKey: useCollection
      ? ["collection", category!.collectionHandle]
      : ["products"],
    queryFn: () =>
      useCollection
        ? fetchCollectionProducts(category!.collectionHandle!, 50)
        : fetchProducts(120),
  });

  // Pre-filter to category scope
  const scoped = useMemo(() => {
    const products = data ?? [];
    if (useCurated) {
      const handles = category!.slug === "trending" ? getTrendingHandles() : category!.productHandles!;
      const map = new Map(products.map((p) => [p.node.handle, p]));
      return handles
        .map((h) => map.get(h))
        .filter((p): p is (typeof products)[number] => !!p);
    }
    if (category && !useCollection) {
      return products.filter((p) =>
        matchesCategory(category, p.node.title, p.node.description, p.node.handle),
      );
    }
    return products;
  }, [data, category, useCollection, useCurated]);

  const PRICE_MIN = 0;
  const PRICE_MAX = 5000;
  const [draftRange, setDraftRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [range, setRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [min, max] = range;
  const [draftMin, draftMax] = draftRange;
  const isDirty = draftMin !== min || draftMax !== max;
  const isDefault = min === PRICE_MIN && max === PRICE_MAX;
  const currency = scoped[0]?.node.priceRange.minVariantPrice.currencyCode ?? "USD";

  const [sort, setSort] = useState<SortOption>("featured");

  let filtered = scoped.filter((p) => {
    const amt = parseFloat(p.node.priceRange.minVariantPrice.amount);
    return amt >= min && amt <= max;
  });

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === "price-asc") {
      arr.sort(
        (a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount),
      );
    } else if (sort === "price-desc") {
      arr.sort(
        (a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount),
      );
    } else if (sort === "newest") {
      arr.sort(
        (a, b) =>
          new Date(b.node.createdAt).getTime() -
          new Date(a.node.createdAt).getTime(),
      );
    } else if (sort === "featured") {
      if (category?.slug === "trending") {
        // Preserve pinned + shuffled curated order for trending
        return arr;
      }
      // Premium-first, modern-first, lightly interleaved so it doesn't read
      // as a pure price ranking. Score = normalized price weight + recency
      // weight, with a small deterministic jitter from the product id.
      const prices = arr.map((p) => parseFloat(p.node.priceRange.minVariantPrice.amount) || 0);
      const maxPrice = Math.max(1, ...prices);
      const times = arr.map((p) => new Date(p.node.createdAt).getTime() || 0);
      const maxTime = Math.max(1, ...times);
      const minTime = Math.min(...times);
      const timeSpan = Math.max(1, maxTime - minTime);
      const hash = (s: string) => {
        let h = 0;
        for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
        return ((h >>> 0) % 1000) / 1000;
      };
      arr.sort((a, b) => {
        const pa = parseFloat(a.node.priceRange.minVariantPrice.amount) || 0;
        const pb = parseFloat(b.node.priceRange.minVariantPrice.amount) || 0;
        const ta = new Date(a.node.createdAt).getTime() || 0;
        const tb = new Date(b.node.createdAt).getTime() || 0;
        const sa = 0.6 * (pa / maxPrice) + 0.35 * ((ta - minTime) / timeSpan) + 0.05 * hash(a.node.id);
        const sb = 0.6 * (pb / maxPrice) + 0.35 * ((tb - minTime) / timeSpan) + 0.05 * hash(b.node.id);
        return sb - sa;
      });
    }
    return arr;
  }, [filtered, sort]);

  // Always push sold-out products to the end, preserving the chosen sort within each group
  const isSoldOut = (p: typeof sorted[number]) =>
    (p.node.variants?.edges?.length ?? 0) > 0 &&
    p.node.variants.edges.every((v) => !v.node.availableForSale);

  const ordered = useMemo(() => {
    const inStock: typeof sorted = [];
    const soldOut: typeof sorted = [];
    for (const p of sorted) (isSoldOut(p) ? soldOut : inStock).push(p);
    return [...inStock, ...soldOut];
  }, [sorted]);

  const display = limit ? ordered.slice(0, limit) : ordered;

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const collectionLinks = ALL_CATEGORIES.filter((c) => c.group === "Collection");

  return (
    <div>
      {showFilters && scoped.length > 0 && (
        <div className="mb-10 border-y border-border/60 py-5 flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">
          <div className="flex-1 min-w-0 lg:max-w-md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Price</p>
              <p className="text-xs tabular-nums text-foreground">
                {currency} {draftMin} — {currency} {draftMax}
              </p>
            </div>
            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={50}
              value={[draftMin, draftMax]}
              onValueChange={(v) => setDraftRange([v[0], v[1]] as [number, number])}
              minStepsBetweenThumbs={1}
            />
            <div className="mt-4 flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="default"
                className="h-8 px-4 text-[11px] uppercase tracking-[0.2em] rounded-full"
                onClick={() => setRange(draftRange)}
                disabled={!isDirty}
              >
                Apply
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 px-4 text-[11px] uppercase tracking-[0.2em] rounded-full"
                onClick={() => {
                  setDraftRange([PRICE_MIN, PRICE_MAX]);
                  setRange([PRICE_MIN, PRICE_MAX]);
                }}
                disabled={isDefault && !isDirty}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="min-w-0 lg:w-52">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Sort</p>
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="h-9 text-xs uppercase tracking-[0.15em]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    {SORT_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!category && (
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Collection</p>
              <div className="flex flex-wrap gap-2">
                {collectionLinks.map((c) => (
                  <Link
                    key={c.slug}
                    to="/categories/$slug"
                    params={{ slug: c.slug }}
                    className="text-[11px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-border hover:bg-foreground hover:text-background transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error || display.length === 0 ? (
        <div className="text-center py-24 border border-dashed rounded-lg">
          <p className="font-display text-2xl mb-2">No products found</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {scoped.length === 0
              ? category
                ? "Nothing in this category yet — check back soon."
                : "Tell me what product you'd like to add and at what price, and I'll create it in your Shopify store."
              : "No pieces match the current price range. Try widening it."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {display.map((product) => (
            <ProductCard key={product.node.id} product={product} variant={variant} fromCategory={category?.slug} />
          ))}
        </div>
      )}
    </div>
  );
}
