import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCollectionProducts } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";
import type { Category } from "@/lib/categories";

interface ProductGridProps {
  category?: Category;
  limit?: number;
  variant?: "default" | "featured";
}

export function ProductGrid({ category, limit, variant = "default" }: ProductGridProps = {}) {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const products = data ?? [];
  let filtered = products;
  if (useCurated) {
    const set = new Set(category!.productHandles);
    const map = new Map(products.map((p) => [p.node.handle, p]));
    filtered = category!.productHandles!
      .map((h) => map.get(h))
      .filter((p): p is (typeof products)[number] => !!p && set.has(p.node.handle));
  }
  if (limit) filtered = filtered.slice(0, limit);

  if (error || filtered.length === 0) {
    return (
      <div className="text-center py-24 border border-dashed rounded-lg">
        <p className="font-display text-2xl mb-2">No products found</p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {category
            ? "Nothing in this category yet — check back soon."
            : "Tell me what product you'd like to add and at what price, and I'll create it in your Shopify store."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {filtered.map((product) => (
        <ProductCard key={product.node.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
