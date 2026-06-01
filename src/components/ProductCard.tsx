import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const node = product.node;
  const selectedVariant = node.variants.edges[0]?.node;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
  };

  return (
    <Link to="/product/$handle" params={{ handle: node.handle }} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-muted rounded-md mb-4 relative">
        {image ? (
          <img
            src={image.url}
            alt={image.altText || node.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
        )}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={handleAddToCart}
            disabled={isLoading || !selectedVariant}
            className="w-full rounded-full"
            size="sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to bag"}
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-sm font-medium leading-tight group-hover:opacity-60 transition-opacity">{node.title}</h3>
        <p className="text-sm font-medium whitespace-nowrap">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
