import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

const PICK_HANDLES = [
  "villa-light-luxury-living-room-floor-lamp",
  "modern-led-pendant-light-24-inch-round-hanging-chandelier-with-adjustable-height-marble-finish-resin-ring-ceiling-light-for-dining-room-kitchen-island-living-room",
  "led-strip-simple-office-long-line-pendant-light",
];

export function MakersPick() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(120),
  });

  const picks = useMemo(() => {
    if (!data) return [];
    const byHandle = new Map(data.map((p) => [p.node.handle, p]));
    const curated = PICK_HANDLES.map((h) => byHandle.get(h)).filter(Boolean) as typeof data;
    if (curated.length >= 3) return curated.slice(0, 3);
    // fallback: fill with top-priced excluding crystal pendant
    const extras = [...data]
      .filter(
        (p) =>
          !PICK_HANDLES.includes(p.node.handle) &&
          p.node.handle !==
            "4inch-modern-crystal-pendant-light-3-pack-adjustable-hanging-ceiling-lamp-with-crystal-prism-design-for-dining-room-kitchen-island-and-living-room-golden-finish",
      )
      .sort(
        (a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount),
      );
    return [...curated, ...extras].slice(0, 3);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {picks.map((product) => (
        <ProductCard key={product.node.id} product={product} variant="featured" />
      ))}
    </div>
  );
}
