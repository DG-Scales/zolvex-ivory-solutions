import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  variant?: "default" | "featured";
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
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

  const isFeatured = variant === "featured";

  return (
    <Link to="/product/$handle" params={{ handle: node.handle }} className="group block">
      <div
        className={
          isFeatured
            ? "aspect-[4/5] overflow-hidden bg-[#F5F1E8] border border-black/80 rounded-none mb-4 relative"
            : "aspect-[4/5] overflow-hidden bg-muted rounded-md mb-4 relative"
        }
      >
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
            className={
              isFeatured
                ? "w-full rounded-none bg-black text-[#F5F1E8] hover:bg-black/85"
                : "w-full rounded-full"
            }
            size="sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add To Bag"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3
          className={
            isFeatured
              ? "text-sm font-medium leading-snug text-black group-hover:opacity-60 transition-opacity"
              : "text-sm font-medium leading-snug group-hover:opacity-60 transition-opacity"
          }
        >
          {node.title}
        </h3>
        <p
          className={
            isFeatured
              ? "text-sm font-medium flex items-baseline gap-2 text-black"
              : "text-sm font-medium flex items-baseline gap-2"
          }
        >
          <span className={isFeatured ? "line-through opacity-50" : "text-foreground line-through opacity-70"}>
            {price.currencyCode} {(parseFloat(price.amount) * 1.1).toFixed(2)}
          </span>
          <span>{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</span>
        </p>
      </div>
    </Link>
  );
}
