import { useState, useEffect, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ShoppingBag, X, Plus, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatVariantTitle } from "@/lib/variantTitle";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const CartIconLink = () => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const addItem = useCartStore((s) => s.addItem);
  const cartLoading = useCartStore((s) => s.isLoading);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode || "$";

  const [upsells, setUpsells] = useState<ShopifyProduct[]>([]);
  const [upsellLoading, setUpsellLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setUpsellLoading(true);
    fetchProducts(20)
      .then((products) => {
        if (cancelled) return;
        const cartIds = new Set(items.map((i) => i.product.node.id));
        const candidates = products.filter((p) => !cartIds.has(p.node.id));
        setUpsells(shuffleArray(candidates).slice(0, 2));
      })
      .catch(() => {
        // silently ignore upsell fetch errors
      })
      .finally(() => {
        if (!cancelled) setUpsellLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const handleQuickAdd = useCallback(
    async (product: ShopifyProduct) => {
      const variant = product.node.variants.edges[0]?.node;
      if (!variant) return;
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
        variantImage: variant.image ?? null,
      });
      toast.success("Added to bag", { description: product.node.title });
    },
    [addItem],
  );

  return (
    <HoverCard openDelay={120} closeDelay={120}>
      <HoverCardTrigger asChild>
        <Button asChild variant="ghost" size="icon" className="relative rounded-full hover:bg-accent">
          <Link to="/cart" aria-label="View cart">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Link>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        sideOffset={10}
        className="w-[460px] p-0 hidden md:block overflow-hidden rounded-2xl border border-border shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]"
      >
        <div className="px-6 py-5 border-b bg-card">
          <p className="font-display text-xl tracking-tight">Your Bag</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </p>
        </div>
        {items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingBag className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Nothing here yet — go add something you love.</p>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto px-6 py-5 space-y-6">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-black/5">
                    {item.product.node.images?.edges?.[0]?.node && (
                      <img
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold leading-snug">{item.product.node.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatVariantTitle({ title: item.variantTitle, selectedOptions: item.selectedOptions })}
                    </p>
                    <p className="text-sm mt-1.5 font-medium">
                      {item.quantity} × {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.variantId);
                    }}
                    className="text-muted-foreground/60 hover:text-destructive transition-colors p-1 -mr-1 mt-0.5"
                    aria-label="Remove item"
                    title="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {upsells.length > 0 && (
          <div className="border-t bg-muted/30 px-6 py-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3">
              You may also like
            </p>
            <div className="grid grid-cols-2 gap-3">
              {upsells.map((product) => {
                const variant = product.node.variants.edges[0]?.node;
                const price = product.node.priceRange.minVariantPrice;
                const img = product.node.images.edges[0]?.node;
                return (
                  <div
                    key={product.node.id}
                    className="group relative bg-card rounded-lg overflow-hidden ring-1 ring-black/5 hover:ring-black/10 transition-all"
                  >
                    <Link
                      to="/product/$handle"
                      params={{ handle: product.node.handle }}
                      className="block aspect-[4/3] bg-muted overflow-hidden"
                    >
                      {img && (
                        <img
                          src={img.url}
                          alt={img.altText || product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </Link>
                    <div className="p-2.5">
                      <Link
                        to="/product/$handle"
                        params={{ handle: product.node.handle }}
                        className="text-[11px] font-medium leading-snug block hover:underline underline-offset-2 line-clamp-2"
                      >
                        {product.node.title}
                      </Link>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-[11px] text-muted-foreground font-medium">
                          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                        </p>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-6 w-6 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(product);
                          }}
                          disabled={cartLoading || !variant}
                        >
                          {cartLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {upsellLoading && upsells.length === 0 && (
          <div className="border-t bg-muted/30 px-6 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3">
              You may also like
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl overflow-hidden ring-1 ring-black/5 animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-2.5 space-y-2">
                  <div className="h-3 bg-muted rounded w-4/5" />
                  <div className="h-2.5 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="bg-card rounded-xl overflow-hidden ring-1 ring-black/5 animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-2.5 space-y-2">
                  <div className="h-3 bg-muted rounded w-4/5" />
                  <div className="h-2.5 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>
        )}

        {items.length > 0 && (
          <div className="px-6 py-4 border-t bg-muted/30">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-xl tracking-tight">
                {currency} {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="px-6 pb-6 pt-3 bg-card">
          <Button asChild className="w-full rounded-full h-11 text-sm font-semibold">
            <Link to="/cart">{items.length === 0 ? "Start Shopping" : "Go to Checkout"}</Link>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
