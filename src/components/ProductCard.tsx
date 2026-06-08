import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
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
  const images = node.images.edges;
  const price = node.priceRange.minVariantPrice;

  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

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

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const next = (e: React.MouseEvent) => {
    stop(e);
    setImgIndex((i) => (i + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    stop(e);
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40 && images.length > 1) {
      setImgIndex((i) =>
        dx < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length,
      );
    }
    touchStartX.current = null;
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
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 0 ? (
          <div
            className="flex h-full transition-transform duration-500 ease-out will-change-transform"
            style={{
              width: `${images.length * 100}%`,
              transform: `translateX(-${imgIndex * (100 / images.length)}%)`,
            }}
          >
            {images.map(({ node: img }, i) => (
              <div
                key={img.url + i}
                className="h-full shrink-0 overflow-hidden"
                style={{ width: `${100 / images.length}%` }}
              >
                <img
                  src={img.url}
                  alt={img.altText || node.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/85 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-0 transition-opacity hover:bg-background"
              style={{ opacity: undefined }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/85 text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    stop(e);
                    setImgIndex(i);
                  }}
                  aria-label={`Show image ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIndex ? "w-4 bg-background" : "w-1.5 bg-background/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-x-3 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">
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
