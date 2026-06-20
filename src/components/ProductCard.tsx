import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: ShopifyProduct;
  variant?: "default" | "featured";
  fromCategory?: string;
}

export function ProductCard({ product, variant = "default", fromCategory }: ProductCardProps) {
  const node = product.node;
  const selectedVariant = node.variants.edges[0]?.node;
  const images = node.images.edges;
  const price = node.priceRange.minVariantPrice;

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  let h = 0;
  for (let i = 0; i < node.id.length; i++) h = (h * 31 + node.id.charCodeAt(i)) >>> 0;
  const discountPct = 10 + (h % 16);
  const beforePrice = parseFloat(price.amount) / (1 - discountPct / 100);


  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const trackWidth = useRef<number>(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;
    await addItem({
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || [],
    });
    toast.success("Added to bag", { description: node.title });
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
    touchStartY.current = e.touches[0].clientY;
    trackWidth.current = e.currentTarget.clientWidth;
    setDragging(true);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (Math.abs(dy) > Math.abs(dx)) return;
    let next = dx;
    if ((imgIndex === 0 && dx > 0) || (imgIndex === images.length - 1 && dx < 0)) {
      next = dx * 0.35;
    }
    setDrag(next);
  };
  const onTouchEnd = () => {
    const width = trackWidth.current || 1;
    const offset = drag;
    touchStartX.current = null;
    touchStartY.current = null;
    setDragging(false);
    setDrag(0);
    const threshold = Math.min(70, width * 0.18);
    if (Math.abs(offset) > threshold && images.length > 1) {
      setImgIndex((i) =>
        offset < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length,
      );
    }
  };

  const isFeatured = variant === "featured";

  const isSoldOut =
    (node.variants?.edges?.length ?? 0) > 0 &&
    node.variants.edges.every((v) => !v.node.availableForSale);

  return (
    <Link to="/product/$handle" params={{ handle: node.handle }} search={fromCategory ? { from: fromCategory } : undefined} className="group block">
      <div
        className={
          isFeatured
            ? "aspect-[4/5] overflow-hidden bg-[#F5F1E8] border border-black/80 rounded-none mb-4 relative touch-pan-y select-none"
            : "aspect-[4/5] overflow-hidden bg-muted rounded-md mb-4 relative touch-pan-y select-none"
        }
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          <span className="bg-black text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded-sm uppercase leading-none">
            20% Off
          </span>
          {isSoldOut && (
            <Badge variant="destructive" className="uppercase tracking-wider text-[10px]">
              Sold Out
            </Badge>
          )}
        </div>
        {images.length > 0 ? (
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${images.length * 100}%`,
              transform: `translate3d(calc(${-imgIndex * (100 / images.length)}% + ${drag}px), 0, 0)`,
              transition: dragging ? "none" : "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
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
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/85 text-foreground flex items-center justify-center transition-opacity hover:bg-background z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/85 text-foreground flex items-center justify-center transition-opacity hover:bg-background z-10"
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

        <div className="absolute inset-x-3 bottom-6 opacity-0 group-hover:opacity-100 transition-opacity space-y-2 pointer-events-none group-hover:pointer-events-auto">
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || isLoading}
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
      <div className="flex flex-col gap-1.5 pb-1">
        <h3
          className={
            isFeatured
              ? "text-base md:text-lg font-medium leading-snug text-black group-hover:opacity-60 transition-opacity"
              : "text-base md:text-lg font-medium leading-snug group-hover:opacity-60 transition-opacity"
          }
        >
          {node.title}
        </h3>
        <p
          className={
            isFeatured
              ? "text-sm font-medium flex items-center gap-2 text-black flex-wrap"
              : "text-sm font-medium flex items-center gap-2 flex-wrap"
          }
        >
          <span>{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</span>
          <span className={isFeatured ? "line-through opacity-50" : "text-foreground line-through opacity-70"}>
            {price.currencyCode} {beforePrice.toFixed(2)}
          </span>
          <span className="inline-flex items-center justify-center bg-black text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
            -{discountPct}%
          </span>
        </p>
      </div>

    </Link>
  );
}
