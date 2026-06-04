import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

interface ProductGridProps {
  /** Filter by case-insensitive substring of title/description. */
  filter?: string[];
}

export function ProductGrid({ filter }: ProductGridProps = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetchProducts(24),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const products = data ?? [];
  const filtered = filter && filter.length
    ? products.filter((p) => {
        const hay = (p.node.title + " " + p.node.description).toLowerCase();
        return filter.some((k) => hay.includes(k.toLowerCase()));
      })
    : products;

  if (error || filtered.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed rounded-lg">
        <p className="font-display text-2xl mb-2">No products found</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {filter && filter.length
            ? "Nothing in this category yet — check back soon."
            : "Tell me what product you'd like to add and at what price, and I'll create it in your Shopify store."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {filtered.map((product) => (
        <ProductCard key={product.node.id} product={product} />
      ))}
    </div>
  );
}
