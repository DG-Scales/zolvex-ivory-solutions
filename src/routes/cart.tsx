import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus, Trash2, Lock, Loader2, ShieldCheck, Truck, PackageCheck } from "lucide-react";
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

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Zolvex" },
      { name: "description", content: "Review the items in your bag before checkout." },
      { property: "og:title", content: "Your Bag — Zolvex" },
      { property: "og:description", content: "Review the items in your bag before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const { items, isLoading, isSyncing, updateQuantity, removeItem, syncCart, getCheckoutUrl } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode || "$";

  useEffect(() => { syncCart(); }, [syncCart]);

  const handleCheckout = async () => {
    const url = await getCheckoutUrl();
    if (!url) return;
    window.location.href = url;
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl">Your Bag</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1} />
          <p className="text-muted-foreground mb-6">Your bag is empty</p>
          <Button onClick={() => navigate({ to: "/shop" })} className="rounded-full">Continue shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4 pb-5 border-b last:border-b-0">
                <Link
                  to="/product/$handle"
                  params={{ handle: item.product.node.handle }}
                  className="w-24 h-24 bg-muted rounded-md overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
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
                    className="font-medium block hover:underline underline-offset-4"
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
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.variantId)}>
                    <Trash2 className="h-3.5 w-3.5" />
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

          <aside className="space-y-4 lg:sticky lg:top-24 self-start border rounded-lg p-5 bg-card">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-xl font-display">{currency} {totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
            <Button onClick={handleCheckout} className="w-full rounded-full" size="lg" disabled={isLoading || isSyncing}>
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
          </aside>
        </div>
      )}
    </div>
  );
}
