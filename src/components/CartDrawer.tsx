import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, Lock, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatVariantTitle } from "@/lib/variantTitle";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, syncCart, getCheckoutUrl } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      setIsOpen(false);
      window.location.href = url;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-accent">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0 border-b pb-4">
          <SheetTitle className="font-display text-2xl">Your Bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
                <p className="text-muted-foreground">Your bag is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 pb-5 border-b last:border-b-0">
                      <Link
                        to="/product/$handle"
                        params={{ handle: item.product.node.handle }}
                        onClick={() => setIsOpen(false)}
                        className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to="/product/$handle"
                          params={{ handle: item.product.node.handle }}
                          onClick={() => setIsOpen(false)}
                          className="font-medium truncate block hover:underline underline-offset-4"
                        >
                          {item.product.node.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatVariantTitle({ title: item.variantTitle, selectedOptions: item.selectedOptions })}
                        </p>
                        <p className="font-medium mt-2">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.variantId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1 border rounded-full">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-background">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-display">
                    {items[0]?.price.currencyCode || "$"} {totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
                <Button onClick={handleCheckout} className="w-full rounded-full" size="lg" disabled={items.length === 0 || isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4 mr-2" />Checkout</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
