import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatVariantTitle } from "@/lib/variantTitle";

export const CartIconLink = () => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode || "$";

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
      <HoverCardContent align="end" sideOffset={10} className="w-80 p-0 hidden md:block">
        <div className="px-4 py-3 border-b">
          <p className="font-display text-lg">Your Bag</p>
          <p className="text-xs text-muted-foreground">
            {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </p>
        </div>
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            Your bag is empty.
          </div>
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
              {items.slice(0, 4).map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {item.product.node.images?.edges?.[0]?.node && (
                      <img
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.node.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {formatVariantTitle({ title: item.variantTitle, selectedOptions: item.selectedOptions })}
                    </p>
                    <p className="text-xs mt-0.5">
                      {item.quantity} × {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {items.length > 4 && (
                <p className="text-[11px] text-muted-foreground text-center">
                  +{items.length - 4} more item{items.length - 4 !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <div className="px-4 py-3 border-t space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-base">
                  {currency} {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
        <div className="px-4 pb-4">
          <Button asChild size="sm" className="w-full rounded-full">
            <Link to="/cart">Go to cart</Link>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
