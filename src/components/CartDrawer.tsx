import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBeforePrice } from "@/lib/utils";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Trash2, Lock, Loader2, ShieldCheck, Truck, PackageCheck } from "lucide-react";
import { QuantityControl } from "@/components/QuantityControl";
import { useCartStore } from "@/stores/cartStore";
import { formatVariantTitle } from "@/lib/variantTitle";

import visaLogo from "@/assets/visa.svg.asset.json";
import mastercardLogo from "@/assets/mastercard.svg.asset.json";
import amexLogo from "@/assets/amex.svg.asset.json";
import applePayLogo from "@/assets/applepay.svg.asset.json";
import googlePayLogo from "@/assets/googlepay.svg.asset.json";
import shopPayLogo from "@/assets/shoppay.svg.asset.json";

const paymentLogos = [
  { src: visaLogo.url, alt: "Visa" },
  { src: mastercardLogo.url, alt: "Mastercard" },
  { src: amexLogo.url, alt: "American Express" },
  { src: applePayLogo.url, alt: "Apple Pay" },
  { src: googlePayLogo.url, alt: "Google Pay" },
  { src: shopPayLogo.url, alt: "Shop Pay" },
];

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, syncCart, getCheckoutUrl } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = async () => {
    const url = await getCheckoutUrl();
    if (!url) return;
    setIsOpen(false);
    window.location.href = url;
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
                <p className="text-muted-foreground mb-4">Your bag is empty</p>
                <Link to="/categories" onClick={() => setIsOpen(false)}>
                  <Button size="lg" className="rounded-full px-8">Start Shopping</Button>
                </Link>
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
                        <p className="mt-2 flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.variantId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <QuantityControl
                          quantity={item.quantity}
                          onChange={(q) => updateQuantity(item.variantId, q)}
                        />
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
                <p className="text-xs text-muted-foreground">Free shipping.</p>
                <Button onClick={handleCheckout} className="w-full rounded-full" size="lg" disabled={items.length === 0 || isLoading || isSyncing}>
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4 mr-2" />Checkout</>}
                </Button>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="flex flex-col items-center gap-1 rounded-md border bg-muted/30 px-2 py-2 text-center">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] leading-tight text-muted-foreground">Insured Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-md border bg-muted/30 px-2 py-2 text-center">
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] leading-tight text-muted-foreground">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 rounded-md border bg-muted/30 px-2 py-2 text-center">
                    <PackageCheck className="w-4 h-4" />
                    <span className="text-[10px] leading-tight text-muted-foreground">Purchase Protection</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">We accept</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {paymentLogos.map((logo) => (
                      <div
                        key={logo.alt}
                        className="h-6 w-9 bg-white rounded-[3px] flex items-center justify-center p-0.5 ring-1 ring-black/5"
                      >
                        <img src={logo.src} alt={logo.alt} className="max-h-full max-w-full object-contain" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
