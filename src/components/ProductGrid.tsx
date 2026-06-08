import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { fetchProducts, fetchCollectionProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories as ALL_CATEGORIES, type Category, matchesCategory } from "@/lib/categories";

interface ProductGridProps {
  category?: Category;
  limit?: number;
  variant?: "default" | "featured";
  showFilters?: boolean;
}

type SortOption = "newest" | "price-asc" | "price-desc";

const SORT_LABELS: Record<SortOption, string> = {
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
        ? fetchCollectionProducts(category!.collectionHandle!, 60)
        : fetchProducts(120),
  });

  // Pre-filter to category scope
  const scoped = useMemo(() => {
    const products = data ?? [];
    if (useCurated) {
      const map = new Map(products.map((p) => [p.node.handle, p]));
      return category!.productHandles!
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

  const [range, setRange] = useState<[number, number]>([0, 5000]);
  const [min, max] = range;
  const currency = scoped[0]?.node.priceRange.minVariantPrice.currencyCode ?? "USD";

  const [sort, setSort] = useState<SortOption>("newest");

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
    }
    return arr;
  }, [filtered, sort]);

  const display = limit ? sorted.slice(0, limit) : sorted;

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
                {currency} {min} — {currency} {max}
              </p>
            </div>
            <Slider
              min={0}
              max={5000}
              step={50}
              value={[min, max]}
              onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
              minStepsBetweenThumbs={1}
            />
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
            <ProductCard key={product.node.id} product={product} variant={variant} />
          ))}
        </div>
      )}
    </div>
  );
}
