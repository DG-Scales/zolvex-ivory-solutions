import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, X, Lock, Loader2, ShieldCheck, Truck, PackageCheck, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatVariantTitle } from "@/lib/variantTitle";
import { getBeforePrice } from "@/lib/utils";
import { QuantityControl } from "@/components/QuantityControl";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
  const currency = items[0]?.price.currencyCode || "USD";

  useEffect(() => { syncCart(); }, [syncCart]);

  const handleCheckout = async () => {
    const url = await getCheckoutUrl();
    if (!url) return;
    window.location.href = url;
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
      <div className="container mx-auto px-4 md:px-6 py-10 md:py-14 max-w-6xl">
        {/* Header */}
        <div className="mb-10 md:mb-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors mb-5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue shopping
          </Link>
          <div className="flex items-end justify-between gap-4 border-b pb-5">
            <h1 className="font-display text-4xl md:text-5xl tracking-tight">Your Bag</h1>
            <p className="text-sm text-muted-foreground pb-1">
              {totalItems === 0 ? "Empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full border flex items-center justify-center mb-6">
              <ShoppingBag className="h-6 w-6 text-muted-foreground" strokeWidth={1.25} />
            </div>
            <p className="font-display text-2xl mb-2">Your bag is empty</p>
            <p className="text-sm text-muted-foreground max-w-sm mb-8">
              Explore our curated collection of lighting and discover pieces made to last.
            </p>
            <Button onClick={() => navigate({ to: "/categories" })} size="lg" className="rounded-full px-8">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
            {/* Items */}
            <div>
              <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-6 text-[10px] uppercase tracking-[0.15em] text-muted-foreground pb-3 border-b">
                <span>Product</span>
                <span className="w-32 text-center">Quantity</span>
                <span className="w-24 text-right">Total</span>
              </div>

              <ul className="divide-y">
                {items.map((item) => {
                  const lineTotal = parseFloat(item.price.amount) * item.quantity;
                  return (
                    <li key={item.variantId} className="py-6">
                      <div className="grid grid-cols-[88px_1fr] md:grid-cols-[112px_1fr_auto_auto] gap-4 md:gap-6 items-start">
                        <Link
                          to="/product/$handle"
                          params={{ handle: item.product.node.handle }}
                          className="aspect-square bg-muted/40 rounded-md overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={item.product.node.images.edges[0].node.url}
                              alt={item.product.node.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </Link>

                        <div className="min-w-0 flex flex-col gap-1">
                          <Link
                            to="/product/$handle"
                            params={{ handle: item.product.node.handle }}
                            className="font-medium leading-snug hover:underline underline-offset-4 decoration-1"
                          >
                            {item.product.node.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatVariantTitle({ title: item.variantTitle, selectedOptions: item.selectedOptions })}
                          </p>
                          <p className="text-sm mt-1 flex items-center gap-2 flex-wrap">
                            <span className="line-through opacity-60">{fmt(getBeforePrice(parseFloat(item.price.amount)))}</span>
                            <span className="font-medium">{fmt(parseFloat(item.price.amount))}</span>
                            <span className="inline-flex items-center justify-center bg-black text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">-20%</span>
                          </p>

                          {/* Mobile: qty + remove + total */}
                          <div className="md:hidden flex items-center justify-between mt-3">
                            <QuantityControl
                              quantity={item.quantity}
                              onChange={(q) => updateQuantity(item.variantId, q)}
                              size="md"
                            />
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium tabular-nums">{fmt(lineTotal)}</span>
                              <button
                                onClick={() => removeItem(item.variantId)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Remove"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Desktop qty */}
                        <div className="hidden md:flex w-32 justify-center pt-1">
                          <QuantityControl
                            quantity={item.quantity}
                            onChange={(q) => updateQuantity(item.variantId, q)}
                            size="md"
                          />
                        </div>

                        {/* Desktop total + remove */}
                        <div className="hidden md:flex w-24 flex-col items-end gap-2 pt-1">
                          <span className="text-sm font-medium tabular-nums">{fmt(lineTotal)}</span>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="border rounded-xl p-6 bg-card space-y-5">
                <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Order Summary</h2>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular-nums">{fmt(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium">Total</span>
                  <span className="font-display text-2xl tabular-nums">{fmt(totalPrice)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-full h-12 text-sm tracking-wide"
                  disabled={isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Secure Checkout
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  You'll be redirected to our secure payment provider.
                </p>
              </div>

              {/* Trust */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { Icon: ShieldCheck, label: "Insured Shipping" },
                  { Icon: Truck, label: "Fast Delivery" },
                  { Icon: PackageCheck, label: "Buyer Protection" },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                    <span className="text-[10px] leading-tight text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Payment methods */}
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-2">
                  We accept
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {paymentLogos.map((logo) => (
                    <div
                      key={logo.alt}
                      className="h-7 w-10 bg-white rounded-[4px] flex items-center justify-center p-1 ring-1 ring-black/5"
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
